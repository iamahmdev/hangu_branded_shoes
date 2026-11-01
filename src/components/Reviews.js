import { useEffect, useState } from "react";
import { products } from "../data/config";
const SEED = [
  { id: 1, n: "Ali Khan", c: "Peshawar", r: 5, p: "Cloud Run Pro", t: "Incredibly comfortable and the quality feels premium. Delivery took only 3 days.", d: "2 weeks ago", v: 1 },
  { id: 2, n: "Usman Ghani", c: "Kohat", r: 5, p: "Executive Derby", t: "The finishing on these formal shoes is outstanding. Looks exactly like the photos.", d: "3 weeks ago", v: 1 },
  { id: 3, n: "Hamza Shah", c: "Islamabad", r: 4, p: "Xarasoft Air Comfort", t: "Very light and cushioned. Perfect for long walks. Would love more colors.", d: "1 month ago", v: 1 },
  { id: 4, n: "Bilal Ahmad", c: "Hangu", r: 5, p: "Classic Driving Loafer", t: "Cash on Delivery gave me confidence to order. Great service and fast replies on WhatsApp.", d: "1 month ago", v: 1 },
  { id: 5, n: "Faisal Iqbal", c: "Rawalpindi", r: 4, p: "Street Sport Runner", t: "Good grip and stylish design. Exchange process was smooth when I needed a different size.", d: "2 months ago", v: 1 },
];
const Stars = ({ n }) => <span className="stars">{"★".repeat(n)}<i>{"★".repeat(5 - n)}</i></span>;
export default function Reviews() {
  const [mine, setMine] = useState([]), [f, setF] = useState(0), [r, setR] = useState(0), [err, setErr] = useState(""), [thx, setThx] = useState(false);
  const [form, setForm] = useState({ n: "", c: "", p: products[0].name, t: "" });
  useEffect(() => { try { setMine(JSON.parse(localStorage.getItem("reviews") || "[]")); } catch (e) {} }, []);
  const all = [...mine, ...SEED], avg = (all.reduce((a, x) => a + x.r, 0) / all.length).toFixed(1);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault(); if (!r) return setErr("Please select a star rating.");
    const m = [{ id: Date.now(), ...form, r, d: "Just now", v: 0 }, ...mine]; setMine(m);
    try { localStorage.setItem("reviews", JSON.stringify(m)); } catch (x) {}
    setForm({ ...form, n: "", c: "", t: "" }); setR(0); setErr(""); setThx(true); setTimeout(() => setThx(false), 5000);
  };
  return (<div id="reviews">
    <div className="title"><small>REVIEWS</small><h2>What Our Customers Say</h2></div>
    <div className="glass rsum"><div className="avg"><b>{avg}</b><Stars n={Math.round(avg)} /><p>Based on {all.length} reviews</p></div>
      <div>{[5, 4, 3, 2, 1].map((s) => { const c = all.filter((x) => x.r === s).length; return <div className="bar" key={s}><span>{s}★</span><div><i style={{ width: (c / all.length) * 100 + "%" }} /></div><span>{c}</span></div>; })}</div></div>
    <div className="rw">
      <form className="glass rform" onSubmit={submit}><h3>Write a Review</h3>
        <p style={{ color: "var(--mut)", margin: "6px 0 14px", fontSize: 14 }}>Bought from us? Share your experience.</p>
        <div className="rate">{[1, 2, 3, 4, 5].map((n) => <span key={n} className={n <= r ? "on" : ""} onClick={() => { setR(n); setErr(""); }}>★</span>)}</div><div className="rerr">{err}</div>
        <input className="inp" required placeholder="Your name" value={form.n} onChange={set("n")} />
        <input className="inp" placeholder="City" value={form.c} onChange={set("c")} />
        <select className="inp" value={form.p} onChange={set("p")}>{products.map((p) => <option key={p.id}>{p.name}</option>)}</select>
        <textarea className="inp" required rows={4} placeholder="Tell us about the fit, comfort and quality…" value={form.t} onChange={set("t")} />
        <button className="btn" style={{ width: "100%" }}>Submit Review</button></form>
      <div>
        {thx && <div className="glass thx">✅ Thank you! Your review has been posted.</div>}
        <div className="chips">{[0, 5, 4, 3].map((s) => <button key={s} className={"sz" + (f === s ? " on" : "")} onClick={() => setF(s)}>{s ? s + " ★" : "All"}</button>)}</div>
        {all.filter((x) => !f || x.r === f).map((x) => (
          <div className="glass rcard" key={x.id}><div className="rtop"><div className="av">{x.n[0]}</div>
            <div><b>{x.n}</b>{x.v ? <span className="vb">✔ Verified Buyer</span> : <span className="vb" style={{ color: "var(--gold)", borderColor: "var(--gold)" }}>New</span>}<br /><small>{x.c || "Pakistan"} • {x.d}</small></div>
            <div style={{ marginLeft: "auto" }}><Stars n={x.r} /></div></div>
            <p>{x.t}</p><small>Purchased: {x.p}</small></div>))}
      </div>
    </div></div>);
}
