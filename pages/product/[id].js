import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import Layout from "../../src/components/Layout";
import { useCart } from "../../src/context/CartContext";
import { products, SIZES, wa } from "../../src/data/config";
import { WhatsAppIcon } from "../../src/components/WhatsAppButton";
export default function Product() {
  const { query, push } = useRouter(); const { add } = useCart();
  const [size, setSize] = useState(""); const [q, setQ] = useState(1); const [err, setErr] = useState(false);
  const p = products.find((x) => x.id == query.id);
  if (!p) return <Layout><div className="pg wrap">Loading…</div></Layout>;
  const go = (buy) => { if (!size) return setErr(true); add(p, size, q); buy && push("/checkout"); };
  return (
    <Layout title={p.name + " — Hangu_branded_shoes"}><div className="pg wrap two">
      <div className="pimg glass" style={{ padding: 12 }}><img src={"/images/" + p.img} alt={p.name} /></div>
      <div>
        <small style={{ color: "var(--red)" }}>{p.cat}</small><h1 style={{ fontSize: 36 }}>{p.name}</h1>
        <div className="price" style={{ fontSize: 28 }}>Rs. {p.price.toLocaleString()}<s>Rs. {p.old.toLocaleString()}</s></div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "14px 0 6px" }}>
          <b>Select your size {err && <span style={{ color: "var(--red)" }}>(required)</span>}</b>
          <Link href="/size-guide" target="_blank" style={{ fontSize: 13, color: "var(--gold)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
            📏 Size Guide
          </Link>
        </div>
        <div className="sizes">{SIZES.map((x) => <button key={x} className={"sz" + (size === x ? " on" : "")} onClick={() => { setSize(x); setErr(false); }}>{x}</button>)}</div>
        <div className="qty"><button onClick={() => setQ(Math.max(1, q - 1))}>−</button><b>{q}</b><button onClick={() => setQ(q + 1)}>+</button></div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "24px 0" }}>
          <button className="btn" onClick={() => go(true)}>Buy Now</button>
          <button className="btn ghost" onClick={() => { go(false); size && push("/cart"); }}>Add to Cart</button>
        </div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#25d366", display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}
          href={wa(`Hello! I would like to order "${p.name}". Size: ${size || "Not selected"}`)}
        >
          <WhatsAppIcon size={20} color="#25d366" /> Inquire / Order on WhatsApp
        </a>
        <div className="glass note">🚚 Free delivery over Rs. 5000 • 🔄 Easy exchange • 💵 Cash on Delivery</div>
      </div>
    </div></Layout>
  );
}
