import Link from "next/link";
import { AdminTab, AdminUser } from "./types";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Star,
  Settings,
  LogOut,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  adminUser: AdminUser | null;
  onRefresh?: () => void;
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
  onLogout,
  counts,
  isOpen,
  onClose,
}: AdminSidebarProps) {
  const navItems = [
    {
      id: "dashboard" as AdminTab,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "orders" as AdminTab,
      label: "Orders",
      icon: ShoppingBag,
      count: counts.orders,
    },
    {
      id: "products" as AdminTab,
      label: "Products",
      icon: Package,
      count: counts.products,
    },
    {
      id: "reviews" as AdminTab,
      label: "Reviews",
      icon: Star,
      count: counts.reviews,
    },
    {
      id: "settings" as AdminTab,
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

      {/* Main Sidebar Column - Clean Crisp White SaaS Aesthetic */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white text-slate-800 border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-xs ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top: Brand Header */}
        <div className="flex flex-col">
          <div className="h-20 px-4 border-b border-slate-100 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/images/logo.png"
                alt="Hangu Branded Shoes Logo"
                className="w-14 h-14 rounded-full object-contain ring-2 ring-emerald-500/20 p-0.5 group-hover:scale-105 transition-transform bg-white shrink-0 shadow-sm"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-wide text-slate-900 leading-tight">
                  HANGU
                </span>
                <span className="text-[11px] text-slate-500 font-semibold tracking-wider uppercase">
                  Super Admin
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Simple Clean Navigation Menu (No Scrollbars) */}
          <nav className="p-3 flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 h-11 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm font-extrabold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={17}
                      className={isActive ? "text-white" : "text-slate-500"}
                    />
                    <span>{item.label}</span>
                  </div>

                  {typeof item.count === "number" && (
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
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

        {/* Bottom Logout Only */}
        <div className="p-3 border-t border-slate-100 bg-white shrink-0">
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Logout"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
