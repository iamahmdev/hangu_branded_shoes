import { useState } from "react";
import { ORDER_STATUS_COLORS } from "./types";
import { resolveProductImage } from "../../utils/image";
import { Search, Eye, Trash2, Truck, Check, RefreshCw } from "lucide-react";

interface OrdersTabProps {
  orders: any[];
  filterStatus: string;
  onFilterChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectOrder: (order: any) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
  onDeleteOrder: (orderId: string) => void;
  isLoading?: boolean;
}

const STATUS_OPTIONS = [
  "all",
  "pending",
  "confirmed",
  "processing",
  "dispatched",
  "delivered",
  "cancelled",
];

export default function OrdersTab({
  orders,
  filterStatus,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onSelectOrder,
  onUpdateStatus,
  onDeleteOrder,
  isLoading = false,
}: OrdersTabProps) {
  const [quickStatusLoading, setQuickStatusLoading] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const idMatch = o.orderId?.toLowerCase().includes(q);
    const nameMatch = o.customer?.name?.toLowerCase().includes(q);
    const phoneMatch = o.customer?.phone?.includes(q);
    const cityMatch = o.customer?.city?.toLowerCase().includes(q);
    return idMatch || nameMatch || phoneMatch || cityMatch;
  });

  const handleQuickStatus = async (orderId: string, nextStatus: string) => {
    setQuickStatusLoading(orderId);
    try {
      await onUpdateStatus(orderId, nextStatus);
    } finally {
      setQuickStatusLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Search & Status Filters Bar */}
      <div className="glass p-4 rounded-3xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {STATUS_OPTIONS.map((st) => {
            const count =
              st === "all"
                ? orders.length
                : orders.filter((o) => o.status === st).length;
            const isSelected = filterStatus === st;
            return (
              <button
                key={st}
                onClick={() => onFilterChange(st)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-brand-red text-white shadow-glow"
                    : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{st}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-black/40 text-white" : "bg-white/10 text-zinc-300"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative min-w-[260px] flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search order ID, customer, phone, city..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-brand-gold transition-colors"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-white/5 uppercase text-zinc-400 text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Delivery City & Address</th>
                <th className="p-4">Footwear Items</th>
                <th className="p-4">Total & Payment</th>
                <th className="p-4">Status & Logistics</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-zinc-400">
                    <RefreshCw className="animate-spin inline mr-2 text-brand-gold" size={16} />
                    Loading orders from live MongoDB Atlas...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-zinc-500">
                    {searchQuery
                      ? `No orders matching "${searchQuery}" in this view.`
                      : `No ${filterStatus === "all" ? "" : filterStatus} orders found.`}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord: any) => {
                  const statusMeta = ORDER_STATUS_COLORS[ord.status] || {
                    bg: "bg-zinc-800",
                    text: "text-zinc-300",
                    border: "border-zinc-700",
                  };
                  const dateStr = ord.createdAt
                    ? new Date(ord.createdAt).toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Recently";

                  return (
                    <tr key={ord.orderId} className="hover:bg-white/5 transition-colors">
                      {/* Order ID & Date */}
                      <td className="p-4">
                        <b className="text-white font-mono text-sm block">{ord.orderId}</b>
                        <span className="text-[11px] text-zinc-400 block mt-0.5">{dateStr}</span>
                      </td>

                      {/* Customer Details */}
                      <td className="p-4">
                        <b className="text-white text-xs block">{ord.customer?.name}</b>
                        <span className="text-brand-gold font-mono text-[11px] block mt-0.5">
                          {ord.customer?.phone}
                        </span>
                      </td>

                      {/* City & Address */}
                      <td className="p-4 max-w-[200px]">
                        <span className="text-white font-semibold text-xs block">
                          📍 {ord.customer?.city}
                        </span>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5" title={ord.customer?.address}>
                          {ord.customer?.address}
                        </p>
                      </td>

                      {/* Footwear Items */}
                      <td className="p-4">
                        <div className="flex -space-x-2">
                          {(ord.items || []).map((it: any, i: number) => (
                            <img
                              key={i}
                              src={resolveProductImage(it.img)}
                              alt={it.name}
                              title={`${it.name} (Size ${it.size}) x${it.quantity}`}
                              className="w-8 h-8 rounded-full object-cover border-2 border-zinc-950 bg-zinc-900"
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-zinc-400 mt-1 block">
                          {ord.items?.length || 1} shoe{ord.items?.length > 1 ? "s" : ""}
                        </span>
                      </td>

                      {/* Total & Payment */}
                      <td className="p-4">
                        <b className="text-brand-gold font-mono text-sm block font-bold">
                          Rs. {(ord.totalAmount || 0).toLocaleString()}
                        </b>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-white/5 text-zinc-300 border border-white/10">
                          {ord.paymentMethod?.toUpperCase() || "COD"}
                        </span>
                        {ord.transactionId && (
                          <span className="text-[10px] text-cyan-400 font-mono block mt-0.5">
                            TID: {ord.transactionId}
                          </span>
                        )}
                      </td>

                      {/* Status & Logistics */}
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                        >
                          {ord.status}
                        </span>
                        {ord.courierName && (
                          <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-1">
                            <Truck size={12} className="text-brand-gold" />
                            <span>{ord.courierName}</span>
                          </div>
                        )}
                        {ord.trackingNumber && (
                          <span className="text-[10px] text-brand-gold font-mono block">
                            TRK: {ord.trackingNumber}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectOrder(ord)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-brand-gold/15 text-zinc-300 hover:text-brand-gold border border-white/10 transition-colors"
                            title="Inspect Order Details & Logistics"
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            onClick={() => onDeleteOrder(ord.orderId)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/15 text-zinc-400 hover:text-red-400 border border-white/10 transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
