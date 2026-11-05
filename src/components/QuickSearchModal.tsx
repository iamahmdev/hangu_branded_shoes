import { useState, useEffect, useRef, MouseEvent } from "react";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";
import { useProducts } from "../hooks/useApi";
import { Product } from "../types";
import { Search, X, ArrowRight } from "lucide-react";
import { resolveProductImage } from "../utils/image";

export default function QuickSearchModal() {
  const { searchOpen, closeSearch, openQuickOrder } = useCart();
  const [query, setQuery] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { data: searchResults, isLoading } = useProducts({
    search: query.trim() || undefined,
  });

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

  const handleSelectProduct = (id: number) => {
    closeSearch();
    router.push(`/product/${id}`);
  };

  const handleQuickBuy = (e: MouseEvent<HTMLButtonElement>, p: Product) => {
    e.stopPropagation();
    closeSearch();
    openQuickOrder(p);
  };

  return (
    <div
      className="qsearch-overlay fixed inset-0 z-[1001] bg-black/60 backdrop-blur-md flex items-start justify-center p-4 pt-16 md:pt-24 animate-fadeIn"
      onClick={closeSearch}
    >
      <div
        className="qsearch-modal relative w-full max-w-2xl bg-white border border-zinc-200/90 rounded-3xl shadow-2xl p-6 text-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Search Box */}
        <div className="qsearch-header flex items-center gap-3 pb-4 border-b border-zinc-200">
          <Search size={20} className="text-zinc-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search footwear by shoe name, category, or tag..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-zinc-900 text-base placeholder:text-zinc-400"
          />
          <button
            type="button"
            onClick={closeSearch}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 flex items-center justify-center shrink-0 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results Body */}
        <div className="qsearch-results max-h-[60vh] overflow-y-auto mt-4 divide-y divide-zinc-100">
          {isLoading ? (
            <div className="py-8 text-center text-zinc-500 text-xs">
              <div className="inline-block w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mb-2" />
              <p>Searching footwear database...</p>
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            searchResults.map((p) => (
              <div
                key={p.id}
                onClick={() => handleSelectProduct(p.id)}
                className="qsearch-item py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50 p-2.5 rounded-2xl transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={resolveProductImage(p.img)}
                    alt={p.name}
                    className="w-14 h-14 rounded-xl object-cover bg-[#f4f4f6] border border-zinc-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase text-brand-red tracking-wider">
                      {p.cat}
                    </span>
                    <b className="text-zinc-900 text-sm block truncate group-hover:text-zinc-600 transition-colors">
                      {p.name}
                    </b>
                    <span className="text-xs font-mono font-bold text-zinc-900">
                      Rs. {p.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleQuickBuy(e, p)}
                    className="btn ghost py-1.5 px-3 text-xs border border-zinc-300 text-zinc-900 hover:bg-zinc-100"
                  >
                    Quick Order
                  </button>
                  <ArrowRight size={16} className="text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-zinc-500 text-xs">
              No footwear matched "{query}". Try checking category names like Sneakers, Formal, Comfort or Loafers.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
