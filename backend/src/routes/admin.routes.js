import express from "express";

import {
  getAdminDashboard,
  getPendingProducts,
  approveProduct,
  rejectProduct,
} from "../controllers/admin.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getAdminDashboard
);

router.get(
  "/products/pending",
  protect,
  adminOnly,
  getPendingProducts
);

router.patch(
  "/products/:id/approve",
  protect,
  adminOnly,
  approveProduct
);

router.patch(
  "/products/:id/reject",
  protect,
  adminOnly,
  rejectProduct
);

export default router;