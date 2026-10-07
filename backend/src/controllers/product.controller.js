import mongoose from "mongoose";

import Product from "../models/Product.js";
import "../models/Category.js";

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      stock,
      images,
      category,
      tags,
    } = req.body;

    if (!title || !description || price === undefined || !category) {
      return res.status(400).json({
        message: "Title, description, price and category are required",
      });
    }

    const product = await Product.create({
      title,
      description,
      price,
      stock,
      images,
      category,
      tags,
      seller: req.user.userId,
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { category, tag } = req.query;

    const filter = {
      status: "approved",
    };

    if (category) {
      filter.category = category;
    }

    if (tag) {
      filter.tags = tag;
    }

    const products = await Product.find(filter)
      .populate("seller", "name email")
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

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

export async function getProductById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "شناسه محصول معتبر نیست",
      });
    }

    const product = await Product.findOne({
      _id: id,
      status: "approved",
    })
      .populate("seller", "name email")
      .populate("category", "name slug");

    if (!product) {
      return res.status(404).json({
        message: "محصول پیدا نشد",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.seller.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to edit this product",
      });
    }

    const {
      title,
      description,
      price,
      stock,
      images,
      category,
      tags,
    } = req.body;

    if (title !== undefined) product.title = title;
    if (description !== undefined) {
      product.description = description;
    }
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (images !== undefined) product.images = images;
    if (category !== undefined) product.category = category;
    if (tags !== undefined) product.tags = tags;

    // بعد از ویرایش دوباره نیاز به بررسی Admin دارد
    product.status = "pending";
    product.rejectionReason = "";

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.seller.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to delete this product",
      });
    }

    if (product.salesCount > 0) {
      return res.status(400).json({
        message: "Product with sales cannot be deleted",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user.userId,
    })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

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

export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const products = await Product.find({
      _id: { $ne: product._id },
      status: "approved",
      category: product.category,
      tags: { $in: product.tags },
    })
      .populate("seller", "name email")
      .populate("category", "name slug")
      .sort({ salesCount: -1, viewCount: -1 });

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