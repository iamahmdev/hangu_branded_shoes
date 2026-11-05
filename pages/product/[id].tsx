import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import Layout from "../../src/components/Layout";
import { useCart } from "../../src/context/CartContext";
import { SIZES, wa } from "../../src/data/config";
import { useProduct } from "../../src/hooks/useApi";
import { WhatsAppIcon } from "../../src/components/WhatsAppButton";
import { PackageCheck, RotateCcw, ShieldCheck, Zap, ShoppingBag, ArrowRight } from "lucide-react";
import { resolveProductImage } from "../../src/utils/image";

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
        <div className="wrap max-w-7xl mx-auto pt-24 pb-16 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-zinc-200/60 rounded-3xl animate-pulse" />
          <div className="flex flex-col gap-4">
            <div className="h-6 w-24 bg-zinc-200 rounded-full animate-pulse" />
            <div className="h-10 w-3/4 bg-zinc-200 rounded-xl animate-pulse" />
            <div className="h-8 w-1/3 bg-zinc-200 rounded-xl animate-pulse" />
            <div className="h-28 w-full bg-zinc-200/60 rounded-2xl animate-pulse mt-4" />
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !p) {
    return (
      <Layout>
        <div className="wrap text-center py-28 px-5">
          <span className="text-4xl block mb-2">👟</span>
          <h2 className="text-2xl font-bold text-zinc-950">Shoe Not Found</h2>
          <p className="text-zinc-500 text-sm mt-2">
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
    const msg = `Assalam-o-Alaikum! 👟\n\nMujhe ye shoe order karna hai:\n*Product:* ${p.name}\n*Category:* ${p.cat}\n*Size (EU):* ${sizeText}\n*Quantity:* ${q}\n*Price:* Rs. ${totalAmount}\n*Payment:* Cash on Delivery / EasyPaisa\n\nMera Delivery Address ye hai:\nNaam: \nPhone: \nCity: \nAddress: `;
    return wa(msg);
  };

  return (
    <Layout title={`${p.name} — Hangu Branded Shoes`}>
      <div className="bg-[#fafafa] text-zinc-900 min-h-screen pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
            <Link href="/" className="hover:text-zinc-950">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-zinc-950">Footwear</Link>
            <span>/</span>
            <span className="text-zinc-900 font-semibold truncate">{p.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Product Image & Badges (ETQ Profile Box) */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-[#f4f4f6] border border-zinc-200/80 flex items-center justify-center p-8 group">
                <img
                  src={resolveProductImage(p.img)}
                  alt={p.name}
                  className="max-h-full max-w-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {p.tag && (
                  <span className="absolute top-5 left-5 bg-zinc-950 text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                    {p.tag}
                  </span>
                )}

                {savings > 0 && (
                  <span className="absolute top-5 right-5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs px-3 py-1 rounded-md shadow-xs">
                    Save {discount}%
                  </span>
                )}
              </div>

              <div className="flex justify-around text-xs text-zinc-500 font-medium py-1">
                <span>✨ 100% Genuine Sole</span>
                <span>🧵 Handcrafted Quality</span>
                <span>🚚 Free Shipping over Rs. 5,000</span>
              </div>
            </div>

            {/* Right: Product Details & Buying Actions */}
            <div className="lg:col-span-6 flex flex-col bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-xs">
              <span className="text-zinc-400 font-bold tracking-widest uppercase text-xs">
                {p.cat}
              </span>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-950 my-2 tracking-tight">
                {p.name}
              </h1>

              <div className="flex items-baseline gap-3 my-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-zinc-950 font-mono">
                  Rs. {p.price.toLocaleString()}
                </span>
                {p.old && p.old > p.price && (
                  <s className="text-zinc-400 font-normal text-lg font-mono">
                    Rs. {p.old.toLocaleString()}
                  </s>
                )}
                {savings > 0 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                    Save Rs. {savings.toLocaleString()}
                  </span>
                )}
              </div>

              {p.desc && (
                <p className="text-zinc-600 text-xs sm:text-sm mb-6 leading-relaxed">
                  {p.desc}
                </p>
              )}

              {/* Size Selector */}
              <div className="flex justify-between items-center my-2">
                <b className="text-xs sm:text-sm text-zinc-900">
                  Select Size (EU / PK):{" "}
                  {size ? (
                    <span className="text-emerald-700 font-bold font-mono">{size}</span>
                  ) : (
                    <span className={err ? "text-rose-600 font-bold" : "text-zinc-400"}>
                      {err ? "⚠️ Please pick a size" : "(Required)"}
                    </span>
                  )}
                </b>
                <Link
                  href="/size-guide"
                  className="text-xs text-zinc-600 hover:text-zinc-950 underline flex items-center gap-1 font-semibold"
                >
                  📏 Size Guide
                </Link>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {(p.sizes || SIZES).map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`w-12 h-12 rounded-xl font-bold text-sm transition-all font-mono ${
                      size === s
                        ? "bg-zinc-950 text-white shadow-xs scale-105"
                        : "bg-[#f4f4f6] text-zinc-700 hover:bg-zinc-200 border border-zinc-200"
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
              <div className="flex items-center gap-3 my-3">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center bg-[#f4f4f6] border border-zinc-200 rounded-xl px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setQ(Math.max(1, q - 1))}
                    className="w-7 h-7 flex items-center justify-center text-zinc-700 text-base font-bold hover:text-zinc-950"
                  >
                    −
                  </button>
                  <b className="px-3 text-sm text-zinc-950 font-mono">{q}</b>
                  <button
                    type="button"
                    onClick={() => setQ(q + 1)}
                    className="w-7 h-7 flex items-center justify-center text-zinc-700 text-base font-bold hover:text-zinc-950"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-zinc-500">
                  Total: <b className="text-zinc-950 font-mono">Rs. {(p.price * q).toLocaleString()}</b>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  type="button"
                  className="flex-1 py-3 px-6 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                  onClick={() => go(true)}
                >
                  <Zap size={16} />
                  <span>Buy Now (Instant Checkout)</span>
                </button>
                <button
                  type="button"
                  className="py-3 px-6 rounded-xl bg-[#f4f4f6] hover:bg-zinc-200 text-zinc-900 border border-zinc-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  onClick={() => go(false)}
                >
                  <ShoppingBag size={16} />
                  <span>Add to Bag</span>
                </button>
              </div>

              {/* Direct WhatsApp Instant Buy */}
              <div className="mt-3">
                <a
                  href={buildWhatsAppOrderUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <WhatsAppIcon size={16} color="#fff" />
                  <span>Instant Order on WhatsApp</span>
                </a>
              </div>

              {addedToast && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 animate-fadeIn">
                  ✓ Added to Cart! View your cart to checkout anytime.
                </div>
              )}

              {/* Value Assurance List */}
              <div className="mt-6 pt-6 border-t border-zinc-100 flex flex-col gap-3 text-xs text-zinc-600">
                <div className="flex items-center gap-2.5">
                  <PackageCheck size={16} className="text-emerald-600" />
                  <span>
                    <b>EasyPaisa & COD:</b> Cash on Delivery or instant EasyPaisa verified transfer.
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <RotateCcw size={16} className="text-emerald-600" />
                  <span>
                    <b>7-Day Free Size Exchange:</b> Hassle-free replacement if sizing does not fit.
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>
                    <b>Genuine Quality Sole:</b> High density cushioned comfort and genuine fit.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
