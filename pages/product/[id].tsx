import type { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useState, useMemo } from "react";
import Link from "next/link";
import Head from "next/head";
import Layout from "../../src/components/Layout";
import { useCart } from "../../src/context/CartContext";
import { SIZES, wa } from "../../src/data/config";
import { useProduct } from "../../src/hooks/useApi";
import { WhatsAppIcon } from "../../src/components/WhatsAppButton";
import { FALLBACK_PRODUCTS } from "../../src/data/fallbackProducts";
import { Product as ProductType } from "../../src/types";
import {
  Star,
  Tag,
  Plane,
  Package,
  Calendar,
  Truck,
  Heart,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Zap,
  Check,
  RotateCcw,
  ShieldCheck,
  Box,
  ZoomIn,
  Maximize2,
  X,
} from "lucide-react";
import { resolveProductImage } from "../../src/utils/image";

export default function Product({ initialProduct }: { initialProduct?: ProductType }) {
  const { query, push } = useRouter();
  const { add } = useCart();
  const [size, setSize] = useState<string>("");
  const [q, setQ] = useState<number>(1);
  const [err, setErr] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<boolean>(false);
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  // High-Resolution Zoom & Lightbox State
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // TanStack Query hook - uses initialProduct directly so ZERO loading delay!
  const { data: apiProduct, isError } = useProduct(query.id as string);
  const p = apiProduct || initialProduct || (query.id ? FALLBACK_PRODUCTS.find((item) => item.id === Number(query.id)) : undefined);

  // Gallery images list: strictly uses genuine product images from database
  const galleryImages = useMemo(() => {
    if (!p) return [];
    if (Array.isArray(p.images) && p.images.length > 0) {
      return p.images.map((img) => resolveProductImage(img));
    }
    return [resolveProductImage(p.img)];
  }, [p]);

  // Dynamic delivery date estimate (e.g. 2-3 working days)
  const deliveryEstimate = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const end = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
    const startStr = start.getDate();
    const endStr = end.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    return `${startStr}-${endStr}`;
  }, []);

  if (!p) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6 aspect-square bg-[#fbf4e6]/70 rounded-3xl animate-pulse" />
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="h-4 w-24 bg-zinc-200 rounded-md animate-pulse" />
            <div className="h-10 w-3/4 bg-zinc-200 rounded-xl animate-pulse" />
            <div className="h-16 w-full bg-zinc-200/60 rounded-xl animate-pulse" />
            <div className="h-8 w-1/3 bg-zinc-200 rounded-xl animate-pulse" />
            <div className="h-32 w-full bg-zinc-200/50 rounded-2xl animate-pulse mt-4" />
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !p) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto text-center py-28 px-5">
          <span className="text-4xl block mb-2">👟</span>
          <h2 className="text-2xl font-bold text-zinc-950">Shoe Not Found</h2>
          <p className="text-zinc-500 text-sm mt-2">
            The shoe you are looking for does not exist or has been removed from inventory.
          </p>
          <Link
            href="/shop"
            className="mt-5 inline-block px-6 py-2.5 rounded-lg bg-zinc-950 text-white text-xs font-bold hover:bg-zinc-800 transition-colors"
          >
            Back to Footwear Catalog
          </Link>
        </div>
      </Layout>
    );
  }

  const savings = p.old && p.old > p.price ? p.old - p.price : 0;
  const discount = p.old && p.old > p.price ? Math.round((savings / p.old) * 100) : 23;

  const handlePrevImage = () => {
    setActiveImgIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImgIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const go = (buy: boolean) => {
    if (!size) {
      setErr(true);
      return;
    }
    add(p, size, q);
    if (buy) {
      push("/checkout");
    } else {
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2500);
    }
  };

  const buildWhatsAppOrderUrl = () => {
    const sizeText = size || "Size not selected yet";
    const totalAmount = (p.price * q).toLocaleString();
    const msg = `Hello Hangu Branded Shoes! 👟\n\nI want to order this footwear pair:\n*Product:* ${p.name}\n*Category:* ${p.cat}\n*Size (EU):* ${sizeText}\n*Quantity:* ${q}\n*Price:* Rs. ${totalAmount}\n*Payment:* Cash on Delivery / JazzCash\n\nMy Delivery Details:\nName: \nPhone: \nCity: \nDelivery Address: `;
    return wa(msg);
  };

  const availableSizes = p.sizes && p.sizes.length > 0 ? p.sizes : SIZES;

  return (
    <Layout
      title={`${p.name} — Rs. ${p.price.toLocaleString()} | Hangu Branded Shoes`}
      description={`Buy authentic ${p.name} (${p.cat}) handcrafted with premium materials for Rs. ${p.price.toLocaleString()}. Cash on Delivery & 7-Day Hassle-Free Size Exchange nationwide in Pakistan.`}
      ogImage={resolveProductImage(p.img)}
      ogType="product"
      product={{
        name: p.name,
        description: p.desc || `Authentic handcrafted ${p.name} from Hangu Branded Shoes Pakistan.`,
        price: p.price,
        image: resolveProductImage(p.img),
        stock: p.stock,
        rating: p.rating || 5,
        reviewsCount: p.reviews || 15,
        sku: p.id,
        category: p.cat,
      }}
    >
      <Head>
        <link rel="preload" as="image" href={resolveProductImage(p.img)} />
      </Head>
      <div className="bg-[#fafafa] text-zinc-900 min-h-screen pt-4 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
            <Link href="/" className="hover:text-zinc-950 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-zinc-950 transition-colors">
              Footwear
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-semibold truncate">{p.name}</span>
          </div>

          {/* Main PDP Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* ============================================================ */}
            {/* LEFT COLUMN: Visual Showcase & Gallery                       */}
            {/* ============================================================ */}
            <div className="lg:col-span-6 flex flex-col gap-3">
              {/* Pure Modern Showcase Frame (100% Full Unobstructed Shoe Display) */}
              <div className="relative w-full rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/90 shadow-xs overflow-hidden flex flex-col">
                {/* Floating Badges Header (Top Row) */}
                <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
                  {/* Discount Badge */}
                  {discount > 0 && (
                    <span className="bg-zinc-950 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs pointer-events-auto">
                      {discount}% OFF
                    </span>
                  )}

                  {/* Right: Category + Wishlist */}
                  <div className="flex items-center gap-2 pointer-events-auto ml-auto">
                    <span className="bg-white/95 backdrop-blur-md text-zinc-800 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full border border-zinc-200/80 shadow-2xs">
                      {p.cat || "Footwear"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border transition-all ${isWishlisted
                        ? "bg-rose-50 border-rose-300 text-rose-500 scale-105"
                        : "bg-white/95 border-zinc-200 text-zinc-500 hover:text-zinc-900 shadow-2xs"
                        }`}
                      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>

                {/* Big Full Photo Canvas: 100% Edge-to-Edge Fill with Hover Magnification & Tap Lightbox */}
                <div
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    setZoomPos({ x, y });
                  }}
                  onClick={() => setIsLightboxOpen(true)}
                  className="relative w-full aspect-[3/4] bg-gradient-to-b from-[#fafafa] via-[#f4f4f6] to-[#eaebee] flex items-center justify-center p-2 sm:p-4 overflow-hidden cursor-zoom-in group select-none"
                  title="Click to view full-screen high-resolution photo"
                >
                  <img
                    key={activeImgIndex}
                    src={galleryImages[activeImgIndex] || resolveProductImage(p.img)}
                    alt={`${p.name} - Angle ${activeImgIndex + 1}`}
                    loading="eager"
                    decoding="async"
                    className={`w-full h-full max-h-full max-w-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)] select-none transition-transform duration-150 ease-out ${isZoomed ? "scale-175" : "scale-100"
                      }`}
                    style={
                      isZoomed
                        ? {
                          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        }
                        : undefined
                    }
                  />

                  {/* Left / Right Carousel Arrow Buttons */}
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevImage();
                        }}
                        aria-label="Previous shoe angle"
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-zinc-900 flex items-center justify-center shadow-md border border-zinc-200 transition-all z-20 cursor-pointer active:scale-95"
                      >
                        <ChevronLeft size={18} strokeWidth={2.5} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextImage();
                        }}
                        aria-label="Next shoe angle"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-zinc-900 flex items-center justify-center shadow-md border border-zinc-200 transition-all z-20 cursor-pointer active:scale-95"
                      >
                        <ChevronRight size={18} strokeWidth={2.5} />
                      </button>
                    </>
                  )}

                  {/* Angle Pagination Dots (Center Bottom) */}
                  {galleryImages.length > 1 && (
                    <div className="absolute bottom-11 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 pointer-events-none">
                      {galleryImages.map((_, idx) => (
                        <span
                          key={idx}
                          className={`h-1.5 rounded-full transition-all duration-300 ${activeImgIndex === idx
                            ? "w-6 bg-zinc-950 shadow-xs"
                            : "w-1.5 bg-zinc-400/70"
                            }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Zoom Indicator Badge (Bottom Center) */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-semibold shadow-md border border-white/10">
                      <ZoomIn size={12} className="text-emerald-400" />
                      <span className="hidden sm:inline">Hover to Zoom • Click for Full View</span>
                      <span className="sm:hidden">Tap for Fullscreen Zoom</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Clean Gallery Thumbnails + Fullscreen Action (Below Canvas) */}
              <div className="flex items-center justify-between gap-3 px-1 py-1">
                {galleryImages.length > 1 ? (
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {galleryImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImgIndex(idx)}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white p-0.5 border-2 transition-all overflow-hidden flex items-center justify-center cursor-pointer shrink-0 ${activeImgIndex === idx
                          ? "border-zinc-950 ring-2 ring-zinc-950/20 scale-102 shadow-xs"
                          : "border-zinc-200 opacity-70 hover:opacity-100"
                          }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`${p.name} angle ${idx + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>100% Genuine Physical Store Photograph</span>
                  </div>
                )}

                {/* Fullscreen High-Res Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition-colors ml-auto cursor-pointer shrink-0"
                  title="View Fullscreen High-Res Photo"
                >
                  <Maximize2 size={13} />
                  <span>Photo {activeImgIndex + 1} of {galleryImages.length}</span>
                </button>
              </div>

              {/* Bottom Quick Trust Highlights */}
              <div className="flex justify-around text-[11px] sm:text-xs text-zinc-500 font-medium py-1">
                <span>✨ Genuine Sole</span>
                <span>🧵 Handcrafted</span>
                <span>🚚 Fast Delivery Across Pakistan</span>
              </div>
            </div>

            {/* ============================================================ */}
            {/* RIGHT COLUMN: Product Details & Purchase Actions             */}
            {/* ============================================================ */}
            <div className="lg:col-span-6 flex flex-col pt-1">
              {/* Category / Collection Eyebrow */}
              <span className="text-xs sm:text-sm font-extrabold tracking-wider uppercase text-[#eab308] mb-1">
                {p.cat || "Handcrafted Footwear"}
              </span>

              {/* Product Title in Heavy Bold Uppercase */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-950 uppercase tracking-tight leading-tight mb-2.5">
                {p.name}
              </h1>

              {/* Product Short Description */}
              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed mb-4 max-w-xl">
                {p.desc ||
                  "Authentic handcrafted shoe from Hangu Branded Shoes. Designed with premium genuine materials, responsive shock-absorbing cushioning, and ergonomic footbed for lifetime durability and supreme daily comfort in Pakistan."}
              </p>

              {/* Ratings & Genuine Stock Row */}
              <div className="flex flex-wrap items-center gap-4 text-xs mb-6">
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-zinc-500 font-semibold ml-1">
                    ({p.reviews || 15} Reviews)
                  </span>
                </div>

                <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <Tag size={13} />
                  <span>{p.stock ? `${p.stock} Pairs in Stock` : "Available in Stock"}</span>
                </div>
              </div>

              {/* ============================================================ */}
              {/* SHIPPING DETAILS BOX (2x2 Grid)                              */}
              {/* ============================================================ */}
              <div className="mb-6">
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 mb-3">Shipping & Delivery</h3>
                <div className="grid grid-cols-2 gap-4 py-2 border-y border-zinc-200/80">
                  {/* Origin */}
                  <div className="flex items-start gap-2.5">
                    <Plane size={18} className="text-zinc-700 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[11px] text-zinc-400 block font-medium">Dispatch From</span>
                      <b className="text-xs text-zinc-900">Hangu, KP (Tahir Market)</b>
                    </div>
                  </div>

                  {/* Packaging */}
                  <div className="flex items-start gap-2.5">
                    <Package size={18} className="text-zinc-700 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[11px] text-zinc-400 block font-medium">Packaging</span>
                      <b className="text-xs text-zinc-900">Original Shoe Box</b>
                    </div>
                  </div>

                  {/* Delivery Time */}
                  <div className="flex items-start gap-2.5">
                    <Calendar size={18} className="text-zinc-700 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[11px] text-zinc-400 block font-medium">Delivery Time</span>
                      <b className="text-xs text-zinc-900">2-3 Working Days</b>
                    </div>
                  </div>

                  {/* Estimation Arrive */}
                  <div className="flex items-start gap-2.5">
                    <Truck size={18} className="text-zinc-700 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[11px] text-zinc-400 block font-medium">Courier Service</span>
                      <b className="text-xs text-zinc-900">Nationwide Express ({deliveryEstimate})</b>
                    </div>
                  </div>
                </div>
              </div>

              {/* ============================================================ */}
              {/* PRICING & QUANTITY ROW                                       */}
              {/* ============================================================ */}
              <div className="flex flex-wrap items-center justify-between gap-4 my-3">
                {/* Price Display */}
                <div className="flex items-baseline gap-3">
                  {p.old && p.old > p.price && (
                    <s className="text-xl sm:text-2xl font-bold text-zinc-400 font-mono line-through">
                      Rs. {p.old.toLocaleString()}
                    </s>
                  )}
                  <span className="text-3xl sm:text-4xl font-black text-zinc-950 font-mono tracking-tight">
                    Rs. {p.price.toLocaleString()}
                  </span>
                </div>

                {/* Quantity Selector Minimal Pill */}
                <div className="flex items-center gap-1.5 border border-zinc-200 rounded-lg p-1 bg-white">
                  <button
                    type="button"
                    onClick={() => setQ(Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-bold font-mono text-zinc-900">
                    {q}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQ(q + 1)}
                    aria-label="Increase quantity"
                    className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* ============================================================ */}
              {/* SELECT SIZE SECTION                                          */}
              {/* ============================================================ */}
              <div className="mt-4 mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs sm:text-sm font-semibold text-zinc-600">
                    Select Size:{" "}
                    {size ? (
                      <b className="text-zinc-950 font-mono">{size} EU</b>
                    ) : (
                      <span className={err ? "text-rose-600 font-bold" : "text-zinc-400"}>
                        {err ? "⚠️ Please choose a size" : "(Required)"}
                      </span>
                    )}
                  </span>
                  <Link
                    href="/size-guide"
                    className="text-xs text-zinc-500 hover:text-zinc-950 underline font-medium"
                  >
                    📏 Size Guide
                  </Link>
                </div>

                {/* Size Tiles */}
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSize(s);
                        setErr(false);
                      }}
                      className={`min-w-[48px] sm:min-w-[54px] h-11 sm:h-12 px-2.5 sm:px-3 rounded-xl font-bold text-xs sm:text-sm font-mono transition-all flex items-center justify-center cursor-pointer ${size === s
                        ? "bg-zinc-950 text-white shadow-xs scale-102"
                        : "bg-[#f4f4f6] text-zinc-800 hover:bg-zinc-200 border border-zinc-200/70"
                        }`}
                    >
                      {s}
                    </button>
                  ))}

                  <Link
                    href="/size-guide"
                    aria-label="View more sizes"
                    className="w-10 h-11 sm:h-12 rounded-xl bg-[#f4f4f6] text-zinc-400 hover:text-zinc-950 hover:bg-zinc-200 border border-zinc-200/70 flex items-center justify-center transition-colors shrink-0"
                  >
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </div>

              {/* ============================================================ */}
              {/* TWO ACTION BUTTONS (Add to Cart / Buy now)                   */}
              {/* ============================================================ */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => go(false)}
                  className="py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-white hover:bg-zinc-50 active:bg-zinc-100 text-zinc-950 border border-zinc-900 font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors shadow-2xs flex items-center justify-center gap-1.5 sm:gap-2 active:scale-98"
                >
                  <ShoppingBag size={16} />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={() => go(true)}
                  className="py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-zinc-950 hover:bg-zinc-800 active:bg-zinc-900 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-1.5 sm:gap-2 active:scale-98"
                >
                  <Zap size={16} className="text-amber-400 fill-amber-400" />
                  <span>Buy now</span>
                </button>
              </div>

              {/* Direct Instant WhatsApp Order Button */}
              <a
                href={buildWhatsAppOrderUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-2.5 sm:mt-3 py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs active:scale-98"
              >
                <WhatsAppIcon size={18} color="#fff" />
                <span>Instant Order on WhatsApp</span>
              </a>

              {/* Added to Bag Toast Notification */}
              {addedToast && (
                <div className="mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 animate-fadeIn">
                  <Check size={16} />
                  <span>✓ Added to Cart! View cart to checkout anytime.</span>
                </div>
              )}

              {/* Value Assurance List */}
              <div className="mt-6 pt-5 border-t border-zinc-200/80 flex flex-col gap-2.5 text-xs text-zinc-600">
                <div className="flex items-center gap-2.5">
                  <RotateCcw size={15} className="text-emerald-600 shrink-0" />
                  <span>
                    <b>7-Day Free Size Exchange:</b> Hassle-free replacement if sizing does not fit.
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
                  <span>
                    <b>100% Genuine Sole:</b> High density cushioned comfort and genuine fit.
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Truck size={15} className="text-emerald-600 shrink-0" />
                  <span>
                    <b>Fast Delivery Across Pakistan:</b> Safe doorstep delivery to all cities.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen High-Resolution Lightbox Modal (Tap / Click to Inspect Leather & Stitching) */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Header Bar */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between text-white z-30 pointer-events-auto">
            <div className="flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold truncate max-w-[180px] sm:max-w-xs">{p.name}</span>
              <span className="text-zinc-500 text-xs">•</span>
              <span className="text-zinc-300 text-xs font-mono">
                {activeImgIndex + 1} / {galleryImages.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="w-10 h-10 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white flex items-center justify-center border border-white/10 transition-colors cursor-pointer shadow-lg"
              aria-label="Close Fullscreen View"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main High-Res Image Container */}
          <div
            className="relative max-w-4xl max-h-[82vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[activeImgIndex] || resolveProductImage(p.img)}
              alt={`${p.name} fullscreen`}
              className="max-h-[78vh] sm:max-h-[82vh] max-w-full object-contain rounded-2xl shadow-2xl select-none"
            />

            {/* Prev / Next Arrows */}
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="Previous angle"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer active:scale-95 shadow-xl"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="Next angle"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer active:scale-95 shadow-xl"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          {galleryImages.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-zinc-950/80 backdrop-blur-md rounded-2xl border border-white/10 z-30 overflow-x-auto max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImgIndex(idx)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${activeImgIndex === idx
                    ? "border-emerald-400 scale-105"
                    : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                >
                  <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = FALLBACK_PRODUCTS.map((item) => ({
    params: { id: String(item.id) },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id;
  const numId = Number(id);
  const initialProduct = FALLBACK_PRODUCTS.find((item) => item.id === numId) || null;
  if (!initialProduct) {
    return { notFound: true };
  }
  return {
    props: {
      initialProduct,
    },
    revalidate: 60,
  };
};
