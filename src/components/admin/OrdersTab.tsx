import { useState } from "react";
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "./types";
import { resolveProductImage } from "../../utils/image";
import { Search, Eye, Trash2, Truck, RefreshCw, Image as ImageIcon, ShieldCheck } from "lucide-react";

interface OrdersTabProps {
  orders: any[];
  filterStatus: string;
  onFilterChange: (status: string) => void;
  paymentFilterStatus?: string;
  onPaymentFilterChange?: (status: string) => void;
  paymentMethodFilter?: string;
  onPaymentMethodFilterChange?: (method: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectOrder: (order: any) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
  onDeleteOrder: (orderId: string) => void;
  isLoading?: boolean;
}

const ORDER_STATUS_OPTIONS = [
  "all",
  "awaiting_confirmation",
  "pending",
  "confirmed",
  "dispatched",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUS_OPTIONS = [
  { id: "all", label: "All Payments" },
  { id: "cod_pending", label: "COD Pending" },
  { id: "pending_verification", label: "EasyPaisa Verification" },
  { id: "paid", label: "Paid" },
  { id: "rejected", label: "Rejected" },
];

const PAYMENT_METHOD_OPTIONS = [
  { id: "all", label: "All Methods" },
  { id: "cod", label: "Cash on Delivery (COD)" },
  { id: "easypaisa", label: "EasyPaisa" },
];

export default function OrdersTab({
  orders,
  filterStatus,
  onFilterChange,
  paymentFilterStatus = "all",
  onPaymentFilterChange,
  paymentMethodFilter = "all",
  onPaymentMethodFilterChange,
  searchQuery,
  onSearchChange,
  onSelectOrder,
  onUpdateStatus,
  onDeleteOrder,
  isLoading = false,
}: OrdersTabProps) {
  const filteredOrders = orders.filter((o) => {
    // Payment method filter
    if (paymentMethodFilter !== "all" && (o.paymentMethod || "cod") !== paymentMethodFilter) {
      return false;
    }
    // Payment status filter
    if (paymentFilterStatus !== "all" && (o.paymentStatus || "cod_pending") !== paymentFilterStatus) {
      return false;
    }
    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const idMatch = o.orderId?.toLowerCase().includes(q);
    const nameMatch = o.customer?.name?.toLowerCase().includes(q);
    const phoneMatch = o.customer?.phone?.includes(q);
    const cityMatch = o.customer?.city?.toLowerCase().includes(q);
    const tidMatch = o.transactionId?.toLowerCase().includes(q);
    const methodMatch = (o.paymentMethod || "").toLowerCase().includes(q);
    return idMatch || nameMatch || phoneMatch || cityMatch || tidMatch || methodMatch;
  });

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Search & Filters Bar */}
      <div className="bg-[#121218] p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search orders by customer name, phone, Order ID, city..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-brand-gold transition-colors"
          />
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        </div>

        {/* Clean Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Order Status Select */}
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value)}
            className="bg-[#181824] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-gold cursor-pointer"
          >
            <option value="all">All Orders ({orders.length})</option>
            <option value="awaiting_confirmation">Awaiting Confirmation</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Payment Method Select */}
          {onPaymentMethodFilterChange && (
            <select
              value={paymentMethodFilter}
              onChange={(e) => onPaymentMethodFilterChange(e.target.value)}
              className="bg-[#181824] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-gold cursor-pointer"
            >
              <option value="all">All Payment Methods</option>
              <option value="cod">Cash on Delivery (COD)</option>
              <option value="easypaisa">EasyPaisa</option>
            </select>
          )}

          {/* Payment Status Select */}
          {onPaymentFilterChange && (
            <select
              value={paymentFilterStatus}
              onChange={(e) => onPaymentFilterChange(e.target.value)}
              className="bg-[#181824] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-gold cursor-pointer"
            >
              <option value="all">All Payment Statuses</option>
              <option value="cod_pending">COD Pending</option>
              <option value="pending_verification">EasyPaisa Verification</option>
              <option value="paid">Paid</option>
              <option value="rejected">Rejected</option>
            </select>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-white/5 uppercase text-zinc-400 text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="p-4 whitespace-nowrap">Order ID & Date</th>
                <th className="p-4 whitespace-nowrap">Customer</th>
                <th className="p-4 whitespace-nowrap">City & Address</th>
                <th className="p-4 whitespace-nowrap">Items</th>
                <th className="p-4 whitespace-nowrap">Amount & Method</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 whitespace-nowrap text-right">Actions</th>
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
                      ? `No orders matching "${searchQuery}".`
                      : "No orders found in this view."}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord: any) => {
                  const statusMeta = ORDER_STATUS_COLORS[ord.status] || {
                    bg: "bg-zinc-800",
                    text: "text-zinc-300",
                    border: "border-zinc-700",
                  };
                  const paymentMeta = PAYMENT_STATUS_COLORS[ord.paymentStatus || "pending_verification"] || {
                    bg: "bg-amber-500/15",
                    text: "text-amber-400",
                    border: "border-amber-500/30",
                    label: ord.paymentStatus || "Pending",
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

                      {/* Total & Payment Verification Status */}
                      <td className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <b className="text-brand-gold font-mono text-sm font-bold">
                            Rs. {(ord.totalAmount || 0).toLocaleString()}
                          </b>
                          {ord.paymentMethod === "cod" ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              COD
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-green-500/20 text-green-300 border border-green-500/30">
                              EP
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${paymentMeta.bg} ${paymentMeta.text} ${paymentMeta.border}`}
                          >
                            {paymentMeta.label}
                          </span>
                          {ord.paymentScreenshot && (
                            <span
                              title="Payment receipt attached"
                              className="inline-flex items-center text-cyan-400"
                            >
                              <ImageIcon size={12} />
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono block mt-1">
                          {ord.paymentMethod === "cod" ? (
                            <span className="text-amber-200/80">Cash on Delivery</span>
                          ) : (
                            <>
                              TID: <strong className="text-white">{ord.transactionId || "—"}</strong>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Order Status & Logistics */}
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                        >
                          {ord.status.replace("_", " ")}
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
                        {ord.deliveryNote && (
                          <span className="text-[10px] text-zinc-400 italic block mt-0.5" title={ord.deliveryNote}>
                            📝 {ord.deliveryNote}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectOrder(ord)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-brand-gold/15 text-zinc-300 hover:text-brand-gold border border-white/10 transition-colors"
                            title="Inspect Order Details & Verify Payment"
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
