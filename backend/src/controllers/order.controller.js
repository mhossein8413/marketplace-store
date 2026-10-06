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

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
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

    const orderItems = [];
    let totalAmount = 0;
    let sellerId = null;

    for (const item of items) {
      const { product: productId, quantity } = item;

      if (!productId || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          message: "Invalid product or quantity",
        });
      }

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          message: `Product ${productId} not found`,
        });
      }

      if (product.status !== "approved") {
        return res.status(400).json({
          message: `Product "${product.title}" is not available for purchase`,
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Not enough stock for "${product.title}"`,
        });
      }

      if (!sellerId) {
        sellerId = product.seller;
      }

      if (product.seller.toString() !== sellerId.toString()) {
        return res.status(400).json({
          message: "All products in one order must belong to the same seller",
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

    const order = await Order.create({
      buyer: req.user.userId,
      seller: sellerId,
      items: orderItems,
      totalAmount,
      shippingAddress: {
        recipientName,
        phone,
        city,
        address,
        postalCode,
      },
      status: "pending",
    });

    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: -item.quantity,
          salesCount: item.quantity,
        },
      });
    }

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};