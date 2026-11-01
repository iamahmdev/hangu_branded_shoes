import { useRef } from "react";
import Link from "next/link";
export default function ProductCard({ p }) {
  const r = useRef();
  const mv = (e) => { const b = r.current.getBoundingClientRect(); const x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5; r.current.style.transform = `perspective(800px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) scale(1.03)`; };
  const lv = () => (r.current.style.transform = "");
  return (
    <div className="card glass" ref={r} onMouseMove={mv} onMouseLeave={lv}>
      <div className="im"><img src={"/images/" + p.img} alt={p.name} /><span className="badge">{p.tag}</span></div>
      <h3>{p.name}</h3><small>{p.cat}</small>
      <div className="price">Rs. {p.price.toLocaleString()}<s>Rs. {p.old.toLocaleString()}</s></div>
      <Link className="btn" href={"/product/" + p.id}>View & Buy</Link>
    </div>
  );
}
