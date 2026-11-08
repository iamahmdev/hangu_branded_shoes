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
    const msg = `Assalam-o-Alaikum! 👟\n\nMujhe ye shoe order karna hai:\n\n*Product:* ${p.name}\n*Category:* ${p.cat}\n*Size (EU):* ${sizeText}\n*Quantity:* ${qty}\n*Price:* Rs. ${totalAmount}\n*Payment:* JazzCash Mobile Transfer\n\nMera Delivery Address ye hai:\nNaam: \nPhone Number: \nCity: \nComplete Address: `;
    return wa(msg);
  };

  return (
    <div className="qorder-overlay fixed inset-0 z-[1000] bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn" onClick={closeQuickOrder}>
      <div className="qorder-modal relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white border border-zinc-200/90 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 text-zinc-900" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          onClick={closeQuickOrder}
          className="qorder-close-btn absolute top-3.5 right-3.5 sm:top-4 sm:right-4 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-600 hover:text-zinc-950 rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-colors z-10"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="qorder-grid grid grid-cols-1 md:grid-cols-[320px_1fr] gap-5 md:gap-8">
          {/* Left: Product Image */}
          <div className="qorder-img-col flex flex-col">
            <div className="qorder-img-box relative bg-[#f4f4f6] rounded-2xl overflow-hidden border border-zinc-200 aspect-[3/4] sm:aspect-[4/5] min-h-[260px] sm:min-h-[340px] flex items-center justify-center p-2 sm:p-3">
              <img src={resolveProductImage(p.img)} alt={p.name} className="w-full h-full object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.1)]" />
              {p.tag && <span className="qorder-tag absolute top-2.5 left-2.5 bg-brand-red text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:py-1 rounded-full uppercase">{p.tag}</span>}
              <span className="qorder-discount absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-md text-zinc-900 border border-zinc-200 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:py-1 rounded-full shadow-xs">Save {discount}%</span>
            </div>
            <div className="qorder-quick-specs flex justify-around mt-2.5 text-xs text-zinc-500">
              <span>🌟 High Comfort Sole</span>
              <span>🧵 Premium Stitching</span>
            </div>
          </div>

          {/* Right: Details & Order Actions */}
          <div className="qorder-info-col flex flex-col">
            <div className="qorder-header">
              <span className="qorder-cat text-xs text-brand-red font-bold uppercase tracking-wider">{p.cat}</span>
              <h2 className="qorder-title text-2xl md:text-3xl font-extrabold text-zinc-900 mt-1 mb-2">{p.name}</h2>
              <div className="qorder-price-wrap flex items-baseline gap-3 flex-wrap mb-4">
                <span className="qorder-price text-2xl font-extrabold text-zinc-900">Rs. {p.price.toLocaleString()}</span>
                <s className="qorder-old-price text-sm text-zinc-400">Rs. {p.old.toLocaleString()}</s>
                <span className="qorder-save-badge text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">Save Rs. {(p.old - p.price).toLocaleString()}</span>
              </div>
            </div>

            {/* Size Selector */}
            <div className="qorder-section mb-4">
              <div className="qorder-sec-top flex justify-between items-center mb-2">
                <label className="qorder-sec-label text-sm font-semibold text-zinc-700">
                  Select Size (EU / PK):{" "}
                  {selectedSize ? (
                    <strong className="text-zinc-900 font-bold">Size {selectedSize}</strong>
                  ) : (
                    <span className="text-brand-red">(Required)</span>
                  )}
                </label>
                <Link
                  href="/size-guide"
                  target="_blank"
                  className="qorder-size-guide-link text-xs text-zinc-600 hover:text-zinc-950 font-semibold underline"
                >
                  📏 Size Guide
                </Link>
              </div>

              <div className="qorder-sizes flex gap-2 flex-wrap">
                {SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    className={`qorder-sz-btn min-w-[42px] h-[42px] rounded-xl font-semibold text-sm transition-all border ${
                      selectedSize === sz
                        ? "active bg-zinc-950 border-zinc-950 text-white shadow-sm scale-105"
                        : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-950 hover:text-zinc-950"
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
                <small className="qorder-err-msg text-brand-red text-xs mt-1.5 block">
                  ⚠️ Please select a shoe size to proceed.
                </small>
              )}
            </div>

            {/* Quantity */}
            <div className="qorder-qty-row flex items-center gap-3.5 mb-5">
              <label className="qorder-sec-label text-sm font-semibold text-zinc-700">Quantity:</label>
              <div className="qorder-qty-ctrl flex items-center bg-zinc-100 border border-zinc-200 rounded-full px-2 py-0.5">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="qorder-qty-btn text-zinc-700 text-lg w-7 h-7 flex items-center justify-center hover:text-zinc-950"
                >
                  −
                </button>
                <span className="qorder-qty-val px-2.5 font-bold text-sm text-zinc-900">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="qorder-qty-btn text-zinc-700 text-lg w-7 h-7 flex items-center justify-center hover:text-zinc-950"
                >
                  +
                </button>
              </div>
              <span className="qorder-subtotal text-xs text-zinc-500">
                Total: <b className="text-zinc-900 text-sm font-bold">Rs. {(p.price * qty).toLocaleString()}</b>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="qorder-actions flex flex-col gap-2.5 mb-5">
              {/* Direct 1-Tap WhatsApp Order */}
              <a
                href={buildWhatsAppOrderUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="qorder-btn-wa flex items-center gap-3.5 bg-gradient-to-r from-[#25d366] to-[#128c7e] text-white p-3.5 rounded-2xl shadow-md hover:scale-[1.01] transition-transform"
              >
                <WhatsAppIcon size={24} color="#fff" />
                <div className="qorder-btn-wa-text text-left">
                  <strong className="block text-sm font-bold">Order on WhatsApp (1-Tap)</strong>
                  <small className="block text-[11px] text-white/90">No registration or forms required</small>
                </div>
              </a>

              {/* Standard Checkout / Add to Cart */}
              <div className="qorder-sub-actions grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="btn qorder-btn-buy inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold rounded-xl text-white bg-zinc-950 hover:bg-zinc-800"
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="btn ghost qorder-btn-cart py-3 px-4 text-sm font-semibold rounded-xl border border-zinc-300 text-zinc-900 hover:bg-zinc-100 transition-colors"
                >
                  {addedToast ? "✓ Added to Cart!" : "Add to Cart"}
                </button>
              </div>
            </div>

            {/* Trust Assurance Strip */}
            <div className="qorder-trust-strip grid grid-cols-1 gap-2 pt-3.5 border-t border-zinc-200 text-xs text-zinc-500">
              <div className="qorder-trust-item flex items-center gap-2.5">
                <PackageCheck size={18} className="text-zinc-700 shrink-0" />
                <div>
                  <strong className="text-zinc-800">100% Genuine Sole Guarantee</strong> — Hand-inspected quality
                </div>
              </div>
              <div className="qorder-trust-item flex items-center gap-2.5">
                <RotateCcw size={18} className="text-emerald-600 shrink-0" />
                <div>
                  <strong className="text-zinc-800">7-Day Free Size Exchange</strong> — Size na aye to foran change
                </div>
              </div>
              <div className="qorder-trust-item flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-brand-red shrink-0" />
                <div>
                  <strong className="text-zinc-800">JazzCash Direct Payment</strong> — Fast nationwide courier dispatch
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
