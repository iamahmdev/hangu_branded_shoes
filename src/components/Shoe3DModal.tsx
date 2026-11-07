import React, { useEffect } from "react";
import Link from "next/link";
import { X, ExternalLink, Zap, ShoppingBag } from "lucide-react";
import Shoe3DViewer from "./Shoe3DViewer";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { WhatsAppIcon } from "./WhatsAppButton";
import { wa } from "../data/config";

interface Shoe3DModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function Shoe3DModal({ product, isOpen, onClose }: Shoe3DModalProps) {
  const { openQuickOrder, add } = useCart();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const savings = product.old && product.old > product.price ? product.old - product.price : 0;

  const handleWhatsAppOrder = () => {
    const msg = `Assalam-o-Alaikum! 👟\n\nMujhe ye shoe order karna hai:\n*Product:* ${product.name}\n*Category:* ${product.cat}\n*Price:* Rs. ${product.price.toLocaleString()}\n*Photo:* ${product.img}\n\nDelivery details share karein please.`;
    window.open(wa(msg), "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 z-10 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <h3 className="font-bold text-sm tracking-tight">{product.name}</h3>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
                3D Interactive Model • {product.cat}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
            title="Close 3D View"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: 3D Stage */}
        <div className="relative flex-1 min-h-[280px] sm:min-h-[460px] bg-[#f2f2f4] flex flex-col justify-center">
          <Shoe3DViewer
            img={product.img}
            name={product.name}
            className="w-full h-full min-h-[280px] sm:min-h-[460px]"
            initialAutoRotate={true}
            allowZoom={true}
            showControls={true}
          />
        </div>

        {/* Modal Footer: Product Info & Direct Buy Actions */}
        <div className="px-4 sm:px-5 py-3 sm:py-4 bg-white border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-2.5">
            <span className="text-xl sm:text-2xl font-extrabold text-zinc-950 font-mono">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.old && product.old > product.price && (
              <s className="text-zinc-400 text-sm font-mono">
                Rs. {product.old.toLocaleString()}
              </s>
            )}
            {savings > 0 && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                Save Rs. {savings.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleWhatsAppOrder}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <WhatsAppIcon size={14} />
              <span>Order on WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                openQuickOrder(product);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Zap size={14} />
              <span>Instant Checkout</span>
            </button>

            <Link
              href={`/product/${product.id}`}
              onClick={onClose}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors border border-zinc-200"
            >
              <span>Full Details</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

