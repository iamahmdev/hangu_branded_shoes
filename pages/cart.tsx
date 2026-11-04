import Link from "next/link";
import Layout from "../src/components/Layout";
import { useCart } from "../src/context/CartContext";
import { ArrowRight, Trash2 } from "lucide-react";
import { resolveProductImage } from "../src/utils/image";

export default function Cart() {
  const { items, setQ, sub, ship } = useCart();
  const total = sub + ship;

  return (
    <Layout title="Shopping Cart — Hangu Branded Shoes">
      <div className="wrap max-w-4xl mx-auto pt-32 pb-20">
        <div className="title text-center mb-8">
          <small className="text-brand-red uppercase tracking-wider text-xs font-bold">
            YOUR CART
          </small>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-1">Shopping Cart</h2>
        </div>

        {!items.length ? (
          <div className="text-center py-16">
            <p className="text-zinc-400 mb-6 text-lg">Your cart is empty 🛒</p>
            <Link className="btn" href="/shop">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="two grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
            <div className="flex flex-col gap-3">
              {items.map((i) => (
                <div
                  className="row glass flex items-center gap-4 p-4 rounded-2xl border border-white/10"
                  key={i.k}
                >
                  <img
                    src={resolveProductImage(i.img)}
                    alt={i.name}
                    className="w-20 h-20 rounded-xl object-cover bg-zinc-900 border border-white/10"
                  />
                  <div className="g flex-1 min-w-0">
                    <b className="text-white text-base block truncate">{i.name}</b>
                    <small className="text-zinc-400 text-xs">
                      Size: <span className="font-mono text-brand-gold">{i.size}</span>
                    </small>
                    <div className="text-brand-gold font-bold font-mono text-sm mt-1">
                      Rs. {i.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="qty flex items-center border border-white/15 rounded-xl bg-white/5 overflow-hidden">
                    <button
                      className="w-8 h-8 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10"
                      onClick={() => setQ(i.k, i.q - 1)}
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-mono text-white">{i.q}</span>
                    <button
                      className="w-8 h-8 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10"
                      onClick={() => setQ(i.k, i.q + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => setQ(i.k, 0)}
                    className="p-2 text-zinc-500 hover:text-brand-red transition-colors"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="sum glass p-6 rounded-3xl flex flex-col gap-3 h-fit border border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">Order Summary</h3>

              <p className="flex justify-between text-zinc-300 text-sm">
                <span>Subtotal</span>
                <span className="font-mono">Rs. {sub.toLocaleString()}</span>
              </p>

              <p className="flex justify-between text-zinc-300 text-sm">
                <span>Delivery</span>
                <span className="font-mono">
                  {ship === 0 ? (
                    <span className="text-green-400 font-bold">FREE</span>
                  ) : (
                    `Rs. ${ship}`
                  )}
                </span>
              </p>

              <div className="border-t border-white/10 my-1" />

              <p className="t flex justify-between text-white font-extrabold text-lg">
                <span>Total</span>
                <span className="text-brand-gold font-mono text-xl">
                  Rs. {total.toLocaleString()}
                </span>
              </p>

              <Link
                className="btn w-full text-center mt-3 py-3 text-sm font-bold flex items-center justify-center gap-2"
                href="/checkout"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
