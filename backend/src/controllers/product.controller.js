import mongoose from "mongoose";
import path from "path";

import Product from "../models/Product.js";
import Category from "../models/Category.js";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function createSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseTags(tags) {
  if (!tags) {
    return [];
  }

  if (Array.isArray(tags)) {
    return tags
      .map((tag) => String(tag).trim())
      .filter(Boolean);
  }

  try {
    const parsed = JSON.parse(tags);

    if (Array.isArray(parsed)) {
      return parsed
        .map((tag) => String(tag).trim())
        .filter(Boolean);
    }
  } catch {
    // اگر JSON نبود، با کاما جداشده در نظر می‌گیریم.
  }

  return String(tags)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

/*
|--------------------------------------------------------------------------
| GET CATEGORIES
|--------------------------------------------------------------------------
*/

export const getCategories = async (
  req,
  res
) => {
  try {
    const categories = await Category.find()
      .select("_id name slug")
      .sort({ name: 1 });

    return res.status(200).json({
      count: categories.length,
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| CREATE CATEGORY
|--------------------------------------------------------------------------
*/

export const createCategory = async (
  req,
  res
) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "نام دسته‌بندی الزامی است",
      });
    }

    const cleanName = name.trim();
    const slug = createSlug(cleanName);

    if (!slug) {
      return res.status(400).json({
        message:
          "نام دسته‌بندی معتبر نیست",
      });
    }

    const existingCategory =
      await Category.findOne({
        $or: [
          { name: cleanName },
          { slug },
        ],
      });

    if (existingCategory) {
      return res.status(409).json({
        message:
          "این دسته‌بندی قبلاً وجود دارد",
      });
    }

    const category =
      await Category.create({
        name: cleanName,
        slug,
      });

    return res.status(201).json({
      message:
        "دسته‌بندی با موفقیت ایجاد شد",
      category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "این دسته‌بندی قبلاً وجود دارد",
      });
    }

    return res.status(400).json({
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| CREATE PRODUCT
|--------------------------------------------------------------------------
*/

export const createProduct = async (
  req,
  res
) => {
  try {
    const {
      title,
      description,
      price,
      stock,
      category,
      tags,
    } = req.body;

    if (
      !title ||
      !description ||
      price === undefined ||
      !category
    ) {
      return res.status(400).json({
        message:
          "عنوان، توضیحات، قیمت و دسته‌بندی الزامی هستند",
      });
    }

    if (
      !mongoose.isObjectIdOrHexString(
        category
      )
    ) {
      return res.status(400).json({
        message:
          "شناسه دسته‌بندی معتبر نیست",
      });
    }

    const categoryExists =
      await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        message:
          "دسته‌بندی پیدا نشد",
      });
    }

    const numericPrice = Number(price);
    const numericStock = Number(
      stock ?? 0
    );

    if (
      Number.isNaN(numericPrice) ||
      numericPrice < 0
    ) {
      return res.status(400).json({
        message: "قیمت معتبر نیست",
      });
    }

    if (
      Number.isNaN(numericStock) ||
      numericStock < 0
    ) {
      return res.status(400).json({
        message: "موجودی معتبر نیست",
      });
    }

    const productImages = (
      req.files || []
    ).map(
      (file) =>
        `/api/products/images/${file.filename}`
    );

    const product = await Product.create({
      title: title.trim(),

      description:
        description.trim(),

      price: numericPrice,

      stock: numericStock,

      images: productImages,

      seller: req.user.userId,

      category,

      tags: parseTags(tags),

      // انتشار مستقیم
      status: "approved",

      rejectionReason: "",
    });

    const populatedProduct =
      await Product.findById(product._id)
        .populate(
          "seller",
          "name email"
        )
        .populate(
          "category",
          "name slug"
        );

    return res.status(201).json({
      message:
        "محصول با موفقیت ثبت شد",
      product: populatedProduct,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET PUBLIC PRODUCTS
|--------------------------------------------------------------------------
*/

export const getProducts = async (
  req,
  res
) => {
  try {
    const {
      category,
      tag,
    } = req.query;

    const filter = {
      status: "approved",
    };

    if (category) {
      filter.category = category;
    }

    if (tag) {
      filter.tags = tag;
    }

    const products =
      await Product.find(filter)
        .populate(
          "seller",
          "name email"
        )
        .populate(
          "category",
          "name slug"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET PRODUCT IMAGE
|--------------------------------------------------------------------------
*/

export const getProductImage = (
  req,
  res
) => {
  const safeFilename = path.basename(
    req.params.filename
  );

  const filePath = path.resolve(
    process.cwd(),
    "uploads",
    "products",
    safeFilename
  );

  return res.sendFile(
    filePath,
    (error) => {
      if (error && !res.headersSent) {
        return res.status(404).json({
          message:
            "تصویر پیدا نشد",
        });
      }
    }
  );
};

/*
|--------------------------------------------------------------------------
| GET PRODUCT BY ID
|--------------------------------------------------------------------------
*/

export const getProductById =
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.isObjectIdOrHexString(id)
      ) {
        return res.status(400).json({
          message:
            "شناسه محصول معتبر نیست",
        });
      }

      const product =
        await Product.findOne({
          _id: id,
          status: "approved",
        })
          .populate(
            "seller",
            "name email"
          )
          .populate(
            "category",
            "name slug"
          );

      if (!product) {
        return res.status(404).json({
          message:
            "محصول پیدا نشد",
        });
      }

      return res.status(200).json(
        product
      );
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };

/*
|--------------------------------------------------------------------------
| GET MY PRODUCTS
|--------------------------------------------------------------------------
*/

export const getMyProducts =
  async (req, res) => {
    try {
      const products =
        await Product.find({
          seller: req.user.userId,
        })
          .populate(
            "seller",
            "name email"
          )
          .populate(
            "category",
            "name slug"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        count: products.length,
        products,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };

/*
|--------------------------------------------------------------------------
| UPDATE PRODUCT
|--------------------------------------------------------------------------
*/

export const updateProduct =
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.isObjectIdOrHexString(id)
      ) {
        return res.status(400).json({
          message:
            "شناسه محصول معتبر نیست",
        });
      }

      const product =
        await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found",
        });
      }

      if (
        product.seller.toString() !==
        req.user.userId
      ) {
        return res.status(403).json({
          message:
            "You are not allowed to edit this product",
        });
      }

      const {
        title,
        description,
        price,
        stock,
        category,
        tags,
      } = req.body;

      if (title !== undefined) {
        product.title =
          title.trim();
      }

      if (
        description !== undefined
      ) {
        product.description =
          description.trim();
      }

      if (price !== undefined) {
        const numericPrice =
          Number(price);

        if (
          Number.isNaN(
            numericPrice
          ) ||
          numericPrice < 0
        ) {
          return res.status(400).json({
            message:
              "قیمت معتبر نیست",
          });
        }

        product.price =
          numericPrice;
      }

      if (stock !== undefined) {
        const numericStock =
          Number(stock);

        if (
          Number.isNaN(
            numericStock
          ) ||
          numericStock < 0
        ) {
          return res.status(400).json({
            message:
              "موجودی معتبر نیست",
          });
        }

        product.stock =
          numericStock;
      }

      if (category !== undefined) {
        if (
          !mongoose.isObjectIdOrHexString(
            category
          )
        ) {
          return res.status(400).json({
            message:
              "شناسه دسته‌بندی معتبر نیست",
          });
        }

        const categoryExists =
          await Category.findById(
            category
          );

        if (!categoryExists) {
          return res.status(404).json({
            message:
              "دسته‌بندی پیدا نشد",
          });
        }

        product.category =
          category;
      }

      if (tags !== undefined) {
        product.tags =
          parseTags(tags);
      }

      product.status =
        "approved";

      product.rejectionReason =
        "";

      await product.save();

      const updatedProduct =
        await Product.findById(
          product._id
        )
          .populate(
            "seller",
            "name email"
          )
          .populate(
            "category",
            "name slug"
          );

      return res.status(200).json({
        message:
          "Product updated successfully",
        product:
          updatedProduct,
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  };

/*
|--------------------------------------------------------------------------
| DELETE PRODUCT
|--------------------------------------------------------------------------
*/

export const deleteProduct =
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.isObjectIdOrHexString(id)
      ) {
        return res.status(400).json({
          message:
            "شناسه محصول معتبر نیست",
        });
      }

      const product =
        await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found",
        });
      }

      if (
        product.seller.toString() !==
        req.user.userId
      ) {
        return res.status(403).json({
          message:
            "You are not allowed to delete this product",
        });
      }

      if (product.salesCount > 0) {
        return res.status(400).json({
          message:
            "Product with sales cannot be deleted",
        });
      }

      await Product.findByIdAndDelete(
        id
      );

      return res.status(200).json({
        message:
          "Product deleted successfully",
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  };

/*
|--------------------------------------------------------------------------
| RELATED PRODUCTS
|--------------------------------------------------------------------------
*/

export const getRelatedProducts =
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.isObjectIdOrHexString(id)
      ) {
        return res.status(400).json({
          message:
            "شناسه محصول معتبر نیست",
        });
      }

      const product =
        await Product.findOne({
          _id: id,
          status: "approved",
        });

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found",
        });
      }

      const filter = {
        _id: {
          $ne: product._id,
        },

        status: "approved",

        category:
          product.category,
      };

      if (product.tags?.length) {
        filter.tags = {
          $in: product.tags,
        };
      }

      const products =
        await Product.find(filter)
          .populate(
            "seller",
            "name email"
          )
          .populate(
            "category",
            "name slug"
          )
          .sort({
            salesCount: -1,
            viewCount: -1,
            createdAt: -1,
          });

      return res.status(200).json({
        count: products.length,
        products,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };