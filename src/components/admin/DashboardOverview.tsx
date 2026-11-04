import { AdminDashboardData } from "../../hooks/useApi";
import { ORDER_STATUS_COLORS } from "./types";
import { AlertTriangle, ArrowRight, DollarSign, ShoppingBag, CheckCircle, Calendar, Users, MessageSquare } from "lucide-react";

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
  const recentInquiries = data?.recentInquiries || [];

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* 6 Key Analytics Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass p-5 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Gross Revenue</span>
            <DollarSign size={16} className="text-brand-gold" />
          </div>
          <div>
            <b className="text-xl md:text-2xl font-bold text-brand-gold font-mono block">
              Rs. {(stats?.totalRevenue || 0).toLocaleString()}
            </b>
            <span className="text-[10px] text-zinc-500 mt-1 block">Live Atlas orders</span>
          </div>
        </div>

        <div className="glass p-5 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag size={16} className="text-white" />
          </div>
          <div>
            <b className="text-xl md:text-2xl font-bold text-white font-mono block">
              {stats?.totalOrders || 0}
            </b>
            <span className="text-[10px] text-amber-400 mt-1 block">
              {stats?.pendingOrders || 0} pending dispatch
            </span>
          </div>
        </div>

        <div className="glass p-5 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Delivered</span>
            <CheckCircle size={16} className="text-green-400" />
          </div>
          <div>
            <b className="text-xl md:text-2xl font-bold text-green-400 font-mono block">
              {stats?.deliveredOrders || 0}
            </b>
            <span className="text-[10px] text-zinc-500 mt-1 block">Fulfilled successfully</span>
          </div>
        </div>

        <div className="glass p-5 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Low Stock</span>
            <AlertTriangle size={16} className="text-red-400" />
          </div>
          <div>
            <b className="text-xl md:text-2xl font-bold text-red-400 font-mono block">
              {stats?.lowStockCount || 0} items
            </b>
            <span className="text-[10px] text-zinc-500 mt-1 block">Stock ≤ 10 units</span>
          </div>
        </div>

        <div className="glass p-5 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Today's Orders</span>
            <Calendar size={16} className="text-cyan-400" />
          </div>
          <div>
            <b className="text-xl md:text-2xl font-bold text-cyan-400 font-mono block">
              {stats?.todayOrders || 0}
            </b>
            <span className="text-[10px] text-zinc-500 mt-1 block">Placed today</span>
          </div>
        </div>

        <div className="glass p-5 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">VIP Members</span>
            <Users size={16} className="text-purple-400" />
          </div>
          <div>
            <b className="text-xl md:text-2xl font-bold text-purple-400 font-mono block">
              {stats?.subscriberCount || 0}
            </b>
            <span className="text-[10px] text-zinc-500 mt-1 block">Email subscribers</span>
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

      {/* Grid: Recent Orders (Left 7 cols) & Recent Inquiries (Right 5 cols) */}
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

        {/* Recent Inquiries & Leads */}
        <div className="lg:col-span-4 glass p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Latest Leads & Inquiries</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Contact form customer queries</p>
              </div>
              <button
                onClick={() => onNavigateTab("inquiries")}
                className="text-xs text-brand-gold hover:underline font-bold inline-flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {recentInquiries.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-xs">
                No inquiries submitted yet.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recentInquiries.slice(0, 4).map((inq: any) => (
                  <div
                    key={inq._id}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <b className="text-xs text-white">{inq.name}</b>
                      <span className="text-[10px] text-zinc-400 font-mono">{inq.city || "Pakistan"}</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 line-clamp-2 mt-0.5 leading-relaxed">
                      "{inq.message}"
                    </p>
                    <div className="flex items-center justify-between mt-1 text-[10px]">
                      <span className="text-brand-gold font-mono">{inq.phone}</span>
                      <span className="text-zinc-500">
                        {inq.status === "new" ? "🟡 New Lead" : "🟢 Responded"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <button
              onClick={() => onNavigateTab("inquiries")}
              className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <MessageSquare size={13} /> Manage Customer Communications →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
