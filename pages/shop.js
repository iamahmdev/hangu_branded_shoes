import { useState } from "react";
import Layout from "../src/components/Layout"; import ProductCard from "../src/components/ProductCard"; import Reveal from "../src/components/Reveal";
import { products } from "../src/data/config";
export default function Shop() {
  const cats = ["All", ...new Set(products.map((p) => p.cat))]; const [c, setC] = useState("All");
  return (
    <Layout title="Shop — Hangu_branded_shoes"><section style={{ paddingTop: 130 }}><div className="wrap">
      <div className="title"><small>COLLECTION</small><h2>Our Collection</h2></div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 40, flexWrap: "wrap" }}>
        {cats.map((x) => <button key={x} onClick={() => setC(x)} className={"btn" + (x === c ? "" : " ghost")} style={{ padding: "9px 22px" }}>{x}</button>)}
      </div>
      <div className="grid">{products.filter((p) => c === "All" || p.cat === c).map((p, i) => <Reveal key={p.id} delay={i * 80}><ProductCard p={p} /></Reveal>)}</div>
    </div></section></Layout>
  );
}
