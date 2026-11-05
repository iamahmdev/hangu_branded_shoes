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
    <Layout title="All Footwear Collection — Hangu Branded Shoes">
      <div className="bg-[#fafafa] text-zinc-900 min-h-screen pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-8">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-400">
              PERMANENT & NEW COLLECTION
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-950 mt-1">
              All Footwear Collection
            </h1>
            <p className="text-zinc-500 max-w-lg mx-auto mt-2 text-xs md:text-sm">
              Explore cushioned sneakers, executive formals, and hand-finished comfort footwear delivered nationwide.
            </p>
          </div>

          {/* Search & Filter Toolbar (ETQ Minimalist Style) */}
          <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 mb-6">
            {/* Search Input */}
            <div className="flex items-center gap-2.5 flex-1 min-w-[260px] bg-[#f4f4f6] rounded-xl px-4 py-2 border border-zinc-200/60">
              <Search size={16} className="text-zinc-400" />
              <input
                type="text"
                placeholder="Search by shoe name, category, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-zinc-900 text-xs placeholder:text-zinc-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-zinc-400 hover:text-zinc-900 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort & Quick Filter Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-zinc-600 text-xs font-semibold">
                <SlidersHorizontal size={14} />
                <select
                  id="shop-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#f4f4f6] border border-zinc-200/60 text-zinc-800 rounded-xl px-3 py-1.5 text-xs font-medium outline-none cursor-pointer"
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
                  className="text-xs text-zinc-600 hover:text-zinc-950 font-semibold underline flex items-center gap-1"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {cats.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCat(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCat === c
                    ? "bg-zinc-950 text-white shadow-xs"
                    : "bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Product Results Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-zinc-200/60 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl max-w-md mx-auto my-12 border border-zinc-200 shadow-xs">
              <span className="text-4xl block mb-3">👟</span>
              <h3 className="text-lg font-bold text-zinc-900">No footwear found</h3>
              <p className="text-zinc-500 text-xs mt-1 mb-4">
                No shoes currently match your search or filter parameters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-full bg-zinc-950 text-white text-xs font-bold hover:bg-zinc-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
