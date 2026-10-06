import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createProduct);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.patch("/:id", protect, updateProduct);

router.delete("/:id", protect, deleteProduct);

export default router;