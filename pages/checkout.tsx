import { useState, useId, FormEvent, ChangeEvent, useEffect } from "react";
import Link from "next/link";
import Layout from "../src/components/Layout";
import { useCart } from "../src/context/CartContext";
import { WA, wa } from "../src/data/config";
import { useCreateOrder, useStoreSettings, useUploadPaymentReceipt } from "../src/hooks/useApi";
import {
  ShieldCheck,
  Copy,
  Check,
  Upload,
  AlertTriangle,
  MessageCircle,
  FileCheck2,
  Banknote,
  Smartphone,
  Truck,
  ArrowRight,
} from "lucide-react";
import { resolveProductImage } from "../src/utils/image";

export default function Checkout() {
  const { items, sub, ship, clear } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "jazzcash">("cod");
  const [f, setF] = useState({ name: "", phone: "", city: "", address: "", tid: "" });
  const [hp, setHp] = useState<string>(""); // Honeypot field for bot protection
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedOrderId, setCopiedOrderId] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderId: string;
    method: "cod" | "jazzcash";
    total: number;
    subtotal: number;
    shipping: number;
    codFee: number;
    customer: { name: string; phone: string; city: string; address: string };
    msg: string;
    items: typeof items;
  } | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string>("");
  const [screenshotUploading, setScreenshotUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");

  // Live Store Settings
  const { data: storeSettingsData } = useStoreSettings();
  const liveSettings = storeSettingsData?.data;

  const isCodEnabled = liveSettings?.enableCod !== false;
  const jazzcashNumber = liveSettings?.easypaisaNumber?.trim() || "03275430305";
  const jazzcashTitle = liveSettings?.easypaisaTitle?.trim() || "Muhammad Atif Ibrahim";
  const whatsappNumber = liveSettings?.whatsappNumber?.trim() || WA;
  const isJazzCashConfigured = Boolean(jazzcashTitle);

  // If COD is disabled in settings, automatically switch to JazzCash
  useEffect(() => {
    if (!isCodEnabled && paymentMethod === "cod") {
      setPaymentMethod("jazzcash");
    }
  }, [isCodEnabled, paymentMethod]);

  const effectiveMethod = isCodEnabled ? paymentMethod : "jazzcash";

  // Dynamic Shipping & COD Fee
  const freeThreshold = liveSettings?.freeShippingThreshold ?? 5000;
  const standardFee = liveSettings?.shippingFee ?? (sub >= freeThreshold ? 0 : 250);
  const effectiveShipping = sub >= freeThreshold ? 0 : standardFee;
  const codFee = effectiveMethod === "cod" ? Number(liveSettings?.codFee || 0) : 0;
  const effectiveTotal = sub + effectiveShipping + codFee;

  const createOrderMutation = useCreateOrder();
  const uploadReceiptMutation = useUploadPaymentReceipt();

  const set = (k: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  const handleCopyAccount = () => {
    const acc = jazzcashNumber || "03275430305";
    navigator.clipboard.writeText(acc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleScreenshotChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose a valid image file (PNG, JPG, JPEG, WebP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError("Screenshot size exceeds 8MB. Please choose a smaller image.");
      return;
    }

    setUploadError("");
    setScreenshotUploading(true);

    try {
      const res = await uploadReceiptMutation.mutateAsync(file);
      const receiptUrl = res.data?.url || (res as any).url;
      if (res.success && receiptUrl) {
        setScreenshotUrl(receiptUrl);
      } else {
        setUploadError(res.message || "Failed to upload receipt screenshot.");
      }
    } catch (err: any) {
      setUploadError(err?.message || "Upload error. You can continue and send proof via WhatsApp.");
    } finally {
      setScreenshotUploading(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();

    if (!items.length) {
      alert("Your cart is empty.");
      return;
    }

    if (!f.name.trim() || !f.phone.trim() || !f.city.trim() || !f.address.trim()) {
      alert("Please fill in all required delivery details (Name, Phone, City, Address).");
      return;
    }

    const orderId = "HBS" + Date.now().toString().slice(-6);

    const itemsSummary = items
      .map(
        (i) =>
          `• *${i.name}*\n   Size: ${i.size} | Qty: ${i.q} | Rs. ${(i.price * i.q).toLocaleString()}`
      )
      .join("\n");

    const msg =
      effectiveMethod === "cod"
        ? `🛍️ *NEW ORDER (CASH ON DELIVERY) — HANGU BRANDED SHOES*\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `📦 *Order ID:* #${orderId}\n\n` +
          `👟 *Ordered Shoes:*\n${itemsSummary}\n\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `Subtotal: Rs. ${sub.toLocaleString()}\n` +
          `Shipping Delivery: ${effectiveShipping === 0 ? "FREE" : `Rs. ${effectiveShipping.toLocaleString()}`}\n` +
          (codFee > 0 ? `COD Extra Fee: Rs. ${codFee.toLocaleString()}\n` : "") +
          `💵 *CASH DUE ON DELIVERY:* Rs. ${effectiveTotal.toLocaleString()}\n` +
          `🚚 *Payment Method:* Cash on Delivery (COD)\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `👤 *Customer Name:* ${f.name.trim()}\n` +
          `📞 *Phone / WhatsApp:* ${f.phone.trim()}\n` +
          `📍 *Delivery Address:* ${f.address.trim()}, ${f.city.trim()}\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `_Assalam-o-Alaikum! I have placed an order with Cash on Delivery. Please confirm my order and dispatch it._`
        : `🛍️ *NEW ORDER (JAZZCASH) — HANGU BRANDED SHOES*\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `📦 *Order ID:* #${orderId}\n\n` +
          `👟 *Ordered Shoes:*\n${itemsSummary}\n\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `Subtotal: Rs. ${sub.toLocaleString()}\n` +
          `Shipping Delivery: ${effectiveShipping === 0 ? "FREE" : `Rs. ${effectiveShipping.toLocaleString()}`}\n` +
          `💰 *TOTAL PAYABLE:* Rs. ${effectiveTotal.toLocaleString()}\n` +
          `📱 *Payment Method:* JazzCash\n` +
          `👤 *Account Title:* ${jazzcashTitle || "Muhammad Atif Ibrahim"}\n` +
          `📞 *Account Number:* ${jazzcashNumber || "03275430305"}\n` +
          (f.tid.trim() ? `🔖 *Transaction ID (TID):* ${f.tid.trim()}\n` : "") +
          (screenshotUrl ? `📸 *Payment Screenshot:* Uploaded to order record\n` : "") +
          `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `👤 *Customer Name:* ${f.name.trim()}\n` +
          `📞 *Phone / WhatsApp:* ${f.phone.trim()}\n` +
          `📍 *Delivery Address:* ${f.address.trim()}, ${f.city.trim()}\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `_Assalam-o-Alaikum! I have placed an order via JazzCash. Please verify my payment and dispatch my order._`;

    // Persist to MongoDB database first
    createOrderMutation.mutate(
      {
        orderId,
        customer: {
          name: f.name.trim(),
          phone: f.phone.trim(),
          city: f.city.trim(),
          address: f.address.trim(),
        },
        items: items.map((i) => ({
          productId: i.id,
          name: i.name,
          img: i.img,
          price: i.price,
          size: i.size,
          quantity: i.q,
          total: i.price * i.q,
        })),
        subtotal: sub,
        shippingFee: effectiveShipping,
        codFee,
        totalAmount: effectiveTotal,
        paymentMethod: effectiveMethod,
        transactionId: effectiveMethod === "jazzcash" ? f.tid.trim() || undefined : undefined,
        paymentScreenshot: effectiveMethod === "jazzcash" ? screenshotUrl || undefined : undefined,
        hp,
      },
      {
        onSuccess: () => {
          sessionStorage.setItem("lastOrder", JSON.stringify({ id: orderId, msg }));
          setConfirmedOrder({
            orderId,
            method: effectiveMethod,
            total: effectiveTotal,
            subtotal: sub,
            shipping: effectiveShipping,
            codFee,
            customer: {
              name: f.name.trim(),
              phone: f.phone.trim(),
              city: f.city.trim(),
              address: f.address.trim(),
            },
            msg,
            items: [...items],
          });
          clear();
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        },
        onError: (err: any) => {
          alert(
            err?.message ||
              "Could not record your order in the database. Please check your details and try again."
          );
        },
      }
    );
  };

  if (confirmedOrder) {
    const isJc = confirmedOrder.method === "jazzcash";
    const jcNum = jazzcashNumber || "03275430305";
    const jcName = jazzcashTitle || "Muhammad Atif Ibrahim";

    return (
      <Layout title={`Order #${confirmedOrder.orderId} Confirmed — Hangu Branded Shoes`}>
        <div className="bg-[#fafafa] text-zinc-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto flex flex-col gap-6">
            {/* Success Header Banner */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3.5 shadow-sm ring-4 ring-emerald-50">
                <Check size={32} strokeWidth={2.8} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
                Order Confirmed Successfully
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 mt-2.5">
                Thank You, {confirmedOrder.customer.name}!
              </h1>
              <p className="text-zinc-600 text-xs sm:text-sm mt-1 max-w-md mx-auto">
                {isJc
                  ? "Your order has been recorded. Please complete your JazzCash transfer using the details below."
                  : "Your order has been recorded. Our team will verify sizing with you before courier dispatch."}
              </p>
            </div>

            {/* Order Tracking Reference Box */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-zinc-200/90 shadow-xs flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  Your Order Reference ID
                </span>
                <span className="font-mono text-xl sm:text-2xl font-extrabold text-zinc-950">
                  #{confirmedOrder.orderId}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(confirmedOrder.orderId);
                  setCopiedOrderId(true);
                  setTimeout(() => setCopiedOrderId(false), 2000);
                }}
                className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-zinc-200"
              >
                {copiedOrderId ? (
                  <>
                    <Check size={14} className="text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>

            {/* JAZZCASH PAYMENT DETAILS REVEAL CARD */}
            {isJc && (
              <div className="bg-gradient-to-br from-red-50 via-white to-red-50/60 p-6 sm:p-8 rounded-3xl border-2 border-red-500/80 shadow-md flex flex-col gap-5">
                <div className="flex items-center justify-between pb-4 border-b border-red-200/70">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      JC
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-extrabold text-zinc-950">JazzCash Payment Details</h2>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 tracking-wide uppercase">
                          Official Account
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">Send exact amount to complete your reservation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono font-semibold">Total Due</span>
                    <b className="text-red-700 text-lg sm:text-xl font-mono font-extrabold">
                      Rs. {confirmedOrder.total.toLocaleString()}
                    </b>
                  </div>
                </div>

                {/* Account Details Box */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-red-200 shadow-xs flex flex-col gap-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-3 border-b border-zinc-100">
                    <span className="text-xs font-semibold text-zinc-500">Account Title (Beneficiary Name):</span>
                    <span className="text-sm sm:text-base font-extrabold text-zinc-950 font-sans tracking-wide">
                      {jcName}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div>
                      <span className="text-[11px] font-bold text-red-600 block uppercase tracking-wider">
                        JazzCash Mobile Number
                      </span>
                      <span className="font-mono text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-wider">
                        {jcNum}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                    >
                      {copied ? (
                        <>
                          <Check size={16} />
                          <span>Number Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          <span>Copy JazzCash Number</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Step Instructions */}
                <div className="bg-red-50/60 p-4 rounded-2xl border border-red-100 text-xs text-zinc-700 space-y-2">
                  <div className="font-bold text-zinc-900 text-xs flex items-center gap-1.5 mb-1">
                    <span>⚡ Quick Transfer Steps:</span>
                  </div>
                  <p className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">1</span>
                    <span>Open your <b>JazzCash App</b> or dial <b>*786#</b>.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">2</span>
                    <span>Transfer <b>Rs. {confirmedOrder.total.toLocaleString()}</b> to <b>{jcNum}</b> (Title: <b>{jcName}</b>).</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">3</span>
                    <span>Click the green button below to share payment screenshot / TID on WhatsApp for instant order dispatch.</span>
                  </p>
                </div>

                {/* Primary WhatsApp Action Button */}
                <a
                  href={wa(confirmedOrder.msg, whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base font-bold flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-[0.99]"
                >
                  <MessageCircle size={20} />
                  <span>Send Payment Proof via WhatsApp 💬</span>
                </a>
              </div>
            )}

            {/* COD Confirmation Card */}
            {!isJc && (
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-zinc-200/90 shadow-xs flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Banknote size={22} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-zinc-950">Cash on Delivery (COD)</h2>
                    <p className="text-xs text-zinc-500">Pay exact cash to courier rider upon delivery</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs flex justify-between items-center">
                  <span className="text-zinc-600 font-medium">Cash Due at Doorstep:</span>
                  <span className="font-mono text-base font-extrabold text-zinc-950">
                    Rs. {confirmedOrder.total.toLocaleString()}
                  </span>
                </div>

                <a
                  href={wa(confirmedOrder.msg, whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle size={17} />
                  <span>Confirm on WhatsApp With Store 💬</span>
                </a>
              </div>
            )}

            {/* Delivery Destination Summary */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-zinc-200/80 shadow-xs text-xs flex flex-col gap-2.5">
              <h3 className="font-bold text-zinc-950 text-sm mb-1">Delivery Destination</h3>
              <div className="grid grid-cols-2 gap-2 text-zinc-600">
                <div>
                  <span className="text-zinc-400 block text-[11px]">Recipient Name</span>
                  <span className="font-semibold text-zinc-900">{confirmedOrder.customer.name}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">Phone</span>
                  <span className="font-semibold text-zinc-900 font-mono">{confirmedOrder.customer.phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-zinc-400 block text-[11px]">Address</span>
                  <span className="font-semibold text-zinc-900">
                    {confirmedOrder.customer.address}, {confirmedOrder.customer.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Navigation Links */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={`/track?orderId=${confirmedOrder.orderId}`}
                className="flex-1 py-3 px-5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors text-center"
              >
                <Truck size={15} />
                <span>Track Live Order Status</span>
              </Link>
              <Link
                href="/shop"
                className="flex-1 py-3 px-5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-bold flex items-center justify-center gap-2 border border-zinc-300 transition-colors text-center"
              >
                <span>Continue Shopping</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!items.length) {
    return (
      <Layout>
        <div className="wrap text-center py-28 px-5">
          <p className="text-zinc-500 text-lg mb-4">Your shopping bag is empty.</p>
          <Link href="/shop" className="btn inline-block">
            Explore Footwear Catalog
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Checkout — Hangu Branded Shoes">
      <div className="bg-[#fafafa] text-zinc-900 min-h-screen pt-8 pb-20">
        <form
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          onSubmit={submit}
        >
          {/* Hidden Honeypot Input for Bot Protection */}
          <input
            type="text"
            name="website"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="hidden pointer-events-none"
            aria-hidden="true"
          />

          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Section 1: Customer Details */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-xs">
              <h2 className="text-xl font-bold text-zinc-950 mb-4">Delivery Information</h2>
              <div className="flex flex-col gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">Full Name</label>
                  <input
                    className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-zinc-950 font-medium text-xs sm:text-sm placeholder:text-zinc-500 outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 shadow-xs transition-all"
                    required
                    placeholder="e.g. Muhammad Ahmad"
                    value={f.name}
                    onChange={set("name")}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">Mobile / WhatsApp Number</label>
                  <input
                    className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-zinc-950 font-medium text-xs sm:text-sm placeholder:text-zinc-500 outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 shadow-xs transition-all font-mono"
                    required
                    type="tel"
                    placeholder="e.g. 0333 1234567"
                    value={f.phone}
                    onChange={set("phone")}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">Destination City</label>
                  <input
                    className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-zinc-950 font-medium text-xs sm:text-sm placeholder:text-zinc-500 outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 shadow-xs transition-all"
                    required
                    placeholder="e.g. Hangu, Kohat, Peshawar, Islamabad, Lahore..."
                    value={f.city}
                    onChange={set("city")}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">Complete Delivery Address</label>
                  <textarea
                    className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-zinc-950 font-medium text-xs sm:text-sm placeholder:text-zinc-500 outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 shadow-xs transition-all"
                    required
                    rows={3}
                    placeholder="House/Shop No, Street, Mohallah / Landmark"
                    value={f.address}
                    onChange={set("address")}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Payment Method Selection */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-xs">
              <h2 className="text-xl font-bold text-zinc-950 mb-4">Payment Method</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
                {/* Option 1: Cash on Delivery (Default) */}
                {isCodEnabled && (
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all relative ${
                      effectiveMethod === "cod"
                        ? "border-zinc-950 bg-zinc-950/5 ring-1 ring-zinc-950"
                        : "border-zinc-200 bg-[#f4f4f6] hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                        <Banknote size={20} />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-800 tracking-wide uppercase">
                        Recommended
                      </span>
                    </div>
                    <div className="font-bold text-zinc-900 text-sm">Cash on Delivery (COD)</div>
                    <div className="text-zinc-500 text-xs mt-1 leading-snug">
                      Pay cash to courier when your shoes arrive at your door.
                    </div>
                    {Number(liveSettings?.codFee) > 0 && (
                      <div className="mt-2 text-[11px] text-amber-700 font-mono font-semibold">
                        +Rs. {Number(liveSettings?.codFee).toLocaleString()} COD handling
                      </div>
                    )}
                  </div>
                )}

                {/* Option 2: JazzCash */}
                <div
                  onClick={() => setPaymentMethod("jazzcash")}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                    effectiveMethod === "jazzcash"
                      ? "border-red-600 bg-red-50/50 ring-1 ring-red-600"
                      : "border-zinc-200 bg-[#f4f4f6] hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                      <Smartphone size={20} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 tracking-wide uppercase">
                      JazzCash
                    </span>
                  </div>
                  <div className="font-bold text-zinc-900 text-sm">Pay via JazzCash</div>
                  <div className="text-zinc-500 text-xs mt-1 leading-snug">
                    Account: <strong>{jazzcashTitle || "Muhammad Atif Ibrahim"}</strong>
                  </div>
                </div>
              </div>

              {/* COD Informational Box */}
              {effectiveMethod === "cod" && (
                <div className="p-5 rounded-2xl border border-zinc-200 bg-[#f4f4f6]">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-white text-zinc-900 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Truck size={18} />
                    </div>
                    <div className="text-xs leading-relaxed">
                      <b className="text-zinc-900 text-sm block mb-1">Pay Cash Upon Delivery</b>
                      <p className="text-zinc-600">
                        No advance payment needed. Enter your address above and click below to confirm via WhatsApp.
                        Our team will verify your size before courier dispatch.
                      </p>
                      <div className="mt-3 inline-flex items-center gap-2 text-xs text-zinc-800 bg-white px-3 py-1.5 rounded-lg border border-zinc-200">
                        <ShieldCheck size={14} className="text-emerald-600" /> Pay exact amount of <strong>Rs. {effectiveTotal.toLocaleString()}</strong> to the rider.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* JazzCash Section (Public - Shows ONLY Account Title 'Muhammad Atif Ibrahim', NO Phone Number) */}
              {effectiveMethod === "jazzcash" && (
                <div className="p-5 sm:p-6 rounded-2xl border border-red-200 bg-red-50/40">
                  <div className="flex items-center justify-between pb-3.5 border-b border-red-200/70">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        JC
                      </span>
                      <div>
                        <b className="text-zinc-950 text-sm block">Pay via JazzCash</b>
                        <span className="text-xs text-zinc-600">
                          Account Title:{" "}
                          <strong className="text-zinc-950 font-bold">
                            {jazzcashTitle || "Muhammad Atif Ibrahim"}
                          </strong>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 block uppercase font-mono font-semibold">Amount to Pay</span>
                      <b className="text-zinc-950 text-base font-mono font-bold">Rs. {effectiveTotal.toLocaleString()}</b>
                    </div>
                  </div>

                  <div className="mt-4 p-4 rounded-xl bg-white border border-red-100 flex items-start gap-3 shadow-xs">
                    <ShieldCheck className="text-red-600 shrink-0 mt-0.5" size={20} />
                    <div className="text-xs leading-relaxed">
                      <b className="text-zinc-950 text-xs block mb-0.5">Secure Payment Verification</b>
                      <p className="text-zinc-600">
                        To maintain payment security, our official JazzCash account number will be revealed immediately on the confirmation step after you confirm your order details.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-zinc-600 space-y-2">
                    <p className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">1</span>
                      <span>Enter your name and delivery address above.</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">2</span>
                      <span>Click <b>&quot;Confirm Order &amp; Get JazzCash Details&quot;</b> below to view official account number, one-click copy, and WhatsApp confirmation.</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  100% Genuine Sole Footwear
                </span>
                <span>•</span>
                <span>7-Day Free Size Exchange</span>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs flex flex-col gap-3 sticky top-24">
            <h2 className="text-base font-bold text-zinc-950 mb-2">Order Summary</h2>

            <div className="divide-y divide-zinc-100 max-h-60 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i.k} className="py-2.5 flex items-center gap-3 text-xs">
                  <div className="w-12 h-12 rounded-lg bg-[#f4f4f6] border border-zinc-200/60 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={resolveProductImage(i.img)}
                      alt={i.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <b className="text-zinc-900 block truncate">{i.name}</b>
                    <span className="text-zinc-500">
                      Size: <span className="font-mono text-zinc-800">{i.size}</span> × {i.q}
                    </span>
                  </div>
                  <span className="text-zinc-900 font-mono font-semibold shrink-0">
                    Rs. {(i.price * i.q).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-zinc-600 text-xs pt-3 border-t border-zinc-100">
              <span>Subtotal</span>
              <span className="font-mono font-bold text-zinc-900">Rs. {sub.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-zinc-600 text-xs">
              <span>Nationwide Delivery</span>
              <span className="font-mono font-bold text-zinc-900">
                {effectiveShipping === 0 ? (
                  <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    FREE
                  </span>
                ) : (
                  `Rs. ${effectiveShipping}`
                )}
              </span>
            </div>

            {effectiveMethod === "cod" && codFee > 0 && (
              <div className="flex justify-between text-amber-800 text-xs">
                <span>COD Handling Fee</span>
                <span className="font-mono font-bold">Rs. {codFee.toLocaleString()}</span>
              </div>
            )}

            <div className="border-t border-zinc-100 my-1" />

            <div className="flex justify-between text-zinc-950 font-extrabold text-base">
              <span>{effectiveMethod === "cod" ? "Cash Due on Delivery" : "Total Payable"}</span>
              <span className="font-mono text-lg">
                Rs. {effectiveTotal.toLocaleString()}
              </span>
            </div>

            <button
              type="submit"
              disabled={createOrderMutation.isPending}
              className="w-full mt-3 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-wide disabled:opacity-50 flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>
                {createOrderMutation.isPending
                  ? "Recording Order..."
                  : effectiveMethod === "jazzcash"
                  ? "Confirm Order & Get JazzCash Details 📱"
                  : "Confirm Order (Cash on Delivery) 🚚"}
              </span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
