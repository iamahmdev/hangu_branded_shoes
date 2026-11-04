import { AdminTab } from "./types";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Star,
  Settings,
} from "lucide-react";

interface AdminNavProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  counts: {
    orders: number;
    products: number;
    reviews: number;
  };
}

export default function AdminNav({ activeTab, onTabChange, counts }: AdminNavProps) {
  const tabs = [
    { id: "dashboard" as AdminTab, label: "Overview", icon: LayoutDashboard },
    { id: "orders" as AdminTab, label: `Orders (${counts.orders})`, icon: ShoppingBag },
    { id: "products" as AdminTab, label: `Shoes Catalog (${counts.products})`, icon: Package },
    { id: "reviews" as AdminTab, label: `Reviews (${counts.reviews})`, icon: Star },
    { id: "settings" as AdminTab, label: "Store Settings", icon: Settings },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-brand-red to-brand-redDark text-white shadow-glow"
                : "glass text-zinc-300 hover:text-white hover:bg-white/10 border border-white/5"
            }`}
          >
            <Icon size={15} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
