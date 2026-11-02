import { useRef, MouseEvent } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { Product } from "../types";
import { Zap, Eye } from "lucide-react";

interface ProductCardProps {
  p: Product;
}

export default function ProductCard({ p }: ProductCardProps) {
  const r = useRef<HTMLDivElement>(null);
  const { openQuickOrder } = useCart();

  const mv = (e: MouseEvent<HTMLDivElement>) => {
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
    <div className="card glass card-enhanced relative flex flex-col group transition-all duration-300" ref={r} onMouseMove={mv} onMouseLeave={lv}>
      <div className="im relative overflow-hidden rounded-t-[20px]">
        <Link href={"/product/" + p.id} className="card-img-link block">
          <img src={"/images/" + p.img} alt={p.name} loading="lazy" className="w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
        {p.tag && <span className="badge absolute top-3 left-3 bg-brand-red text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{p.tag}</span>}
        {savings > 0 && <span className="card-savings-tag absolute bottom-3 left-3 bg-black/75 backdrop-blur-md text-[#25d366] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#25d366]/30">Save Rs. {savings.toLocaleString()}</span>}

        {/* Hover Quick Action Overlay */}
        <div className="card-quick-overlay absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
          <button
            type="button"
            className="card-quick-btn inline-flex items-center gap-1.5 bg-gradient-to-r from-brand-red to-brand-redDark text-white text-[13px] font-semibold px-4 py-2 rounded-full shadow-glow cursor-pointer hover:scale-105 transition-transform"
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

      <div className="card-body p-4 flex flex-col flex-1">
        <div className="card-meta flex justify-between items-center mb-1">
          <small className="card-cat text-brand-red font-bold uppercase text-[11px] tracking-wider">{p.cat}</small>
          <span className="card-cod-hint text-[10.5px] text-[#25d366] font-semibold">✓ Cash on Delivery</span>
        </div>
        <h3 className="card-title text-white font-bold text-base my-1 line-clamp-1">
          <Link href={"/product/" + p.id} className="hover:text-brand-gold transition-colors">{p.name}</Link>
        </h3>
        <div className="price flex items-baseline gap-2 font-bold text-brand-gold text-[15px] my-1">
          Rs. {p.price.toLocaleString()}
          <s className="text-zinc-500 font-normal text-xs">Rs. {p.old.toLocaleString()}</s>
        </div>

        <div className="card-btn-group grid grid-cols-2 gap-2 mt-auto pt-3">
          <Link className="btn card-btn-primary inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 text-[13px] rounded-full text-white font-semibold" href={"/product/" + p.id}>
            <Eye size={15} />
            <span>Details</span>
          </Link>
          <button
            type="button"
            className="btn ghost card-btn-quick inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 text-[13px] rounded-full font-semibold border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black transition-colors"
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
