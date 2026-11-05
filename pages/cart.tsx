import Link from "next/link";
import Layout from "../src/components/Layout";
import { useCart } from "../src/context/CartContext";
import { ArrowRight, Trash2, ShoppingBag } from "lucide-react";
import { resolveProductImage } from "../src/utils/image";

export default function Cart() {
  const { items, setQ, sub, ship } = useCart();
  const total = sub + ship;

  return (
    <Layout title="Shopping Bag — Hangu Branded Shoes">
      <div className="bg-[#fafafa] text-zinc-900 min-h-screen pt-8 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-400">
              REVIEW YOUR ORDER
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-950 mt-1 tracking-tight">
              Shopping Bag
            </h1>
          </div>

          {!items.length ? (
            <div className="bg-white p-12 text-center rounded-3xl max-w-md mx-auto my-8 border border-zinc-200/80 shadow-xs">
              <ShoppingBag size={42} className="mx-auto text-zinc-300 mb-3" />
              <h2 className="text-lg font-bold text-zinc-900">Your shopping bag is empty</h2>
              <p className="text-zinc-500 text-xs mt-1 mb-6">
                Explore our latest footwear collection and select your favorite shoes.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-colors"
              >
                <span>Start Shopping</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Items List */}
              <div className="lg:col-span-8 flex flex-col gap-3">
                {items.map((i) => (
                  <div
                    key={i.k}
                    className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center gap-4 transition-colors"
                  >
                    <div className="w-20 h-20 rounded-xl bg-[#f4f4f6] border border-zinc-200/60 p-2 flex items-center justify-center shrink-0">
                      <img
                        src={resolveProductImage(i.img)}
                        alt={i.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <b className="text-zinc-900 text-sm block truncate">{i.name}</b>
                      <span className="text-zinc-500 text-xs block mt-0.5">
                        Size: <strong className="text-zinc-900 font-mono">{i.size}</strong>
                      </span>
                      <div className="text-zinc-950 font-bold font-mono text-sm mt-1">
                        Rs. {i.price.toLocaleString()}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center border border-zinc-200 rounded-xl bg-[#f4f4f6] overflow-hidden">
                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center text-zinc-700 hover:text-zinc-950 font-bold"
                        onClick={() => setQ(i.k, i.q - 1)}
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-bold text-zinc-900">
                        {i.q}
                      </span>
                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center text-zinc-700 hover:text-zinc-950 font-bold"
                        onClick={() => setQ(i.k, i.q + 1)}
                      >
                        +
                      </button>
                    </div>

                    {/* Delete Item */}
                    <button
                      type="button"
                      onClick={() => setQ(i.k, 0)}
                      className="p-2 text-zinc-400 hover:text-rose-600 transition-colors"
                      title="Remove shoe"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Order Summary Card */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs flex flex-col gap-3">
                <h2 className="text-base font-bold text-zinc-950 mb-2">Order Summary</h2>

                <div className="flex justify-between text-zinc-600 text-xs">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-zinc-900">Rs. {sub.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-zinc-600 text-xs">
                  <span>Nationwide Delivery</span>
                  <span className="font-mono font-bold text-zinc-900">
                    {ship === 0 ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        FREE
                      </span>
                    ) : (
                      `Rs. ${ship}`
                    )}
                  </span>
                </div>

                <div className="border-t border-zinc-100 my-2" />

                <div className="flex justify-between text-zinc-950 font-extrabold text-base">
                  <span>Total Amount</span>
                  <span className="font-mono text-lg">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full text-center mt-3 py-3 px-6 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={14} />
                </Link>

                <p className="text-[11px] text-zinc-400 text-center mt-1">
                  Cash on Delivery & EasyPaisa accepted
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
