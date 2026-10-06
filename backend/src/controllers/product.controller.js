import Product from "../models/Product.js";

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