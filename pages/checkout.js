import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../src/components/Layout";
import { useCart } from "../src/context/CartContext";
import { PAY, wa } from "../src/data/config";
export default function Checkout() {
  const { items, sub, ship, total, clear } = useCart(); const { push } = useRouter();
  const [f, setF] = useState({ name: "", phone: "", city: "", address: "", tid: "" }); const [m, setM] = useState("cod");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const id = "HBS" + Date.now().toString().slice(-6);
    const pay = m === "cod" ? "Cash on Delivery" : `${PAY[m].name} (TID: ${f.tid})`;
    const msg = `🛍 NEW ORDER ${id}\n\n` + items.map((i) => `• ${i.name} | Size ${i.size} | x${i.q} = Rs.${i.price * i.q}`).join("\n") +
      `\n\nSubtotal: Rs.${sub}\nDelivery: Rs.${ship}\nTOTAL: Rs.${total}\nPayment: ${pay}\n\n👤 ${f.name}\n📞 ${f.phone}\n📍 ${f.address}, ${f.city}`;
    sessionStorage.setItem("lastOrder", JSON.stringify({ id, msg }));
    window.open(wa(msg), "_blank"); clear(); push("/success");
  };
  if (!items.length) return <Layout><div className="pg wrap" style={{ textAlign: "center" }}>Your cart is empty.</div></Layout>;
  return (
    <Layout title="Checkout — Hangu_branded_shoes"><form className="pg wrap two" onSubmit={submit} style={{ gridTemplateColumns: "1.3fr 1fr" }}>
      <div><h2 style={{ marginBottom: 18 }}>Delivery Details</h2>
        <input className="inp" required placeholder="Full Name" value={f.name} onChange={set("name")} />
        <input className="inp" required type="tel" placeholder="Phone / WhatsApp" value={f.phone} onChange={set("phone")} />
        <input className="inp" required placeholder="City" value={f.city} onChange={set("city")} />
        <textarea className="inp" required rows={3} placeholder="Complete Address" value={f.address} onChange={set("address")} />
        <h2 style={{ margin: "20px 0 14px" }}>Payment Method</h2>
        {[["cod", "💵 Cash on Delivery"], ["jazzcash", "📱 JazzCash"], ["easypaisa", "📱 EasyPaisa"], ["bank", "🏦 Bank Transfer"]].map(([k, l]) => (
          <div key={k} className={"pay" + (m === k ? " on" : "")} onClick={() => setM(k)}>{l}</div>))}
        {m !== "cod" && <div className="glass note">{PAY[m].name}: <b>{PAY[m].acc}</b> ({PAY[m].title}). Rs. {total.toLocaleString()} and enter the Transaction ID below.
          <input className="inp" required style={{ marginTop: 10 }} placeholder="Transaction ID (TID)" value={f.tid} onChange={set("tid")} /></div>}
      </div>
      <div className="sum glass"><h3>Order Summary</h3>
        {items.map((i) => <p key={i.k}><span>{i.name} ({i.size}) ×{i.q}</span><span>Rs. {(i.price * i.q).toLocaleString()}</span></p>)}
        <p>Delivery<span>{ship ? "Rs. " + ship : "FREE"}</span></p><p className="t">Total<span>Rs. {total.toLocaleString()}</span></p>
        <button className="btn" style={{ width: "100%", marginTop: 10 }}>Confirm Order ✓</button></div>
    </form></Layout>
  );
}
