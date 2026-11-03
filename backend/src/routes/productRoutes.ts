import { Router } from "express";
import {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  adjustStock,
  deleteProduct,
} from "../controllers/productController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Public
router.get("/categories", getCategories);
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin Protected
router.post("/", authenticate, createProduct);
router.put("/:id", authenticate, updateProduct);
router.patch("/:id/stock", authenticate, adjustStock);
router.delete("/:id", authenticate, deleteProduct);

export default router;

