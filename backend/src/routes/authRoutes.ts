import { Router } from "express";
import {
  login,
  register,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  getUsers,
  updateUserRole,
} from "../controllers/authController.js";
import { getDashboard } from "../controllers/adminController.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/login", authLimiter, login);
router.post("/register", authenticate, authorizeRoles("admin"), register);
router.get("/me", authenticate, getMe);
router.put("/profile", authenticate, updateProfile);
router.put("/change-password", authenticate, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// User Management
router.get("/users", authenticate, authorizeRoles("admin"), getUsers);
router.put("/users/:id", authenticate, authorizeRoles("admin"), updateUserRole);

// Admin Dashboard stats
router.get("/dashboard", authenticate, getDashboard);

export default router;

