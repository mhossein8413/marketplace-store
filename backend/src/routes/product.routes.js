import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
    getMyProducts,
    getRelatedProducts,
} from "../controllers/product.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createProduct);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.patch("/:id", protect, updateProduct);

router.delete("/:id", protect, deleteProduct);

router.get("/my", protect, getMyProducts);

router.get("/:id/related", getRelatedProducts);

export default router;