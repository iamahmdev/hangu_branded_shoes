import Head from "next/head";
import { useRouter } from "next/router";

export interface ProductSEOProps {
  name: string;
  description: string;
  price: number;
  currency?: string;
  image: string;
  stock?: number;
  rating?: number;
  reviewsCount?: number;
  sku?: string | number;
  category?: string;
}

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "product" | "article";
  canonical?: string;
  product?: ProductSEOProps;
  noIndex?: boolean;
}

const DEFAULT_TITLE = "Hangu Branded Shoes | Premium Handcrafted Footwear in Pakistan";
const DEFAULT_DESCRIPTION =
  "Discover premium handcrafted leather shoes, loafers, formal derby footwear, and performance sneakers at Hangu Branded Shoes. Cash on Delivery & 7-Day Hassle-Free Size Exchange nationwide in Pakistan.";
const DEFAULT_KEYWORDS =
  "hangu branded shoes, shoes in pakistan, pure leather shoes, handmade loafers, sneakers pakistan, formal shoes men, buy shoes online, cash on delivery shoes, peshawari chappal, hangu shoes";
const DEFAULT_OG_IMAGE = "/images/shoes/IMG_3091.jpg";

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  canonical,
  product,
  noIndex = false,
}: SEOProps) {
  const router = useRouter();
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://hangubrandedshoes.com").replace(/\/+$/, "");

  // Format page title
  const finalTitle = title
    ? title.includes("Hangu Branded Shoes")
      ? title
      : `${title} | Hangu Branded Shoes`
    : DEFAULT_TITLE;

  // Resolve absolute URL for canonical and OG image
  const currentPath = router.asPath ? router.asPath.split("?")[0] : "";
  const canonicalUrl = canonical || `${siteUrl}${currentPath === "/" ? "" : currentPath}`;
  const absoluteImageUrl = ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`;

  // Organization & Website JSON-LD Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Hangu Branded Shoes",
        url: siteUrl,
        logo: `${siteUrl}/images/shoes/IMG_3091.jpg`,
        description: DEFAULT_DESCRIPTION,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Tahir Market, Tall Road",
          addressLocality: "Hangu",
          addressRegion: "Khyber Pakhtunkhwa",
          postalCode: "26190",
          addressCountry: "PK",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+923333147691",
          contactType: "customer service",
          availableLanguage: ["Urdu", "Pashto", "English"],
        },
        sameAs: [
          "https://www.facebook.com/share/19iiUCxH6i/?mibextid=",
          "https://www.tiktok.com/@hangubrandshoes",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Hangu Branded Shoes",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/shop?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  // Product Rich Snippet Schema (Google Shopping / E-commerce Rich Results)
  const productSchema = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: [product.image.startsWith("http") ? product.image : `${siteUrl}${product.image}`],
        description: product.description || description,
        sku: String(product.sku || product.name.toLowerCase().replace(/[^a-z0-9]/g, "-")),
        category: product.category || "Footwear",
        brand: {
          "@type": "Brand",
          name: "Hangu Branded Shoes",
        },
        offers: {
          "@type": "Offer",
          url: canonicalUrl,
          priceCurrency: product.currency || "PKR",
          price: product.price,
          priceValidUntil: "2027-12-31",
          itemCondition: "https://schema.org/NewCondition",
          availability:
            (product.stock ?? 1) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          seller: {
            "@type": "Organization",
            name: "Hangu Branded Shoes",
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating || 5,
          reviewCount: product.reviewsCount || 15,
          bestRating: 5,
          worstRating: 1,
        },
      }
    : null;

  return (
    <Head>
      {/* Basic SEO Meta */}
      <title>{finalTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Hangu Branded Shoes" />
      <meta
        name="robots"
        content={
          noIndex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph (Facebook, WhatsApp, LinkedIn Cards) */}
      <meta property="og:site_name" content="Hangu Branded Shoes" />
      <meta property="og:type" content={product ? "product" : ogType} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:alt" content={finalTitle} />
      <meta property="og:locale" content="en_PK" />

      {/* Product Specific OG Meta */}
      {product && (
        <>
          <meta property="product:price:amount" content={String(product.price)} />
          <meta property="product:price:currency" content={product.currency || "PKR"} />
          <meta
            property="product:availability"
            content={(product.stock ?? 1) > 0 ? "in stock" : "out of stock"}
          />
        </>
      )}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />

      {/* Global Brand JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Specific Product Rich Snippet JSON-LD */}
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
    </Head>
  );
}

