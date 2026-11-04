import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import Layout from "../src/components/Layout";
import { useOrderTracking, useCancelOrder } from "../src/hooks/useApi";
import { wa } from "../src/data/config";
import { WhatsAppIcon } from "../src/components/WhatsAppButton";
import {
  Search,
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
} from "lucide-react";
import { resolveProductImage } from "../src/utils/image";

export default function TrackOrderPage() {
  const router = useRouter();
  const [queryInput, setQueryInput] = useState<string>("");
  const [activeQuery, setActiveQuery] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>("");

  // TanStack Query for tracking
  const {
    data: trackingRes,
    isLoading: loading,
    isError,
  } = useOrderTracking(activeQuery, Boolean(activeQuery));

  // TanStack Mutation for cancellation
  const cancelOrderMutation = useCancelOrder();

  useEffect(() => {
    if (router.isReady && router.query.orderId) {
      const q = String(router.query.orderId);
      setQueryInput(q);
      setActiveQuery(q);
    }
  }, [router.isReady, router.query.orderId]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (queryInput.trim()) {
      setActiveQuery(queryInput.trim());
    }
  };

  const order = trackingRes?.data;
  const errorMsg =
    trackingRes?.success === false
      ? trackingRes?.message
      : isError
      ? "Failed to communicate with the tracking server."
      : "";

  const handleCopyOrderId = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancelOrder = () => {
    if (!order) return;
    cancelOrderMutation.mutate(
      { orderId: order.orderId, reason: cancelReason },
      {
        onSuccess: () => {
          setCancelModalOpen(false);
          setCancelReason("");
        },
        onError: (err: any) => {
          alert(err?.message || "Failed to cancel order.");
        },
      }
    );
  };

  const getStepProgressIndex = (status: string) => {
    switch (status) {
      case "pending":
        return 0;
      case "confirmed":
      case "processing":
        return 1;
      case "dispatched":
        return 2;
      case "delivered":
        return 3;
      case "cancelled":
        return -1;
      default:
        return 0;
    }
  };

  const stepIndex = order ? getStepProgressIndex(order.status) : 0;

  const buildWhatsAppInquiryUrl = () => {
    if (!order) return wa("Assalam-o-Alaikum! I have a question about an order.");
    const text = `Assalam-o-Alaikum! 📦\n\nI want to inquire about my order:\n*Order ID:* ${order.orderId}\n*Customer:* ${order.customer.name}\n*Total:* Rs. ${order.totalAmount.toLocaleString()}\n*Status:* ${order.status.toUpperCase()}\n\nPlease update me on dispatch status.`;
    return wa(text);
  };

  return (
    <Layout title="Track Your Order — Hangu Branded Shoes">
      <div className="pt-32 pb-20">
        <div className="wrap max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <small className="text-brand-red uppercase tracking-wider text-xs font-bold">
              REAL-TIME DISPATCH TRACKER
            </small>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1">
              Track Your Order
            </h1>
            <p className="text-zinc-400 max-w-lg mx-auto mt-2 text-sm">
              Enter your Order ID (e.g. <span className="text-brand-gold font-mono">HBS123456</span>) or phone number to view live packaging, dispatch, and courier tracking details.
            </p>
          </div>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="glass p-2.5 sm:p-3 rounded-2xl flex items-center gap-2 max-w-xl mx-auto border border-white/15 mb-10 shadow-2xl"
          >
            <div className="flex items-center gap-2.5 flex-1 px-3">
              <Search className="text-zinc-400" size={19} />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. HBS849201) or Phone..."
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-white text-sm placeholder:text-zinc-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !queryInput.trim()}
              className="btn px-6 py-2.5 text-xs font-bold whitespace-nowrap disabled:opacity-50"
            >
              {loading ? "Tracking..." : "Track Order"}
            </button>
          </form>

          {/* Error Notice */}
          {errorMsg && (
            <div className="glass p-5 rounded-2xl border border-red-500/30 bg-red-500/10 text-center max-w-xl mx-auto mb-10 animate-fadeIn">
              <AlertCircle className="mx-auto text-brand-red mb-2" size={28} />
              <b className="text-white block text-sm">Order Not Found</b>
              <p className="text-zinc-400 text-xs mt-1">{errorMsg}</p>
              <div className="mt-3">
                <a
                  href={wa("Assalam-o-Alaikum! I need help tracking my order.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-brand-gold hover:underline"
                >
                  <WhatsAppIcon size={14} color="var(--gold)" /> Contact Support on WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* Order Details Display */}
          {order && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              {/* Order Status Banner */}
              <div className="glass p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div>
                    <span className="text-xs text-zinc-400 uppercase tracking-wider block">
                      Order Reference
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <b className="text-2xl font-mono font-bold text-white tracking-wider">
                        {order.orderId}
                      </b>
                      <button
                        onClick={handleCopyOrderId}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 text-xs flex items-center gap-1 border border-white/10"
                        title="Copy Order ID"
                      >
                        <Copy size={13} />
                        <span>{copied ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${order.status === "delivered"
                        ? "bg-green-500/20 text-green-400 border border-green-500/40"
                        : order.status === "dispatched"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                          : order.status === "cancelled"
                            ? "bg-red-500/20 text-red-400 border border-red-500/40"
                            : "bg-brand-gold/20 text-brand-gold border border-brand-gold/40"
                        }`}
                    >
                      {order.status === "dispatched" ? "🚚 Dispatched" : order.status}
                    </span>

                    {order.status !== "dispatched" && order.status !== "delivered" && order.status !== "cancelled" && (
                      <button
                        type="button"
                        onClick={() => setCancelModalOpen(true)}
                        className="text-xs text-zinc-400 hover:text-brand-red underline py-1"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Stepper Progress Bar */}
                {order.status !== "cancelled" ? (
                  <div className="py-8">
                    <div className="grid grid-cols-4 gap-2 relative text-center">
                      <div className="absolute top-5 left-[12%] right-[12%] h-1 bg-white/10 -z-0">
                        <div
                          className="h-full bg-gradient-to-r from-brand-red to-brand-gold transition-all duration-500"
                          style={{
                            width:
                              stepIndex === 0
                                ? "0%"
                                : stepIndex === 1
                                  ? "35%"
                                  : stepIndex === 2
                                    ? "70%"
                                    : "100%",
                          }}
                        />
                      </div>

                      {[
                        { title: "Order Placed", icon: Clock, desc: "Received" },
                        { title: "Confirmed", icon: CheckCircle2, desc: "Packed & Verified" },
                        { title: "Dispatched", icon: Truck, desc: "In Courier Transit" },
                        { title: "Delivered", icon: PackageCheck, desc: "At Your Doorstep" },
                      ].map((step, idx) => {
                        const Icon = step.icon;
                        const isDone = stepIndex >= idx;
                        const isCurrent = stepIndex === idx;

                        return (
                          <div key={step.title} className="flex flex-col items-center relative z-10">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isDone
                                ? "bg-brand-gold text-black font-bold shadow-[0_0_15px_rgba(230,179,37,0.5)]"
                                : "bg-zinc-800 text-zinc-500 border border-white/10"
                                }`}
                            >
                              <Icon size={18} />
                            </div>
                            <b
                              className={`text-xs mt-3 block ${isCurrent
                                ? "text-brand-gold font-bold"
                                : isDone
                                  ? "text-white"
                                  : "text-zinc-500"
                                }`}
                            >
                              {step.title}
                            </b>
                            <span className="text-[11px] text-zinc-400 hidden sm:block">
                              {step.desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-brand-red font-semibold text-sm">
                    ⚠️ This order was cancelled. Please place a new order if you wish to purchase.
                  </div>
                )}

                {/* Courier / Tracking Detail (if dispatched) */}
                {order.status === "dispatched" && (
                  <div className="mt-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Truck className="text-blue-400" size={24} />
                      <div>
                        <span className="text-xs text-zinc-400 block">Courier Carrier:</span>
                        <b className="text-white text-sm">
                          {order.courierName || "TCS Express Pakistan"}
                        </b>
                      </div>
                    </div>

                    {order.trackingNumber && (
                      <div>
                        <span className="text-xs text-zinc-400 block">Tracking ID / CN:</span>
                        <b className="font-mono text-brand-gold text-sm">
                          {order.trackingNumber}
                        </b>
                      </div>
                    )}

                    <a
                      href={buildWhatsAppInquiryUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn py-1.5 px-3 text-xs"
                    >
                      Track with WhatsApp
                    </a>
                  </div>
                )}
              </div>

              {/* Order Items & Customer Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
                {/* Items Table */}
                <div className="glass p-6 rounded-3xl border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                    <span>Ordered Footwear ({order.items.length})</span>
                    <span className="text-xs text-brand-gold font-mono font-semibold uppercase">
                      {order.paymentMethod || "EasyPaisa"}
                    </span>
                  </h3>

                  <div className="divide-y divide-white/10">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="py-3.5 flex items-center gap-4">
                        <img
                          src={resolveProductImage(item.img)}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover bg-zinc-900 border border-white/10"
                        />
                        <div className="flex-1 min-w-0">
                          <b className="text-white text-sm block truncate">{item.name}</b>
                          <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                            <span>Size: <b className="text-white font-mono">{item.size}</b></span>
                            <span>Qty: <b className="text-white font-mono">{item.quantity}</b></span>
                          </div>
                        </div>
                        <div className="text-right">
                          <b className="text-brand-gold text-sm block font-mono">
                            Rs. {item.total.toLocaleString()}
                          </b>
                          <small className="text-zinc-500 text-xs font-mono">
                            Rs. {item.price.toLocaleString()} ea
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Totals */}
                  <div className="border-t border-white/10 pt-4 mt-4 flex flex-col gap-2 text-sm">
                    <div className="flex justify-between text-zinc-400">
                      <span>Subtotal:</span>
                      <span className="text-white font-mono">Rs. {order.subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-zinc-400">
                      <span>Nationwide Delivery:</span>
                      <span className="text-white font-mono">
                        {order.shippingFee === 0 ? "FREE" : `Rs. ${order.shippingFee}`}
                      </span>
                    </div>

                    {order.discountAmount ? (
                      <div className="flex justify-between text-[#25d366]">
                        <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}:</span>
                        <span className="font-mono">- Rs. {order.discountAmount.toLocaleString()}</span>
                      </div>
                    ) : null}

                    <div className="border-t border-white/10 pt-2 flex justify-between text-base font-extrabold text-white">
                      <span>Total Amount Payable:</span>
                      <span className="text-brand-gold font-mono text-lg">
                        Rs. {order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer & Delivery Information */}
                <div className="flex flex-col gap-6">
                  <div className="glass p-6 rounded-3xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-3">Delivery Information</h3>
                    <div className="flex flex-col gap-3 text-sm">
                      <div>
                        <span className="text-xs text-zinc-500 uppercase block">Recipient</span>
                        <b className="text-white">{order.customer.name}</b>
                      </div>
                      <div>
                        <span className="text-xs text-zinc-500 uppercase block">Phone / WhatsApp</span>
                        <b className="text-white font-mono">{order.customer.phone}</b>
                      </div>
                      <div>
                        <span className="text-xs text-zinc-500 uppercase block">Destination City</span>
                        <b className="text-brand-gold">{order.customer.city}</b>
                      </div>
                      <div>
                        <span className="text-xs text-zinc-500 uppercase block">Delivery Address</span>
                        <p className="text-zinc-300 text-xs leading-relaxed mt-0.5">
                          {order.customer.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Concierge */}
                  <div className="glass p-6 rounded-3xl border border-white/10 text-center">
                    <h4 className="text-white font-bold text-sm mb-1">Need Urgent Assistance?</h4>
                    <p className="text-zinc-400 text-xs mb-4">
                      Our Hangu dispatch desk responds within 5 minutes on WhatsApp.
                    </p>
                    <a
                      href={buildWhatsAppInquiryUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn w-full inline-flex items-center justify-center gap-2 text-xs"
                    >
                      <WhatsAppIcon size={16} color="#fff" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cancellation Modal */}
          {cancelModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="glass p-6 rounded-3xl max-w-md w-full bg-zinc-950 border border-white/15">
                <h3 className="text-lg font-bold text-white mb-2">Cancel Order {order?.orderId}</h3>
                <p className="text-zinc-400 text-xs mb-4">
                  Are you sure you want to cancel this order? If you need a different shoe size or color, our team can exchange it without cancellation.
                </p>

                <textarea
                  placeholder="Reason for cancellation (optional)..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none mb-4"
                  rows={3}
                />

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setCancelModalOpen(false)}
                    className="btn ghost py-2 px-4 text-xs"
                  >
                    Keep Order
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelOrder}
                    disabled={cancelOrderMutation.isPending}
                    className="btn py-2 px-4 text-xs bg-brand-red text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {cancelOrderMutation.isPending ? "Cancelling..." : "Confirm Cancel"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
