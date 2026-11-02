import { useState, useMemo } from "react";
import Layout from "../src/components/Layout";
import ProductCard from "../src/components/ProductCard";
import Reveal from "../src/components/Reveal";
import { products, SIZES } from "../src/data/config";
import { Product } from "../src/types";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

export default function Shop() {
  const cats = ["All", ...Array.from(new Set(products.map((p) => p.cat)))];
  const [selectedCat, setSelectedCat] = useState<string>("All");
  const [selectedSize, setSelectedSize] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("" );
  const [sortBy, setSortBy] = useState<string>("featured");

  const filteredProducts = useMemo(() => {
    let list: Product[] = [...products];

    if (selectedCat !== "All") {
      list = list.filter((p) => p.cat === selectedCat);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.cat.toLowerCase().includes(q) ||
          (p.tag && p.tag.toLowerCase().includes(q))
      );
    }

    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "discount") {
      list.sort((a, b) => b.old - b.price - (a.old - a.price));
    }

    return list;
  }, [selectedCat, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedCat !== "All" || selectedSize !== "All" || searchQuery.trim() !== "" || sortBy !== "featured";

  const handleResetFilters = () => {
    setSelectedCat("All");
    setSelectedSize("All");
    setSearchQuery("");
    setSortBy("featured");
  };

  return (
    <Layout title="Shop Collection — Hangu Branded Shoes">
      <section className="shop-section pt-32 pb-16">
        <div className="wrap">
          {/* Section Header */}
          <div className="title text-center mb-8">
            <small className="text-brand-red uppercase tracking-wider text-xs font-bold">EXCLUSIVE FOOTWEAR</small>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-1">Our Complete Collection</h2>
            <p className="text-zinc-400 max-w-xl mx-auto mt-2.5 text-sm">
              Browse premium sneakers, executive formals, and comfort slip-ons with direct Cash on Delivery all across Pakistan.
            </p>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="shop-filter-panel glass flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl mb-6">
            {/* Search Input */}
            <div className="shop-search-bar flex items-center gap-2.5 flex-1 min-w-[260px] bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5">
              <Search size={18} className="shop-search-icon text-zinc-400" />
              <input
                type="text"
                placeholder="Search by shoe name, category, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="shop-search-input flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-zinc-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="shop-search-clear text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort & Quick Filter Controls */}
            <div className="shop-sort-controls flex items-center gap-3.5">
              <div className="shop-sort-wrap flex items-center gap-2 text-zinc-400 text-xs">
                <SlidersHorizontal size={16} />
                <label htmlFor="shop-sort">Sort By:</label>
                <select
                  id="shop-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="shop-sort-select bg-zinc-900 border border-white/10 text-white rounded-xl px-3 py-2 text-xs outline-none"
                >
                  <option value="featured">Featured / New</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="discount">Biggest Discount</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="shop-reset-btn inline-flex items-center gap-1.5 bg-brand-red/15 border border-brand-red text-white text-xs font-semibold px-3.5 py-2 rounded-xl"
                  title="Clear all filters"
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="shop-cat-pills flex gap-2.5 justify-center flex-wrap mb-5">
            {cats.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`shop-pill-btn px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
                  cat === selectedCat
                    ? "active bg-gradient-to-r from-brand-red to-brand-redDark border-transparent text-white shadow-glow"
                    : "border-white/10 text-zinc-400 hover:text-white hover:border-brand-gold"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Size Filter Pills */}
          <div className="shop-size-filter-row flex items-center justify-center gap-3 flex-wrap mb-7 p-2.5 px-4 bg-white/[0.02] rounded-2xl">
            <span className="shop-size-label text-xs font-semibold text-zinc-400">Filter by Size (EU):</span>
            <div className="shop-size-pills flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedSize("All")}
                className={`shop-sz-pill px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  selectedSize === "All"
                    ? "active bg-brand-gold border-brand-gold text-black font-bold"
                    : "bg-white/5 border-white/10 text-zinc-300 hover:text-white"
                }`}
              >
                All Sizes
              </button>
              {SIZES.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`shop-sz-pill px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    selectedSize === sz
                      ? "active bg-brand-gold border-brand-gold text-black font-bold"
                      : "bg-white/5 border-white/10 text-zinc-300 hover:text-white"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="shop-results-meta flex justify-between items-center text-xs text-zinc-400 mb-6 px-2">
            <span>
              Showing <strong className="text-white">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? "pair" : "pairs"}
              {selectedCat !== "All" && ` in "${selectedCat}"`}
              {selectedSize !== "All" && ` (Size ${selectedSize} Available)`}
            </span>
            <span className="shop-delivery-pill text-[#25d366]">
              🚚 Free Delivery Over Rs. 5,000 • 💵 COD Available
            </span>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="shop-no-results glass text-center p-12 max-w-lg mx-auto rounded-3xl">
              <h3 className="text-xl font-bold text-white mb-2">No matching shoes found</h3>
              <p className="text-zinc-400 text-sm">Try searching with another keyword or resetting the category filter.</p>
              <button
                type="button"
                className="btn mt-4"
                onClick={handleResetFilters}
              >
                Show All Shoes
              </button>
            </div>
          ) : (
            <div className="grid">
              {filteredProducts.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
                  <ProductCard p={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
