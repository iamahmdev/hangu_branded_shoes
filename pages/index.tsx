import { useState } from "react";
import Link from "next/link";
import Layout from "../src/components/Layout";
import ProductCard from "../src/components/ProductCard";
import Reviews from "../src/components/Reviews";
import { WhatsAppIcon } from "../src/components/WhatsAppButton";
import { wa } from "../src/data/config";
import { useProducts } from "../src/hooks/useApi";
import { ArrowRight, Package, Sparkles, CheckCircle2, ShieldCheck, Truck, RotateCcw } from "lucide-react";

export default function Home() {
  const { data: products, isLoading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    { label: "All Footwear", val: "All" },
    { label: "Sneakers", val: "Sneakers" },
    { label: "Formal", val: "Formal" },
    { label: "Loafers", val: "Loafers" },
    { label: "Comfort", val: "Comfort" },
    { label: "Boots", val: "Boots" },
  ];

  const filteredShoes = products?.filter((p) => {
    if (selectedCategory === "All") return true;
    return p.cat?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <Layout
      title="Hangu Branded Shoes — Premium Handcrafted Footwear Pakistan"
      description="Shop authentic handcrafted leather shoes, loafers, formal derbies, and athletic sneakers at Hangu Branded Shoes. Cash on Delivery across Pakistan with 7-day hassle-free size exchange."
      keywords="hangu branded shoes, shoes in pakistan, buy leather shoes online, loafers pakistan, sneakers pakistan, peshawari chappal, formal footwear men, cash on delivery shoes"
      ogImage="/images/shoes/IMG_3091.jpg"
    >
      <div className="bg-[#fafafa] text-zinc-900 min-h-screen">
        {/* 1. Ultra-Modern Full-Width Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-zinc-100/80 via-white to-[#fafafa] border-b border-zinc-200/80 pt-10 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center flex flex-col items-center">
            {/* Top Brand Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/5 border border-zinc-900/10 text-zinc-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>EST. 2026 • TAHIR MARKET, HANGU • NATIONWIDE DELIVERY</span>
            </div>

            {/* Modern Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-950 tracking-tight leading-[1.15] max-w-4xl">
              Minimalist Luxury. <br className="hidden sm:inline" />
              <span className="text-zinc-600 font-bold">Handcrafted Precision.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-zinc-600 mt-4 max-w-2xl leading-relaxed">
              Explore 50+ authentic handcrafted leather shoes, formal derbies, penny loafers, and athletic sneakers.
              Delivered nationwide with Cash on Delivery & 7-Day Size Exchange.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/shop"
                className="px-7 py-3.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all shadow-md hover:scale-102 active:scale-98"
              >
                <span>Explore All Footwear ({products?.length || 53})</span>
                <ArrowRight size={15} />
              </Link>

              <Link
                href="/track"
                className="px-6 py-3.5 rounded-full bg-white hover:bg-zinc-50 text-zinc-900 text-xs sm:text-sm font-bold border border-zinc-300 hover:border-zinc-950 inline-flex items-center gap-2 transition-all shadow-2xs"
              >
                <Package size={15} />
                <span>Track Your Order</span>
              </Link>
            </div>

            {/* Modern Trust Features Bar */}
            <div className="mt-10 sm:mt-12 pt-6 border-t border-zinc-200/80 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="flex items-center gap-2.5">
                <Truck size={18} className="text-zinc-900 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-950">Free Shipping</h4>
                  <p className="text-[10px] text-zinc-500">Orders over Rs. 5,000</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-950">JazzCash & COD</h4>
                  <p className="text-[10px] text-zinc-500">Pay at doorstep</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <RotateCcw size={18} className="text-zinc-900 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-950">7-Day Exchange</h4>
                  <p className="text-[10px] text-zinc-500">Hassle-free size fit</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-zinc-900 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-950">100% Genuine</h4>
                  <p className="text-[10px] text-zinc-500">Handcrafted durability</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Main Catalog Grid Section with Category Tabs */}
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header & Category Filter Pills */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 pb-4 border-b border-zinc-200">
            <div>
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-400">
                CURATED COLLECTION
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 mt-1">
                Latest Footwear Arrivals
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Showing {filteredShoes?.length || 0} premium footwear pairs ready for immediate dispatch.
              </p>
            </div>

            {/* Clean Category Pill Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((c) => (
                <button
                  key={c.val}
                  type="button"
                  onClick={() => setSelectedCategory(c.val)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === c.val
                      ? "bg-zinc-950 text-white shadow-xs"
                      : "bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200/80"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Full-Width 4-Column Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-zinc-200/60 rounded-2xl sm:rounded-3xl animate-pulse"
                />
              ))
            ) : filteredShoes && filteredShoes.length > 0 ? (
              filteredShoes.slice(0, 12).map((p) => (
                <ProductCard key={p.id} p={p} />
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-zinc-500 text-sm">
                No products found in this category.
              </div>
            )}
          </div>

          {/* View All Button */}
          <div className="mt-12 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:scale-102"
            >
              <span>View All 50+ Footwear Styles</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* 3. Luxury Leather Craftsmanship Feature Banner */}
        <section className="py-14 bg-zinc-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-emerald-400 mb-2 block">
                  ORIGINAL HANGU HERITAGE
                </span>
                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Handcrafted with Pure Genuine Materials
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm mt-3 max-w-xl leading-relaxed">
                  Every shoe at Hangu Branded Shoes is crafted by master artisans in Tahir Market, Hangu.
                  We combine supple full-grain leathers, reinforced double-stitching, and ergonomic shock-absorbing
                  soles for a lifetime of comfortable strides.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-6 text-xs font-semibold text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Pure Cow & Calf Leather</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Ortho Cushioning Footbed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Anti-Slip Durable Soles</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row gap-3 justify-end">
                <Link
                  href="/shop?cat=Loafers"
                  className="px-6 py-3.5 rounded-full bg-white text-zinc-950 text-xs font-bold text-center hover:bg-zinc-100 transition-colors"
                >
                  Shop Leather Loafers
                </Link>
                <Link
                  href="/about"
                  className="px-6 py-3.5 rounded-full bg-zinc-800 text-white text-xs font-bold text-center hover:bg-zinc-700 border border-zinc-700 transition-colors"
                >
                  Our Story & Location
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Customer Testimonials & Reviews */}
        <section className="py-14 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-400">
              TRUSTED BY CUSTOMERS ACROSS PAKISTAN
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-950 mt-1">
              Customer Reviews & Feedback
            </h2>
            <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
              Real reviews from verified buyers across Peshawar, Islamabad, Lahore, Karachi and Hangu.
            </p>
          </div>
          <Reviews />
        </section>

        {/* 5. Minimalist Call To Action & WhatsApp Concierge */}
        <section className="py-16 bg-[#f4f4f6] text-zinc-900 text-center px-4 border-t border-zinc-200/80">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-500 mb-2">
              NEED HELP SELECTING YOUR SIZE?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
              Speak Directly with Our Store Team
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-2 max-w-md">
              Visit our flagship store at Tahir Market, Tall Road, Hangu or chat with us on WhatsApp for live photo requests and custom recommendations.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={wa("Assalam-o-Alaikum! Mujhe Hangu Branded Shoes se jootay ke baray mein janna hai.")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-2 transition-colors shadow-md"
              >
                <WhatsAppIcon size={16} color="#fff" />
                <span>Chat on WhatsApp (+92 333 3147691)</span>
              </a>
              <Link
                href="/shop"
                className="px-6 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-colors"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
