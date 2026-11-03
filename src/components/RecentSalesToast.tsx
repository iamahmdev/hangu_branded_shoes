import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useProducts } from "../hooks/useApi";
import { CheckCircle2, X } from "lucide-react";

interface RecentCustomerOrder {
  city: string;
  name: string;
  size: string;
  time: string;
}

const RECENT_CUSTOMER_CITIES: RecentCustomerOrder[] = [
  { city: "Islamabad", name: "Hamza R.", size: "42", time: "3 mins ago" },
  { city: "Lahore", name: "Bilal K.", size: "43", time: "7 mins ago" },
  { city: "Peshawar", name: "Zahid Khan", size: "41", time: "12 mins ago" },
  { city: "Rawalpindi", name: "Usman A.", size: "44", time: "18 mins ago" },
  { city: "Karachi", name: "Fahad M.", size: "42", time: "25 mins ago" },
  { city: "Hangu", name: "Zeeshan Khan", size: "40", time: "32 mins ago" },
  { city: "Kohat", name: "Tariq Shah", size: "43", time: "41 mins ago" },
];

export default function RecentSalesToast() {
  const [index, setIndex] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [closed, setClosed] = useState<boolean>(false);
  const { openQuickOrder } = useCart();

  // Query live shoes from TanStack Query
  const { data: products } = useProducts();

  useEffect(() => {
    if (closed) return;

    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 4000);

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % RECENT_CUSTOMER_CITIES.length);
        setVisible(true);
      }, 800);
    }, 16000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [closed]);

  if (closed || !visible || !products || products.length === 0) return null;

  const current = RECENT_CUSTOMER_CITIES[index % RECENT_CUSTOMER_CITIES.length];
  const shoe = products[index % products.length] || products[0];

  return (
    <aside
      className={`recent-toast fixed z-[92] bg-zinc-900/95 backdrop-blur-md border border-white/10 border-l-[3px] border-l-[#25d366] rounded-2xl p-2.5 px-3.5 shadow-2xl transition-all duration-500 max-w-[320px] ${
        visible ? "show opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ bottom: "84px", left: "20px" }}
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <img
          src={`/images/${shoe.img}`}
          alt={shoe.name}
          className="w-12 h-12 rounded-xl object-cover bg-zinc-950 border border-white/10 shrink-0"
        />
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-1 text-[11px] text-[#25d366] font-semibold">
            <CheckCircle2 size={12} />
            <span>Someone in {current.city} purchased</span>
          </div>
          <b
            onClick={() => openQuickOrder(shoe)}
            className="text-xs text-white block truncate cursor-pointer hover:text-brand-gold transition-colors"
          >
            {shoe.name}
          </b>
          <div className="flex items-center gap-2 text-[10px] text-zinc-400">
            <span>Size {current.size}</span>
            <span>•</span>
            <span className="font-mono text-brand-gold font-bold">
              Rs. {shoe.price.toLocaleString()}
            </span>
            <span>•</span>
            <span>{current.time}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setClosed(true)}
          className="text-zinc-500 hover:text-white p-1"
          aria-label="Dismiss notification"
        >
          <X size={13} />
        </button>
      </div>
    </aside>
  );
}
