import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { SIZES, wa } from "../data/config";
import { WhatsAppIcon } from "./WhatsAppButton";
import { X, ShieldCheck, PackageCheck, RotateCcw, ArrowRight } from "lucide-react";
import { resolveProductImage } from "../utils/image";

export default function QuickOrderModal() {
  const { quickProduct, closeQuickOrder, add } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const [error, setError] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (quickProduct) {
      setSelectedSize("42");
      setQty(1);
      setError(false);
      setAddedToast(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [quickProduct]);

  if (!quickProduct) return null;

  const p = quickProduct;
  const discount = Math.round(((p.old - p.price) / p.old) * 100);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError(true);
      return;
    }
    add(p, selectedSize, qty);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      closeQuickOrder();
    }, 1200);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setError(true);
      return;
    }
    add(p, selectedSize, qty);
    closeQuickOrder();
    router.push("/checkout");
  };

  const buildWhatsAppOrderUrl = () => {
    const sizeText = selectedSize || "42";
    const totalAmount = (p.price * qty).toLocaleString();
    const msg = `Hello Hangu Branded Shoes! 👟\n\nI want to order this footwear pair:\n\n*Product:* ${p.name}\n*Category:* ${p.cat}\n*Size (EU):* ${sizeText}\n*Quantity:* ${qty}\n*Price:* Rs. ${totalAmount}\n*Payment:* JazzCash Mobile Transfer\n\nMy Delivery Details:\nName: \nPhone Number: \nCity: \nComplete Address: `;
    return wa(msg);
  };

  return (
    <div className="qorder-overlay fixed inset-0 z-[1000] bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn" onClick={closeQuickOrder}>
      <div className="qorder-modal relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white border border-zinc-200/90 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 text-zinc-900" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          onClick={closeQuickOrder}
          className="qorder-close-btn absolute top-3 right-3 sm:top-4 sm:right-4 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-600 hover:text-zinc-950 rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-colors z-10"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="qorder-grid grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 sm:gap-6 items-center">
          {/* Left: Product Image (100% Uncropped Studio Display) */}
          <div className="qorder-img-col flex flex-col w-full">
            <div className="qorder-img-box relative bg-gradient-to-b from-[#fafafa] to-[#f4f4f6] rounded-2xl overflow-hidden border border-zinc-200 aspect-[3/4] w-full flex items-center justify-center p-0 shadow-xs">
              <img
                src={resolveProductImage(p.img)}
                alt={p.name}
                loading="eager"
                decoding="async"
                className="w-full h-full max-h-full max-w-full object-contain p-2 select-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.08)]"
              />
              {p.tag && (
                <span className="absolute top-2.5 left-2.5 bg-zinc-950 text-white text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  {p.tag}
                </span>
              )}
              {discount > 0 && (
                <span className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-md text-zinc-950 border border-zinc-200 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                  Save {discount}%
                </span>
              )}
            </div>
          </div>

          {/* Right: Details & Order Actions */}
          <div className="qorder-info-col flex flex-col justify-center">
            {/* Header */}
            <div>
              <span className="text-[11px] text-amber-600 font-extrabold uppercase tracking-wider block mb-0.5">
                {p.cat}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 leading-tight mb-2">
                {p.name}
              </h2>
              <div className="flex items-baseline gap-2.5 flex-wrap mb-4">
                <span className="text-2xl font-black text-zinc-950 font-mono">
                  Rs. {p.price.toLocaleString()}
                </span>
                {p.old && p.old > p.price && (
                  <s className="text-xs sm:text-sm text-zinc-400 font-mono">
                    Rs. {p.old.toLocaleString()}
                  </s>
                )}
                {p.old && p.old > p.price && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Save Rs. {(p.old - p.price).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs sm:text-sm font-semibold text-zinc-700">
                  Select Size:{" "}
                  {selectedSize ? (
                    <strong className="text-zinc-950 font-bold">Size {selectedSize}</strong>
                  ) : (
                    <span className="text-rose-600 font-semibold">(Required)</span>
                  )}
                </label>
              </div>

              <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                {SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    className={`min-w-[42px] h-[40px] sm:h-[42px] rounded-xl font-bold text-xs sm:text-sm transition-all border ${
                      selectedSize === sz
                        ? "bg-zinc-950 border-zinc-950 text-white shadow-xs scale-102"
                        : "bg-zinc-100 border-zinc-200 text-zinc-800 hover:bg-zinc-200 hover:border-zinc-300"
                    }`}
                    onClick={() => {
                      setSelectedSize(sz);
                      setError(false);
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              {error && (
                <small className="text-rose-600 text-xs mt-1 block font-semibold">
                  ⚠️ Please select a shoe size to proceed.
                </small>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-4">
              <label className="text-xs sm:text-sm font-semibold text-zinc-700">Quantity:</label>
              <div className="flex items-center bg-zinc-100 border border-zinc-200 rounded-full px-2 py-0.5">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="text-zinc-700 text-base w-7 h-7 flex items-center justify-center hover:text-zinc-950 hover:bg-zinc-200 rounded-full transition-colors"
                >
                  −
                </button>
                <span className="px-2.5 font-bold text-sm text-zinc-950">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="text-zinc-700 text-base w-7 h-7 flex items-center justify-center hover:text-zinc-950 hover:bg-zinc-200 rounded-full transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-zinc-500 ml-auto">
                Total: <b className="text-zinc-950 text-sm font-bold">Rs. {(p.price * qty).toLocaleString()}</b>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {/* Direct 1-Tap WhatsApp Order */}
              <a
                href={buildWhatsAppOrderUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#25d366] to-[#128c7e] text-white py-3 px-4 rounded-xl shadow-sm hover:opacity-95 transition-all text-sm font-bold"
              >
                <WhatsAppIcon size={20} color="#fff" />
                <span>Order on WhatsApp (1-Tap)</span>
              </a>

              {/* Standard Checkout / Add to Cart */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl text-white bg-zinc-950 hover:bg-zinc-800 active:scale-98 transition-all"
                >
                  <span>Checkout</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl border border-zinc-300 text-zinc-800 bg-white hover:bg-zinc-100 hover:text-zinc-950 active:scale-98 transition-colors"
                >
                  {addedToast ? "✓ Added!" : "Add to Cart"}
                </button>
              </div>
            </div>

            {/* Sleek Minimal Trust Footer (1-line, zero clutter) */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 pt-3 text-[11px] text-zinc-500 font-medium">
              <span>✨ 100% Genuine</span>
              <span>•</span>
              <span>🔄 7-Day Free Exchange</span>
              <span>•</span>
              <span>🚚 Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
