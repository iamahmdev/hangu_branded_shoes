import { useState, useEffect } from "react";
import { products } from "../data/config";
import { useCart } from "../context/CartContext";
import { CheckCircle2, X } from "lucide-react";

const RECENT_ORDERS = [
  { city: "Islamabad", name: "Hamza R.", shoeIdx: 0, size: "42", time: "3 mins ago" },
  { city: "Lahore", name: "Bilal K.", shoeIdx: 1, size: "43", time: "7 mins ago" },
  { city: "Peshawar", name: "Zahid Khan", shoeIdx: 2, size: "41", time: "12 mins ago" },
  { city: "Rawalpindi", name: "Usman A.", shoeIdx: 3, size: "44", time: "18 mins ago" },
  { city: "Karachi", name: "Fahad M.", shoeIdx: 4, size: "42", time: "25 mins ago" },
  { city: "Faisalabad", name: "Ali Raza", shoeIdx: 5, size: "40", time: "32 mins ago" },
  { city: "Kohat", name: "Tariq Shah", shoeIdx: 6, size: "43", time: "41 mins ago" },
];

export default function RecentSalesToast() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);
  const { openQuickOrder } = useCart();

  useEffect(() => {
    if (closed) return;

    // Show first toast after 4 seconds
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 4000);

    // Rotate every 16 seconds
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
      className={`recent-toast ${visible ? "show" : ""}`}
      aria-live="polite"
      aria-label="Recent customer purchase notification"
    >
      <button
        type="button"
        onClick={() => setClosed(true)}
        className="recent-toast-close"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>

      <div
        className="recent-toast-content"
        onClick={() => openQuickOrder(shoe)}
        role="button"
        tabIndex={0}
        title="Click to view shoe"
      >
        <div className="recent-toast-img">
          <img src={"/images/" + shoe.img} alt={shoe.name} />
          <span className="recent-toast-check">
            <CheckCircle2 size={12} color="#fff" />
          </span>
        </div>

        <div className="recent-toast-text">
          <div className="recent-toast-headline">
            <span className="recent-toast-user">{current.name}</span>
            <span className="recent-toast-city">({current.city})</span>
          </div>
          <div className="recent-toast-shoe">
            Purchased <b>{shoe.name}</b> (Size {current.size})
          </div>
          <div className="recent-toast-time">
            <span className="recent-toast-pulse" />
            Verified Order • {current.time}
          </div>
        </div>
      </div>
    </aside>
  );
}
