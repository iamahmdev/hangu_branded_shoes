import Link from "next/link";
import { useEffect, useState } from "react";

interface Slide {
  t: string;
  e: string;
  tag: string;
  img: string;
  bp: string;
  d: string;
}

const S: Slide[] = [
  { t: "Run Faster.", e: "Look Better.", tag: "SNEAKERS", img: "h1.jpg", bp: "64%", d: "Premium sneakers that give every step comfort and style." },
  { t: "Walk In", e: "Pure Comfort.", tag: "COMFORT", img: "h2.jpg", bp: "55%", d: "Lightweight, cushioned slip-ons — wear them all day without fatigue." },
  { t: "Dress To", e: "Impress.", tag: "FORMAL", img: "h3.jpg", bp: "50%", d: "Formal shoes and loafers that make you stand out at every occasion." },
];

export default function HeroSlider() {
  const [i, setI] = useState<number>(0);

  useEffect(() => {
    const t = setTimeout(() => setI((prev) => (prev + 1) % S.length), 6000);
    return () => clearTimeout(t);
  }, [i]);

  const go = (n: number) => setI((n + S.length) % S.length);

  return (
    <header className="hs">
      {S.map((s, k) => (
        <div key={k} className={"sl" + (k === i ? " on" : "")}>
          <div className="kb" style={{ backgroundImage: `url(/images/${s.img})`, backgroundPosition: `50% ${s.bp}` }} />
          <div className="ov" />
          <div className="wrap">
            <div className="tx">
              <span className="pill glass">🔥 {s.tag} • New Collection 2026</span>
              <h1>
                {s.t} <em>{s.e}</em>
              </h1>
              <p>{s.d}</p>
              <div className="btns flex gap-3 flex-wrap">
                <Link className="btn" href="/shop">
                  Shop Now →
                </Link>
                <Link className="btn ghost" href="/about">
                  About Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button className="arr l" onClick={() => go(i - 1)} aria-label="Previous Slide">
        ‹
      </button>
      <button className="arr r" onClick={() => go(i + 1)} aria-label="Next Slide">
        ›
      </button>
      <div className="hbar">
        <span className="cn">
          0{i + 1} <small>/ 0{S.length}</small>
        </span>
        <div className="thumbs">
          {S.map((s, k) => (
            <img key={k} src={"/images/" + s.img} className={k === i ? "on" : ""} onClick={() => go(k)} alt="" />
          ))}
        </div>
      </div>
    </header>
  );
}
