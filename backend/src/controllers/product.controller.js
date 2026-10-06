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
    const products = await Product.find({
      status: "approved",
    })
      .populate("seller", "name")
      .populate("category", "name slug");

    return res.status(200).json({
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      status: "approved",
    })
      .populate("seller", "name")
      .populate("category", "name slug");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

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