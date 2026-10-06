import "dotenv/config"; 
import mongoose from "mongoose";

import connectDB from "./config/db.js";

import User from "./models/User.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";

const seedDatabase = async () => {
  try {
    await connectDB();

    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    await Category.deleteMany({});

    const category = await Category.create({
      name: "Mobile Phones",
      slug: "mobile-phones",
    });

    const seller = await User.create({
      name: "Ali",
      email: "ali@example.com",
      password: "123456",
    });

    const buyer = await User.create({
      name: "Reza",
      email: "reza@example.com",
      password: "123456",
    });

    // 3. Product
    const product = await Product.create({
      title: "iPhone 15",
      description: "A sample product for testing",
      price: 50000,
      stock: 10,

      images: [
        "https://example.com/iphone15.jpg",
      ],

      seller: seller._id,
      category: category._id,

      tags: ["iphone", "apple", "smartphone"],

      status: "approved",

      isFeatured: true,

      viewCount: 120,
      salesCount: 5,
    });

    // 4. Order
    const order = await Order.create({
      buyer: buyer._id,
      seller: seller._id,

      items: [
        {
          product: product._id,
          quantity: 2,
          priceAtPurchase: product.price,
        },
      ],

      totalAmount: product.price * 2,

      status: "pending",

      shippingAddress: {
        recipientName: "Reza",
        phone: "09120000000",
        city: "Tehran",
        address: "Example Street",
        postalCode: "1234567890",
      },
    });

    console.log("Database seeded successfully.");

    console.log("\nCategory:");
    console.log(category);

    console.log("\nSeller:");
    console.log(seller);

    console.log("\nBuyer:");
    console.log(buyer);

    console.log("\nProduct:");
    console.log(product);

    console.log("\nOrder:");
    console.log(order);

    await mongoose.connection.close();
    console.log("\nMongoDB connection closed.");
  } catch (error) {
    console.error("Seed failed:", error);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();