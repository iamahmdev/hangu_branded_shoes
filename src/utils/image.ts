/**
 * Resolves a product, banner, or category image URL safely.
 * Handles Cloudinary/Unsplash absolute URLs, local images, and undefined/missing fallbacks.
 */
export function resolveProductImage(img?: string | null, fallback: string = "/images/p1.jpg"): string {
  if (!img || img === "undefined" || img === "null" || typeof img !== "string" || img.trim() === "") {
    return fallback;
  }
  const clean = img.trim();
  if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("/")) {
    return clean;
  }
  return `/images/${clean}`;
}

