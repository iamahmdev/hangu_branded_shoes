import { useState } from "react";
import Link from "next/link";
import Layout from "../src/components/Layout";
import ProductCard from "../src/components/ProductCard";
import Reveal from "../src/components/Reveal";
import Reviews from "../src/components/Reviews";
import { WhatsAppIcon } from "../src/components/WhatsAppButton";
import { wa } from "../src/data/config";
import { useProducts } from "../src/hooks/useApi";
import { SlidersHorizontal, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

export default function Home() {
  const { data: products, isLoading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  const categories = ["All", "Sneakers", "Formal", "Loafers", "Comfort", "Boots"];

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
        {/* 1. ETQ-Inspired Split Showcase Hero Section */}
        <section className="pt-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Editorial Visual (matching Image 1's left model shot) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[3/4] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#ebebeb] border border-zinc-200/80 shadow-xs group">
                <img
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1200"
                  alt="Hangu Luxury Footwear Showcase"
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-6 md:p-8 text-white">
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-300 mb-1">
                    SEASON ARCHIVE 2026
                  </span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
                    Pure Form. Unmatched Comfort.
                  </h2>
                  <p className="text-xs text-zinc-300 mt-1 max-w-sm hidden sm:block">
                    Hand-finished soles, premium genuine leathers, and tailored silhouettes for everyday luxury.
                  </p>
                  <div className="mt-3 sm:mt-4 flex items-center gap-3">
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-100 transition-colors"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Product Grid with Filter Button (matching Image 1) */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* Top Subheader Bar & Filter Pill Button */}
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">
                    FEATURED SELECTION
                  </span>
                  <h3 className="text-lg md:text-xl font-bold tracking-tight text-zinc-950">
                    Latest Footwear Arrivals
                  </h3>
                </div>

                {/* Filter Pill Button (matching Image 1 top right) */}
                <button
                  type="button"
                  onClick={() => setFilterOpen(!filterOpen)}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    filterOpen
                      ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                      : "bg-white text-zinc-700 border-zinc-300 hover:border-zinc-900"
                  }`}
                >
                  <SlidersHorizontal size={13} />
                  <span>Filter</span>
                </button>
              </div>

              {/* Collapsible Category Filter Bar */}
              {filterOpen && (
                <div className="flex items-center gap-2 overflow-x-auto py-2 animate-fadeIn no-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                        selectedCategory === cat
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-200/70 text-zinc-700 hover:bg-zinc-300"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Footwear Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                {isLoading ? (
                  [1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-[3/4] bg-zinc-200/60 rounded-2xl animate-pulse"
                    />
                  ))
                ) : (
                  (filteredShoes || []).slice(0, 6).map((p) => (
                    <ProductCard key={p.id} p={p} />
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 2. Permanent Collection Overview (Minimalist Grid) */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-200/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-400">
                HANGU CORE FOOTWEAR
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-950 mt-1">
                The Permanent Footwear Line
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Timeless designs engineered for maximum sole durability and daily comfort.
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 hover:text-emerald-700 underline underline-offset-4"
            >
              <span>View All Footwear ({products?.length || 0})</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
            {(products || []).slice(0, 8).map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>

        {/* 3. Value Props (Clean Minimalist Luxury Strip) */}
        <section className="py-12 bg-white border-y border-zinc-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
              <div className="flex items-start gap-3.5 p-3">
                <span className="text-2xl">🚚</span>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900">Free Nationwide Shipping</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">Complimentary express dispatch on orders over Rs. 5,000</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900">Cash on Delivery & JazzCash</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">Pay safely at your doorstep or via instant JazzCash transfer</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3">
                <span className="text-2xl">🔄</span>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900">7-Day Free Size Exchange</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">Hassle-free size adjustment guarantee across Pakistan</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900">100% Genuine Sole Footwear</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">Triple-inspected for stitching, durability and genuine sole fit</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Customer Testimonials */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-400">
              VERIFIED BUYERS
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-950 mt-1">
              Customer Feedback & Reviews
            </h2>
          </div>
          <Reviews />
        </section>

        {/* 5. Minimalist Call To Action */}
        <section className="py-16 bg-zinc-950 text-white text-center px-4">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-400 mb-2">
              EXECUTIVE FOOTWEAR
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Step Into Premium Distinction
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 mt-2 max-w-md">
              Order your pair with instant Cash on Delivery or connect directly with our Hangu store team on WhatsApp.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/shop"
                className="px-6 py-3 rounded-full bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-200 transition-colors"
              >
                Browse All Shoes
              </Link>
              <a
                href={wa("Assalam-o-Alaikum! I want to order shoes from Hangu Branded Shoes.")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-2 transition-colors"
              >
                <WhatsAppIcon size={16} color="#fff" />
                <span>Order on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
