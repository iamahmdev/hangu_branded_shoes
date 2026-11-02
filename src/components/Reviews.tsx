import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { products } from "../data/config";

interface ReviewItem {
  id: number;
  n: string;
  c?: string;
  r: number;
  p: string;
  t: string;
  d: string;
  v?: number;
}

const SEED: ReviewItem[] = [
  { id: 1, n: "Ali Khan", c: "Peshawar", r: 5, p: "Cloud Run Pro", t: "Incredibly comfortable and the quality feels premium. Delivery took only 3 days.", d: "2 weeks ago", v: 1 },
  { id: 2, n: "Usman Ghani", c: "Kohat", r: 5, p: "Executive Derby", t: "The finishing on these formal shoes is outstanding. Looks exactly like the photos.", d: "3 weeks ago", v: 1 },
  { id: 3, n: "Hamza Shah", c: "Islamabad", r: 4, p: "Xarasoft Air Comfort", t: "Very light and cushioned. Perfect for long walks. Would love more colors.", d: "1 month ago", v: 1 },
  { id: 4, n: "Bilal Ahmad", c: "Hangu", r: 5, p: "Classic Driving Loafer", t: "Cash on Delivery gave me confidence to order. Great service and fast replies on WhatsApp.", d: "1 month ago", v: 1 },
  { id: 5, n: "Faisal Iqbal", c: "Rawalpindi", r: 4, p: "Street Sport Runner", t: "Good grip and stylish design. Exchange process was smooth when I needed a different size.", d: "2 months ago", v: 1 },
];

const Stars = ({ n }: { n: number }) => (
  <span className="stars text-brand-gold">
    {"★".repeat(n)}
    <i className="text-zinc-600 not-italic">{"★".repeat(5 - n)}</i>
  </span>
);

export default function Reviews() {
  const [mine, setMine] = useState<ReviewItem[]>([]);
  const [f, setF] = useState<number>(0);
  const [r, setR] = useState<number>(0);
  const [err, setErr] = useState<string>("");
  const [thx, setThx] = useState<boolean>(false);
  const [form, setForm] = useState({ n: "", c: "", p: products[0].name, t: "" });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("reviews");
      if (saved) setMine(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const all = [...mine, ...SEED];
  const avg = (all.reduce((a, x) => a + x.r, 0) / all.length).toFixed(1);

  const set = (k: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!r) return setErr("Please select a star rating.");
    const m: ReviewItem[] = [{ id: Date.now(), ...form, r, d: "Just now", v: 0 }, ...mine];
    setMine(m);
    try {
      localStorage.setItem("reviews", JSON.stringify(m));
    } catch (x) {}
    setForm({ ...form, n: "", c: "", t: "" });
    setR(0);
    setErr("");
    setThx(true);
    setTimeout(() => setThx(false), 5000);
  };

  return (
    <div id="reviews">
      <div className="title text-center mb-8">
        <small className="text-brand-red uppercase tracking-wider text-xs font-bold">REVIEWS</small>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1">What Our Customers Say</h2>
      </div>

      <div className="glass rsum p-6 rounded-3xl flex flex-wrap items-center justify-around gap-6 mb-10">
        <div className="avg text-center">
          <b className="text-4xl md:text-5xl font-extrabold text-white block">{avg}</b>
          <Stars n={Math.round(Number(avg))} />
          <p className="text-zinc-400 text-xs mt-1">Based on {all.length} reviews</p>
        </div>
        <div className="flex flex-col gap-1.5 min-w-[240px]">
          {[5, 4, 3, 2, 1].map((s) => {
            const c = all.filter((x) => x.r === s).length;
            return (
              <div className="bar flex items-center gap-2 text-xs text-zinc-400" key={s}>
                <span className="w-6">{s}★</span>
                <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden">
                  <i className="block bg-brand-gold h-full rounded-full" style={{ width: (c / all.length) * 100 + "%" }} />
                </div>
                <span className="w-6 text-right">{c}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rw grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
        <form className="glass rform p-6 rounded-3xl flex flex-col gap-3.5" onSubmit={submit}>
          <h3 className="text-xl font-bold text-white">Write a Review</h3>
          <p className="text-zinc-400 text-sm">Bought from us? Share your experience.</p>
          <div className="rate flex gap-1 text-2xl cursor-pointer">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className={n <= r ? "on text-brand-gold" : "text-zinc-600"} onClick={() => { setR(n); setErr(""); }}>
                ★
              </span>
            ))}
          </div>
          {err && <div className="rerr text-brand-red text-xs">{err}</div>}
          <input className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-red" required placeholder="Your name" value={form.n} onChange={set("n")} />
          <input className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-red" placeholder="City" value={form.c} onChange={set("c")} />
          <select className="inp w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-red" value={form.p} onChange={set("p")}>
            {products.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
          <textarea className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-red" required rows={4} placeholder="Tell us about the fit, comfort and quality…" value={form.t} onChange={set("t")} />
          <button className="btn w-full">Submit Review</button>
        </form>

        <div className="flex flex-col gap-4">
          {thx && <div className="glass thx p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-[#25d366] text-sm">✅ Thank you! Your review has been posted.</div>}
          <div className="chips flex gap-2 flex-wrap mb-2">
            {[0, 5, 4, 3].map((s) => (
              <button key={s} className={"sz px-3 py-1.5 rounded-xl text-xs font-semibold border " + (f === s ? "on bg-brand-red border-brand-red text-white" : "border-white/10 text-zinc-400 hover:text-white")} onClick={() => setF(s)}>
                {s ? s + " ★" : "All"}
              </button>
            ))}
          </div>
          {all
            .filter((x) => !f || x.r === f)
            .map((x) => (
              <div className="glass rcard p-5 rounded-2xl flex flex-col gap-2" key={x.id}>
                <div className="rtop flex items-center gap-3">
                  <div className="av w-10 h-10 rounded-full bg-brand-red/20 text-brand-red border border-brand-red/30 flex items-center justify-center font-bold text-sm">{x.n[0]}</div>
                  <div>
                    <b className="text-white text-sm block">{x.n}</b>
                    {x.v ? (
                      <span className="vb text-[11px] text-[#25d366] font-semibold">✔ Verified Buyer</span>
                    ) : (
                      <span className="vb text-[11px] text-brand-gold font-semibold">New</span>
                    )}
                    <br />
                    <small className="text-zinc-500 text-xs">{x.c || "Pakistan"} • {x.d}</small>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <Stars n={x.r} />
                  </div>
                </div>
                <p className="text-zinc-300 text-sm mt-1">{x.t}</p>
                <small className="text-zinc-500 text-xs">Purchased: {x.p}</small>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
