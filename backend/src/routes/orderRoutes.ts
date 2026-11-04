import { Router } from "express";
import {
  createOrder,
  trackOrder,
  cancelOrder,
  getOrders,
  updateOrderStatus,
  updateOrderPaymentStatus,
  deleteOrder,
  getRecentPublicSales,
} from "../controllers/orderController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Public Order Lifecycle
router.get("/recent", getRecentPublicSales);
router.get("/track", trackOrder);
router.post("/", createOrder);
router.patch("/:id/cancel", cancelOrder);

// Admin Order & Payment Management
router.get("/", authenticate, getOrders);
router.patch("/:id/status", authenticate, updateOrderStatus);
router.patch("/:id/payment", authenticate, updateOrderPaymentStatus);
router.delete("/:id", authenticate, deleteOrder);

export default router;
