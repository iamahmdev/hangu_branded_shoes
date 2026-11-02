import Link from "next/link";
import Layout from "../src/components/Layout";
import { useCart } from "../src/context/CartContext";

export default function Cart() {
  const { items, setQ, sub, ship, total } = useCart();

  return (
    <Layout title="Shopping Cart — Hangu Branded Shoes">
      <div className="pg wrap pt-32 pb-16">
        <div className="title text-center mb-8">
          <small className="text-brand-red uppercase tracking-wider text-xs font-bold">YOUR CART</small>
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
                <div className="row glass flex items-center gap-4 p-4 rounded-2xl" key={i.k}>
                  <img src={"/images/" + i.img} alt={i.name} className="w-20 h-20 rounded-xl object-cover" />
                  <div className="g flex-1">
                    <b className="text-white text-base block">{i.name}</b>
                    <small className="text-zinc-400 text-xs">Size: {i.size}</small>
                    <div className="price text-brand-gold font-bold text-sm mt-1">
                      Rs. {i.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="qty flex items-center bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
                    <button onClick={() => setQ(i.k, i.q - 1)} className="text-white text-base w-6 h-6 flex items-center justify-center hover:text-brand-red">−</button>
                    <b className="px-2.5 text-xs text-white">{i.q}</b>
                    <button onClick={() => setQ(i.k, i.q + 1)} className="text-white text-base w-6 h-6 flex items-center justify-center hover:text-brand-red">+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="sum glass p-6 rounded-3xl flex flex-col gap-3 h-fit">
              <h3 className="text-xl font-bold text-white mb-2">Order Summary</h3>
              <p className="flex justify-between text-zinc-300 text-sm">
                Subtotal<span>Rs. {sub.toLocaleString()}</span>
              </p>
              <p className="flex justify-between text-zinc-300 text-sm">
                Delivery<span>{ship ? "Rs. " + ship : "FREE"}</span>
              </p>
              <div className="border-t border-white/10 my-2" />
              <p className="t flex justify-between text-white font-extrabold text-lg">
                Total<span className="text-brand-gold">Rs. {total.toLocaleString()}</span>
              </p>
              <Link className="btn w-full text-center mt-3" href="/checkout">
                Proceed to Checkout →
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
