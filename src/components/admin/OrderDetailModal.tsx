import { useState } from "react";
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "./types";
import { resolveProductImage } from "../../utils/image";
import { WhatsAppIcon } from "../WhatsAppButton";
import {
  X,
  Truck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  User,
  Printer,
  Trash2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface OrderDetailModalProps {
  order: any | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: string, courier?: string, tracking?: string) => Promise<void> | void;
  onUpdatePaymentStatus?: (orderId: string, paymentStatus: "paid" | "rejected") => Promise<void> | void;
  onDeleteOrder: (orderId: string) => void;
}

const COURIER_OPTIONS = [
  "TCS Express",
  "Leopards Courier",
  "Trax Logistics",
  "PostEx Courier",
  "M&P Express Logistics",
  "Call Courier",
  "Rider Delivery (Local Hangu/Kohat)",
];

export default function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
  onUpdatePaymentStatus,
  onDeleteOrder,
}: OrderDetailModalProps) {
  if (!order) return null;

  const [courierName, setCourierName] = useState<string>(order.courierName || "TCS Express");
  const [trackingNumber, setTrackingNumber] = useState<string>(order.trackingNumber || "");
  const [updating, setUpdating] = useState<boolean>(false);
  const [paymentActionLoading, setPaymentActionLoading] = useState<boolean>(false);
  const [screenshotModalOpen, setScreenshotModalOpen] = useState<boolean>(false);

  const statusMeta = ORDER_STATUS_COLORS[order.status] || {
    bg: "bg-zinc-800",
    text: "text-zinc-300",
    border: "border-zinc-700",
  };

  const paymentMeta = PAYMENT_STATUS_COLORS[order.paymentStatus || "pending_verification"] || {
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    border: "border-amber-500/30",
    label: order.paymentStatus || "Pending",
  };

  const isPaid = order.paymentStatus === "paid";

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === "confirmed" && !isPaid) {
      alert("Cannot confirm this order: Payment has not been marked as 'Paid' yet. Please verify payment first.");
      return;
    }
    setUpdating(true);
    try {
      await onUpdateStatus(order.orderId, newStatus, courierName, trackingNumber);
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentChange = async (nextPaymentStatus: "paid" | "rejected") => {
    if (!onUpdatePaymentStatus) return;
    setPaymentActionLoading(true);
    try {
      await onUpdatePaymentStatus(order.orderId, nextPaymentStatus);
    } catch (err: any) {
      alert(err?.message || "Failed to update payment status.");
    } finally {
      setPaymentActionLoading(false);
    }
  };

  const handleWhatsAppCustomer = () => {
    const custName = order.customer?.name || "Customer";
    const paymentStateText = isPaid
      ? "✅ Payment Verified & Received via EasyPaisa"
      : order.paymentStatus === "rejected"
      ? "❌ Payment Verification Failed (Please resend proof)"
      : "⏳ Payment Awaiting Verification";

    const msg =
      `Assalam-o-Alaikum *${custName}*! 👟\n\n` +
      `Thank you for shopping at *Hangu Branded Shoes*.\n\n` +
      `*Order ID:* #${order.orderId}\n` +
      `*Order Status:* ${order.status.toUpperCase()}\n` +
      `*Payment Status:* ${paymentStateText}\n` +
      `*EasyPaisa TID:* ${order.transactionId || "N/A"}\n` +
      (order.courierName ? `*Courier:* ${order.courierName}\n` : "") +
      (order.trackingNumber ? `*Tracking Number:* ${order.trackingNumber}\n` : "") +
      `*Total Amount:* Rs. ${order.totalAmount?.toLocaleString()}\n\n` +
      `You can track your order anytime at: www.hangubrandedshoes.com/track\n\n` +
      `Let us know if you have any questions!`;

    const cleanPhone = (order.customer?.phone || "").replace(/[^0-9]/g, "");
    const waUrl = cleanPhone.startsWith("0")
      ? `https://wa.me/92${cleanPhone.slice(1)}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="glass p-6 md:p-8 rounded-3xl max-w-2xl w-full border border-white/15 bg-zinc-950/95 shadow-2xl relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
            >
              {order.status}
            </span>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white font-mono">
                Order #{order.orderId}
              </h2>
              <span className="text-xs text-zinc-400 block mt-0.5">
                Placed on {new Date(order.createdAt || Date.now()).toLocaleString("en-PK")}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            aria-label="Close Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Customer Information & Delivery Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gold block mb-2">
              Customer Details
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-white font-semibold">
                <User size={14} className="text-zinc-400 shrink-0" />
                <span>{order.customer?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Phone size={14} className="text-zinc-400 shrink-0" />
                <span className="font-mono">{order.customer?.phone}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gold block mb-2">
              Delivery Destination
            </span>
            <div className="space-y-1.5 text-xs text-zinc-300">
              <div className="flex items-center gap-2 text-white font-semibold">
                <MapPin size={14} className="text-zinc-400 shrink-0" />
                <span>{order.customer?.city}</span>
              </div>
              <p className="text-[11px] text-zinc-400 pl-5 leading-relaxed">
                {order.customer?.address}
              </p>
            </div>
          </div>
        </div>

        {/* EasyPaisa Payment Verification Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gold flex items-center gap-1.5">
              <ShieldCheck size={14} /> EasyPaisa Payment Verification
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase border ${paymentMeta.bg} ${paymentMeta.text} ${paymentMeta.border}`}
            >
              {paymentMeta.label}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-zinc-400 block text-[11px]">Submitted EasyPaisa TID:</span>
              <strong className="text-white font-mono text-sm block mt-0.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 w-fit">
                {order.transactionId || "No TID Provided"}
              </strong>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  disabled={paymentActionLoading || isPaid}
                  onClick={() => handlePaymentChange("paid")}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-green-600 hover:bg-green-500 text-white disabled:opacity-40 flex items-center gap-1.5 transition-all shadow-md"
                >
                  <CheckCircle2 size={14} />
                  <span>Mark as Paid</span>
                </button>

                <button
                  type="button"
                  disabled={paymentActionLoading || order.paymentStatus === "rejected"}
                  onClick={() => handlePaymentChange("rejected")}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-600/80 hover:bg-red-500 text-white disabled:opacity-40 flex items-center gap-1.5 transition-all"
                >
                  <XCircle size={14} />
                  <span>Reject Payment</span>
                </button>
              </div>
            </div>

            <div>
              <span className="text-zinc-400 block text-[11px] mb-1">Payment Receipt Screenshot:</span>
              {order.paymentScreenshot ? (
                <div className="relative group w-32 h-24 rounded-xl overflow-hidden border border-white/20 bg-zinc-900 cursor-pointer">
                  <img
                    src={order.paymentScreenshot}
                    alt="Payment Screenshot"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onClick={() => setScreenshotModalOpen(true)}
                  />
                  <div
                    onClick={() => setScreenshotModalOpen(true)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[11px] font-bold transition-opacity"
                  >
                    View Full
                  </div>
                </div>
              ) : (
                <p className="text-zinc-500 text-xs italic bg-white/5 p-3 rounded-xl border border-white/5">
                  No payment screenshot uploaded. Customer should send receipt via WhatsApp.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Ordered Footwear Items */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
            Ordered Items ({order.items?.length || 1})
          </h4>
          <div className="divide-y divide-white/10 border border-white/10 rounded-2xl overflow-hidden bg-black/40">
            {(order.items || []).map((it: any, i: number) => (
              <div key={i} className="p-3.5 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={resolveProductImage(it.img)}
                    alt={it.name}
                    className="w-12 h-12 rounded-xl object-cover bg-zinc-900 border border-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <b className="text-white block truncate">{it.name}</b>
                    <span className="text-zinc-400 text-[11px]">
                      Size: <b className="text-brand-gold font-mono">{it.size}</b> | Qty: {it.quantity}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <b className="text-brand-gold font-mono block">
                    Rs. {(it.total || it.price * it.quantity || 0).toLocaleString()}
                  </b>
                  <span className="text-[10px] text-zinc-500">
                    Rs. {(it.price || 0).toLocaleString()} each
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing breakdown */}
          <div className="mt-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal:</span>
              <span className="font-mono">Rs. {(order.subtotal || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Delivery Shipping:</span>
              <span className="font-mono">
                {order.shippingFee === 0 ? "FREE" : `Rs. ${order.shippingFee}`}
              </span>
            </div>
            <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
              <span>Total Payable (EasyPaisa):</span>
              <span className="text-brand-gold font-mono font-extrabold text-base">
                Rs. {(order.totalAmount || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Courier & Tracking Assignment */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gold block mb-3 flex items-center gap-1.5">
            <Truck size={14} /> Courier & Shipping Logistics
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                Select Courier Company
              </label>
              <select
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-gold"
              >
                {COURIER_OPTIONS.map((c) => (
                  <option key={c} value={c} className="bg-zinc-950 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                Airway Bill / Tracking Code
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. 123456789"
                className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-brand-gold"
              />
            </div>
          </div>
        </div>

        {/* Status Actions */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Update Order Status
            </span>
            {!isPaid && (
              <span className="text-[11px] text-amber-400 flex items-center gap-1 font-medium">
                <AlertTriangle size={13} /> Order can only be confirmed after payment is marked "Paid"
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {["confirmed", "dispatched", "delivered", "cancelled"].map((st) => {
              const cannotConfirm = st === "confirmed" && !isPaid;
              return (
                <button
                  key={st}
                  disabled={updating || order.status === st || cannotConfirm}
                  onClick={() => handleStatusChange(st)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                    order.status === st
                      ? "bg-white/20 text-white cursor-default"
                      : cannotConfirm
                      ? "bg-white/5 text-zinc-600 border border-white/5 cursor-not-allowed opacity-50"
                      : "bg-white/5 hover:bg-white/15 text-zinc-300 border border-white/10"
                  }`}
                  title={cannotConfirm ? "Must mark payment as Paid first" : undefined}
                >
                  Mark {st}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppCustomer}
              className="btn py-2.5 px-4 text-xs font-bold bg-[#25d366] hover:bg-[#20ba59] text-black inline-flex items-center gap-1.5 shadow-glow"
            >
              <WhatsAppIcon size={16} color="#000" />
              <span>WhatsApp Customer</span>
            </button>

            <button
              onClick={() => window.print()}
              className="btn ghost py-2.5 px-3.5 text-xs text-zinc-300 hover:text-white inline-flex items-center gap-1.5"
            >
              <Printer size={14} />
              <span>Print Invoice</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (confirm(`Delete order #${order.orderId}? This cannot be undone.`)) {
                onDeleteOrder(order.orderId);
                onClose();
              }
            }}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 p-2"
          >
            <Trash2 size={14} />
            <span>Delete Order</span>
          </button>
        </div>
      </div>

      {/* Full Screenshot Modal Preview */}
      {screenshotModalOpen && order.paymentScreenshot && (
        <div
          className="fixed inset-0 z-[130] bg-black/90 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setScreenshotModalOpen(false)}
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-zinc-950 p-2 rounded-2xl border border-white/20">
            <img
              src={order.paymentScreenshot}
              alt="Payment Screenshot Full Preview"
              className="max-h-[85vh] w-auto rounded-xl object-contain"
            />
            <button
              onClick={() => setScreenshotModalOpen(false)}
              className="absolute top-4 right-4 bg-black/80 hover:bg-black text-white p-2 rounded-full"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
