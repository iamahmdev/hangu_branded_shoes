import { Router } from "express";
import {
  createOrder,
  trackOrder,
  cancelOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Public Order Lifecycle
router.get("/track", trackOrder);
router.post("/", createOrder);
router.patch("/:id/cancel", cancelOrder);

// Admin Management
router.get("/", authenticate, getOrders);
router.patch("/:id/status", authenticate, updateOrderStatus);
router.delete("/:id", authenticate, deleteOrder);

export default router;

