import { useState, useRef, MouseEvent } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { Product } from "../types";
import { Zap, Eye, ArrowRight } from "lucide-react";
import { resolveProductImage } from "../utils/image";
import Shoe3DModal from "./Shoe3DModal";

interface ProductCardProps {
  p: Product;
}

export default function ProductCard({ p }: ProductCardProps) {
  const { openQuickOrder } = useCart();
  const [is3DModalOpen, setIs3DModalOpen] = useState<boolean>(false);
  const [cardTilt, setCardTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const savings = p.old && p.old > p.price ? p.old - p.price : 0;

  // Subtle interactive 3D parallax tilt on mouse move
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Constrain tilt to max +/- 8 degrees
    const tiltX = ((centerY - y) / centerY) * 8;
    const tiltY = ((x - centerX) / centerX) * 8;
    setCardTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCardTilt({ x: 0, y: 0 });
  };

  return (
    <>
      <div
        className="flex flex-col group transition-all duration-300"
        style={{ perspective: 1000 }}
      >
        {/* 1. Footwear Profile Showcase Container (3:4 Portrait for Full Shoe Display & Zero Cropping) */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="relative aspect-[3/4] w-full bg-[#f4f4f6] group-hover:bg-[#ebebee] rounded-2xl sm:rounded-3xl overflow-hidden flex items-center justify-center p-2 sm:p-3 transition-all duration-300 border border-zinc-200/80 shadow-xs group-hover:shadow-md"
          style={{
            transform: isHovered
              ? `rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg) translateY(-3px)`
              : "none",
            transformStyle: "preserve-3d",
            transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
          }}
        >
          {/* Main Shoe Image Link to PDP */}
          <Link
            href={"/product/" + p.id}
            className="w-full h-full flex items-center justify-center relative p-1 cursor-pointer"
            title={`View ${p.name}`}
          >
            <img
              src={resolveProductImage(p.img)}
              alt={p.name}
              loading="lazy"
              className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-105 drop-shadow-[0_10px_16px_rgba(0,0,0,0.1)]"
            />

            {/* Specular Glare light on card hover */}
            {isHovered && (
              <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at ${50 + cardTilt.y * 3}% ${50 - cardTilt.x * 3}%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)`,
                }}
              />
            )}
          </Link>

          {/* 3D Rotate Pill Button (Top Right) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIs3DModalOpen(true);
            }}
            className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-zinc-950/85 hover:bg-zinc-950 text-white text-[9px] sm:text-[10px] font-bold tracking-wider uppercase border border-white/20 shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95 shrink-0"
            title="Open 3D Interactive Rotate View"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="hidden sm:inline">3D View</span>
            <span className="sm:hidden font-mono">3D</span>
          </button>

          {/* Tag Badges (Top Left) */}
          {p.tag && (
            <span className="absolute top-2 left-2 z-10 bg-white/95 backdrop-blur-sm text-zinc-900 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border border-zinc-200 shadow-xs max-w-[55%] truncate pointer-events-none">
              {p.tag}
            </span>
          )}

          {/* Discount Tag (Bottom Left) */}
          {savings > 0 && (
            <span className="absolute bottom-2 left-2 z-10 bg-emerald-600/95 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs pointer-events-none">
              Save Rs. {savings.toLocaleString()}
            </span>
          )}
        </div>

        {/* 2. Footwear Typography & Price */}
        <div className="pt-2.5 pb-1 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-500 truncate max-w-[65%]">
              {p.cat}
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 shrink-0">✓ In Stock</span>
          </div>

          <h3 className="font-semibold text-zinc-950 text-xs sm:text-sm mt-0.5 hover:text-emerald-700 transition-colors line-clamp-2 min-h-[2.25rem] leading-snug">
            <Link href={"/product/" + p.id}>{p.name}</Link>
          </h3>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-bold text-zinc-950 text-xs sm:text-sm font-mono">
              Rs. {p.price.toLocaleString()}
            </span>
            {p.old && p.old > p.price && (
              <s className="text-zinc-500 text-[11px] sm:text-xs font-normal font-mono">
                Rs. {p.old.toLocaleString()}
              </s>
            )}
          </div>

          {/* Direct Mobile & Desktop Action Bar */}
          <div className="mt-2.5 flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openQuickOrder(p);
              }}
              className="flex-1 py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 active:bg-zinc-900 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 active:scale-98"
            >
              <Zap size={13} className="text-amber-400 fill-amber-400 shrink-0" />
              <span>Quick Order</span>
            </button>
            <Link
              href={"/product/" + p.id}
              className="p-1.5 sm:p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors shrink-0 flex items-center justify-center"
              title="View Product Details"
              aria-label={`View details for ${p.name}`}
            >
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive 3D Model Modal */}
      <Shoe3DModal
        product={p}
        isOpen={is3DModalOpen}
        onClose={() => setIs3DModalOpen(false)}
      />
    </>
  );
}
