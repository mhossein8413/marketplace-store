import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getRelatedProducts,
  getCategories,
  createCategory,
  getProductImage,
} from "../controllers/product.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

import {
  uploadProductImages,
} from "../middlewares/upload.middleware.js";

const router =
  express.Router();

/*
|--------------------------------------------------------------------------
| Categories
|--------------------------------------------------------------------------
| IMPORTANT:
| These routes must be before /:id
|--------------------------------------------------------------------------
*/

router.get(
  "/categories",
  getCategories
);

router.post(
  "/categories",
  protect,
  createCategory
);

/*
|--------------------------------------------------------------------------
| Public Products
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  getProducts
);

/*
|--------------------------------------------------------------------------
| Seller Products
|--------------------------------------------------------------------------
*/

router.get(
  "/my",
  protect,
  getMyProducts
);

/*
|--------------------------------------------------------------------------
| Product Images
|--------------------------------------------------------------------------
*/

router.get(
  "/images/:filename",
  getProductImage
);

/*
|--------------------------------------------------------------------------
| Product By ID
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  getProductById
);

router.get(
  "/:id/related",
  getRelatedProducts
);

/*
|--------------------------------------------------------------------------
| Seller Product Management
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  protect,
  uploadProductImages,
  createProduct
);

router.patch(
  "/:id",
  protect,
  updateProduct
);

router.delete(
  "/:id",
  protect,
  deleteProduct
);

export default router;