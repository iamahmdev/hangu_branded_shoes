/**
 * Resolves a product, banner, or category image URL safely.
 * Handles Cloudinary/Unsplash absolute URLs, local images, and undefined/missing fallbacks.
 */
export function resolveProductImage(img?: string | null, fallback: string = "/images/p1.jpg"): string {
  if (!img || img === "undefined" || img === "null" || typeof img !== "string" || img.trim() === "") {
    return fallback;
  }
  let clean = img.trim();
  // Auto-optimize Cloudinary images: WebP/AVIF format, auto-quality, max 800px width
  if (clean.includes("res.cloudinary.com") && clean.includes("/upload/") && !clean.includes("/upload/f_auto")) {
    clean = clean.replace("/upload/", "/upload/f_auto,q_auto,w_800/");
  }
  if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("/")) {
    return clean;
  }
  return `/images/${clean}`;
}

