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
    label: string;
    icon: any;
    count?: number;
  }> = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingBag,
      count: counts.orders,
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      count: counts.products,
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: Star,
      count: counts.reviews,
    },
    {
      id: "settings",
      label: "Settings",
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
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Column */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0e0e14] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand & Top Header */}
        <div className="flex flex-col">
          <div className="h-16 px-5 border-b border-white/10 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-red to-brand-redDark flex items-center justify-center text-white shadow-glow shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-sm tracking-wide leading-none">
                  Hangu Shoes
                </span>
                <span className="text-[11px] text-zinc-400 mt-1 leading-none">
                  Admin Portal
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Simple Clean Navigation */}
          <nav className="p-3 flex flex-col gap-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full h-11 px-3.5 rounded-xl flex items-center justify-between text-sm font-medium transition-all ${
                    isActive
                      ? "bg-brand-red text-white font-semibold shadow-glow"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? "text-white" : "text-zinc-400"} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>

                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-mono font-semibold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-white/10 text-zinc-300"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-white/10 flex flex-col gap-2">
          {/* External Store Link */}
          <Link
            href="/"
            target="_blank"
            className="w-full h-10 px-3 rounded-xl flex items-center justify-between text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Store size={16} className="text-brand-gold" />
              <span>View Storefront</span>
            </div>
            <ExternalLink size={13} className="text-zinc-500" />
          </Link>

          {/* Admin User Details */}
          <div className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
              {adminUser?.username?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs text-white font-medium truncate leading-tight">
                {adminUser?.name || "Admin"}
              </span>
              <span className="text-[10px] text-zinc-500 truncate leading-tight mt-0.5">
                {adminUser?.email || "admin@hangubrandedshoes.com"}
              </span>
            </div>
          </div>

          {/* Action Buttons: Refresh & Logout */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={onRefresh}
              className="h-9 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-white/5"
              title="Refresh Data"
            >
              <RefreshCw size={13} className={isRefreshing ? "animate-spin text-brand-gold" : ""} />
              <span>Refresh</span>
            </button>

            <button
              onClick={onLogout}
              className="h-9 px-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-red-500/20"
              title="Logout"
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
