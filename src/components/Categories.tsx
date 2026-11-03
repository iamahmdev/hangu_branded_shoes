import Link from "next/link";
import { useCategories } from "../hooks/useApi";

export default function Categories() {
  const { data: categories, isLoading, isError } = useCategories();

  if (isLoading) {
    return (
      <div className="cats grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass rounded-3xl h-64 animate-pulse bg-white/5 border border-white/10" />
        ))}
      </div>
    );
  }

  if (isError || !categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="cats grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {categories.map((c) => (
        <Link
          key={c.name}
          href={`/shop?cat=${encodeURIComponent(c.name)}`}
          className="cat glass group relative overflow-hidden rounded-3xl block h-64 border border-white/10"
        >
          <img
            src={`/images/${c.img}`}
            alt={c.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="cat-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end">
            <span className="cat-badge inline-block text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">
              {c.count} {c.count === 1 ? "Pair" : "Pairs Available"}
            </span>
            <div className="cat-text">
              <h3 className="text-xl font-bold text-white">{c.name}</h3>
              <p className="text-xs text-zinc-300 mt-0.5">Explore {c.name} Collection</p>
              <span className="cat-explore-btn text-xs font-bold text-brand-red group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 mt-2">
                Shop {c.name} →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
