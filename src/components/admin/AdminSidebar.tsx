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
  ChevronRight,
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

interface NavSection {
  title: string;
  items: Array<{
    id: AdminTab;
    label: string;
    icon: any;
    count?: number;
    badgeColor?: string;
  }>;
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
  const navSections: NavSection[] = [
    {
      title: "DASHBOARD",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "ORDER MANAGEMENT",
      items: [
        {
          id: "orders",
          label: "Orders",
          icon: ShoppingBag,
          count: counts.orders,
          badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        },
      ],
    },
    {
      title: "PRODUCT MANAGEMENT",
      items: [
        {
          id: "products",
          label: "Products",
          icon: Package,
          count: counts.products,
          badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        },
      ],
    },
    {
      title: "CUSTOMER FEEDBACK",
      items: [
        {
          id: "reviews",
          label: "Reviews",
          icon: Star,
          count: counts.reviews,
          badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        },
      ],
    },
    {
      title: "STORE SETTINGS",
      items: [
        {
          id: "settings",
          label: "Settings",
          icon: Settings,
        },
      ],
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

      {/* Main Sidebar Column - Deep Dark Slate (eMart Reference Style) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0f172a] text-slate-200 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top: Brand Header */}
        <div className="flex flex-col">
          <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src="/images/logo.png"
                alt="Hangu Branded Shoes Logo"
                className="w-9 h-9 rounded-full object-contain ring-1 ring-emerald-500/40 p-0.5 group-hover:scale-105 transition-transform bg-white/5"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-wider text-white">HANGU</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-500 text-slate-950 uppercase tracking-wider">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 tracking-wider">STORE ADMIN</span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Categorized Navigation Menu */}
          <nav className="p-3.5 flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-210px)]">
            {navSections.map((sec) => (
              <div key={sec.title} className="flex flex-col gap-1">
                <span className="px-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  {sec.title}
                </span>

                <div className="flex flex-col gap-0.5 mt-0.5">
                  {sec.items.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectTab(item.id)}
                        className={`w-full flex items-center justify-between px-3 h-10 rounded-xl text-xs font-semibold transition-all duration-200 ${
                          isActive
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                            : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            size={16}
                            className={isActive ? "text-white" : "text-slate-400 group-hover:text-white"}
                          />
                          <span>{item.label}</span>
                        </div>

                        {typeof item.count === "number" && (
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                              isActive
                                ? "bg-white/20 text-white border-white/30"
                                : item.badgeColor || "bg-slate-800 text-slate-300 border-slate-700"
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/40 flex flex-col gap-2.5">
          {/* Admin User Profile Card */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-xs">
                {(adminUser?.username || "A").charAt(0).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-white truncate">
                {adminUser?.username || "Super Admin"}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck size={10} className="text-emerald-400" />
                Store Owner
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/50 transition-colors"
            >
              <ExternalLink size={12} />
              <span>Storefront</span>
            </Link>

            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/50 transition-colors"
            >
              <RefreshCw size={12} className={isRefreshing ? "animate-spin text-emerald-400" : ""} />
              <span>Refresh</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-colors"
          >
            <LogOut size={13} />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}
