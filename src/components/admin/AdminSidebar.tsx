import Link from "next/link";
import { AdminTab, AdminUser } from "./types";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Star,
  Settings,
  RefreshCw,
  LogOut,
  ExternalLink,
  ShieldCheck,
  X,
  ChevronRight,
  Store,
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  adminUser: AdminUser | null;
  onRefresh: () => void;
  onLogout: () => void;
  isRefreshing?: boolean;
  counts: {
    orders: number;
    products: number;
    reviews: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({
  activeTab,
  onTabChange,
  adminUser,
  onRefresh,
  onLogout,
  isRefreshing = false,
  counts,
  isOpen,
  onClose,
}: AdminSidebarProps) {
  const navItems: Array<{
    id: AdminTab;
    title: string;
    urdu: string;
    icon: any;
    count?: number;
    badgeColor?: string;
  }> = [
    {
      id: "dashboard",
      title: "Dashboard",
      urdu: "خلاصہ و رپورٹ",
      icon: LayoutDashboard,
    },
    {
      id: "orders",
      title: "Customer Orders",
      urdu: "کسٹمر کے آرڈرز",
      icon: ShoppingBag,
      count: counts.orders,
      badgeColor: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    },
    {
      id: "products",
      title: "Shoes Catalog",
      urdu: "جوتوں کا اسٹاک",
      icon: Package,
      count: counts.products,
      badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    },
    {
      id: "reviews",
      title: "Customer Reviews",
      urdu: "کسٹمر ریویوز",
      icon: Star,
      count: counts.reviews,
      badgeColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    },
    {
      id: "settings",
      title: "Store Settings",
      urdu: "دکان کی سیٹنگز",
      icon: Settings,
    },
  ];

  const handleSelectTab = (tab: AdminTab) => {
    onTabChange(tab);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Column */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0d0d12] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand & Top Info */}
        <div className="flex flex-col">
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-red to-brand-redDark flex items-center justify-center text-white shadow-glow border border-white/20 shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-sm tracking-wider group-hover:text-brand-red transition-colors">
                  HANGU SHOES
                </span>
                <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Admin Control Center
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="p-4 flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 py-1">
              Main Menu • بنیادی صفحات
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-brand-red to-brand-redDark text-white shadow-glow"
                      : "text-zinc-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-white/5 text-zinc-400 group-hover:text-white group-hover:bg-white/10"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <b className="text-xs block font-bold leading-tight">{item.title}</b>
                      <span
                        className={`text-[10px] block font-normal leading-tight mt-0.5 ${
                          isActive ? "text-white/80" : "text-zinc-500 group-hover:text-zinc-400"
                        }`}
                      >
                        {item.urdu}
                      </span>
                    </div>
                  </div>

                  {item.count !== undefined ? (
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isActive ? "bg-white/20 text-white" : item.badgeColor || "bg-white/10 text-zinc-300"
                      }`}
                    >
                      {item.count}
                    </span>
                  ) : (
                    <ChevronRight
                      size={14}
                      className={`transition-transform group-hover:translate-x-0.5 ${
                        isActive ? "text-white" : "text-zinc-600 group-hover:text-zinc-400"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Section (Admin User & Actions) */}
        <div className="p-4 border-t border-white/10 flex flex-col gap-3 bg-[#0a0a0e]/60">
          {/* Quick External Store Link */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <Store size={16} className="text-brand-gold group-hover:scale-110 transition-transform" />
              <span>Customer Storefront</span>
            </div>
            <ExternalLink size={14} className="text-zinc-500 group-hover:text-white transition-colors" />
          </Link>

          {/* Admin Profile Mini Card */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="w-9 h-9 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold text-xs shrink-0">
              {adminUser?.username?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <b className="text-xs text-white truncate font-semibold">
                {adminUser?.name || adminUser?.username || "Super Admin"}
              </b>
              <span className="text-[10px] text-zinc-500 truncate">
                {adminUser?.email || "admin@hangubrandedshoes.com"}
              </span>
            </div>
          </div>

          {/* Refresh & Logout Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onRefresh}
              className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
              title="Refresh All Real-Time Queries"
            >
              <RefreshCw size={13} className={isRefreshing ? "animate-spin text-brand-gold" : ""} />
              <span>Refresh</span>
            </button>

            <button
              onClick={onLogout}
              className="py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-medium flex items-center justify-center gap-1.5 border border-red-500/20 transition-colors"
              title="Logout from Admin Portal"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
