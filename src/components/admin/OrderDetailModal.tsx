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
      ? `Assalam-o-Alaikum *${custName}*! 👟\n\n` +
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
      : `Assalam-o-Alaikum *${custName}*! 👟\n\n` +
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
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="glass p-6 md:p-8 rounded-3xl max-w-2xl w-full border border-white/15 bg-zinc-950/95 shadow-2xl relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
            >
              {order.status.replace("_", " ")}
            </span>
            {isCod ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Banknote size={13} /> Cash on Delivery
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
                <Smartphone size={13} /> JazzCash
              </span>
            )}
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

        {/* Payment Verification / Details Card */}
        {isCod ? (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Banknote size={15} /> Cash on Delivery (COD) Details
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase border ${paymentMeta.bg} ${paymentMeta.text} ${paymentMeta.border}`}
              >
                {paymentMeta.label}
              </span>
            </div>

            <div className="text-xs space-y-2">
              <p className="text-zinc-300 leading-relaxed">
                No advance payment received. Rider will collect exact cash of{" "}
                <strong className="text-brand-gold font-mono font-bold text-sm">
                  Rs. {(order.totalAmount || 0).toLocaleString()}
                </strong>{" "}
                upon delivery at customer's doorstep.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                {!isPaid && (
                  <button
                    type="button"
                    disabled={cashCollectedLoading}
                    onClick={handleMarkCashCollected}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-green-600 hover:bg-green-500 text-white disabled:opacity-40 flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <CheckCircle2 size={14} />
                    <span>{cashCollectedLoading ? "Updating..." : "Mark Cash Collected (Delivered)"}</span>
                  </button>
                )}

                {order.status !== "cancelled" && (
                  <button
                    type="button"
                    onClick={() => setFakeModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 flex items-center gap-1.5 transition-all"
                  >
                    <ShieldAlert size={14} />
                    <span>Mark as Fake / Unreachable</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gold flex items-center gap-1.5">
                <ShieldCheck size={14} /> JazzCash Payment Verification
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase border ${paymentMeta.bg} ${paymentMeta.text} ${paymentMeta.border}`}
              >
                {paymentMeta.label}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-zinc-400 block text-[11px]">Submitted JazzCash TID:</span>
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
        )}

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
            {isCod && Number(order.codFee) > 0 && (
              <div className="flex justify-between text-amber-300">
                <span>COD Handling Fee:</span>
                <span className="font-mono">Rs. {Number(order.codFee).toLocaleString()}</span>
              </div>
            )}
            <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
              <span>{isCod ? "Cash Due on Delivery:" : "Total Payable (JazzCash):"}</span>
              <span className="text-brand-gold font-mono font-extrabold text-base">
                Rs. {(order.totalAmount || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Courier & Tracking Logistics (Optional) */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gold flex items-center gap-1.5">
              <Truck size={14} /> Shipping & Courier Logistics (Optional)
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                Courier Company (Optional)
              </label>
              <select
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-gold"
              >
                <option value="">No Courier Assigned / In-Person</option>
                {COURIER_OPTIONS.map((c) => (
                  <option key={c} value={c} className="bg-zinc-950 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                Tracking Number / Airway Bill (Optional)
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

          <div>
            <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
              Delivery Note (Optional, e.g. "Sent with local rider", "Deliver after 4 PM")
            </label>
            <input
              type="text"
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              placeholder="e.g. Sent with local rider"
              className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-gold"
            />
          </div>
        </div>

        {/* Status Actions */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Update Order Status
            </span>
            {!canConfirm && (
              <span className="text-[11px] text-amber-400 flex items-center gap-1 font-medium">
                <AlertTriangle size={13} /> JazzCash order requires "Paid" status before confirmation
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {["confirmed", "dispatched", "delivered", "cancelled"].map((st) => {
              const cannotConfirm = st === "confirmed" && !canConfirm;
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
                  title={cannotConfirm ? "JazzCash order requires payment verification first" : undefined}
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

      {/* Fake Order & Block Confirmation Modal */}
      {fakeModalOpen && (
        <div className="fixed inset-0 z-[140] bg-black/90 flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass max-w-md w-full p-6 rounded-3xl border border-red-500/30 bg-zinc-950">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <ShieldAlert size={24} />
              <h3 className="text-base font-bold text-white">Mark as Fake / Unreachable</h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed mb-4">
              This action will <strong>cancel Order #{order.orderId}</strong> and <strong>immediately restore the shoe stock</strong> to your inventory.
            </p>

            <div className="mb-4">
              <label className="text-xs text-zinc-400 block mb-1">Reason for cancellation:</label>
              <input
                type="text"
                value={fakeReason}
                onChange={(e) => setFakeReason(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-400"
              />
            </div>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-200 cursor-pointer mb-5">
              <input
                type="checkbox"
                checked={blockPhoneChecked}
                onChange={(e) => setBlockPhoneChecked(e.target.checked)}
                className="rounded accent-red-500"
              />
              <span>
                Block phone number <strong className="font-mono text-white">{order.customer?.phone}</strong> from placing future orders
              </span>
            </label>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setFakeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={fakeActionLoading}
                onClick={handleConfirmFakeOrder}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white disabled:opacity-50"
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