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
        {/* 1. High-Impact Luxury Hero Visual Banner */}
        <section className="relative px-4 sm:px-6 lg:px-8 pt-4 pb-6 max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-zinc-950 text-white min-h-[360px] sm:min-h-[420px] flex items-center shadow-xl">
            {/* Background Atmosphere & Subtle Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-zinc-950/90 to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1400"
              alt="Hangu Luxury Footwear"
              className="absolute right-0 top-0 w-full md:w-3/5 h-full object-cover object-center opacity-40 md:opacity-70 scale-102"
            />

            {/* Left Content */}
            <div className="relative z-20 max-w-xl p-6 sm:p-10 md:p-14 flex flex-col items-start">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.3em] uppercase text-emerald-400 mb-2">
                COLLECTION ARCHIVE 2026
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.1] text-white">
                Handcrafted <br />
                <span className="text-zinc-400 font-extrabold">Leather Footwear.</span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 mt-3 max-w-md leading-relaxed">
                Over 50+ handcrafted loafers, formal derbies, and daily sneakers.
                Delivered across Pakistan with Cash on Delivery & 7-Day Size Exchange.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <Link
                  href="/shop"
                  className="px-6 py-3 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all shadow-md active:scale-98"
                >
                  <span>Shop Collection ({products?.length || 53})</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/track"
                  className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 backdrop-blur-md transition-all"
                >
                  Track Order
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Sleek 1-Line Luxury Trust Marquee Bar */}
        <div className="bg-zinc-950 text-white text-[11px] sm:text-xs font-semibold py-3 border-y border-zinc-800 overflow-hidden">
          <div className="flex items-center justify-around max-w-7xl mx-auto px-4 gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
            <span className="inline-flex items-center gap-2 text-zinc-300">
              <Truck size={14} className="text-emerald-400" />
              <span>Free Delivery Over Rs. 5,000</span>
            </span>
            <span className="text-zinc-600">✦</span>
            <span className="inline-flex items-center gap-2 text-zinc-300">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Cash on Delivery & JazzCash</span>
            </span>
            <span className="text-zinc-600">✦</span>
            <span className="inline-flex items-center gap-2 text-zinc-300">
              <RotateCcw size={14} className="text-emerald-400" />
              <span>7-Day Hassle-Free Size Exchange</span>
            </span>
            <span className="text-zinc-600">✦</span>
            <span className="inline-flex items-center gap-2 text-zinc-300">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>100% Handcrafted Leather</span>
            </span>
          </div>
        </div>

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

          {/* Full-Width Luxury 3-Column Product Grid (Big Prominent Shoe Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-[4/5] sm:aspect-[3/4] bg-zinc-200/60 rounded-2xl sm:rounded-3xl animate-pulse"
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
