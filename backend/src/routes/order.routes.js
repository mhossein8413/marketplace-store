import express from "express";
import { getMySales } from "../controllers/order.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/sales", protect, getMySales);

export default router;