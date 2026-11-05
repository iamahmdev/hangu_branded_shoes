import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useProducts, useRecentSales } from "../hooks/useApi";
import { CheckCircle2, X } from "lucide-react";
import { Product } from "../types";
import { resolveProductImage } from "../utils/image";

function formatTimeAgo(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    if (diffMs < 0) return "Just now";
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? "s" : ""} ago`;
    if (diffHour < 24) return `${diffHour} hr${diffHour > 1 ? "s" : ""} ago`;
    if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
    return "Recently";
  } catch {
    return "Recently";
  }
}

export default function RecentSalesToast() {
  const [index, setIndex] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [closed, setClosed] = useState<boolean>(false);
  const { openQuickOrder } = useCart();

  // Query genuine customer orders and live products from TanStack Query
  const { data: recentSales } = useRecentSales();
  const { data: products } = useProducts();

  useEffect(() => {
    if (closed || !recentSales || recentSales.length === 0) {
      setVisible(false);
      return;
    }

    // Initial popup delay
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 4000);

    // Rotate across genuine sales every 15 seconds
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % recentSales.length);
        setVisible(true);
      }, 800);
    }, 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [closed, recentSales]);

  // If dismissed, or if NO genuine orders exist in MongoDB Atlas, do not show popup
  if (closed || !visible || !recentSales || recentSales.length === 0) {
    return null;
  }

  const current = recentSales[index % recentSales.length];
  if (!current) return null;

  // Resolve matching product or build fallback
  const handleOpenProduct = () => {
    const matched = products?.find((p) => p.id === current.productId);
    if (matched) {
      openQuickOrder(matched);
    } else {
      openQuickOrder({
        id: current.productId,
        name: current.name,
        cat: "Shoes",
        price: current.price,
        old: current.price + 1000,
        img: current.img,
        inStock: true,
        sizes: [current.size || "42"],
      } as Product);
    }
  };

  const imageSrc = resolveProductImage(current.img);

  return (
    <aside
      className={`recent-toast fixed z-[92] bg-white/95 backdrop-blur-md border border-zinc-200/90 border-l-[3px] border-l-emerald-500 rounded-2xl p-2.5 px-3.5 shadow-xl transition-all duration-500 max-w-[320px] ${
        visible ? "show opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ bottom: "84px", left: "20px" }}
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <img
          src={imageSrc}
          alt={current.name}
          className="w-12 h-12 rounded-xl object-cover bg-[#f4f4f6] border border-zinc-200 shrink-0"
        />
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <CheckCircle2 size={12} />
            <span>
              {current.customerName
                ? `${current.customerName} in ${current.city}`
                : `Someone in ${current.city}`}{" "}
              purchased
            </span>
          </div>
          <b
            onClick={handleOpenProduct}
            className="text-xs text-zinc-900 block truncate cursor-pointer hover:text-zinc-600 transition-colors"
          >
            {current.name}
          </b>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500">
            <span>Size {current.size}</span>
            <span>•</span>
            <span className="font-mono text-zinc-900 font-bold">
              Rs. {current.price.toLocaleString()}
            </span>
            <span>•</span>
            <span>{formatTimeAgo(current.createdAt)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setClosed(true)}
          className="text-zinc-400 hover:text-zinc-800 p-1"
          aria-label="Dismiss notification"
        >
          <X size={13} />
        </button>
      </div>
    </aside>
  );
}
