import { useState, useEffect, useRef, MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";
import { products } from "../data/config";
import { Product } from "../types";
import { Search, X, ArrowRight, Tag } from "lucide-react";

export default function QuickSearchModal() {
  const { searchOpen, closeSearch, openQuickOrder } = useCart();
  const [query, setQuery] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    : products.slice(0, 4);

  const handleSelectProduct = (id: number) => {
    closeSearch();
    router.push(`/product/${id}`);
  };

  const handleQuickBuy = (e: MouseEvent<HTMLButtonElement>, p: Product) => {
    e.stopPropagation();
    closeSearch();
    openQuickOrder(p);
  };

  const QUICK_TAGS = ["Sneakers", "Formal", "Comfort", "Sale", "Loafers"];

  return (
    <div className="qsearch-overlay fixed inset-0 z-[999] bg-black/85 backdrop-blur-xl flex items-start justify-center pt-20 px-4 pb-10 animate-fadeIn" onClick={closeSearch}>
      <div className="qsearch-modal w-full max-w-xl bg-zinc-950/95 border border-white/15 rounded-3xl shadow-2xl overflow-hidden animate-slideDown" onClick={(e) => e.stopPropagation()}>
        {/* Search Header */}
        <div className="qsearch-header flex items-center gap-3 p-4 md:p-5 border-b border-white/10">
          <div className="qsearch-input-wrap flex items-center gap-3 flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 focus-within:border-brand-red">
            <Search className="qsearch-icon text-zinc-400 shrink-0" size={20} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search sneakers, loafers, formal..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="qsearch-input flex-1 bg-transparent border-none outline-none text-white font-medium text-sm md:text-base placeholder:text-zinc-500"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="qsearch-clear text-zinc-400 hover:text-white p-1"
                aria-label="Clear input"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={closeSearch}
            className="qsearch-close-btn bg-white/5 hover:bg-brand-red border border-white/10 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Tag Pills */}
        <div className="qsearch-tags flex items-center gap-2 px-5 py-3 border-b border-white/5 overflow-x-auto whitespace-nowrap">
          <span className="qsearch-tag-label text-xs text-zinc-400 inline-flex items-center gap-1">
            <Tag size={13} /> Quick Tags:
          </span>
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`qsearch-tag-pill text-xs font-medium px-3 py-1 rounded-full border transition-all ${
                trimmed === tag.toLowerCase()
                  ? "bg-brand-red/20 border-brand-red text-white"
                  : "bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:border-brand-gold"
              }`}
              onClick={() => setQuery(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="qsearch-body max-h-[50vh] overflow-y-auto p-4 md:p-5">
          <div className="qsearch-results-label text-xs font-bold text-brand-gold uppercase tracking-wider mb-3">
            {trimmed
              ? `Results for "${query}" (${filtered.length})`
              : "🔥 Popular / Trending Pairs"}
          </div>

          {filtered.length === 0 ? (
            <div className="qsearch-empty text-center py-10 px-4 text-zinc-400">
              <p className="text-white text-base font-semibold mb-1.5">No shoes found matching "{query}"</p>
              <small className="text-xs">Try searching for "Sneakers", "Loafer", or "Comfort"</small>
            </div>
          ) : (
            <div className="qsearch-list flex flex-col gap-2.5">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="qsearch-card flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-brand-red/40 cursor-pointer transition-all hover:translate-x-1"
                  onClick={() => handleSelectProduct(p.id)}
                >
                  <div className="qsearch-card-img w-14 h-14 rounded-xl overflow-hidden bg-zinc-900 shrink-0">
                    <img src={"/images/" + p.img} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="qsearch-card-info flex-1 min-w-0">
                    <div className="qsearch-card-cat text-[11px] text-brand-red font-bold uppercase tracking-wider">{p.cat}</div>
                    <div className="qsearch-card-name text-sm font-semibold text-white truncate my-0.5">{p.name}</div>
                    <div className="qsearch-card-price text-xs font-bold text-brand-gold">
                      Rs. {p.price.toLocaleString()}
                      <s className="text-zinc-500 font-normal ml-2">Rs. {p.old.toLocaleString()}</s>
                    </div>
                  </div>
                  <div className="qsearch-card-actions flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      className="qsearch-btn-quick bg-gradient-to-r from-brand-red to-brand-redDark text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-glow hover:scale-105 transition-transform"
                      onClick={(e) => handleQuickBuy(e, p)}
                      title="Quick Order on WhatsApp"
                    >
                      ⚡ Quick Buy
                    </button>
                    <span className="qsearch-btn-arrow text-zinc-500">
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="qsearch-footer flex justify-between items-center p-3.5 px-5 bg-black/40 border-t border-white/10 text-xs">
          <Link
            href="/shop"
            className="qsearch-view-all inline-flex items-center gap-1.5 text-brand-gold font-semibold hover:gap-2.5 transition-all"
            onClick={closeSearch}
          >
            <span>View All Shoes in Shop</span>
            <ArrowRight size={14} />
          </Link>
          <span className="qsearch-tip text-zinc-500">Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
}
