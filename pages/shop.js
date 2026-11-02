import { useState, useMemo } from "react";
import Layout from "../src/components/Layout";
import ProductCard from "../src/components/ProductCard";
import Reveal from "../src/components/Reveal";
import { products, SIZES } from "../src/data/config";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

export default function Shop() {
  const cats = ["All", ...new Set(products.map((p) => p.cat))];
  const [selectedCat, setSelectedCat] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by category
    if (selectedCat !== "All") {
      list = list.filter((p) => p.cat === selectedCat);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.cat.toLowerCase().includes(q) ||
          (p.tag && p.tag.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "discount") {
      list.sort((a, b) => (b.old - b.price) - (a.old - a.price));
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
    <Layout title="Shop Collection — Hangu_branded_shoes">
      <section className="shop-section">
        <div className="wrap">
          {/* Section Header */}
          <div className="title" style={{ marginBottom: 30 }}>
            <small>EXCLUSIVE FOOTWEAR</small>
            <h2>Our Complete Collection</h2>
            <p style={{ color: "var(--mut)", maxWidth: 540, margin: "10px auto 0", fontSize: 14 }}>
              Browse premium sneakers, executive formals, and comfort slip-ons with direct Cash on Delivery all across Pakistan.
            </p>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="shop-filter-panel glass">
            {/* Search Input */}
            <div className="shop-search-bar">
              <Search size={18} className="shop-search-icon" />
              <input
                type="text"
                placeholder="Search by shoe name, category, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="shop-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="shop-search-clear"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort & Quick Filter Controls */}
            <div className="shop-sort-controls">
              <div className="shop-sort-wrap">
                <SlidersHorizontal size={16} />
                <label htmlFor="shop-sort">Sort By:</label>
                <select
                  id="shop-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="shop-sort-select"
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
                  className="shop-reset-btn"
                  title="Clear all filters"
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="shop-cat-pills">
            {cats.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`shop-pill-btn ${cat === selectedCat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Size Filter Pills */}
          <div className="shop-size-filter-row">
            <span className="shop-size-label">Filter by Size (EU):</span>
            <div className="shop-size-pills">
              <button
                type="button"
                onClick={() => setSelectedSize("All")}
                className={`shop-sz-pill ${selectedSize === "All" ? "active" : ""}`}
              >
                All Sizes
              </button>
              {SIZES.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`shop-sz-pill ${selectedSize === sz ? "active" : ""}`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="shop-results-meta">
            <span>
              Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? "pair" : "pairs"}
              {selectedCat !== "All" && ` in "${selectedCat}"`}
              {selectedSize !== "All" && ` (Size ${selectedSize} Available)`}
            </span>
            <span className="shop-delivery-pill">
              🚚 Free Delivery Over Rs. 5,000 • 💵 COD Available
            </span>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="shop-no-results glass">
              <h3>No matching shoes found</h3>
              <p>Try searching with another keyword or resetting the category filter.</p>
              <button
                type="button"
                className="btn"
                style={{ marginTop: 16 }}
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
