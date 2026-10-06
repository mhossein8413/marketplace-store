import Order from "../models/Order.js";
import "../models/User.js";
import "../models/Product.js";

export const getMySales = async (req, res) => {
  try {
    const orders = await Order.find({
      seller: req.user.userId,
    })
      .populate("buyer", "name email")
      .populate("items.product", "title price images")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      buyer: req.user.userId,
    })
      .populate("seller", "name email")
      .populate("items.product", "title price images")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};