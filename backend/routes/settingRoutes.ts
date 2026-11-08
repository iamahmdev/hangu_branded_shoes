import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Public
router.get("/", getSettings);

// Admin
router.put("/", authenticate, updateSettings);

export default router;

