import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();

// -----------------------------
// Global Middleware
// -----------------------------

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// -----------------------------
// Routes
// -----------------------------

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);

// -----------------------------
// Test Route
// -----------------------------

app.get("/", (req, res) => {
  res.json({
    message: "API is running",
  });
});

// -----------------------------
// Error Handler
// -----------------------------

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: err.message || "خطای داخلی سرور",
  });
});

export default app;