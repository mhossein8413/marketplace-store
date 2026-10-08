import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

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

export async function createOrder(req, res) {

  

  
  
  try {

    const session = await mongoose.startSession();
    console.log("========== CREATE ORDER ==========");
    console.log("URL:", req.originalUrl);
    console.log("METHOD:", req.method);
    console.log("CONTENT TYPE:", req.headers["content-type"]);
    console.log("BODY:", req.body);
    console.log("ITEMS:", req.body?.items);

    const { items, shippingAddress } = req.body || {};

    console.log("ORDER BODY:", req.body);
    console.log("ORDER ITEMS:", items);

    // -----------------------------
    // Validation
    // -----------------------------

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order items are required",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        message: "Shipping address is required",
      });
    }

    const {
      recipientName,
      phone,
      city,
      address,
      postalCode,
    } = shippingAddress;

    if (
      !recipientName ||
      !phone ||
      !city ||
      !address ||
      !postalCode
    ) {
      return res.status(400).json({
        message: "Complete shipping address is required",
      });
    }

    // -----------------------------
    // Validate first product
    // -----------------------------

    const firstItem = items[0];

    if (!firstItem?.product) {
      return res.status(400).json({
        message: "Product id is required",
      });
    }

    if (!mongoose.isObjectIdOrHexString(firstItem.product)) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    // -----------------------------
    // Load products
    // -----------------------------

    const productIds = items.map((item) => item.product);

    const products = await Product.find({
      _id: { $in: productIds },
      status: "approved",
    }).populate("seller");

    if (products.length !== items.length) {
      return res.status(400).json({
        message: "One or more products were not found or are not approved",
      });
    }

    // -----------------------------
    // Check seller
    // -----------------------------

    const sellerId = products[0].seller?._id?.toString();

    if (!sellerId) {
      return res.status(400).json({
        message: "Product seller was not found",
      });
    }

    for (const product of products) {
      const productSellerId = product.seller?._id?.toString();

      if (productSellerId !== sellerId) {
        return res.status(400).json({
          message:
            "All products in one order must belong to the same seller",
        });
      }
    }

    // -----------------------------
    // Build order items
    // -----------------------------

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = products.find(
        (product) =>
          product._id.toString() === item.product.toString()
      );

      if (!product) {
        return res.status(400).json({
          message: "Product not found",
        });
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
          message: `Invalid quantity for product ${product.title}`,
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `موجودی محصول «${product.title}» کافی نیست`,
        });
      }

      const itemTotal = product.price * quantity;

      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity,
        priceAtPurchase: product.price,
      });
    }

    // -----------------------------
    // Create order
    // -----------------------------

    const order = await Order.create({
        buyer: req.user.userId,
        seller: sellerId,
        items: orderItems,
        totalAmount,
        status: "pending",
        shippingAddress: {
          recipientName,
          phone,
          city,
          address,
          postalCode,
        },
      });

    // -----------------------------
    // Update stock and sales
    // -----------------------------

    for (const item of items) {
      const quantity = Number(item.quantity);

      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: -quantity,
            salesCount: quantity,
          },
        }
      );
    }

    // -----------------------------
    // Response
    // -----------------------------

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      message: "خطا در ثبت سفارش",
      error: error.message,
    });
  }
}

export async function cancelOrder(req, res) {
  try {
    const { id } = req.params;

    console.log("========== CANCEL ORDER ==========");
    console.log("ORDER ID:", id);
    console.log("USER ID:", req.user?.userId);

    // -----------------------------
    // Find order
    // -----------------------------

    const order = await Order.findOne({
      _id: id,
      buyer: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({
        message: "سفارش پیدا نشد",
      });
    }

    // -----------------------------
    // Check order status
    // -----------------------------

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "این سفارش دیگر قابل لغو نیست",
      });
    }

    // -----------------------------
    // Restore product stock
    // -----------------------------

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: item.quantity,
            salesCount: -item.quantity,
          },
        }
      );
    }

    // -----------------------------
    // Cancel order
    // -----------------------------

    order.status = "cancelled";

    await order.save();

    // -----------------------------
    // Response
    // -----------------------------

    return res.status(200).json({
      message: "سفارش با موفقیت لغو شد",
      order,
    });
  } catch (error) {
    console.error("CANCEL ORDER ERROR:", error);

    return res.status(500).json({
      message: "خطا در لغو سفارش",
      error: error.message,
    });
  }
}