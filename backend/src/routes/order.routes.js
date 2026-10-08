import express from "express";

import {
  getMySales,
  getMyOrders,
  createOrder,
  cancelOrder,
  approveOrder,
} from "../controllers/order.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/sales", protect, getMySales);

router.patch("/:id/approve",protect,approveOrder);

router.get("/my", protect, getMyOrders);

router.post("/", protect, createOrder);

router.patch("/:id/cancel",protect,cancelOrder);

export default router;