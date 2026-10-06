import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import "../models/Category.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      pendingProducts,
      approvedProducts,
      rejectedProducts,
      totalOrders,
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Product.countDocuments({ status: "pending" }),
      Product.countDocuments({ status: "approved" }),
      Product.countDocuments({ status: "rejected" }),
      Order.countDocuments(),
    ]);

    return res.status(200).json({
      message: "Admin dashboard data",
      stats: {
        totalUsers,
        totalProducts,
        pendingProducts,
        approvedProducts,
        rejectedProducts,
        totalOrders,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.status !== "pending") {
      return res.status(400).json({
        message: "Only pending products can be approved",
      });
    }

    product.status = "approved";
    product.rejectionReason = "";

    await product.save();

    return res.status(200).json({
      message: "Product approved successfully",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const rejectProduct = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        message: "Rejection reason is required",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.status !== "pending") {
      return res.status(400).json({
        message: "Only pending products can be rejected",
      });
    }

    product.status = "rejected";
    product.rejectionReason = rejectionReason;

    await product.save();

    return res.status(200).json({
      message: "Product rejected successfully",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({
      status: "pending",
    })
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