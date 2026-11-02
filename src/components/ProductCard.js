import { useRef } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { Zap, Eye } from "lucide-react";

export default function ProductCard({ p }) {
  const r = useRef();
  const { openQuickOrder } = useCart();

  const mv = (e) => {
    if (!r.current) return;
    const b = r.current.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - 0.5;
    const y = (e.clientY - b.top) / b.height - 0.5;
    r.current.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-4px)`;
  };

  const lv = () => {
    if (r.current) r.current.style.transform = "";
  };

  const savings = p.old - p.price;

  return (
    <div className="card glass card-enhanced" ref={r} onMouseMove={mv} onMouseLeave={lv}>
      <div className="im">
        <Link href={"/product/" + p.id} className="card-img-link">
          <img src={"/images/" + p.img} alt={p.name} loading="lazy" />
        </Link>
        {p.tag && <span className="badge">{p.tag}</span>}
        {savings > 0 && <span className="card-savings-tag">Save Rs. {savings.toLocaleString()}</span>}

        {/* Hover Quick Action Overlay */}
        <div className="card-quick-overlay">
          <button
            type="button"
            className="card-quick-btn"
            onClick={(e) => {
              e.preventDefault();
              openQuickOrder(p);
            }}
            title="Quick Order / WhatsApp Checkout"
          >
            <Zap size={15} />
            <span>Quick Order</span>
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="card-meta">
          <small className="card-cat">{p.cat}</small>
          <span className="card-cod-hint">✓ Cash on Delivery</span>
        </div>
        <h3 className="card-title">
          <Link href={"/product/" + p.id}>{p.name}</Link>
        </h3>
        <div className="price">
          Rs. {p.price.toLocaleString()}
          <s>Rs. {p.old.toLocaleString()}</s>
        </div>

        <div className="card-btn-group">
          <Link className="btn card-btn-primary" href={"/product/" + p.id}>
            <Eye size={15} />
            <span>Details</span>
          </Link>
          <button
            type="button"
            className="btn ghost card-btn-quick"
            onClick={() => openQuickOrder(p)}
            title="Instant WhatsApp & COD Order"
          >
            <Zap size={15} />
            <span>Quick Buy</span>
          </button>
        </div>
      </div>
    </div>
  );
}
