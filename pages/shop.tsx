import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../src/components/Layout";
import ProductCard from "../src/components/ProductCard";
import { useProducts, useCategories } from "../src/hooks/useApi";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

export default function Shop() {
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Sync category with URL query param if present
  useEffect(() => {
    if (router.isReady && router.query.cat) {
      setSelectedCat(String(router.query.cat));
    }
  }, [router.isReady, router.query.cat]);

  // Query categories from API
  const { data: categoriesData } = useCategories();
  const cats = useMemo(() => {
    const list = ["All"];
    if (categoriesData && categoriesData.length > 0) {
      categoriesData.forEach((c) => {
        if (!list.includes(c.name)) list.push(c.name);
      });
    } else {
      list.push("Sneakers", "Comfort", "Formal", "Loafers");
    }
    return list;
  }, [categoriesData]);

  // Query products directly from database API using TanStack Query
  const {
    data: products,
    isLoading,
    isError,
  } = useProducts({
    cat: selectedCat !== "All" ? selectedCat : undefined,
    search: searchQuery.trim() || undefined,
    sort: sortBy !== "featured" ? sortBy : undefined,
  });

  const hasActiveFilters =
    selectedCat !== "All" || searchQuery.trim() !== "" || sortBy !== "featured";

  const handleResetFilters = () => {
    setSelectedCat("All");
    setSearchQuery("");
    setSortBy("featured");
    if (router.query.cat) {
      router.push("/shop", undefined, { shallow: true });
    }
  };

  return (
    <Layout title="Shop Collection — Hangu Branded Shoes">
      <section className="shop-section pt-32 pb-16">
        <div className="wrap">
          {/* Section Header */}
          <div className="title text-center mb-8">
            <small className="text-brand-red uppercase tracking-wider text-xs font-bold">
              EXCLUSIVE FOOTWEAR
            </small>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-1">
              Our Complete Collection
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto mt-2.5 text-sm">
              Browse premium sneakers, executive formals, and comfort slip-ons with direct Cash on Delivery all across Pakistan.
            </p>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="shop-filter-panel glass flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl mb-6 border border-white/10">
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
                  <option value="featured">Featured / Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="discount">Highest Discount</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="shop-reset-btn text-xs text-brand-gold hover:underline flex items-center gap-1"
                >
                  <RotateCcw size={13} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="shop-cat-tabs flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {cats.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCat(c)}
                className={`shop-cat-pill px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedCat === c
                  ? "bg-brand-red text-white shadow-lg"
                  : "glass text-zinc-300 hover:text-white hover:bg-white/10"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Product Results Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="glass rounded-3xl h-80 animate-pulse bg-white/5 border border-white/10"
                />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <div className="shop-empty glass p-12 text-center rounded-3xl max-w-md mx-auto my-12 border border-white/10">
              <span className="text-4xl block mb-3">👟</span>
              <h3 className="text-lg font-bold text-white">No footwear found</h3>
              <p className="text-zinc-400 text-xs mt-1 mb-4">
                No shoes currently match your search or filter parameters.
              </p>
              <button type="button" onClick={handleResetFilters} className="btn py-2 px-4 text-xs">
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
