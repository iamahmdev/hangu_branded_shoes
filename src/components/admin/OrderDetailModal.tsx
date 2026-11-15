import { useState } from "react";
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "./types";
import { resolveProductImage } from "../../utils/image";
import { WhatsAppIcon } from "../WhatsAppButton";
import {
  X,
  ArrowLeft,
  Truck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MapPin,
  Phone,
  User,
  Printer,
  Trash2,
  ShieldCheck,
  Banknote,
  Smartphone,
  ShieldAlert,
} from "lucide-react";

interface OrderDetailModalProps {
  order: any | null;
  onClose: () => void;
  onUpdateStatus: (
    orderId: string,
    status: string,
    courier?: string,
    tracking?: string,
    deliveryNote?: string
  ) => Promise<void> | void;
  onUpdatePaymentStatus?: (orderId: string, paymentStatus: "paid" | "rejected") => Promise<void> | void;
  onMarkCashCollected?: (orderId: string, note?: string) => Promise<void> | void;
  onMarkFakeOrder?: (orderId: string, blockPhone?: boolean, reason?: string) => Promise<void> | void;
  onDeleteOrder: (orderId: string) => void;
}

const COURIER_OPTIONS = [
  "None / Local Delivery",
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
  onMarkCashCollected,
  onMarkFakeOrder,
  onDeleteOrder,
}: OrderDetailModalProps) {
  if (!order) return null;

  const isCod = (order.paymentMethod || "cod") === "cod";
  const [courierName, setCourierName] = useState<string>(order.courierName || "");
  const [trackingNumber, setTrackingNumber] = useState<string>(order.trackingNumber || "");
  const [deliveryNote, setDeliveryNote] = useState<string>(order.deliveryNote || "");
  const [updating, setUpdating] = useState<boolean>(false);
  const [paymentActionLoading, setPaymentActionLoading] = useState<boolean>(false);
  const [cashCollectedLoading, setCashCollectedLoading] = useState<boolean>(false);
  const [fakeModalOpen, setFakeModalOpen] = useState<boolean>(false);
  const [blockPhoneChecked, setBlockPhoneChecked] = useState<boolean>(true);
  const [fakeReason, setFakeReason] = useState<string>("Customer unreachable / fake order");
  const [fakeActionLoading, setFakeActionLoading] = useState<boolean>(false);
  const [screenshotModalOpen, setScreenshotModalOpen] = useState<boolean>(false);

  const statusMeta = ORDER_STATUS_COLORS[order.status] || {
    bg: "bg-zinc-800",
    text: "text-zinc-300",
    border: "border-zinc-700",
  };

  const paymentMeta = PAYMENT_STATUS_COLORS[order.paymentStatus || (isCod ? "cod_pending" : "pending_verification")] || {
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    border: "border-amber-500/30",
    label: order.paymentStatus || "Pending",
  };

  const isPaid = order.paymentStatus === "paid";
  const canConfirm = isCod ? true : isPaid;

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === "confirmed" && !canConfirm) {
      alert("Cannot confirm this JazzCash order: Payment has not been marked as 'Paid' yet. Please verify payment first.");
      return;
    }
    setUpdating(true);
    try {
      await onUpdateStatus(order.orderId, newStatus, courierName, trackingNumber, deliveryNote);
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

  const handleMarkCashCollected = async () => {
    if (!onMarkCashCollected) return;
    if (!confirm(`Mark Cash of Rs. ${(order.totalAmount || 0).toLocaleString()} as Collected for Order #${order.orderId}? This will set payment to Paid and order to Delivered.`)) {
      return;
    }
    setCashCollectedLoading(true);
    try {
      await onMarkCashCollected(order.orderId, "Cash collected by shop/rider");
    } catch (err: any) {
      alert(err?.message || "Failed to mark cash collected.");
    } finally {
      setCashCollectedLoading(false);
    }
  };

  const handleConfirmFakeOrder = async () => {
    if (!onMarkFakeOrder) return;
    setFakeActionLoading(true);
    try {
      await onMarkFakeOrder(order.orderId, blockPhoneChecked, fakeReason);
      setFakeModalOpen(false);
      onClose();
    } catch (err: any) {
      alert(err?.message || "Failed to mark fake order.");
    } finally {
      setFakeActionLoading(false);
    }
  };

  const handleWhatsAppCustomer = () => {
    const custName = order.customer?.name || "Customer";
    let paymentStateText = "";

    if (isCod) {
      paymentStateText = isPaid
        ? "✅ Cash Collected & Paid"
        : "💵 Cash on Delivery (Pay Rs. " + (order.totalAmount || 0).toLocaleString() + " upon delivery)";
    } else {
      paymentStateText = isPaid
        ? "✅ Payment Verified & Received via JazzCash"
        : order.paymentStatus === "rejected"
        ? "❌ Payment Verification Failed (Please resend proof)"
        : "⏳ Payment Awaiting Verification";
    }

    const msg = isCod
      ? `Hello *${custName}*! 👟\n\n` +
        `Thank you for ordering at *Hangu Branded Shoes*.\n\n` +
        `*Order ID:* #${order.orderId}\n` +
        `*Order Status:* ${(order.status || "").replace("_", " ").toUpperCase()}\n` +
        `*Payment Method:* Cash on Delivery (COD)\n` +
        `*Amount to Pay Rider:* Rs. ${(order.totalAmount || 0).toLocaleString()}\n` +
        (order.deliveryNote ? `*Delivery Note:* ${order.deliveryNote}\n` : "") +
        (order.courierName ? `*Courier:* ${order.courierName}\n` : "") +
        (order.trackingNumber ? `*Tracking Number:* ${order.trackingNumber}\n` : "") +
        `\nPlease keep the exact cash ready when the rider arrives.\n` +
        `You can track your order anytime at: www.hangubrandedshoes.com/track\n\n` +
        `Let us know if you need to confirm or adjust anything!`
      : `Hello *${custName}*! 👟\n\n` +
        `Thank you for shopping at *Hangu Branded Shoes*.\n\n` +
        `*Order ID:* #${order.orderId}\n` +
        `*Order Status:* ${(order.status || "").replace("_", " ").toUpperCase()}\n` +
        `*Payment Status:* ${paymentStateText}\n` +
        `*JazzCash TID:* ${order.transactionId || "N/A"}\n` +
        (order.deliveryNote ? `*Delivery Note:* ${order.deliveryNote}\n` : "") +
        (order.courierName ? `*Courier:* ${order.courierName}\n` : "") +
        (order.trackingNumber ? `*Tracking Number:* ${order.trackingNumber}\n` : "") +
        `*Total Amount:* Rs. ${(order.totalAmount || 0).toLocaleString()}\n\n` +
        `You can track your order anytime at: www.hangubrandedshoes.com/track\n\n` +
        `Let us know if you have any questions!`;

    const cleanPhone = (order.customer?.phone || "").replace(/[^0-9]/g, "");
    const waUrl = cleanPhone.startsWith("0")
      ? `https://wa.me/92${cleanPhone.slice(1)}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white p-5 sm:p-7 md:p-8 rounded-3xl max-w-2xl w-full border border-slate-200/90 shadow-2xl relative my-6 text-slate-800">
        {/* Top Header with Prominent Back Button */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black active:scale-98 text-white font-bold text-xs transition-all cursor-pointer shadow-sm group shrink-0"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>← Back to Orders</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
            >
              {order.status.replace("_", " ")}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Close"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Order Identifier Strip */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-5 px-1 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono">
              Order #{order.orderId}
            </h2>
            {isCod ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                <Banknote size={12} /> Cash on Delivery
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                <Smartphone size={12} /> JazzCash
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-500">
            Placed on {new Date(order.createdAt || Date.now()).toLocaleString("en-PK")}
          </span>
        </div>

        {/* Customer Information & Delivery Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Customer Details
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <User size={14} className="text-slate-400 shrink-0" />
                <span>{order.customer?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Phone size={14} className="text-slate-400 shrink-0" />
                <span className="font-mono font-bold text-emerald-700">{order.customer?.phone}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Delivery Destination
            </span>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <MapPin size={14} className="text-slate-400 shrink-0" />
                <span>{order.customer?.city}</span>
              </div>
              <p className="text-[11px] text-slate-600 pl-5 leading-relaxed">
                {order.customer?.address}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Verification / Details Card */}
        {isCod ? (
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <Banknote size={15} /> Cash on Delivery (COD) Details
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${paymentMeta.bg} ${paymentMeta.text} ${paymentMeta.border}`}
              >
                {paymentMeta.label}
              </span>
            </div>

            <div className="text-xs space-y-2">
              <p className="text-slate-700 leading-relaxed">
                Rider will collect exact cash of{" "}
                <strong className="text-slate-900 font-mono font-bold text-sm">
                  Rs. {(order.totalAmount || 0).toLocaleString()}
                </strong>{" "}
                upon delivery at customer's doorstep.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2">
                {!isPaid && (
                  <button
                    type="button"
                    disabled={cashCollectedLoading}
                    onClick={handleMarkCashCollected}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <CheckCircle2 size={14} />
                    <span>{cashCollectedLoading ? "Updating..." : "Mark Cash Collected (Delivered)"}</span>
                  </button>
                )}

                {order.status !== "cancelled" && (
                  <button
                    type="button"
                    onClick={() => setFakeModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1.5 transition-all"
                  >
                    <ShieldAlert size={14} />
                    <span>Mark as Fake / Unreachable</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" /> JazzCash Payment Verification
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${paymentMeta.bg} ${paymentMeta.text} ${paymentMeta.border}`}
              >
                {paymentMeta.label}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Submitted JazzCash TID:</span>
                <strong className="text-slate-900 font-mono text-sm block mt-0.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 w-fit">
                  {order.transactionId || "No TID Provided"}
                </strong>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={paymentActionLoading || isPaid}
                    onClick={() => handlePaymentChange("paid")}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <CheckCircle2 size={14} />
                    <span>Mark as Paid</span>
                  </button>

                  <button
                    type="button"
                    disabled={paymentActionLoading || order.paymentStatus === "rejected"}
                    onClick={() => handlePaymentChange("rejected")}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 disabled:opacity-40 flex items-center gap-1.5 transition-all"
                  >
                    <XCircle size={14} />
                    <span>Reject Payment</span>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] mb-1">Payment Receipt:</span>
                {order.paymentScreenshot ? (
                  <div className="relative group w-32 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer">
                    <img
                      src={order.paymentScreenshot}
                      alt="Payment Screenshot"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      onClick={() => setScreenshotModalOpen(true)}
                    />
                    <div
                      onClick={() => setScreenshotModalOpen(true)}
                      className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[11px] font-bold transition-opacity"
                    >
                      View Full
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs italic bg-white p-2.5 rounded-xl border border-slate-200">
                    No receipt uploaded. Customer can send receipt via WhatsApp.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Ordered Footwear Items */}
        <div className="mb-5">
          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Ordered Footwear ({order.items?.length || 1})
          </h4>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/40">
            {(order.items || []).map((it: any, i: number) => (
              <div key={i} className="p-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={resolveProductImage(it.img)}
                    alt={it.name}
                    className="w-12 h-12 rounded-xl object-contain bg-white border border-slate-200 shrink-0 p-1"
                  />
                  <div className="min-w-0">
                    <b className="text-slate-900 block truncate">{it.name}</b>
                    <span className="text-slate-500 text-[11px]">
                      Size: <b className="text-emerald-700 font-mono">{it.size}</b> | Qty: {it.quantity}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <b className="text-slate-900 font-mono block">
                    Rs. {(it.total || it.price * it.quantity || 0).toLocaleString()}
                  </b>
                  <span className="text-[10px] text-slate-400">
                    Rs. {(it.price || 0).toLocaleString()} each
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing breakdown */}
          <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono">Rs. {(order.subtotal || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee:</span>
              <span className="font-mono">
                {order.shippingFee === 0 ? "FREE" : `Rs. ${order.shippingFee}`}
              </span>
            </div>
            {isCod && Number(order.codFee) > 0 && (
              <div className="flex justify-between text-amber-700">
                <span>COD Handling Fee:</span>
                <span className="font-mono">Rs. {Number(order.codFee).toLocaleString()}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
              <span>{isCod ? "Cash Due on Delivery:" : "Total Payable (JazzCash):"}</span>
              <span className="text-emerald-700 font-mono font-extrabold text-base">
                Rs. {(order.totalAmount || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Courier & Tracking Logistics (Optional) */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Truck size={14} className="text-emerald-600" /> Shipping & Courier Logistics (Optional)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Courier Company
              </label>
              <select
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
              >
                <option value="">No Courier Assigned / Rider</option>
                {COURIER_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Tracking Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. 123456789"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
              Delivery Note (e.g. "Sent with local rider", "Deliver after 4 PM")
            </label>
            <input
              type="text"
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              placeholder="e.g. Sent with local rider"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Status Actions - Big Simple Buttons Like for a 10-Year-Old! */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
              1-Click Status Update:
            </span>
            {!canConfirm && (
              <span className="text-[11px] text-amber-600 flex items-center gap-1 font-medium">
                <AlertTriangle size={13} /> JazzCash order requires "Paid" status first
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "confirmed", label: "Confirm Order", color: "bg-blue-600 hover:bg-blue-700 text-white" },
              { id: "dispatched", label: "Mark Dispatched", color: "bg-amber-500 hover:bg-amber-600 text-white" },
              { id: "delivered", label: "Delivered & Paid", color: "bg-emerald-600 hover:bg-emerald-700 text-white" },
              { id: "cancelled", label: "Cancel Order", color: "bg-rose-600 hover:bg-rose-700 text-white" },
            ].map((st) => {
              const isCurrent = order.status === st.id;
              const cannotConfirm = st.id === "confirmed" && !canConfirm;
              return (
                <button
                  key={st.id}
                  disabled={updating || isCurrent || cannotConfirm}
                  onClick={() => handleStatusChange(st.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center text-center ${
                    isCurrent
                      ? "bg-slate-200 text-slate-500 cursor-default opacity-60 border border-slate-300"
                      : cannotConfirm
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed opacity-50"
                      : st.color
                  }`}
                  title={cannotConfirm ? "JazzCash order requires payment verification first" : undefined}
                >
                  {isCurrent ? `✓ ${st.label}` : st.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppCustomer}
              className="py-2 px-4 text-xs font-bold bg-[#25d366] hover:bg-[#20ba59] text-white rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <WhatsAppIcon size={16} color="#fff" />
              <span>WhatsApp Customer</span>
            </button>

            <button
              onClick={() => window.print()}
              className="py-2 px-3.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl inline-flex items-center gap-1.5 transition-colors border border-slate-200"
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
            className="text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl flex items-center gap-1 font-semibold transition-colors"
          >
            <Trash2 size={14} />
            <span>Delete Order</span>
          </button>
        </div>

        {/* Large Prominent Bottom Back Button */}
        <div className="pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-bold inline-flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Close & Return to Orders List</span>
          </button>
        </div>
      </div>

      {/* Fake Order & Block Confirmation Modal */}
      {fakeModalOpen && (
        <div className="fixed inset-0 z-[140] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-rose-200 shadow-2xl text-slate-800">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <ShieldAlert size={24} />
              <h3 className="text-base font-bold text-slate-900">Mark as Fake / Unreachable</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              This action will <strong>cancel Order #{order.orderId}</strong> and <strong>immediately restore the shoe stock</strong> to your inventory.
            </p>

            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-600 block mb-1">Reason for cancellation:</label>
              <input
                type="text"
                value={fakeReason}
                onChange={(e) => setFakeReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-rose-400"
              />
            </div>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 cursor-pointer mb-5">
              <input
                type="checkbox"
                checked={blockPhoneChecked}
                onChange={(e) => setBlockPhoneChecked(e.target.checked)}
                className="rounded accent-rose-600"
              />
              <span>
                Block phone number <strong className="font-mono text-rose-950 font-bold">{order.customer?.phone}</strong> from future orders
              </span>
            </label>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setFakeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={fakeActionLoading}
                onClick={handleConfirmFakeOrder}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50 transition-colors shadow-xs"
              >
                {fakeActionLoading ? "Processing..." : "Confirm & Restore Stock"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Screenshot Modal Preview */}
      {screenshotModalOpen && order.paymentScreenshot && (
        <div
          className="fixed inset-0 z-[130] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setScreenshotModalOpen(false)}
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-white p-2 rounded-2xl border border-slate-200 shadow-2xl">
            <img
              src={order.paymentScreenshot}
              alt="Payment Screenshot Full Preview"
              className="max-h-[85vh] w-auto rounded-xl object-contain"
            />
            <button
              onClick={() => setScreenshotModalOpen(false)}
              className="absolute top-4 right-4 bg-white/95 hover:bg-white text-slate-900 border border-slate-200 p-2 rounded-full shadow-lg transition-transform hover:scale-105"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}