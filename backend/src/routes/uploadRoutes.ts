import { Router } from "express";
import { uploadImage, deleteImage } from "../controllers/uploadController.js";
import { authenticate } from "../middleware/auth.js";
import { uploadMiddleware } from "../middleware/upload.js";

const router = Router();

// Protected Upload endpoints
router.post("/", authenticate, uploadMiddleware.single("image"), uploadImage);
router.delete("/:publicId(*)", authenticate, deleteImage);
router.delete("/", authenticate, deleteImage);

export default router;

