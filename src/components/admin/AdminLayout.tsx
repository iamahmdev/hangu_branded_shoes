import Head from "next/head";
import Link from "next/link";
import { ReactNode, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { AdminTab, AdminUser } from "./types";
import {
  Menu,
  RefreshCw,
  ExternalLink,
  LogOut,
  Store,
  Search,
  Bell,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
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
}

const TAB_TITLES: Record<AdminTab, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Dashboard Overview",
    subtitle: "Real-time sales, order fulfillment, and footwear inventory metrics",
  },
  orders: {
    title: "Order Management",
    subtitle: "Track, confirm COD & JazzCash payments, dispatch, and manage customers",
  },
  products: {
    title: "Footwear Catalog & Inventory",
    subtitle: "Add new shoes, manage prices, stock levels, and active status",
  },
  reviews: {
    title: "Customer Reviews Moderation",
    subtitle: "Moderate customer testimonials and public star ratings",
  },
  settings: {
    title: "Store Settings & JazzCash",
    subtitle: "Configure delivery rates, business address, and official JazzCash account",
  },
};

export default function AdminLayout({
  children,
  activeTab,
  onTabChange,
  adminUser,
  onRefresh,
  onLogout,
  isRefreshing = false,
  counts,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const current = TAB_TITLES[activeTab] || {
    title: "Admin Portal",
    subtitle: "Store Management System",
  };

  return (
    <>
      <Head>
        <title>{`Admin — ${current.title} | Hangu Branded Shoes`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Light modern SaaS Canvas (eMart Reference Style) */}
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col antialiased">
        {/* Left Dark Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          adminUser={adminUser}
          onRefresh={onRefresh}
          onLogout={onLogout}
          isRefreshing={isRefreshing}
          counts={counts}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area offset by 256px on desktop */}
        <div className="lg:pl-64 flex flex-col min-h-screen">
          {/* Top Modern SaaS Header Bar */}
          <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 h-16 flex items-center justify-between gap-4 shadow-sm">
            {/* Left: Mobile Toggle & Search Bar */}
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                aria-label="Open sidebar menu"
              >
                <Menu size={18} />
              </button>

              {/* Global Quick Search Input (matching eMart Top Bar) */}
              <div className="relative w-full hidden sm:block">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Type to search..."
                  className="w-full bg-slate-100 hover:bg-slate-200/70 focus:bg-white border border-transparent focus:border-emerald-500 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all shadow-inner"
                  readOnly
                  onClick={() => onTabChange("orders")}
                />
              </div>
            </div>

            {/* Right: Live Status, View Website, Profile & Logout */}
            <div className="flex items-center gap-2.5">
              {/* Live DB Status Pill */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live DB</span>
              </div>

              {/* Website Link */}
              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors"
                title="Open Website in New Tab"
              >
                <Store size={14} className="text-emerald-600" />
                <span>View Website</span>
                <ExternalLink size={12} className="text-slate-400" />
              </Link>

              {/* Admin Profile Pill */}
              <div className="flex items-center gap-2 pl-1 sm:pl-2 sm:border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {(adminUser?.username || "A").charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {adminUser?.username || "Admin"}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Super Admin</span>
                </div>
              </div>

              {/* Top Header Logout Button */}
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
                title="Log out of Admin Portal"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          </header>

          {/* Page Body Container */}
          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
            {/* Page Header with Breadcrumbs */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {current.title}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Dashboard <span className="text-slate-300">/</span> {activeTab}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm self-start sm:self-auto">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>Auto-syncing real-time updates</span>
              </div>
            </div>

            {children}
          </main>
        </div>
      </div>
    </>
  );
}
