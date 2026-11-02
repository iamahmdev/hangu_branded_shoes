import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/router";
import Layout from "../src/components/Layout";
import { useCart } from "../src/context/CartContext";
import { PAY, wa } from "../src/data/config";

type PaymentMethod = "cod" | "jazzcash" | "easypaisa" | "bank";

export default function Checkout() {
  const { items, sub, ship, total, clear } = useCart();
  const { push } = useRouter();
  const [f, setF] = useState({ name: "", phone: "", city: "", address: "", tid: "" });
  const [m, setM] = useState<PaymentMethod>("cod");

  const set = (k: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const id = "HBS" + Date.now().toString().slice(-6);
    const pay = m === "cod" ? "Cash on Delivery" : `${PAY[m].name} (TID: ${f.tid})`;
    const msg =
      `🛍 NEW ORDER ${id}\n\n` +
      items.map((i) => `• ${i.name} | Size ${i.size} | x${i.q} = Rs.${i.price * i.q}`).join("\n") +
      `\n\nSubtotal: Rs.${sub}\nDelivery: Rs.${ship}\nTOTAL: Rs.${total}\nPayment: ${pay}\n\n👤 ${f.name}\n📞 ${f.phone}\n📍 ${f.address}, ${f.city}`;

    sessionStorage.setItem("lastOrder", JSON.stringify({ id, msg }));
    window.open(wa(msg), "_blank");
    clear();
    push("/success");
  };

  if (!items.length) {
    return (
      <Layout>
        <div className="pg wrap text-center py-28 px-5">
          <p className="text-zinc-400 text-lg mb-4">Your cart is empty.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Checkout — Hangu Branded Shoes">
      <form className="pg wrap two pt-32 pb-16 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8" onSubmit={submit}>
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Delivery Details</h2>
          <div className="flex flex-col gap-3">
            <input className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-red" required placeholder="Full Name" value={f.name} onChange={set("name")} />
            <input className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-red" required type="tel" placeholder="Phone / WhatsApp" value={f.phone} onChange={set("phone")} />
            <input className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-red" required placeholder="City" value={f.city} onChange={set("city")} />
            <textarea className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-red" required rows={3} placeholder="Complete Delivery Address" value={f.address} onChange={set("address")} />
          </div>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Payment Method</h2>
          <div className="flex flex-col gap-2">
            {[
              ["cod", "💵 Cash on Delivery (Inspect before payment)"],
              ["jazzcash", "📱 JazzCash"],
              ["easypaisa", "📱 EasyPaisa"],
              ["bank", "🏦 Bank Transfer"],
            ].map(([k, l]) => (
              <div
                key={k}
                className={`pay p-3.5 rounded-xl border cursor-pointer font-medium text-sm transition-all ${
                  m === k
                    ? "on bg-brand-red/15 border-brand-red text-white"
                    : "bg-white/5 border-white/10 text-zinc-300 hover:text-white"
                }`}
                onClick={() => setM(k as PaymentMethod)}
              >
                {l}
              </div>
            ))}
          </div>

          {m !== "cod" && (
            <div className="glass note p-4 rounded-xl mt-3 text-xs text-zinc-300">
              Transfer to {PAY[m].name}: <b className="text-white">{PAY[m].acc}</b> ({PAY[m].title}). Send Rs. {total.toLocaleString()} and enter the Transaction ID below:
              <input
                className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs mt-2 outline-none focus:border-brand-red"
                required
                placeholder="Transaction ID (TID)"
                value={f.tid}
                onChange={set("tid")}
              />
            </div>
          )}
        </div>

        <div className="sum glass p-6 rounded-3xl flex flex-col gap-3 h-fit">
          <h3 className="text-xl font-bold text-white mb-2">Order Summary</h3>
          {items.map((i) => (
            <p key={i.k} className="flex justify-between text-zinc-300 text-xs">
              <span>{i.name} ({i.size}) ×{i.q}</span>
              <span>Rs. {(i.price * i.q).toLocaleString()}</span>
            </p>
          ))}
          <p className="flex justify-between text-zinc-300 text-sm pt-2 border-t border-white/10">
            Delivery<span>{ship ? "Rs. " + ship : "FREE"}</span>
          </p>
          <p className="t flex justify-between text-white font-extrabold text-lg pt-2 border-t border-white/10">
            Total<span className="text-brand-gold">Rs. {total.toLocaleString()}</span>
          </p>
          <button className="btn w-full mt-3">Confirm Order ✓</button>
        </div>
      </form>
    </Layout>
  );
}
