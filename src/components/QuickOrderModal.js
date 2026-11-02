import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { SIZES, wa, WA } from "../data/config";
import { WhatsAppIcon } from "./WhatsAppButton";
import { X, Check, ShieldCheck, PackageCheck, RotateCcw, ArrowRight } from "lucide-react";

export default function QuickOrderModal() {
  const { quickProduct, closeQuickOrder, add } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const router = useRouter();

  // Reset state on open
  useEffect(() => {
    if (quickProduct) {
      setSelectedSize("42"); // default popular size
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
    <div className="qorder-overlay" onClick={closeQuickOrder}>
      <div className="qorder-modal glass" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          onClick={closeQuickOrder}
          className="qorder-close-btn"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="qorder-grid">
          {/* Left: Product Image */}
          <div className="qorder-img-col">
            <div className="qorder-img-box">
              <img src={"/images/" + p.img} alt={p.name} />
              {p.tag && <span className="qorder-tag">{p.tag}</span>}
              <span className="qorder-discount">Save {discount}%</span>
            </div>
            <div className="qorder-quick-specs">
              <span>🌟 High Comfort Sole</span>
              <span>🧵 Premium Stitching</span>
            </div>
          </div>

          {/* Right: Details & Order Actions */}
          <div className="qorder-info-col">
            <div className="qorder-header">
              <span className="qorder-cat">{p.cat}</span>
              <h2 className="qorder-title">{p.name}</h2>
              <div className="qorder-price-wrap">
                <span className="qorder-price">Rs. {p.price.toLocaleString()}</span>
                <s className="qorder-old-price">Rs. {p.old.toLocaleString()}</s>
                <span className="qorder-save-badge">You save Rs. {(p.old - p.price).toLocaleString()}</span>
              </div>
            </div>

            {/* Size Selector */}
            <div className="qorder-section">
              <div className="qorder-sec-top">
                <label className="qorder-sec-label">
                  Select Size (EU / Pakistan):{" "}
                  {selectedSize ? (
                    <strong style={{ color: "var(--gold)" }}>Size {selectedSize}</strong>
                  ) : (
                    <span style={{ color: "var(--red)" }}>(Required)</span>
                  )}
                </label>
                <Link
                  href="/size-guide"
                  target="_blank"
                  className="qorder-size-guide-link"
                >
                  📏 Size Guide
                </Link>
              </div>

              <div className="qorder-sizes">
                {SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    className={`qorder-sz-btn ${selectedSize === sz ? "active" : ""}`}
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
                <small className="qorder-err-msg">
                  ⚠️ Please select a shoe size to proceed.
                </small>
              )}
            </div>

            {/* Quantity */}
            <div className="qorder-qty-row">
              <label className="qorder-sec-label">Quantity:</label>
              <div className="qorder-qty-ctrl">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="qorder-qty-btn"
                >
                  −
                </button>
                <span className="qorder-qty-val">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="qorder-qty-btn"
                >
                  +
                </button>
              </div>
              <span className="qorder-subtotal">
                Total: <b>Rs. {(p.price * qty).toLocaleString()}</b>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="qorder-actions">
              {/* Direct 1-Tap WhatsApp Order */}
              <a
                href={buildWhatsAppOrderUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="qorder-btn-wa"
              >
                <WhatsAppIcon size={22} color="#fff" />
                <div className="qorder-btn-wa-text">
                  <strong>Order on WhatsApp (1-Tap)</strong>
                  <small>No registration or forms required</small>
                </div>
              </a>

              {/* Standard Checkout / Add to Cart */}
              <div className="qorder-sub-actions">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="btn qorder-btn-buy"
                >
                  Instant COD Checkout <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="btn ghost qorder-btn-cart"
                >
                  {addedToast ? "✓ Added to Cart!" : "Add to Cart"}
                </button>
              </div>
            </div>

            {/* Trust Assurance Strip */}
            <div className="qorder-trust-strip">
              <div className="qorder-trust-item">
                <PackageCheck size={18} className="qorder-trust-icon" />
                <div>
                  <strong>Parcel Khol Kar Check Karein</strong>
                  <small>Open parcel check before payment</small>
                </div>
              </div>
              <div className="qorder-trust-item">
                <RotateCcw size={18} className="qorder-trust-icon" />
                <div>
                  <strong>7-Day Free Size Exchange</strong>
                  <small>Size na aye to foran change</small>
                </div>
              </div>
              <div className="qorder-trust-item">
                <ShieldCheck size={18} className="qorder-trust-icon" />
                <div>
                  <strong>100% Cash on Delivery (COD)</strong>
                  <small>All Pakistan fast courier delivery</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
