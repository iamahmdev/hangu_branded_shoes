import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import Layout from "../../src/components/Layout";
import { useCart } from "../../src/context/CartContext";
import { products, SIZES, wa } from "../../src/data/config";
import { WhatsAppIcon } from "../../src/components/WhatsAppButton";
import { PackageCheck, RotateCcw, ShieldCheck, Zap } from "lucide-react";

export default function Product() {
  const { query, push } = useRouter();
  const { add } = useCart();
  const [size, setSize] = useState<string>("");
  const [q, setQ] = useState<number>(1);
  const [err, setErr] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  const p = products.find((x) => String(x.id) === String(query.id));
  if (!p) {
    return (
      <Layout>
        <div className="pg wrap text-center py-28 px-5">
          <h2 className="text-2xl font-bold text-white">Product Loading...</h2>
          <Link href="/shop" className="btn mt-5 inline-block">
            Back to Shop
          </Link>
        </div>
      </Layout>
    );
  }

  const savings = p.old - p.price;
  const discount = Math.round((savings / p.old) * 100);

  const go = (buy: boolean) => {
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
    <Layout title={`${p.name} — Hangu Branded Shoes`}>
      <div className="pg wrap two pt-32 pb-16">
        {/* Left: Product Image & Badges */}
        <div>
          <div className="pimg glass p-4 relative rounded-3xl overflow-hidden bg-zinc-950/80">
            <img src={"/images/" + p.img} alt={p.name} className="w-full object-cover rounded-2xl" />
            {p.tag && <span className="badge absolute top-6 left-6 bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full uppercase">{p.tag}</span>}
            {savings > 0 && (
              <span className="pdp-discount-badge absolute top-6 right-6 bg-brand-gold text-black font-extrabold text-xs px-3 py-1 rounded-full">Save {discount}%</span>
            )}
          </div>
          <div className="pdp-thumbnail-hints flex justify-around mt-3 text-sm text-zinc-400">
            <span>✨ 100% Genuine Sole</span>
            <span>🧵 Handcrafted Quality</span>
          </div>
        </div>

        {/* Right: Product Details & Buying Actions */}
        <div>
          <small className="text-brand-red font-bold tracking-widest uppercase text-xs">
            {p.cat}
          </small>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white my-2">{p.name}</h1>

          <div className="price text-2xl md:text-3xl font-extrabold text-brand-gold flex items-center gap-3 my-3">
            <span>Rs. {p.price.toLocaleString()}</span>
            <s className="text-zinc-500 font-normal text-base">Rs. {p.old.toLocaleString()}</s>
            <span className="pdp-save-pill text-xs font-bold text-[#25d366] bg-[#25d366]/15 px-3 py-1 rounded-full">Save Rs. {savings.toLocaleString()}</span>
          </div>

          {/* Size Selector */}
          <div className="flex justify-between items-center my-4">
            <b className="text-sm text-white">
              Select Size (EU / PK):{" "}
              {size ? (
                <span className="text-brand-gold font-bold">{size}</span>
              ) : (
                <span className={err ? "text-brand-red" : "text-zinc-400"}>
                  {err ? "⚠️ Please pick a size" : "(Required)"}
                </span>
              )}
            </b>
            <Link
              href="/size-guide"
              target="_blank"
              className="text-xs text-brand-gold font-semibold inline-flex items-center gap-1 hover:underline"
            >
              📏 Size Calculator & Guide
            </Link>
          </div>

          <div className="sizes flex gap-2 flex-wrap mb-4">
            {SIZES.map((x) => (
              <button
                key={x}
                className={"sz min-w-[44px] h-[44px] rounded-xl font-semibold border transition-all " + (size === x ? "on bg-brand-red border-brand-red text-white scale-105 shadow-glow" : "border-white/10 text-white bg-white/5 hover:border-brand-gold")}
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
          <div className="flex items-center gap-4 my-5">
            <span className="text-sm text-zinc-400">Quantity:</span>
            <div className="qty flex items-center bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
              <button onClick={() => setQ(Math.max(1, q - 1))} className="text-white text-lg w-7 h-7 flex items-center justify-center hover:text-brand-red">−</button>
              <b className="px-3 text-sm text-white">{q}</b>
              <button onClick={() => setQ(q + 1)} className="text-white text-lg w-7 h-7 flex items-center justify-center hover:text-brand-red">+</button>
            </div>
            <span className="text-sm font-semibold text-zinc-300">
              Subtotal: <span className="text-brand-gold">Rs. {(p.price * q).toLocaleString()}</span>
            </span>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex gap-3 flex-wrap my-5">
            <button
              className="btn flex-1 sm:flex-initial inline-flex justify-center items-center gap-2 py-3.5 px-6 rounded-full font-semibold text-sm"
              onClick={() => go(true)}
            >
              <Zap size={18} /> Buy Now (Cash on Delivery)
            </button>
            <button
              className="btn ghost flex-1 sm:flex-initial py-3.5 px-6 rounded-full font-semibold text-sm border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black transition-colors"
              onClick={() => go(false)}
            >
              {addedToast ? "✓ Added to Cart!" : "Add to Cart"}
            </button>
          </div>

          {/* 1-Click WhatsApp Direct Order Button */}
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="pdp-wa-btn flex items-center gap-3 bg-gradient-to-r from-[#25d366] to-[#128c7e] text-white p-3.5 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform my-4"
            href={buildWhatsAppOrderUrl()}
          >
            <WhatsAppIcon size={24} color="#fff" />
            <div className="text-left">
              <strong className="block text-sm font-bold">Direct Order on WhatsApp</strong>
              <small className="opacity-90 text-xs">1-Tap order sent to +923333147691</small>
            </div>
          </a>

          {/* 3-Pillar Customer Trust & Assurance Grid */}
          <div className="pdp-trust-grid grid grid-cols-1 gap-2.5 mt-6">
            <div className="pdp-trust-card glass p-3.5 rounded-2xl flex items-start gap-3">
              <PackageCheck size={22} className="text-brand-gold shrink-0 mt-0.5" />
              <div>
                <b className="text-sm text-white block">Parcel Khol Kar Check Karein</b>
                <p className="text-xs text-zinc-400">Delivery boy ke samne parcel khol kar shoe quality check karein.</p>
              </div>
            </div>
            <div className="pdp-trust-card glass p-3.5 rounded-2xl flex items-start gap-3">
              <RotateCcw size={22} className="text-brand-gold shrink-0 mt-0.5" />
              <div>
                <b className="text-sm text-white block">7-Day Free Size Exchange</b>
                <p className="text-xs text-zinc-400">Size chota ya bara aye to free doorstep replacement available.</p>
              </div>
            </div>
            <div className="pdp-trust-card glass p-3.5 rounded-2xl flex items-start gap-3">
              <ShieldCheck size={22} className="text-brand-gold shrink-0 mt-0.5" />
              <div>
                <b className="text-sm text-white block">Cash on Delivery (COD)</b>
                <p className="text-xs text-zinc-400">Pehlay jootey haath mein lein, baad mein paise ada karein.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
