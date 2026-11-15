import Link from "next/link";
import { useCategories } from "../hooks/useApi";
import { resolveProductImage } from "../utils/image";

export default function Categories() {
  const { data: categories, isLoading, isError } = useCategories();

  if (isLoading) {
    return (
      <div className="cats grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl sm:rounded-3xl aspect-[4/5] animate-pulse bg-zinc-100 border border-zinc-200" />
        ))}
      </div>
    );
  }

  if (isError || !categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="cats grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
      {categories.map((c) => (
        <Link
          key={c.name}
          href={`/shop?cat=${encodeURIComponent(c.name)}`}
          className="cat group relative overflow-hidden rounded-2xl sm:rounded-3xl block aspect-[4/5] bg-zinc-950 border border-zinc-200/80 shadow-xs"
        >
          <img
            src={resolveProductImage(c.img)}
            alt={c.name}
            className="w-full h-full object-contain p-2 sm:p-4 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="cat-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-3 sm:p-5 flex flex-col justify-end">
            <span className="cat-badge inline-block text-[9px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider mb-0.5">
              {c.count} {c.count === 1 ? "Pair" : "Pairs"}
            </span>
            <div className="cat-text">
              <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-white leading-tight">{c.name}</h3>
              <p className="text-[10px] sm:text-xs text-zinc-300 mt-0.5 line-clamp-1 hidden sm:block">Explore {c.name} Collection</p>
              <span className="cat-explore-btn text-[10px] sm:text-xs font-bold text-white group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 mt-1 sm:mt-1.5">
                Shop Now →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
