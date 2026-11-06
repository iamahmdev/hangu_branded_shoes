import { useState, useRef, MouseEvent } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { Product } from "../types";
import { Zap, Eye } from "lucide-react";
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
        {/* 1. Footwear Profile Showcase Container (Portrait 3:4 for Max Shoe Size & No Cropping) */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="relative aspect-[3/4] w-full bg-[#f4f4f6] group-hover:bg-[#ebebee] rounded-2xl sm:rounded-3xl overflow-hidden flex items-center justify-center p-2 sm:p-3 transition-all duration-300 border border-zinc-200/80 shadow-xs group-hover:shadow-lg"
          style={{
            transform: isHovered
              ? `rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg) translateY(-4px)`
              : "none",
            transformStyle: "preserve-3d",
            transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
          }}
        >
          {/* Main Shoe Image Container */}
          <div
            onClick={() => setIs3DModalOpen(true)}
            className="w-full h-full flex items-center justify-center cursor-pointer relative"
          >
            <img
              src={resolveProductImage(p.img)}
              alt={p.name}
              loading="lazy"
              className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-108 drop-shadow-[0_12px_20px_rgba(0,0,0,0.12)]"
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
          </div>

          {/* 3D Rotate Pill Button (Top Right) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIs3DModalOpen(true);
            }}
            className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-950/85 hover:bg-zinc-950 text-white text-[10px] font-bold tracking-wider uppercase border border-white/20 shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95 group/btn"
            title="Open 3D Interactive Rotate View"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover/btn:animate-ping" />
            <span>3D View</span>
          </button>

          {/* Tag Badges (Top Left) */}
          {p.tag && (
            <span className="absolute top-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-sm text-zinc-900 text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider border border-zinc-200 shadow-xs">
              {p.tag}
            </span>
          )}

          {/* Discount Tag (Bottom Left) */}
          {savings > 0 && (
            <span className="absolute bottom-2.5 left-2.5 z-10 bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              Save Rs. {savings.toLocaleString()}
            </span>
          )}

          {/* Minimal Hover Overlay Actions (Center-Bottom) */}
          <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 pointer-events-none group-hover:pointer-events-auto">
            {/* 3D Spin Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIs3DModalOpen(true);
              }}
              className="p-3 rounded-full bg-white text-zinc-950 hover:bg-zinc-950 hover:text-white transition-all shadow-xl hover:scale-110 flex items-center gap-1.5 text-xs font-bold"
              title="Rotate in 3D"
            >
              <span>🔄 3D Rotate</span>
            </button>

            {/* Quick WhatsApp Order */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openQuickOrder(p);
              }}
              className="p-3 rounded-full bg-zinc-900 text-white hover:bg-emerald-600 transition-all shadow-xl hover:scale-110"
              title="Quick Order / WhatsApp Checkout"
            >
              <Zap size={16} />
            </button>

            {/* View Product Details */}
            <Link
              href={"/product/" + p.id}
              className="p-3 rounded-full bg-white text-zinc-900 hover:bg-zinc-950 hover:text-white transition-all shadow-xl hover:scale-110"
              title="Product Details"
            >
              <Eye size={16} />
            </Link>
          </div>
        </div>

        {/* 2. Footwear Typography & Price */}
        <div className="pt-3 pb-1 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              {p.cat}
            </span>
            <span className="text-[10px] font-medium text-emerald-600">✓ In Stock</span>
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

      {/* Interactive 3D Model Modal */}
      <Shoe3DModal
        product={p}
        isOpen={is3DModalOpen}
        onClose={() => setIs3DModalOpen(false)}
      />
    </>
  );
}
