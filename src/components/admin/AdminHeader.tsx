import Link from "next/link";
import { AdminUser } from "./types";
import { RefreshCw, LogOut, ExternalLink, ShieldCheck } from "lucide-react";

interface AdminHeaderProps {
  adminUser: AdminUser | null;
  onRefresh: () => void;
  onLogout: () => void;
  isRefreshing?: boolean;
}

export default function AdminHeader({
  adminUser,
  onRefresh,
  onLogout,
  isRefreshing = false,
}: AdminHeaderProps) {
  return (
    <div className="glass p-4 md:p-6 rounded-3xl border border-white/10 flex flex-wrap items-center justify-between gap-4 mb-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-red to-brand-redDark border border-white/20 flex items-center justify-center text-white shadow-glow">
          <ShieldCheck size={24} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <b className="text-white text-base md:text-lg block tracking-wide">
              Hangu Shoes Operations Console
            </b>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/15 text-green-400 border border-green-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live Atlas DB
            </span>
          </div>
          <span className="text-xs text-zinc-400">
            Signed in as{" "}
            <span className="text-brand-gold font-mono font-semibold">
              {adminUser?.username || "Admin"}
            </span>{" "}
            ({adminUser?.role ? adminUser.role.toUpperCase() : "SUPERADMIN"}) •{" "}
            <span className="text-zinc-500">{adminUser?.email || "admin@hangubrandedshoes.com"}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        <Link
          href="/"
          target="_blank"
          className="p-2.5 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs flex items-center gap-1.5 border border-white/10 transition-colors"
          title="Open Customer Storefront in New Tab"
        >
          <ExternalLink size={14} />
          <span className="hidden sm:inline">Storefront</span>
        </Link>

        <button
          onClick={onRefresh}
          className="p-2.5 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs flex items-center gap-1.5 border border-white/10 transition-colors"
          title="Refresh All Real-Time Queries"
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin text-brand-gold" : ""} />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>

        <button
          onClick={onLogout}
          className="btn ghost py-2 px-3.5 text-xs inline-flex items-center gap-1.5 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-colors"
          title="End Session"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

