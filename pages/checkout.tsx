import { useState, useId, FormEvent, ChangeEvent } from "react";
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
  Clock,
  ArrowRight,
} from "lucide-react";
import { resolveProductImage } from "../src/utils/image";

export default function Checkout() {
  const { items, sub, ship, clear } = useCart();
  const [f, setF] = useState({ name: "", phone: "", city: "", address: "", tid: "" });
  const [copied, setCopied] = useState<boolean>(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string>("");
  const [screenshotUploading, setScreenshotUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");

  // Live Store Settings
  const { data: storeSettingsData } = useStoreSettings();
  const liveSettings = storeSettingsData?.data;

  const easypaisaNumber = liveSettings?.easypaisaNumber?.trim() || "";
  const easypaisaTitle = liveSettings?.easypaisaTitle?.trim() || "";
  const whatsappNumber = liveSettings?.whatsappNumber?.trim() || WA;
  const isPaymentConfigured = Boolean(easypaisaNumber && easypaisaTitle);

  // Dynamic Shipping & Total
  const freeThreshold = liveSettings?.freeShippingThreshold ?? 5000;
  const standardFee = liveSettings?.shippingFee ?? (sub >= freeThreshold ? 0 : 250);
  const effectiveShipping = sub >= freeThreshold ? 0 : standardFee;
  const effectiveTotal = sub + effectiveShipping;

  const createOrderMutation = useCreateOrder();
  const uploadReceiptMutation = useUploadPaymentReceipt();

  const set = (k: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  const handleCopyAccount = () => {
    if (!easypaisaNumber) return;
    navigator.clipboard.writeText(easypaisaNumber);
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
      setUploadError("Screenshot size exceeds 8MB limit.");
      return;
    }

    setUploadError("");
    setScreenshotUploading(true);

    uploadReceiptMutation.mutate(file, {
      onSuccess: (res) => {
        setScreenshotUploading(false);
        if (res.success && res.data?.url) {
          setScreenshotUrl(res.data.url);
        } else {
          setUploadError(res.message || "Failed to upload screenshot.");
        }
      },
      onError: (err: any) => {
        setScreenshotUploading(false);
        setUploadError(err?.message || "Screenshot upload failed. Please try again.");
      },
    });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();

    if (!isPaymentConfigured) {
      alert("Store payment details are currently being updated. Please contact us on WhatsApp directly.");
      return;
    }

    if (!f.tid.trim() || f.tid.trim().length < 5) {
      alert("Please provide a valid EasyPaisa Transaction ID (TID) from your transfer.");
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
      `🛍️ *NEW ORDER CONFIRMATION — HANGU BRANDED SHOES*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 *Order ID:* #${orderId}\n\n` +
      `👟 *Ordered Shoes:*\n${itemsSummary}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Subtotal: Rs. ${sub.toLocaleString()}\n` +
      `Shipping Delivery: ${effectiveShipping === 0 ? "FREE" : `Rs. ${effectiveShipping.toLocaleString()}`}\n` +
      `💰 *TOTAL PAID:* Rs. ${effectiveTotal.toLocaleString()}\n` +
      `📱 *Payment Method:* EasyPaisa\n` +
      `🔖 *Transaction ID (TID):* ${f.tid.trim()}\n` +
      (screenshotUrl ? `📸 *Payment Screenshot:* Uploaded to order record\n` : `📸 *Payment Screenshot:* Attached in this WhatsApp chat\n`) +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Customer Name:* ${f.name.trim()}\n` +
      `📞 *Phone / WhatsApp:* ${f.phone.trim()}\n` +
      `📍 *Delivery Address:* ${f.address.trim()}, ${f.city.trim()}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `_Assalam-o-Alaikum! I have transferred the amount via EasyPaisa. Please verify payment and dispatch my order._`;

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
        totalAmount: effectiveTotal,
        paymentMethod: "easypaisa",
        transactionId: f.tid.trim(),
        paymentScreenshot: screenshotUrl || undefined,
      },
      {
        onSuccess: () => {
          sessionStorage.setItem("lastOrder", JSON.stringify({ id: orderId, msg }));
          clear();
          // Seamless redirect directly to official WhatsApp with pre-filled details
          window.location.href = wa(msg, whatsappNumber);
        },
        onError: (err: any) => {
          alert(
            err?.message ||
              "Could not record your order in the database. Please check your connection and try again."
          );
        },
      }
    );
  };

  if (!items.length) {
    return (
      <Layout>
        <div className="pg wrap text-center py-28 px-5">
          <p className="text-zinc-400 text-lg mb-4">Your cart is empty.</p>
          <Link href="/shop" className="btn inline-block">
            Explore Footwear Catalog
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Checkout — Hangu Branded Shoes">
      <form
        className="pg wrap two pt-32 pb-16 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8"
        onSubmit={submit}
      >
        <div>
          {/* Section 1: Customer Details */}
          <h2 className="text-2xl font-bold text-white mb-4">Delivery Details</h2>
          <div className="flex flex-col gap-3">
            <input
              className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold"
              required
              placeholder="Full Name"
              value={f.name}
              onChange={set("name")}
            />
            <input
              className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold font-mono"
              required
              type="tel"
              placeholder="Phone / WhatsApp Number (e.g. 0333 1234567)"
              value={f.phone}
              onChange={set("phone")}
            />
            <input
              className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold"
              required
              placeholder="Destination City (e.g. Peshawar, Kohat, Islamabad, Lahore...)"
              value={f.city}
              onChange={set("city")}
            />
            <textarea
              className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold"
              required
              rows={3}
              placeholder="Complete Delivery Address (House/Shop No, Street, Mohallah / Landmark)"
              value={f.address}
              onChange={set("address")}
            />
          </div>

          {/* Section 2: EasyPaisa Payment Details */}
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Payment: EasyPaisa Only</h2>

          {!isPaymentConfigured ? (
            <div className="glass p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={20} />
                <div className="text-xs leading-relaxed">
                  <b className="text-white text-sm block mb-1">EasyPaisa Account Not Configured</b>
                  Payment details are currently being updated by store administration. Please
                  contact our official WhatsApp to place your order directly:
                  <div className="mt-3">
                    <a
                      href={wa("Assalam-o-Alaikum! I want to place an order directly on WhatsApp.", whatsappNumber)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                    >
                      <MessageCircle size={15} /> Order Directly on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass p-5 rounded-2xl border border-white/10 bg-zinc-950/70">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-xs">
                    EP
                  </span>
                  <div>
                    <b className="text-white text-sm block">EasyPaisa Mobile Account</b>
                    <span className="text-zinc-400 text-xs">Title: <strong className="text-zinc-200">{easypaisaTitle}</strong></span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-zinc-400 block uppercase font-mono">Amount to Send</span>
                  <b className="text-brand-gold text-base font-mono">Rs. {effectiveTotal.toLocaleString()}</b>
                </div>
              </div>

              <div className="mt-4 p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-zinc-400 block">EasyPaisa Number</span>
                  <span className="font-mono text-lg font-extrabold text-white tracking-wider">
                    {easypaisaNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Number</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instructions */}
              <div className="mt-4 text-xs text-zinc-300 space-y-1.5">
                <p className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">1</span>
                  <span>Open your EasyPaisa app or dial <b>*786#</b>.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">2</span>
                  <span>Send exactly <b>Rs. {effectiveTotal.toLocaleString()}</b> to <b>{easypaisaNumber}</b> ({easypaisaTitle}).</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">3</span>
                  <span>Copy your <b>Transaction ID (TID)</b> and enter it below:</span>
                </p>
              </div>

              {/* TID Input */}
              <div className="mt-4">
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  EasyPaisa Transaction ID (TID) <span className="text-brand-red">*</span>
                </label>
                <input
                  className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-brand-gold font-mono"
                  required
                  placeholder="e.g. 24891048291"
                  value={f.tid}
                  onChange={set("tid")}
                />
              </div>

              {/* Payment Screenshot Upload */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Payment Screenshot (Optional but recommended)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/15 transition-all">
                    <Upload size={14} />
                    <span>{screenshotUploading ? "Uploading to Cloudinary..." : "Upload Screenshot"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={screenshotUploading}
                      onChange={handleScreenshotChange}
                    />
                  </label>
                  {screenshotUrl && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-green-400 font-medium">
                      <FileCheck2 size={15} /> Screenshot Attached
                    </span>
                  )}
                </div>
                {uploadError && (
                  <p className="text-brand-red text-xs mt-1.5">{uploadError}</p>
                )}
                {screenshotUrl && (
                  <div className="mt-3 relative w-24 h-24 rounded-xl overflow-hidden border border-white/20 bg-zinc-900">
                    <img src={screenshotUrl} alt="Receipt preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setScreenshotUrl("")}
                      className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      title="Remove screenshot"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-brand-gold" />
              100% Genuine Sole Guarantee
            </span>
            <span>•</span>
            <span>7-Day Free Size Exchange</span>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="sum glass p-6 rounded-3xl flex flex-col gap-3 h-fit border border-white/10">
          <h3 className="text-xl font-bold text-white mb-2">Order Summary</h3>

          <div className="divide-y divide-white/5 max-h-60 overflow-y-auto pr-1">
            {items.map((i) => (
              <div key={i.k} className="py-2.5 flex items-center gap-3 text-xs">
                <img
                  src={resolveProductImage(i.img)}
                  alt={i.name}
                  className="w-12 h-12 rounded-lg object-cover bg-zinc-900 border border-white/10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <b className="text-white block truncate">{i.name}</b>
                  <span className="text-zinc-400">
                    Size: <span className="font-mono text-zinc-200">{i.size}</span> × {i.q}
                  </span>
                </div>
                <span className="text-zinc-300 font-mono font-semibold shrink-0">
                  Rs. {(i.price * i.q).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <p className="flex justify-between text-zinc-300 text-sm pt-3 border-t border-white/10">
            <span>Subtotal</span>
            <span className="font-mono">Rs. {sub.toLocaleString()}</span>
          </p>

          <p className="flex justify-between text-zinc-300 text-sm">
            <span>Nationwide Delivery</span>
            <span className="font-mono">
              {effectiveShipping === 0 ? (
                <span className="text-green-400 font-bold">FREE</span>
              ) : (
                `Rs. ${effectiveShipping}`
              )}
            </span>
          </p>

          <div className="border-t border-white/10 my-1" />

          <p className="t flex justify-between text-white font-extrabold text-lg">
            <span>Total Payable</span>
            <span className="text-brand-gold font-mono text-xl">
              Rs. {effectiveTotal.toLocaleString()}
            </span>
          </p>

          <button
            type="submit"
            disabled={createOrderMutation.isPending || !isPaymentConfigured || screenshotUploading}
            className="btn w-full mt-3 py-3 text-sm font-bold tracking-wide disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>
              {createOrderMutation.isPending
                ? "Recording Order & Opening WhatsApp..."
                : "Confirm Order via WhatsApp 💬"}
            </span>
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </Layout>
  );
}
