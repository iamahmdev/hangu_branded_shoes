import { useState, useRef, MouseEvent } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { Product } from "../types";
import { Zap, ArrowRight } from "lucide-react";
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
  const discount = p.old && p.old > p.price ? Math.round((savings / p.old) * 100) : 0;

  // Subtle interactive 3D parallax tilt on mouse move
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((centerY - y) / centerY) * 5;
    const tiltY = ((x - centerX) / centerX) * 5;
    setCardTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCardTilt({ x: 0, y: 0 });
  };

  return (
    <>
      <div
        className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-200/90 hover:border-zinc-400 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
        style={{ perspective: 1000 }}
      >
        {/* Top: Large Prominent Image Showcase Canvas (Zero Wasted Space) */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="relative aspect-square w-full bg-[#f8f9fa] group-hover:bg-[#f2f4f7] overflow-hidden flex items-center justify-center p-2 sm:p-2.5 transition-colors duration-300"
          style={{
            transform: isHovered
              ? `rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg) translateY(-2px)`
              : "none",
            transformStyle: "preserve-3d",
            transition: isHovered ? "transform 0.1s ease-out" : "transform 0.3s ease-out",
          }}
        >
          {/* Main Shoe Link */}
          <Link
            href={"/product/" + p.id}
            className="w-full h-full flex items-center justify-center relative cursor-pointer"
            title={`View ${p.name}`}
          >
            <img
              src={resolveProductImage(p.img)}
              alt={p.name}
              loading="lazy"
              className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-108 drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
            />

            {/* Subtle Glare Light */}
            {isHovered && (
              <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-25 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at ${50 + cardTilt.y * 3}% ${50 - cardTilt.x * 3}%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 65%)`,
                }}
              />
            )}
          </Link>

          {/* 3D View Pill (Top Right) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIs3DModalOpen(true);
            }}
            className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-950/85 hover:bg-zinc-950 text-white text-[10px] font-bold tracking-wider uppercase border border-white/20 shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95 shrink-0"
            title="Open 3D 360° Interactive View"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">3D View</span>
            <span className="sm:hidden font-mono">3D</span>
          </button>

          {/* Status Badge (Top Left) */}
          {p.tag ? (
            <span className="absolute top-2.5 left-2.5 z-10 bg-zinc-950 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-xs max-w-[60%] truncate pointer-events-none">
              {p.tag}
            </span>
          ) : discount > 0 ? (
            <span className="absolute top-2.5 left-2.5 z-10 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-xs pointer-events-none">
              -{discount}% OFF
            </span>
          ) : null}

          {/* Bottom Left: Savings Tag */}
          {savings > 0 && p.tag && (
            <span className="absolute bottom-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-sm text-zinc-900 border border-zinc-200/80 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs pointer-events-none">
              Save Rs. {savings.toLocaleString()}
            </span>
          )}
        </div>

        {/* Bottom Details Box */}
        <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-white border-t border-zinc-100">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 truncate">
                {p.cat || "Footwear"}
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 shrink-0">
                ✓ In Stock
              </span>
            </div>

            <h3 className="font-bold text-zinc-950 text-sm hover:text-emerald-700 transition-colors line-clamp-1">
              <Link href={"/product/" + p.id} title={p.name}>
                {p.name}
              </Link>
            </h3>

            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="font-extrabold text-zinc-950 text-base sm:text-lg font-mono">
                Rs. {p.price.toLocaleString()}
              </span>
              {p.old && p.old > p.price && (
                <s className="text-zinc-400 text-xs font-normal font-mono">
                  Rs. {p.old.toLocaleString()}
                </s>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-3.5 flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openQuickOrder(p);
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 active:bg-zinc-900 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-98"
            >
              <Zap size={13} className="text-amber-400 fill-amber-400 shrink-0" />
              <span>Quick Order</span>
            </button>
            <Link
              href={"/product/" + p.id}
              className="p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors shrink-0 flex items-center justify-center"
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
