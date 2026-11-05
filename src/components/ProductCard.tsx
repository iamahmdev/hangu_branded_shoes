import { useRef, MouseEvent } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { Product } from "../types";
import { Zap, Eye, ShoppingBag } from "lucide-react";
import { resolveProductImage } from "../utils/image";

interface ProductCardProps {
  p: Product;
}

export default function ProductCard({ p }: ProductCardProps) {
  const { openQuickOrder } = useCart();
  const savings = p.old - p.price;

  return (
    <div className="flex flex-col group transition-all duration-300">
      {/* 1. Footwear Profile Showcase Container (ETQ Minimalist Style) */}
      <div className="relative aspect-square sm:aspect-[4/3] w-full bg-[#f4f4f6] hover:bg-[#ebebee] rounded-2xl overflow-hidden flex items-center justify-center p-5 transition-colors border border-zinc-200/70">
        <Link href={"/product/" + p.id} className="w-full h-full flex items-center justify-center">
          <img
            src={resolveProductImage(p.img)}
            alt={p.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 drop-shadow-sm"
          />
        </Link>

        {/* Minimal Badges */}
        {p.tag && (
          <span className="absolute top-3 left-3 bg-zinc-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
            {p.tag}
          </span>
        )}

        {savings > 0 && (
          <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200 shadow-xs">
            Save Rs. {savings.toLocaleString()}
          </span>
        )}

        {/* Minimal Hover Overlay Actions */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 pointer-events-none group-hover:pointer-events-auto">
          <Link
            href={"/product/" + p.id}
            className="p-2.5 rounded-full bg-white text-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors shadow-md"
            title="View Details"
          >
            <Eye size={16} />
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              openQuickOrder(p);
            }}
            className="p-2.5 rounded-full bg-zinc-900 text-white hover:bg-emerald-600 transition-colors shadow-md"
            title="Quick Order / WhatsApp Checkout"
          >
            <Zap size={16} />
          </button>
        </div>
      </div>

      {/* 2. Minimalist Footwear Typography & Price (ETQ Reference Style) */}
      <div className="pt-3 pb-1 flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            {p.cat}
          </span>
          <span className="text-[10px] font-medium text-emerald-600">✓ Verified Sole</span>
        </div>

        <h3 className="font-semibold text-zinc-900 text-sm mt-0.5 hover:text-emerald-700 transition-colors line-clamp-1">
          <Link href={"/product/" + p.id}>{p.name}</Link>
        </h3>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-bold text-zinc-900 text-sm font-mono">
            Rs. {p.price.toLocaleString()}
          </span>
          {p.old && p.old > p.price && (
            <s className="text-zinc-400 text-xs font-normal font-mono">
              Rs. {p.old.toLocaleString()}
            </s>
          )}
        </div>
      </div>
    </div>
  );
}
