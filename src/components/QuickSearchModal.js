import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";
import { products } from "../data/config";
import { Search, X, ArrowRight, Tag } from "lucide-react";

export default function QuickSearchModal() {
  const { searchOpen, closeSearch, openQuickOrder } = useCart();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const router = useRouter();

  // Focus input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && searchOpen) {
        closeSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen, closeSearch]);

  if (!searchOpen) return null;

  const trimmed = query.trim().toLowerCase();
  const filtered = trimmed
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.cat.toLowerCase().includes(trimmed) ||
          (p.tag && p.tag.toLowerCase().includes(trimmed))
      )
    : products.slice(0, 4); // show trending 4 if empty

  const handleSelectProduct = (id) => {
    closeSearch();
    router.push(`/product/${id}`);
  };

  const handleQuickBuy = (e, p) => {
    e.stopPropagation();
    closeSearch();
    openQuickOrder(p);
  };

  const QUICK_TAGS = ["Sneakers", "Formal", "Comfort", "Sale", "Loafers"];

  return (
    <div className="qsearch-overlay" onClick={closeSearch}>
      <div className="qsearch-modal" onClick={(e) => e.stopPropagation()}>
        {/* Search Header */}
        <div className="qsearch-header">
          <div className="qsearch-input-wrap">
            <Search className="qsearch-icon" size={20} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search sneakers, loafers, formal..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="qsearch-input"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="qsearch-clear"
                aria-label="Clear input"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={closeSearch}
            className="qsearch-close-btn"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Tag Pills */}
        <div className="qsearch-tags">
          <span className="qsearch-tag-label">
            <Tag size={13} /> Quick Tags:
          </span>
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`qsearch-tag-pill ${trimmed === tag.toLowerCase() ? "active" : ""}`}
              onClick={() => setQuery(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="qsearch-body">
          <div className="qsearch-results-label">
            {trimmed
              ? `Results for "${query}" (${filtered.length})`
              : "🔥 Popular / Trending Pairs"}
          </div>

          {filtered.length === 0 ? (
            <div className="qsearch-empty">
              <p>No shoes found matching "{query}"</p>
              <small>Try searching for "Sneakers", "Loafer", or "Comfort"</small>
            </div>
          ) : (
            <div className="qsearch-list">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="qsearch-card"
                  onClick={() => handleSelectProduct(p.id)}
                >
                  <div className="qsearch-card-img">
                    <img src={"/images/" + p.img} alt={p.name} />
                  </div>
                  <div className="qsearch-card-info">
                    <div className="qsearch-card-cat">{p.cat}</div>
                    <div className="qsearch-card-name">{p.name}</div>
                    <div className="qsearch-card-price">
                      Rs. {p.price.toLocaleString()}
                      <s>Rs. {p.old.toLocaleString()}</s>
                    </div>
                  </div>
                  <div className="qsearch-card-actions">
                    <button
                      type="button"
                      className="qsearch-btn-quick"
                      onClick={(e) => handleQuickBuy(e, p)}
                      title="Quick Order on WhatsApp"
                    >
                      ⚡ Quick Buy
                    </button>
                    <span className="qsearch-btn-arrow">
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="qsearch-footer">
          <Link
            href="/shop"
            className="qsearch-view-all"
            onClick={closeSearch}
          >
            <span>View All Shoes in Shop</span>
            <ArrowRight size={15} />
          </Link>
          <span className="qsearch-tip">Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
}
