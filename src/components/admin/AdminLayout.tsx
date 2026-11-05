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
  ShieldCheck,
  Store,
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

const TAB_TITLES: Record<AdminTab, { title: string; urdu: string }> = {
  dashboard: {
    title: "Store Overview & Analytics",
    urdu: "دکان کی مجموعی رپورٹ اور کارکردگی",
  },
  orders: {
    title: "Customer Orders Management",
    urdu: "گاہکوں کے تمام آرڈرز اور تصدیق",
  },
  products: {
    title: "Footwear Catalog & Stock Control",
    urdu: "جوتوں کی لسٹ اور اسٹاک مینجمنٹ",
  },
  reviews: {
    title: "Customer Reviews & Moderation",
    urdu: "گاہکوں کی رائے اور فیڈبیک",
  },
  settings: {
    title: "Store & Payment Configuration",
    urdu: "دکان کی سیٹنگز، ایزی پیسہ اور ڈلیوری چارجز",
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
  const currentTabInfo = TAB_TITLES[activeTab] || { title: "Admin Portal", urdu: "کنٹرول پینل" };

  return (
    <>
      <Head>
        <title>{`Admin — ${currentTabInfo.title} | Hangu Branded Shoes`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>

      <div className="min-h-screen bg-[#0b0b0e] text-[#f5f5f5] font-sans flex flex-col">
        {/* Left Sidebar */}
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

        {/* Main Content Column with permanent left offset on desktop */}
        <div className="lg:pl-72 flex flex-col min-h-screen">
          {/* Top Sticky App Bar */}
          <header className="sticky top-0 z-30 bg-[#0d0d12]/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
            {/* Left: Mobile Toggle & Page Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Open sidebar menu"
              >
                <Menu size={20} />
              </button>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-base md:text-xl font-bold text-white tracking-tight">
                    {currentTabInfo.title}
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live DB
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 font-medium">
                  {currentTabInfo.urdu}
                </span>
              </div>
            </div>

            {/* Right: Quick Global Actions */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                title="Open Storefront in New Tab"
              >
                <Store size={14} className="text-brand-gold" />
                <span>Storefront</span>
                <ExternalLink size={12} className="text-zinc-500" />
              </Link>

              <button
                onClick={onRefresh}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                title="Refresh All Real-Time Queries"
              >
                <RefreshCw size={14} className={isRefreshing ? "animate-spin text-brand-gold" : ""} />
                <span className="hidden md:inline">Refresh Data</span>
              </button>

              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
                title="Logout"
              >
                <LogOut size={14} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </header>

          {/* Dynamic Page Content */}
          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
