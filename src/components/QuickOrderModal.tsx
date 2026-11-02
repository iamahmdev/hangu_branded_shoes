import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { SIZES, wa } from "../data/config";
import { WhatsAppIcon } from "./WhatsAppButton";
import { X, ShieldCheck, PackageCheck, RotateCcw, ArrowRight } from "lucide-react";

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
    const msg = `Assalam-o-Alaikum! 👟\n\nMujhe ye shoe order karna hai:\n\n*Product:* ${p.name}\n*Category:* ${p.cat}\n*Size (EU):* ${sizeText}\n*Quantity:* ${qty}\n*Price:* Rs. ${totalAmount}\n*Payment:* Cash on Delivery (COD)\n\nMera Delivery Address ye hai:\nNaam: \nPhone Number: \nCity: \nComplete Address: `;
    return wa(msg);
  };

  return (
    <div className="qorder-overlay fixed inset-0 z-[1000] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" onClick={closeQuickOrder}>
      <div className="qorder-modal glass relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-950/95 border border-white/15 rounded-3xl shadow-2xl p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          onClick={closeQuickOrder}
          className="qorder-close-btn absolute top-4 right-4 bg-white/10 hover:bg-brand-red border border-white/10 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors z-10"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="qorder-grid grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6 md:gap-8">
          {/* Left: Product Image */}
          <div className="qorder-img-col flex flex-col">
            <div className="qorder-img-box relative bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 aspect-square">
              <img src={"/images/" + p.img} alt={p.name} className="w-full h-full object-cover" />
              {p.tag && <span className="qorder-tag absolute top-3 left-3 bg-brand-red text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">{p.tag}</span>}
              <span className="qorder-discount absolute bottom-3 left-3 bg-black/75 backdrop-blur-md text-brand-gold border border-brand-gold/40 text-[11px] font-bold px-2.5 py-1 rounded-full">Save {discount}%</span>
            </div>
            <div className="qorder-quick-specs flex justify-around mt-3 text-xs text-zinc-400">
              <span>🌟 High Comfort Sole</span>
              <span>🧵 Premium Stitching</span>
            </div>
          </div>

          {/* Right: Details & Order Actions */}
          <div className="qorder-info-col flex flex-col">
            <div className="qorder-header">
              <span className="qorder-cat text-xs text-brand-red font-bold uppercase tracking-wider">{p.cat}</span>
              <h2 className="qorder-title text-2xl md:text-3xl font-bold text-white mt-1 mb-2">{p.name}</h2>
              <div className="qorder-price-wrap flex items-baseline gap-3 flex-wrap mb-4">
                <span className="qorder-price text-2xl font-bold text-brand-gold">Rs. {p.price.toLocaleString()}</span>
                <s className="qorder-old-price text-sm text-zinc-500">Rs. {p.old.toLocaleString()}</s>
                <span className="qorder-save-badge text-xs font-semibold text-[#25d366] bg-[#25d366]/10 px-2.5 py-0.5 rounded-full">Save Rs. {(p.old - p.price).toLocaleString()}</span>
              </div>
            </div>

            {/* Size Selector */}
            <div className="qorder-section mb-4">
              <div className="qorder-sec-top flex justify-between items-center mb-2">
                <label className="qorder-sec-label text-sm font-semibold text-zinc-200">
                  Select Size (EU / PK):{" "}
                  {selectedSize ? (
                    <strong className="text-brand-gold font-bold">Size {selectedSize}</strong>
                  ) : (
                    <span className="text-brand-red">(Required)</span>
                  )}
                </label>
                <Link
                  href="/size-guide"
                  target="_blank"
                  className="qorder-size-guide-link text-xs text-brand-gold font-semibold hover:underline"
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
                        ? "active bg-brand-red border-brand-red text-white shadow-glow scale-105"
                        : "bg-white/5 border-white/10 text-white hover:border-brand-gold hover:bg-brand-gold/10"
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
              <label className="qorder-sec-label text-sm font-semibold text-zinc-200">Quantity:</label>
              <div className="qorder-qty-ctrl flex items-center bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="qorder-qty-btn text-white text-lg w-7 h-7 flex items-center justify-center hover:text-brand-red"
                >
                  −
                </button>
                <span className="qorder-qty-val px-2.5 font-bold text-sm text-white">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="qorder-qty-btn text-white text-lg w-7 h-7 flex items-center justify-center hover:text-brand-red"
                >
                  +
                </button>
              </div>
              <span className="qorder-subtotal text-xs text-zinc-400">
                Total: <b className="text-white text-sm">Rs. {(p.price * qty).toLocaleString()}</b>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="qorder-actions flex flex-col gap-2.5 mb-5">
              {/* Direct 1-Tap WhatsApp Order */}
              <a
                href={buildWhatsAppOrderUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="qorder-btn-wa flex items-center gap-3.5 bg-gradient-to-r from-[#25d366] to-[#128c7e] text-white p-3.5 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform"
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
                  className="btn qorder-btn-buy inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold rounded-xl text-white"
                >
                  Instant COD Checkout <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="btn ghost qorder-btn-cart py-3 px-4 text-sm font-semibold rounded-xl border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black transition-colors"
                >
                  {addedToast ? "✓ Added to Cart!" : "Add to Cart"}
                </button>
              </div>
            </div>

            {/* Trust Assurance Strip */}
            <div className="qorder-trust-strip grid grid-cols-1 gap-2 pt-3.5 border-t border-white/10 text-xs text-zinc-400">
              <div className="qorder-trust-item flex items-center gap-2.5">
                <PackageCheck size={18} className="text-brand-gold shrink-0" />
                <div>
                  <strong className="text-zinc-200">Parcel Khol Kar Check Karein</strong> — Open parcel check before payment
                </div>
              </div>
              <div className="qorder-trust-item flex items-center gap-2.5">
                <RotateCcw size={18} className="text-brand-gold shrink-0" />
                <div>
                  <strong className="text-zinc-200">7-Day Free Size Exchange</strong> — Size na aye to foran change
                </div>
              </div>
              <div className="qorder-trust-item flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-brand-gold shrink-0" />
                <div>
                  <strong className="text-zinc-200">100% Cash on Delivery (COD)</strong> — All Pakistan courier delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
