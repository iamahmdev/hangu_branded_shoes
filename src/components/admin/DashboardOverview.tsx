import { AdminDashboardData } from "../../hooks/useApi";
import { ORDER_STATUS_COLORS } from "./types";
import {
  AlertTriangle,
  ArrowRight,
  DollarSign,
  ShoppingBag,
  CheckCircle,
  Calendar,
  MessageCircle,
  Settings,
  Package,
  Banknote,
  Smartphone,
} from "lucide-react";
import { wa } from "../../data/config";

interface DashboardOverviewProps {
  data: AdminDashboardData | undefined;
  onNavigateTab: (tab: any) => void;
  onInspectOrder: (order: any) => void;
  onAdjustStock: (productId: number, delta: number) => void;
}

export default function DashboardOverview({
  data,
  onNavigateTab,
  onInspectOrder,
  onAdjustStock,
}: DashboardOverviewProps) {
  const stats = data?.stats;
  const lowStockItems = data?.lowStockItems || [];
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* 6 Key Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Revenue */}
        <div className="bg-[#121218] p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Revenue</span>
            <DollarSign size={18} className="text-brand-gold" />
          </div>
          <div>
            <b className="text-2xl font-bold text-brand-gold font-mono block">
              Rs. {(stats?.totalRevenue || 0).toLocaleString()}
            </b>
            <span className="text-xs text-zinc-500 mt-1 block">Completed & verified sales</span>
          </div>
        </div>

        {/* 2. Total Orders */}
        <div className="bg-[#121218] p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Orders</span>
            <ShoppingBag size={18} className="text-white" />
          </div>
          <div>
            <b className="text-2xl font-bold text-white font-mono block">
              {stats?.totalOrders || 0}
            </b>
            <span className="text-xs text-zinc-400 mt-1 block">
              {stats?.deliveredOrders || 0} orders delivered
            </span>
          </div>
        </div>

        {/* 3. Today's Orders */}
        <div className="bg-[#121218] p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Today&apos;s Orders</span>
            <Calendar size={18} className="text-cyan-400" />
          </div>
          <div>
            <b className="text-2xl font-bold text-cyan-400 font-mono block">
              {stats?.todayOrders || 0}
            </b>
            <span className="text-xs text-zinc-500 mt-1 block">Placed today</span>
          </div>
        </div>

        {/* 4. COD Pending Confirmation */}
        <div
          onClick={() => onNavigateTab("orders")}
          className="bg-[#121218] p-5 rounded-2xl border border-amber-500/30 hover:border-amber-500/60 flex flex-col justify-between cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-amber-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">COD Pending</span>
            <Banknote size={18} className="text-amber-400" />
          </div>
          <div>
            <b className="text-2xl font-bold text-amber-300 font-mono block">
              {stats?.codPendingCount || 0}
            </b>
            <span className="text-xs text-amber-200/70 mt-1 block">
              Needs phone/delivery confirmation
            </span>
          </div>
        </div>

        {/* 5. EasyPaisa Pending Verification */}
        <div
          onClick={() => onNavigateTab("orders")}
          className="bg-[#121218] p-5 rounded-2xl border border-white/10 hover:border-green-500/50 flex flex-col justify-between cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">EasyPaisa Verification</span>
            <Smartphone size={18} className="text-green-400" />
          </div>
          <div>
            <b className="text-2xl font-bold text-green-400 font-mono block">
              {stats?.pendingPaymentsCount || 0}
            </b>
            <span className="text-xs text-zinc-400 mt-1 block">
              TID receipt awaits review
            </span>
          </div>
        </div>

        {/* 6. Low-Stock Alerts */}
        <div
          onClick={() => onNavigateTab("products")}
          className="bg-[#121218] p-5 rounded-2xl border border-white/10 hover:border-red-500/50 flex flex-col justify-between cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Low Stock Shoes</span>
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <div>
            <b className="text-2xl font-bold text-red-400 font-mono block">
              {stats?.lowStockCount || 0}
            </b>
            <span className="text-xs text-zinc-500 mt-1 block">Shoes with stock ≤ 10 pairs</span>
          </div>
        </div>
      </div>

      {/* Low Stock Warning Section */}
      {lowStockItems.length > 0 && (
        <div className="glass p-6 rounded-3xl border border-amber-500/30 bg-amber-500/5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-amber-400" size={18} />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Critical Inventory Stock Warning ({lowStockItems.length} Footwear Models)
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab("products")}
              className="text-xs text-brand-gold hover:underline font-semibold"
            >
              Open Catalog →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {lowStockItems.map((item: any) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between gap-3 shadow-lg"
              >
                <div className="min-w-0">
                  <b className="text-xs text-white block truncate">{item.name}</b>
                  <span className="text-[11px] text-red-400 font-mono font-bold">
                    Only {item.stockCount ?? item.stock ?? 0} pairs in stock
                  </span>
                </div>
                <button
                  onClick={() => onAdjustStock(item.id, 10)}
                  className="btn ghost px-3 py-1.5 text-[11px] font-bold hover:bg-brand-gold/20 hover:text-brand-gold border-white/20 shrink-0"
                  title="Add 10 pairs to stock"
                >
                  +10 Stock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Recent Orders (Left 8 cols) & Quick Operations Actions (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Overview */}
        <div className="lg:col-span-8 glass p-6 rounded-3xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Recent Customer Orders</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Real-time orders placed via online storefront</p>
            </div>
            <button
              onClick={() => onNavigateTab("orders")}
              className="text-xs text-brand-gold hover:underline font-bold inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs">
              No orders placed yet. As customers order, they will appear here in real time.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-white/5 uppercase text-zinc-400 text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3 rounded-l-xl">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">City</th>
                    <th className="p-3">Pairs</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 rounded-r-xl text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentOrders.map((ord: any) => {
                    const statusMeta = ORDER_STATUS_COLORS[ord.status] || {
                      bg: "bg-zinc-800",
                      text: "text-zinc-300",
                      border: "border-zinc-700",
                    };
                    return (
                      <tr key={ord.orderId} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-mono font-bold text-white">{ord.orderId}</td>
                        <td className="p-3 font-semibold text-white">{ord.customer?.name}</td>
                        <td className="p-3 text-zinc-400">{ord.customer?.city}</td>
                        <td className="p-3 font-mono">{ord.items?.length || 1} pairs</td>
                        <td className="p-3 font-mono text-brand-gold font-bold">
                          Rs. {(ord.totalAmount || 0).toLocaleString()}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => onInspectOrder(ord)}
                            className="text-xs text-brand-gold hover:underline font-bold"
                          >
                            Inspect →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Operations Hub */}
        <div className="lg:col-span-4 glass p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Store Operations Hub</h3>
            <p className="text-xs text-zinc-400 mb-5">Admin shortcuts & instant actions</p>

            <div className="flex flex-col gap-3">
              <a
                href={wa("Assalam-o-Alaikum! Hangu Branded Shoes Operations Support.")}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-[#25d366]/10 border border-[#25d366]/20 flex items-center justify-between hover:bg-[#25d366]/20 transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#25d366]/20 flex items-center justify-center text-[#25d366]">
                    <MessageCircle size={16} />
                  </div>
                  <div>
                    <b className="text-white block">WhatsApp Orders</b>
                    <span className="text-zinc-400 text-[11px]">Open customer concierge</span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-[#25d366]" />
              </a>

              <button
                onClick={() => onNavigateTab("orders")}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-all text-left text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <ShoppingBag size={16} />
                  </div>
                  <div>
                    <b className="text-white block">Dispatch Orders</b>
                    <span className="text-zinc-400 text-[11px]">{stats?.pendingOrders || 0} orders waiting</span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-zinc-400" />
              </button>

              <button
                onClick={() => onNavigateTab("products")}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-all text-left text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-red/20 flex items-center justify-center text-brand-red">
                    <Package size={16} />
                  </div>
                  <div>
                    <b className="text-white block">Manage Inventory</b>
                    <span className="text-zinc-400 text-[11px]">Update prices, stock & sizes</span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-zinc-400" />
              </button>

              <button
                onClick={() => onNavigateTab("settings")}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-all text-left text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Settings size={16} />
                  </div>
                  <div>
                    <b className="text-white block">Payment & Rates</b>
                    <span className="text-zinc-400 text-[11px]">EasyPaisa & store settings</span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-zinc-400" />
              </button>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 text-center">
            <span className="text-[11px] text-zinc-500">
              Hangu Branded Shoes • Single Admin Unified Console
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
