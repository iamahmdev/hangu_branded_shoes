import { GetServerSideProps } from "next";
import { FALLBACK_PRODUCTS } from "../src/data/fallbackProducts";

function generateSiteMap(
  products: Array<{ id: number | string; updatedAt?: string }>,
  baseUrl: string
) {
  const currentDate = new Date().toISOString().split("T")[0];

  const staticPages = [
    { url: "", changefreq: "daily", priority: "1.0" },
    { url: "/shop", changefreq: "daily", priority: "0.9" },
    { url: "/about", changefreq: "monthly", priority: "0.7" },
    { url: "/contact", changefreq: "monthly", priority: "0.7" },
    { url: "/track", changefreq: "weekly", priority: "0.8" },
    { url: "/size-guide", changefreq: "monthly", priority: "0.7" },
    { url: "/reviews", changefreq: "weekly", priority: "0.8" },
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
    <url>
      <loc>${baseUrl}${page.url}</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>`
    )
    .join("")}
  ${products
    .map(
      (product) => `
    <url>
      <loc>${baseUrl}/product/${product.id}</loc>
      <lastmod>${product.updatedAt ? product.updatedAt.split("T")[0] : currentDate}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
    </url>`
    )
    .join("")}
</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://hangubrandedshoes.com").replace(/\/+$/, "");
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001").replace(/\/+$/, "");

  let products: Array<{ id: number | string; updatedAt?: string }> = FALLBACK_PRODUCTS;

  try {
    const response = await fetch(`${apiUrl}/api/products`);
    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.data) && data.data.length > 0) {
        products = data.data;
      }
    }
  } catch (err) {
    // Fallback products safely utilized
  }

  const sitemap = generateSiteMap(products, baseUrl);

  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=43200");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default function SiteMap() {
  return null;
}

