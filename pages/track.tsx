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
      case "awaiting_confirmation":
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
      <div className="bg-[#fafafa] text-zinc-900 min-h-screen pt-8 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-400">
              REAL-TIME DISPATCH TRACKER
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-950 mt-1 tracking-tight">
              Track Your Order
            </h1>
            <p className="text-zinc-500 max-w-lg mx-auto mt-2 text-xs md:text-sm">
              Enter your Order ID (e.g. <span className="text-zinc-950 font-mono font-bold">HBS123456</span>) or phone number to view live courier status.
            </p>
          </div>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white p-2.5 sm:p-3 rounded-2xl flex items-center gap-2 max-w-xl mx-auto border border-zinc-200/80 mb-10 shadow-xs"
          >
            <div className="flex items-center gap-2.5 flex-1 px-3">
              <Search className="text-zinc-400" size={18} />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. HBS849201) or Phone..."
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-zinc-900 text-xs sm:text-sm placeholder:text-zinc-400 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !queryInput.trim()}
              className="py-2.5 px-6 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold whitespace-nowrap disabled:opacity-50 transition-colors shadow-xs"
            >
              {loading ? "Tracking..." : "Track Order"}
            </button>
          </form>

          {/* Error Notice */}
          {errorMsg && (
            <div className="bg-rose-50 p-5 rounded-2xl border border-rose-200 text-center max-w-xl mx-auto mb-10 animate-fadeIn">
              <AlertCircle className="mx-auto text-rose-600 mb-2" size={24} />
              <b className="text-rose-950 block text-sm">Order Not Found</b>
              <p className="text-rose-700 text-xs mt-1">{errorMsg}</p>
              <div className="mt-3">
                <a
                  href={wa("Assalam-o-Alaikum! I need help tracking my order.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-rose-800 font-semibold underline"
                >
                  <WhatsAppIcon size={14} color="#991b1b" /> Contact Support on WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* Order Details Display */}
          {order && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              {/* Order Status Banner */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-xs relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-100">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">
                      ORDER REFERENCE
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <b className="text-2xl font-mono font-bold text-zinc-950 tracking-wider">
                        {order.orderId}
                      </b>
                      <button
                        onClick={handleCopyOrderId}
                        className="p-1.5 rounded-lg bg-[#f4f4f6] hover:bg-zinc-200 text-zinc-700 text-xs flex items-center gap-1 border border-zinc-200"
                        title="Copy Order ID"
                      >
                        <Copy size={13} />
                        <span>{copied ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.status === "delivered"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : order.status === "dispatched"
                          ? "bg-blue-50 text-blue-800 border border-blue-200"
                          : order.status === "cancelled"
                          ? "bg-rose-50 text-rose-800 border border-rose-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {order.status === "dispatched"
                        ? "🚚 Dispatched"
                        : order.status === "awaiting_confirmation"
                        ? "⏳ Awaiting Confirmation"
                        : order.status}
                    </span>

                    {order.status !== "dispatched" && order.status !== "delivered" && order.status !== "cancelled" && (
                      <button
                        type="button"
                        onClick={() => setCancelModalOpen(true)}
                        className="text-xs text-zinc-500 hover:text-rose-600 underline py-1 font-semibold"
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
                      <div className="absolute top-5 left-[12%] right-[12%] h-1 bg-zinc-200 -z-0">
                        <div
                          className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
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
                        { title: "Delivered", icon: PackageCheck, desc: "At Doorstep" },
                      ].map((step, idx) => {
                        const Icon = step.icon;
                        const isDone = stepIndex >= idx;
                        const isCurrent = stepIndex === idx;

                        return (
                          <div key={step.title} className="flex flex-col items-center relative z-10">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                isDone
                                  ? "bg-emerald-600 text-white font-bold shadow-xs"
                                  : "bg-white text-zinc-400 border border-zinc-200"
                              }`}
                            >
                              <Icon size={18} />
                            </div>
                            <b
                              className={`text-xs mt-3 block ${
                                isCurrent
                                  ? "text-emerald-700 font-bold"
                                  : isDone
                                  ? "text-zinc-950"
                                  : "text-zinc-400"
                              }`}
                            >
                              {step.title}
                            </b>
                            <span className="text-[11px] text-zinc-500 hidden sm:block">
                              {step.desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-rose-700 font-semibold text-sm">
                    ⚠️ This order was cancelled. Please place a new order if you wish to purchase.
                  </div>
                )}

                {/* Courier / Tracking Detail (if dispatched) */}
                {order.status === "dispatched" && (
                  <div className="mt-4 p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Truck className="text-blue-600" size={24} />
                      <div>
                        <span className="text-xs text-zinc-500 block">Courier Carrier:</span>
                        <b className="text-zinc-900 text-sm">
                          {order.courierName || "TCS Express Pakistan"}
                        </b>
                      </div>
                    </div>

                    {order.trackingNumber && (
                      <div>
                        <span className="text-xs text-zinc-500 block">Tracking ID / CN:</span>
                        <b className="font-mono text-zinc-950 text-sm">
                          {order.trackingNumber}
                        </b>
                      </div>
                    )}

                    <a
                      href={buildWhatsAppInquiryUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                    >
                      Track on WhatsApp
                    </a>
                  </div>
                )}
              </div>

              {/* Order Items & Customer Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Items Table */}
                <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-xs">
                  <h3 className="text-base font-bold text-zinc-950 mb-4 flex items-center justify-between">
                    <span>Ordered Footwear ({order.items.length})</span>
                    <span className="text-xs font-mono font-bold uppercase bg-[#f4f4f6] text-zinc-800 px-2 py-0.5 rounded-md border border-zinc-200">
                      {order.paymentMethod || "COD"}
                    </span>
                  </h3>

                  <div className="divide-y divide-zinc-100">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="py-3 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-[#f4f4f6] border border-zinc-200/60 p-1 flex items-center justify-center shrink-0">
                          <img
                            src={resolveProductImage(item.img)}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <b className="text-zinc-900 text-sm block truncate">{item.name}</b>
                          <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                            <span>Size: <b className="text-zinc-900 font-mono">{item.size}</b></span>
                            <span>Qty: <b className="text-zinc-900 font-mono">{item.quantity}</b></span>
                          </div>
                        </div>
                        <div className="text-right">
                          <b className="text-zinc-950 text-sm block font-mono">
                            Rs. {item.total.toLocaleString()}
                          </b>
                          <small className="text-zinc-400 text-xs font-mono">
                            Rs. {item.price.toLocaleString()} ea
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Totals */}
                  <div className="border-t border-zinc-100 pt-4 mt-4 flex flex-col gap-2 text-xs">
                    <div className="flex justify-between text-zinc-600">
                      <span>Subtotal:</span>
                      <span className="text-zinc-900 font-mono font-bold">Rs. {order.subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-zinc-600">
                      <span>Nationwide Delivery:</span>
                      <span className="text-zinc-900 font-mono font-bold">
                        {order.shippingFee === 0 ? "FREE" : `Rs. ${order.shippingFee}`}
                      </span>
                    </div>

                    {order.codFee ? (
                      <div className="flex justify-between text-amber-800">
                        <span>COD Handling Fee:</span>
                        <span className="font-mono font-bold">Rs. {Number(order.codFee).toLocaleString()}</span>
                      </div>
                    ) : null}

                    <div className="border-t border-zinc-100 pt-2 flex justify-between text-sm font-extrabold text-zinc-950">
                      <span>{order.paymentMethod === "cod" ? "Total Payable on Delivery:" : "Total Amount:"}</span>
                      <span className="font-mono text-base">
                        Rs. {order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer & Delivery Information */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs">
                    <h3 className="text-base font-bold text-zinc-950 mb-3">Delivery Information</h3>
                    <div className="flex flex-col gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Recipient</span>
                        <b className="text-zinc-900 text-sm">{order.customer.name}</b>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Phone Number</span>
                        <b className="text-zinc-900 font-mono text-xs">{order.customer.phone}</b>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">City</span>
                        <b className="text-zinc-900 text-xs">{order.customer.city}</b>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Address</span>
                        <p className="text-zinc-600 text-xs leading-relaxed mt-0.5">
                          {order.customer.address}
                        </p>
                      </div>
                      {order.deliveryNote && (
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Delivery Note</span>
                          <p className="text-zinc-600 text-xs italic leading-relaxed mt-0.5">
                            {order.deliveryNote}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Action Concierge */}
                  <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs text-center">
                    <h4 className="text-zinc-950 font-bold text-sm mb-1">Need Urgent Assistance?</h4>
                    <p className="text-zinc-500 text-xs mb-4">
                      Our Hangu dispatch desk responds within 5 minutes on WhatsApp.
                    </p>
                    <a
                      href={buildWhatsAppInquiryUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition-colors shadow-xs"
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
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="p-6 rounded-3xl max-w-md w-full bg-white border border-zinc-200 shadow-2xl">
                <h3 className="text-lg font-bold text-zinc-950 mb-2">Cancel Order {order?.orderId}</h3>
                <p className="text-zinc-500 text-xs mb-4">
                  Are you sure you want to cancel this order? If you need a different shoe size or model, our team can exchange it without cancellation.
                </p>

                <textarea
                  placeholder="Reason for cancellation (optional)..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-[#f4f4f6] border border-zinc-200 rounded-xl p-3 text-xs text-zinc-900 outline-none mb-4"
                  rows={3}
                />

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setCancelModalOpen(false)}
                    className="py-2 px-4 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
                  >
                    Keep Order
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelOrder}
                    disabled={cancelOrderMutation.isPending}
                    className="py-2 px-4 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50 transition-colors"
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
