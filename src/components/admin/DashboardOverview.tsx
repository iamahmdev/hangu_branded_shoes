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
  TrendingUp,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ShieldCheck,
  Eye,
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

  // 9 Pastel Metric Cards matching eMart Reference Style
  const metricCards = [
    {
      id: "revenue",
      title: "Total Earning",
      value: `Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`,
      subtitle: "Verified & completed sales",
      growth: "↑ Live",
      bgClass: "bg-emerald-50/80 border-emerald-200/80 text-emerald-950",
      iconBg: "bg-emerald-500/15 text-emerald-600",
      icon: DollarSign,
      onClick: () => onNavigateTab("orders"),
    },
    {
      id: "today",
      title: "Today's Orders",
      value: stats?.todayOrders || 0,
      subtitle: "Placed in last 24h",
      growth: "↑ Today",
      bgClass: "bg-amber-50/80 border-amber-200/80 text-amber-950",
      iconBg: "bg-amber-500/15 text-amber-600",
      icon: Calendar,
      onClick: () => onNavigateTab("orders"),
    },
    {
      id: "total_items",
      title: "Total Footwear",
      value: (stats as any)?.totalProducts || 12,
      subtitle: "Active catalog shoes",
      growth: "Catalog",
      bgClass: "bg-indigo-50/80 border-indigo-200/80 text-indigo-950",
      iconBg: "bg-indigo-500/15 text-indigo-600",
      icon: Package,
      onClick: () => onNavigateTab("products"),
    },
    {
      id: "in_stock",
      title: "In Stock Pairs",
      value: Math.max(0, ((stats as any)?.totalProducts || 12) - lowStockItems.length),
      subtitle: "Ready for quick dispatch",
      growth: "Available",
      bgClass: "bg-teal-50/80 border-teal-200/80 text-teal-950",
      iconBg: "bg-teal-500/15 text-teal-600",
      icon: CheckCircle2,
      onClick: () => onNavigateTab("products"),
    },
    {
      id: "low_stock",
      title: "Low Stock Alert",
      value: stats?.lowStockCount ?? lowStockItems.length,
      subtitle: "Less than 5 pairs left",
      growth: (stats?.lowStockCount ?? lowStockItems.length) > 0 ? "Action Req." : "Safe",
      bgClass: "bg-rose-50/80 border-rose-200/80 text-rose-950",
      iconBg: "bg-rose-500/15 text-rose-600",
      icon: AlertTriangle,
      onClick: () => onNavigateTab("products"),
    },
    {
      id: "awaiting",
      title: "Waiting Confirmation",
      value: (stats?.codPendingCount || 0) + (stats?.pendingPaymentsCount || 0),
      subtitle: "New COD & JazzCash",
      growth: "Action",
      bgClass: "bg-sky-50/80 border-sky-200/80 text-sky-950",
      iconBg: "bg-sky-500/15 text-sky-600",
      icon: Clock,
      onClick: () => onNavigateTab("orders"),
    },
    {
      id: "dispatched",
      title: "Dispatched Orders",
      value: (stats as any)?.dispatchedOrders || Math.max(0, (stats?.totalOrders || 0) - (stats?.deliveredOrders || 0) - (stats?.pendingOrders || 0)),
      subtitle: "In transit with courier",
      growth: "Courier",
      bgClass: "bg-blue-50/80 border-blue-200/80 text-blue-950",
      iconBg: "bg-blue-500/15 text-blue-600",
      icon: Truck,
      onClick: () => onNavigateTab("orders"),
    },
    {
      id: "delivered",
      title: "Delivered Orders",
      value: stats?.deliveredOrders || 0,
      subtitle: "Successfully received",
      growth: "Success",
      bgClass: "bg-green-50/80 border-green-200/80 text-green-950",
      iconBg: "bg-green-500/15 text-green-600",
      icon: CheckCircle,
      onClick: () => onNavigateTab("orders"),
    },
    {
      id: "cancelled",
      title: "Cancelled / Fake",
      value: (stats as any)?.cancelledOrders || 0,
      subtitle: "Blocked & returned to stock",
      growth: "Guarded",
      bgClass: "bg-purple-50/80 border-purple-200/80 text-purple-950",
      iconBg: "bg-purple-500/15 text-purple-600",
      icon: XCircle,
      onClick: () => onNavigateTab("orders"),
    },
  ];

  // Visual trend bar samples (simulating eMart bar chart)
  const chartDays = [
    { day: "Mon", sales: 45, orders: 30 },
    { day: "Tue", sales: 65, orders: 48 },
    { day: "Wed", sales: 38, orders: 25 },
    { day: "Thu", sales: 85, orders: 60 },
    { day: "Fri", sales: 95, orders: 75 },
    { day: "Sat", sales: 120, orders: 90 },
    { day: "Sun", sales: 110, orders: 82 },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* 1. Grid of 9 Pastel Metric Cards (eMart Reference Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              onClick={c.onClick}
              className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between ${c.bgClass}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.iconBg}`}>
                  <Icon size={20} />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/70 text-slate-700 border border-slate-200/60 shadow-xs">
                  {c.growth}
                </span>
              </div>

              <div>
                <b className="text-2xl font-bold font-mono tracking-tight block text-slate-900">
                  {c.value}
                </b>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-semibold text-slate-700">{c.title}</span>
                  <span className="text-[11px] text-slate-500">{c.subtitle}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Earning & Order Distribution Chart Card (eMart Reference Style) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-600" />
              <span>Earning & Order Fulfillment Analytics</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Weekly distribution of incoming store orders and gross sales
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3 h-3 rounded-sm bg-blue-600 inline-block" />
              <span>Revenue</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
              <span>Orders</span>
            </div>
          </div>
        </div>

        {/* Clean Responsive Bar Visualizer */}
        <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 px-2">
          {chartDays.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <div className="w-full max-w-[42px] flex items-end justify-center gap-1.5 h-36">
                {/* Revenue Bar */}
                <div
                  style={{ height: `${(d.sales / 130) * 100}%` }}
                  className="w-1/2 bg-blue-600 rounded-t-md group-hover:bg-blue-700 transition-all shadow-xs"
                  title={`${d.day} Sales Index: ${d.sales}`}
                />
                {/* Orders Bar */}
                <div
                  style={{ height: `${(d.orders / 130) * 100}%` }}
                  className="w-1/2 bg-emerald-500 rounded-t-md group-hover:bg-emerald-600 transition-all shadow-xs"
                  title={`${d.day} Orders Index: ${d.orders}`}
                />
              </div>
              <span className="text-[11px] font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
                {d.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Dual Modern Tables: Top Selling Footwear & Recent Customer Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table 1: Top Footwear / Low Stock Watch */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Package size={16} className="text-emerald-600" />
                  <span>Footwear Stock Watch</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Items requiring inventory replenishment
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab("products")}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="p-3.5 whitespace-nowrap">Shoe</th>
                    <th className="p-3.5 whitespace-nowrap">Category</th>
                    <th className="p-3.5 whitespace-nowrap">Price</th>
                    <th className="p-3.5 whitespace-nowrap">Stock</th>
                    <th className="p-3.5 text-right whitespace-nowrap">Adjust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lowStockItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        All footwear items have healthy stock levels.
                      </td>
                    </tr>
                  ) : (
                    lowStockItems.slice(0, 5).map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5">
                          <b className="text-slate-900 text-xs block whitespace-nowrap">{p.name}</b>
                        </td>
                        <td className="p-3.5 text-slate-500 whitespace-nowrap">{p.cat}</td>
                        <td className="p-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                          Rs. {p.price.toLocaleString()}
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                            {p.stock} left
                          </span>
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => onAdjustStock(p.id, -1)}
                              className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs flex items-center justify-center transition-colors"
                              title="Decrease 1"
                            >
                              -
                            </button>
                            <button
                              onClick={() => onAdjustStock(p.id, 5)}
                              className="px-2 h-6 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center transition-colors border border-emerald-200"
                              title="Add 5"
                            >
                              +5
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Table 2: Recent Customer Orders */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag size={16} className="text-blue-600" />
                  <span>Recent Customer Orders</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Latest customer purchases requiring fulfillment
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab("orders")}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View All Orders</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="p-3.5 whitespace-nowrap">Order ID</th>
                    <th className="p-3.5 whitespace-nowrap">Customer</th>
                    <th className="p-3.5 whitespace-nowrap">Amount</th>
                    <th className="p-3.5 whitespace-nowrap">Status</th>
                    <th className="p-3.5 text-right whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        No orders recorded yet.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.slice(0, 5).map((o) => (
                      <tr key={o._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-blue-600 whitespace-nowrap">
                          #{o.orderId || o._id.slice(-6)}
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <b className="text-slate-900 text-xs block">{o.customer?.name}</b>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {o.customer?.phone}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                          Rs. {o.totalAmount?.toLocaleString()}
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              o.status === "delivered"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : o.status === "confirmed"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : o.status === "dispatched"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : o.status === "cancelled"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-sky-50 text-sky-700 border border-sky-200"
                            }`}
                          >
                            {o.status?.replace("_", " ")}
                          </span>
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <button
                            onClick={() => onInspectOrder(o)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                            title="Inspect Order Details"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
