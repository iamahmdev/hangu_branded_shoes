import { useRouter } from "next/router";
import { useState, useMemo } from "react";
import Link from "next/link";
import Layout from "../../src/components/Layout";
import { useCart } from "../../src/context/CartContext";
import { SIZES, wa } from "../../src/data/config";
import { useProduct } from "../../src/hooks/useApi";
import { WhatsAppIcon } from "../../src/components/WhatsAppButton";
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
} from "lucide-react";
import { resolveProductImage } from "../../src/utils/image";
import Shoe3DViewer from "../../src/components/Shoe3DViewer";

export default function Product() {
  const { query, push } = useRouter();
  const { add } = useCart();
  const [size, setSize] = useState<string>("");
  const [q, setQ] = useState<number>(1);
  const [err, setErr] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"photo" | "3d">("photo");
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  // TanStack Query hook
  const { data: p, isLoading, isError } = useProduct(query.id as string);

  // Gallery images list (uses p.images if available, else generates angles from p.img)
  const galleryImages = useMemo(() => {
    if (!p) return [];
    if (Array.isArray(p.images) && p.images.length > 0) {
      return p.images.map((img) => resolveProductImage(img));
    }
    const primary = resolveProductImage(p.img);
    return [primary, primary, primary];
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

  if (isLoading) {
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
            <div className="lg:col-span-6 flex flex-col gap-4">
              {/* Warm Cream Luxury Showcase Card */}
              <div className="relative w-full rounded-3xl bg-[#fbf4e6] border border-amber-200/50 p-6 sm:p-8 flex flex-col justify-between shadow-xs overflow-hidden min-h-[460px] sm:min-h-[520px]">
                {/* Top-Left Ribbon: Get X% Off */}
                <div className="absolute top-0 left-6 sm:left-8 z-20">
                  <div className="bg-[#f59e0b] text-white px-2.5 py-3 rounded-b-lg shadow-md flex flex-col items-center">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest leading-none">
                      Get
                    </span>
                    <span className="text-sm font-black mt-0.5 leading-none">{discount}%</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider leading-none mt-0.5">
                      Off
                    </span>
                  </div>
                </div>

                {/* Top-Right: Category Pill + Heart Wishlist Button */}
                <div className="flex items-center justify-end gap-2 z-20">
                  <span className="bg-white/85 backdrop-blur-xs text-zinc-800 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-200/60 shadow-2xs">
                    {p.cat || "Gen Z Fashion"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                      isWishlisted
                        ? "bg-rose-50 border-rose-300 text-rose-500 scale-105"
                        : "bg-white border-amber-200 text-amber-500 hover:text-amber-600 hover:border-amber-300 shadow-2xs"
                    }`}
                    title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Hero Showcase Center: Photo or 3D */}
                <div className="relative my-auto py-6 sm:py-8 flex items-center justify-center min-h-[280px] sm:min-h-[340px]">
                  {viewMode === "3d" ? (
                    <div className="w-full h-80 flex items-center justify-center">
                      <Shoe3DViewer
                        img={p.img}
                        name={p.name}
                        className="w-full h-full"
                        initialAutoRotate={false}
                        allowZoom={true}
                        showControls={true}
                      />
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={galleryImages[activeImgIndex] || resolveProductImage(p.img)}
                        alt={p.name}
                        className="w-full max-h-[320px] sm:max-h-[360px] object-contain drop-shadow-[0_25px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Left / Right Carousel Arrow Buttons */}
                  {viewMode === "photo" && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevImage}
                        aria-label="Previous view"
                        className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-zinc-600 hover:text-zinc-950 flex items-center justify-center shadow-xs border border-amber-200/70 transition-all z-10"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextImage}
                        aria-label="Next view"
                        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-zinc-600 hover:text-zinc-950 flex items-center justify-center shadow-xs border border-amber-200/70 transition-all z-10"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}
                </div>

                {/* Bottom Row: 3D Rotate Pill + Thumbnail Gallery */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 z-20">
                  {/* Thumbnail Cards Row */}
                  <div className="flex items-center gap-2.5">
                    {galleryImages.slice(0, 2).map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setViewMode("photo");
                          setActiveImgIndex(idx);
                        }}
                        className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white p-1.5 border-2 transition-all overflow-hidden flex items-center justify-center shadow-2xs ${
                          viewMode === "photo" && activeImgIndex === idx
                            ? "border-amber-400 ring-2 ring-amber-200/80 scale-105"
                            : "border-transparent hover:border-amber-300 opacity-80 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`${p.name} view ${idx + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}

                    {/* Plus Thumbnail (+3 Angle Badge) */}
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode("photo");
                        handleNextImage();
                      }}
                      className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white/90 border border-amber-200/70 relative overflow-hidden flex items-center justify-center shadow-2xs hover:border-amber-400 transition-all"
                    >
                      <img
                        src={galleryImages[0] || resolveProductImage(p.img)}
                        alt={p.name}
                        className="w-full h-full object-contain blur-[1.5px] opacity-40 scale-110"
                      />
                      <span className="absolute inset-0 flex items-center justify-center font-bold text-xs sm:text-sm text-zinc-800">
                        +3
                      </span>
                    </button>
                  </div>

                  {/* 3D 360° Switcher Pill */}
                  <button
                    type="button"
                    onClick={() => setViewMode(viewMode === "3d" ? "photo" : "3d")}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs border ${
                      viewMode === "3d"
                        ? "bg-zinc-950 text-white border-zinc-950"
                        : "bg-white/90 text-zinc-700 hover:text-zinc-950 border-amber-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        viewMode === "3d" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                      }`}
                    />
                    <span>{viewMode === "3d" ? "📷 View Photos" : "🔄 3D Rotate 360°"}</span>
                  </button>
                </div>
              </div>

              {/* Bottom Quick Trust Highlights */}
              <div className="flex justify-around text-xs text-zinc-500 font-medium py-1">
                <span>✨ 100% Genuine Sole</span>
                <span>🧵 Handcrafted Quality</span>
                <span>🚚 Free Shipping over Rs. 5,000</span>
              </div>
            </div>

            {/* ============================================================ */}
            {/* RIGHT COLUMN: Product Details & Purchase Actions             */}
            {/* ============================================================ */}
            <div className="lg:col-span-6 flex flex-col pt-1">
              {/* Brand Eyebrow in Yellow/Amber */}
              <span className="text-xs sm:text-sm font-extrabold tracking-wider uppercase text-[#eab308] mb-1">
                {p.brand || "HANGU BRANDED SHOES"}
              </span>

              {/* Product Title in Heavy Bold Uppercase */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-950 uppercase tracking-tight leading-tight mb-2.5">
                {p.name}
              </h1>

              {/* Product Short Description */}
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed mb-4 max-w-xl">
                {p.desc ||
                  `The ${p.name} blends bold design with handcrafted precision, offering superior comfort and iconic luxury style for a confident look in every step.`}
              </p>

              {/* Ratings & Social Proof Row */}
              <div className="flex flex-wrap items-center gap-4 text-xs mb-6">
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-zinc-500 font-semibold ml-1">
                    ({p.reviews ? `${p.reviews}k` : "11.67k"} Reviews)
                  </span>
                </div>

                <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <Tag size={13} />
                  <span>{((p.stock || 10) * 42 + 4320).toLocaleString()} Item sold</span>
                </div>
              </div>

              {/* ============================================================ */}
              {/* SHIPPING DETAILS BOX (2x2 Grid)                              */}
              {/* ============================================================ */}
              <div className="mb-6">
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 mb-3">Shipping</h3>
                <div className="grid grid-cols-2 gap-4 py-2 border-y border-zinc-200/80">
                  {/* Origin */}
                  <div className="flex items-start gap-2.5">
                    <Plane size={18} className="text-zinc-700 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[11px] text-zinc-400 block font-medium">From</span>
                      <b className="text-xs text-zinc-900">USA / Authentic Import</b>
                    </div>
                  </div>

                  {/* Packaging */}
                  <div className="flex items-start gap-2.5">
                    <Package size={18} className="text-zinc-700 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[11px] text-zinc-400 block font-medium">Package</span>
                      <b className="text-xs text-zinc-900">Regular Luxury Box</b>
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
                      <span className="text-[11px] text-zinc-400 block font-medium">Estimation Arrive</span>
                      <b className="text-xs text-zinc-900">{deliveryEstimate}</b>
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
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSize(s);
                        setErr(false);
                      }}
                      className={`min-w-[52px] h-12 px-3 rounded-md font-bold text-sm font-mono transition-all flex items-center justify-center ${
                        size === s
                          ? "bg-zinc-950 text-white shadow-xs scale-105"
                          : "bg-[#f4f4f6] text-zinc-800 hover:bg-zinc-200 border border-zinc-200/70"
                      }`}
                    >
                      {s}
                    </button>
                  ))}

                  <Link
                    href="/size-guide"
                    aria-label="View more sizes"
                    className="w-10 h-12 rounded-md bg-[#f4f4f6] text-zinc-400 hover:text-zinc-950 hover:bg-zinc-200 border border-zinc-200/70 flex items-center justify-center transition-colors shrink-0"
                  >
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </div>

              {/* ============================================================ */}
              {/* TWO ACTION BUTTONS (Add to Cart / Buy now)                   */}
              {/* ============================================================ */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => go(false)}
                  className="py-3.5 px-4 rounded-md bg-white hover:bg-zinc-50 text-zinc-950 border border-zinc-900 font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors shadow-2xs flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={() => go(true)}
                  className="py-3.5 px-4 rounded-md bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <Zap size={16} />
                  <span>Buy now</span>
                </button>
              </div>

              {/* Direct Instant WhatsApp Order Button */}
              <a
                href={buildWhatsAppOrderUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-3 py-3.5 px-4 rounded-md bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
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
                  <Box size={15} className="text-emerald-600 shrink-0" />
                  <span>
                    <b>Cash on Delivery & JazzCash:</b> Pay at doorstep across all Pakistan cities.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
