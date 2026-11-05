import Head from "next/head";
import Link from "next/link";
import { ReactNode, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { AdminTab, AdminUser } from "./types";
import { Menu, RefreshCw, ExternalLink, LogOut, Store } from "lucide-react";

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

const TAB_TITLES: Record<AdminTab, string> = {
  dashboard: "Dashboard Overview",
  orders: "Customer Orders",
  products: "Shoes & Inventory",
  reviews: "Customer Reviews",
  settings: "Store Settings",
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
  const currentTitle = TAB_TITLES[activeTab] || "Admin Portal";

  return (
    <>
      <Head>
        <title>{`Admin — ${currentTitle} | Hangu Branded Shoes`}</title>
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
        <div className="lg:pl-64 flex flex-col min-h-screen">
          {/* Top Clean App Bar */}
          <header className="sticky top-0 z-30 bg-[#0e0e14]/95 backdrop-blur-md border-b border-white/10 px-4 md:px-8 h-16 flex items-center justify-between gap-4">
            {/* Left: Mobile Toggle & Page Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:text-white transition-colors"
                aria-label="Open sidebar menu"
              >
                <Menu size={18} />
              </button>

              <div className="flex items-center gap-2.5">
                <h1 className="text-base md:text-lg font-bold text-white tracking-tight whitespace-nowrap">
                  {currentTitle}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live DB
                </span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
              >
                <Store size={13} className="text-brand-gold" />
                <span>Storefront</span>
                <ExternalLink size={11} className="text-zinc-500" />
              </Link>

              <button
                onClick={onRefresh}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
                title="Refresh All Real-Time Queries"
              >
                <RefreshCw size={13} className={isRefreshing ? "animate-spin text-brand-gold" : ""} />
                <span className="hidden md:inline">Refresh</span>
              </button>

              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-medium text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={13} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </header>

          {/* Dynamic Page Content */}
          <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto animate-fadeIn">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
