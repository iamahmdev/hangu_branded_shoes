import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import Layout from "../../src/components/Layout";
import { useCart } from "../../src/context/CartContext";
import { products, SIZES, wa } from "../../src/data/config";
import { WhatsAppIcon } from "../../src/components/WhatsAppButton";
import { PackageCheck, RotateCcw, ShieldCheck, Zap, ArrowRight, Check } from "lucide-react";

export default function Product() {
  const { query, push } = useRouter();
  const { add } = useCart();
  const [size, setSize] = useState("");
  const [q, setQ] = useState(1);
  const [err, setErr] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const p = products.find((x) => x.id == query.id);
  if (!p) {
    return (
      <Layout>
        <div className="pg wrap" style={{ textAlign: "center", padding: "120px 20px" }}>
          <h2>Product Loading...</h2>
          <Link href="/shop" className="btn" style={{ marginTop: 20 }}>
            Back to Shop
          </Link>
        </div>
      </Layout>
    );
  }

  const savings = p.old - p.price;
  const discount = Math.round((savings / p.old) * 100);

  const go = (buy) => {
    if (!size) {
      setErr(true);
      return;
    }
    add(p, size, q);
    if (buy) {
      push("/checkout");
    } else {
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2000);
    }
  };

  const buildWhatsAppOrderUrl = () => {
    const sizeText = size || "Size not selected yet";
    const totalAmount = (p.price * q).toLocaleString();
    const msg = `Assalam-o-Alaikum! 👟\n\nMujhe ye shoe order karna hai:\n*Product:* ${p.name}\n*Category:* ${p.cat}\n*Size (EU):* ${sizeText}\n*Quantity:* ${q}\n*Price:* Rs. ${totalAmount}\n*Payment:* Cash on Delivery (COD)\n\nMera Delivery Address ye hai:\nNaam: \nPhone: \nCity: \nAddress: `;
    return wa(msg);
  };

  return (
    <Layout title={`${p.name} — Hangu_branded_shoes`}>
      <div className="pg wrap two" style={{ paddingTop: 130 }}>
        {/* Left: Product Image & Badges */}
        <div>
          <div className="pimg glass" style={{ padding: 16, position: "relative" }}>
            <img src={"/images/" + p.img} alt={p.name} />
            {p.tag && <span className="badge">{p.tag}</span>}
            {savings > 0 && (
              <span className="pdp-discount-badge">Save {discount}%</span>
            )}
          </div>
          <div className="pdp-thumbnail-hints">
            <span>✨ 100% Genuine Sole</span>
            <span>🧵 Handcrafted Quality</span>
          </div>
        </div>

        {/* Right: Product Details & Buying Actions */}
        <div>
          <small style={{ color: "var(--red)", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
            {p.cat}
          </small>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 36px)", margin: "6px 0 12px" }}>{p.name}</h1>
          
          <div className="price" style={{ fontSize: 30, display: "flex", alignItems: "center", gap: 14 }}>
            <span>Rs. {p.price.toLocaleString()}</span>
            <s>Rs. {p.old.toLocaleString()}</s>
            <span className="pdp-save-pill">Save Rs. {savings.toLocaleString()}</span>
          </div>

          {/* Size Selector */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px 0 8px" }}>
            <b style={{ fontSize: 15 }}>
              Select Size (EU / PK):{" "}
              {size ? (
                <span style={{ color: "var(--gold)" }}>{size}</span>
              ) : (
                <span style={{ color: err ? "var(--red)" : "var(--mut)" }}>
                  {err ? "⚠️ Please pick a size" : "(Required)"}
                </span>
              )}
            </b>
            <Link
              href="/size-guide"
              target="_blank"
              style={{
                fontSize: 13,
                color: "var(--gold)",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              📏 Size Calculator & Guide
            </Link>
          </div>

          <div className="sizes">
            {SIZES.map((x) => (
              <button
                key={x}
                className={"sz" + (size === x ? " on" : "")}
                onClick={() => {
                  setSize(x);
                  setErr(false);
                }}
              >
                {x}
              </button>
            ))}
          </div>

          {/* Quantity Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "20px 0" }}>
            <span style={{ fontSize: 14, color: "var(--mut)" }}>Quantity:</span>
            <div className="qty">
              <button onClick={() => setQ(Math.max(1, q - 1))}>−</button>
              <b>{q}</b>
              <button onClick={() => setQ(q + 1)}>+</button>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              Subtotal: <span style={{ color: "var(--gold)" }}>Rs. {(p.price * q).toLocaleString()}</span>
            </span>
          </div>

          {/* Primary Action Buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "20px 0" }}>
            <button
              className="btn"
              style={{ flex: "1 1 180px", display: "inline-flex", justifyContent: "center", alignItems: "center", gap: 8 }}
              onClick={() => go(true)}
            >
              <Zap size={18} /> Buy Now (Cash on Delivery)
            </button>
            <button
              className="btn ghost"
              style={{ flex: "1 1 140px" }}
              onClick={() => go(false)}
            >
              {addedToast ? "✓ Added to Cart!" : "Add to Cart"}
            </button>
          </div>

          {/* 1-Click WhatsApp Direct Order Button */}
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="pdp-wa-btn"
            href={buildWhatsAppOrderUrl()}
          >
            <WhatsAppIcon size={22} color="#fff" />
            <div style={{ textAlign: "left" }}>
              <strong style={{ display: "block", fontSize: 14 }}>Direct Order on WhatsApp</strong>
              <small style={{ opacity: 0.85, fontSize: 11 }}>1-Tap order sent to +923333147691</small>
            </div>
          </a>

          {/* 3-Pillar Customer Trust & Assurance Grid */}
          <div className="pdp-trust-grid">
            <div className="pdp-trust-card glass">
              <PackageCheck size={22} className="pdp-trust-icon" />
              <div>
                <b>Parcel Khol Kar Check Karein</b>
                <p>Delivery boy ke samne parcel khol kar shoe quality check karein.</p>
              </div>
            </div>
            <div className="pdp-trust-card glass">
              <RotateCcw size={22} className="pdp-trust-icon" />
              <div>
                <b>7-Day Free Size Exchange</b>
                <p>Size chota ya bara aye to free doorstep replacement available.</p>
              </div>
            </div>
            <div className="pdp-trust-card glass">
              <ShieldCheck size={22} className="pdp-trust-icon" />
              <div>
                <b>Cash on Delivery (COD)</b>
                <p>Pehlay jootey haath mein lein, baad mein paise ada karein.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
