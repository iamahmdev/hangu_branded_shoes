import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import Layout from "../../src/components/Layout";
import { useCart } from "../../src/context/CartContext";
import { SIZES, wa } from "../../src/data/config";
import { useProduct } from "../../src/hooks/useApi";
import { WhatsAppIcon } from "../../src/components/WhatsAppButton";
import { PackageCheck, RotateCcw, ShieldCheck, Zap } from "lucide-react";

export default function Product() {
  const { query, push } = useRouter();
  const { add } = useCart();
  const [size, setSize] = useState<string>("");
  const [q, setQ] = useState<number>(1);
  const [err, setErr] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  // TanStack Query hook
  const { data: p, isLoading, isError } = useProduct(query.id as string);

  if (isLoading) {
    return (
      <Layout>
        <div className="pg wrap two pt-32 pb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass rounded-3xl h-96 animate-pulse bg-white/5 border border-white/10" />
          <div className="flex flex-col gap-4">
            <div className="h-6 w-24 bg-white/10 rounded-full animate-pulse" />
            <div className="h-10 w-3/4 bg-white/10 rounded-xl animate-pulse" />
            <div className="h-8 w-1/3 bg-white/10 rounded-xl animate-pulse" />
            <div className="h-28 w-full bg-white/5 rounded-2xl animate-pulse mt-4" />
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !p) {
    return (
      <Layout>
        <div className="pg wrap text-center py-28 px-5">
          <span className="text-4xl block mb-2">👟</span>
          <h2 className="text-2xl font-bold text-white">Shoe Not Found</h2>
          <p className="text-zinc-400 text-sm mt-2">
            The shoe you are looking for does not exist or has been removed from inventory.
          </p>
          <Link href="/shop" className="btn mt-5 inline-block">
            Back to Footwear Catalog
          </Link>
        </div>
      </Layout>
    );
  }

  const savings = p.old - p.price;
  const discount = p.old > 0 ? Math.round((savings / p.old) * 100) : 0;

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
          <div className="pimg glass p-4 relative rounded-3xl overflow-hidden bg-zinc-950/80 border border-white/10">
            <img src={"/images/" + p.img} alt={p.name} className="w-full object-cover rounded-2xl" />
            {p.tag && (
              <span className="badge absolute top-6 left-6 bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {p.tag}
              </span>
            )}
            {savings > 0 && (
              <span className="pdp-discount-badge absolute top-6 right-6 bg-brand-gold text-black font-extrabold text-xs px-3 py-1 rounded-full">
                Save {discount}%
              </span>
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white my-2">
            {p.name}
          </h1>

          <div className="price text-2xl md:text-3xl font-extrabold text-brand-gold flex items-center gap-3 my-3">
            <span>Rs. {p.price.toLocaleString()}</span>
            <s className="text-zinc-500 font-normal text-base">Rs. {p.old.toLocaleString()}</s>
            {savings > 0 && (
              <span className="pdp-save-pill text-xs font-bold text-[#25d366] bg-[#25d366]/15 px-3 py-1 rounded-full">
                Save Rs. {savings.toLocaleString()}
              </span>
            )}
          </div>

          {p.desc && <p className="text-zinc-300 text-sm mb-4 leading-relaxed">{p.desc}</p>}

          {/* Size Selector */}
          <div className="flex justify-between items-center my-4">
            <b className="text-sm text-white">
              Select Size (EU / PK):{" "}
              {size ? (
                <span className="text-brand-gold font-bold">{size}</span>
              ) : (
                <span className={err ? "text-brand-red font-bold" : "text-zinc-400"}>
                  {err ? "⚠️ Please pick a size" : "(Required)"}
                </span>
              )}
            </b>
            <Link
              href="/size-guide"
              className="text-xs text-brand-gold hover:underline flex items-center gap-1 font-semibold"
            >
              📏 Size Chart Guide
            </Link>
          </div>

          <div className="sizes flex flex-wrap gap-2.5 mb-6">
            {(p.sizes || SIZES).map((s) => (
              <button
                key={s}
                className={`w-12 h-12 rounded-2xl border font-bold text-sm transition-all ${
                  size === s
                    ? "bg-brand-red border-brand-red text-white shadow-[0_0_15px_rgba(235,0,40,0.5)] scale-105"
                    : "bg-white/5 border-white/10 text-zinc-300 hover:border-white/30 hover:text-white"
                }`}
                onClick={() => {
                  setSize(s);
                  setErr(false);
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Quantity Counter */}
          <div className="qty-wrap flex items-center gap-3 my-4">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Quantity:
            </span>
            <div className="qty flex items-center bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
              <button
                onClick={() => setQ(Math.max(1, q - 1))}
                className="w-7 h-7 flex items-center justify-center text-white text-base hover:text-brand-red"
              >
                −
              </button>
              <b className="px-3 text-sm text-white font-mono">{q}</b>
              <button
                onClick={() => setQ(q + 1)}
                className="w-7 h-7 flex items-center justify-center text-white text-base hover:text-brand-red"
              >
                +
              </button>
            </div>
            <span className="text-xs text-zinc-400">
              Total:{" "}
              <b className="text-brand-gold font-mono">Rs. {(p.price * q).toLocaleString()}</b>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="actions flex flex-col sm:flex-row gap-3 mt-6">
            <button
              className="btn flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2"
              onClick={() => go(true)}
            >
              <Zap size={16} />
              <span>Buy Now (Cash on Delivery)</span>
            </button>
            <button className="btn ghost py-3 text-sm font-bold" onClick={() => go(false)}>
              Add to Cart
            </button>
          </div>

          {/* Direct WhatsApp Instant Buy */}
          <div className="mt-3">
            <a
              href={buildWhatsAppOrderUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-full bg-[#25d366]/15 hover:bg-[#25d366]/25 border border-[#25d366]/40 text-[#25d366] font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <WhatsAppIcon size={18} color="#25d366" />
              <span>Instant WhatsApp Order</span>
            </a>
          </div>

          {addedToast && (
            <div className="pdp-toast mt-4 p-3 rounded-2xl bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-bold flex items-center justify-center gap-2 animate-fadeIn">
              ✓ Added to Cart! View your cart to checkout anytime.
            </div>
          )}

          {/* Value Assurance List */}
          <div className="pdp-perks mt-8 pt-6 border-t border-white/10 flex flex-col gap-3 text-xs text-zinc-300">
            <div className="flex items-center gap-2.5">
              <PackageCheck size={18} className="text-brand-gold" />
              <span>
                <b>Cash on Delivery:</b> Inspect shoes before paying the courier.
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw size={18} className="text-brand-gold" />
              <span>
                <b>7-Day Size Exchange:</b> If the size does not fit, we replace it hassle-free.
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-brand-gold" />
              <span>
                <b>Guaranteed Comfort:</b> High density foam cushioning with anti-fatigue insole.
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
