import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, WEBP, GIF, and SVG images are allowed."));
    }
  },
});

