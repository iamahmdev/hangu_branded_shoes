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
  { id: "pending_verification", label: "JazzCash Verification" },
  { id: "paid", label: "Paid" },
  { id: "rejected", label: "Rejected" },
];

const PAYMENT_METHOD_OPTIONS = [
  { id: "all", label: "All Methods" },
  { id: "cod", label: "Cash on Delivery (COD)" },
  { id: "jazzcash", label: "JazzCash" },
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
      {/* Search & Filters Bar Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search orders by customer name, phone, Order ID, city..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white transition-colors"
          />
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Clean Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Order Status Select */}
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
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
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Payment Methods</option>
              <option value="cod">Cash on Delivery (COD)</option>
              <option value="jazzcash">JazzCash</option>
            </select>
          )}

          {/* Payment Status Select */}
          {onPaymentFilterChange && (
            <select
              value={paymentFilterStatus}
              onChange={(e) => onPaymentFilterChange(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Payment Statuses</option>
              <option value="cod_pending">COD Pending</option>
              <option value="pending_verification">JazzCash Verification</option>
              <option value="paid">Paid</option>
              <option value="rejected">Rejected</option>
            </select>
          )}
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 uppercase text-slate-500 text-[10px] tracking-wider border-b border-slate-200">
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
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <RefreshCw className="animate-spin inline mr-2 text-emerald-600" size={16} />
                    Loading orders from live MongoDB Atlas...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    {searchQuery
                      ? `No orders matching "${searchQuery}".`
                      : "No orders found in this view."}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord: any) => {
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
                    <tr key={ord.orderId} className="hover:bg-slate-50/80 transition-colors">
                      {/* Order ID & Date */}
                      <td className="p-4">
                        <b className="text-slate-900 font-mono text-sm block">{ord.orderId}</b>
                        <span className="text-[11px] text-slate-400 block mt-0.5">{dateStr}</span>
                      </td>

                      {/* Customer Details */}
                      <td className="p-4">
                        <b className="text-slate-900 text-xs block">{ord.customer?.name}</b>
                        <span className="text-slate-500 font-mono text-[11px] block mt-0.5">
                          {ord.customer?.phone}
                        </span>
                      </td>

                      {/* City & Address */}
                      <td className="p-4 max-w-[200px]">
                        <span className="text-slate-900 font-semibold text-xs block">
                          📍 {ord.customer?.city}
                        </span>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5" title={ord.customer?.address}>
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
                              className="w-8 h-8 rounded-full object-cover border-2 border-white bg-slate-100 shadow-xs"
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {ord.items?.length || 1} shoe{ord.items?.length > 1 ? "s" : ""}
                        </span>
                      </td>

                      {/* Total & Payment Verification Status */}
                      <td className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <b className="text-slate-900 font-mono text-sm font-bold">
                            Rs. {(ord.totalAmount || 0).toLocaleString()}
                          </b>
                          {ord.paymentMethod === "cod" ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                              COD
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                              EP
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                              ord.paymentStatus === "paid"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : ord.paymentStatus === "rejected"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {ord.paymentStatus || "Pending"}
                          </span>
                          {ord.paymentScreenshot && (
                            <span
                              title="Payment receipt attached"
                              className="inline-flex items-center text-blue-600"
                            >
                              <ImageIcon size={12} />
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block mt-1">
                          {ord.paymentMethod === "cod" ? (
                            <span className="text-slate-500">Cash on Delivery</span>
                          ) : (
                            <>
                              TID: <strong className="text-slate-700">{ord.transactionId || "—"}</strong>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Order Status & Logistics */}
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                            ord.status === "delivered"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : ord.status === "confirmed"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : ord.status === "dispatched"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : ord.status === "cancelled"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-sky-50 text-sky-700 border-sky-200"
                          }`}
                        >
                          {ord.status.replace("_", " ")}
                        </span>
                        {ord.courierName && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                            <Truck size={12} className="text-slate-400" />
                            <span>{ord.courierName}</span>
                          </div>
                        )}
                        {ord.trackingNumber && (
                          <span className="text-[10px] text-emerald-700 font-mono block">
                            TRK: {ord.trackingNumber}
                          </span>
                        )}
                        {ord.deliveryNote && (
                          <span className="text-[10px] text-slate-400 italic block mt-0.5" title={ord.deliveryNote}>
                            📝 {ord.deliveryNote}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectOrder(ord)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 transition-colors"
                            title="Inspect Order Details & Verify Payment"
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            onClick={() => onDeleteOrder(ord.orderId)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 transition-colors"
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
