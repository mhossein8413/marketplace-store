import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
} from "../controllers/product.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createProduct);

router.get("/", getProducts);

router.get("/:id", getProductById);

export default router;