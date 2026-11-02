import { useState, useEffect } from "react";
import { products } from "../data/config";
import { useCart } from "../context/CartContext";
import { CheckCircle2, X } from "lucide-react";

interface RecentOrder {
  city: string;
  name: string;
  shoeIdx: number;
  size: string;
  time: string;
}

const RECENT_ORDERS: RecentOrder[] = [
  { city: "Islamabad", name: "Hamza R.", shoeIdx: 0, size: "42", time: "3 mins ago" },
  { city: "Lahore", name: "Bilal K.", shoeIdx: 1, size: "43", time: "7 mins ago" },
  { city: "Peshawar", name: "Zahid Khan", shoeIdx: 2, size: "41", time: "12 mins ago" },
  { city: "Rawalpindi", name: "Usman A.", shoeIdx: 3, size: "44", time: "18 mins ago" },
  { city: "Karachi", name: "Fahad M.", shoeIdx: 4, size: "42", time: "25 mins ago" },
  { city: "Faisalabad", name: "Ali Raza", shoeIdx: 5, size: "40", time: "32 mins ago" },
  { city: "Kohat", name: "Tariq Shah", shoeIdx: 6, size: "43", time: "41 mins ago" },
];

export default function RecentSalesToast() {
  const [index, setIndex] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [closed, setClosed] = useState<boolean>(false);
  const { openQuickOrder } = useCart();

  useEffect(() => {
    if (closed) return;

    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 4000);

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % RECENT_ORDERS.length);
        setVisible(true);
      }, 800);
    }, 16000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [closed]);

  if (closed || !visible) return null;

  const current = RECENT_ORDERS[index];
  const shoe = products[current.shoeIdx] || products[0];

  return (
    <aside
      className={`recent-toast fixed z-[92] bg-zinc-900/95 backdrop-blur-md border border-white/10 border-l-[3px] border-l-[#25d366] rounded-2xl p-2.5 px-3.5 shadow-2xl transition-all duration-500 max-w-[320px] ${
        visible ? "show opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ bottom: "24px", left: "24px" }}
      aria-live="polite"
      aria-label="Recent customer purchase notification"
    >
      <button
        type="button"
        onClick={() => setClosed(true)}
        className="recent-toast-close absolute top-1.5 right-1.5 text-zinc-400 hover:text-white p-1 rounded-full"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>

      <div
        className="recent-toast-content flex items-center gap-3 cursor-pointer"
        onClick={() => openQuickOrder(shoe)}
        role="button"
        tabIndex={0}
        title="Click to view shoe"
      >
        <div className="recent-toast-img relative w-11 h-11 rounded-lg overflow-hidden bg-zinc-950 shrink-0">
          <img src={"/images/" + shoe.img} alt={shoe.name} className="w-full h-full object-cover" />
          <span className="recent-toast-check absolute bottom-0.5 right-0.5 bg-[#25d366] rounded-full w-3.5 h-3.5 flex items-center justify-center">
            <CheckCircle2 size={11} color="#fff" />
          </span>
        </div>

        <div className="recent-toast-text flex-1 min-w-0">
          <div className="recent-toast-headline text-xs flex gap-1 font-semibold text-white">
            <span className="recent-toast-user font-bold">{current.name}</span>
            <span className="recent-toast-city text-brand-gold">({current.city})</span>
          </div>
          <div className="recent-toast-shoe text-xs text-zinc-300 truncate">
            Purchased <b>{shoe.name}</b> (Size {current.size})
          </div>
          <div className="recent-toast-time text-[10.5px] text-zinc-400 flex items-center gap-1.5">
            <span className="recent-toast-pulse w-1.5 h-1.5 rounded-full bg-[#25d366]" />
            Verified Order • {current.time}
          </div>
        </div>
      </div>
    </aside>
  );
}
