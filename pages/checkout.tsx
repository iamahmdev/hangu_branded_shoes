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
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "easypaisa">("cod");
  const [f, setF] = useState({ name: "", phone: "", city: "", address: "", tid: "" });
  const [hp, setHp] = useState<string>(""); // Honeypot field for bot protection
  const [copied, setCopied] = useState<boolean>(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string>("");
  const [screenshotUploading, setScreenshotUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");

  // Live Store Settings
  const { data: storeSettingsData } = useStoreSettings();
  const liveSettings = storeSettingsData?.data;

  const isCodEnabled = liveSettings?.enableCod !== false;
  const easypaisaNumber = liveSettings?.easypaisaNumber?.trim() || "";
  const easypaisaTitle = liveSettings?.easypaisaTitle?.trim() || "";
  const whatsappNumber = liveSettings?.whatsappNumber?.trim() || WA;
  const isEasyPaisaConfigured = Boolean(easypaisaNumber && easypaisaTitle);

  // If COD is disabled in settings, automatically switch to EasyPaisa
  useEffect(() => {
    if (!isCodEnabled && paymentMethod === "cod") {
      setPaymentMethod("easypaisa");
    }
  }, [isCodEnabled, paymentMethod]);

  const effectiveMethod = isCodEnabled ? paymentMethod : "easypaisa";

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

    // EasyPaisa checks
    if (effectiveMethod === "easypaisa") {
      if (!isEasyPaisaConfigured) {
        alert(
          "EasyPaisa is not configured yet by store administration. Please choose Cash on Delivery or contact WhatsApp."
        );
        return;
      }

      if (!f.tid.trim() || f.tid.trim().length < 5) {
        alert("Please provide a valid EasyPaisa Transaction ID (TID) from your transfer.");
        return;
      }
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
        : `🛍️ *NEW ORDER (EASYPAISA) — HANGU BRANDED SHOES*\n` +
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
        codFee,
        totalAmount: effectiveTotal,
        paymentMethod: effectiveMethod,
        transactionId: effectiveMethod === "easypaisa" ? f.tid.trim() : undefined,
        paymentScreenshot: effectiveMethod === "easypaisa" ? screenshotUrl || undefined : undefined,
        hp,
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
              "Could not record your order in the database. Please check your details and try again."
          );
        },
      }
    );
  };

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

                {/* Option 2: EasyPaisa */}
                <div
                  onClick={() => setPaymentMethod("easypaisa")}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                    effectiveMethod === "easypaisa"
                      ? "border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600"
                      : "border-zinc-200 bg-[#f4f4f6] hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <Smartphone size={20} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 tracking-wide uppercase">
                      EasyPaisa
                    </span>
                  </div>
                  <div className="font-bold text-zinc-900 text-sm">EasyPaisa Account</div>
                  <div className="text-zinc-500 text-xs mt-1 leading-snug">
                    Direct transfer via EasyPaisa mobile app or *786#.
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

              {/* EasyPaisa Box */}
              {effectiveMethod === "easypaisa" && (
                <div>
                  {!isEasyPaisaConfigured ? (
                    <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50 text-amber-900">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                        <div className="text-xs leading-relaxed">
                          <b className="text-zinc-900 text-sm block mb-1">EasyPaisa Account Not Configured</b>
                          Payment details are currently being updated. Please choose Cash on Delivery above or contact our official WhatsApp:
                          <div className="mt-3">
                            <a
                              href={wa("Assalam-o-Alaikum! I want to place an order directly on WhatsApp.", whatsappNumber)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                            >
                              <MessageCircle size={15} /> Order Directly on WhatsApp
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40">
                      <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                            EP
                          </span>
                          <div>
                            <b className="text-zinc-900 text-sm block">EasyPaisa Mobile Account</b>
                            <span className="text-zinc-500 text-xs">Title: <strong className="text-zinc-900">{easypaisaTitle}</strong></span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-zinc-500 block uppercase font-mono">Amount to Send</span>
                          <b className="text-zinc-950 text-base font-mono">Rs. {effectiveTotal.toLocaleString()}</b>
                        </div>
                      </div>

                      <div className="mt-4 p-3.5 rounded-xl bg-white border border-emerald-200 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-zinc-500 block">EasyPaisa Number</span>
                          <span className="font-mono text-lg font-extrabold text-zinc-950 tracking-wider">
                            {easypaisaNumber}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyAccount}
                          className="px-3 py-1.5 rounded-lg bg-[#f4f4f6] hover:bg-zinc-200 text-zinc-900 text-xs font-semibold flex items-center gap-1.5 transition-all border border-zinc-200"
                        >
                          {copied ? (
                            <>
                              <Check size={14} className="text-emerald-600" />
                              <span className="text-emerald-700 font-bold">Copied!</span>
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
                      <div className="mt-4 text-xs text-zinc-600 space-y-1.5">
                        <p className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">1</span>
                          <span>Open your EasyPaisa app or dial <b>*786#</b>.</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">2</span>
                          <span>Send <b>Rs. {effectiveTotal.toLocaleString()}</b> to <b>{easypaisaNumber}</b> ({easypaisaTitle}).</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">3</span>
                          <span>Copy your <b>Transaction ID (TID)</b> and enter below:</span>
                        </p>
                      </div>

                      {/* TID Input */}
                      <div className="mt-4">
                        <label className="text-xs font-semibold text-zinc-700 block mb-1">
                          Transaction ID (TID) <span className="text-rose-600">*</span>
                        </label>
                        <input
                          className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-zinc-950 font-medium text-sm placeholder:text-zinc-500 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 shadow-xs transition-all font-mono"
                          required
                          placeholder="e.g. 24891048291"
                          value={f.tid}
                          onChange={set("tid")}
                        />
                      </div>

                      {/* Payment Screenshot Upload */}
                      <div className="mt-4 pt-4 border-t border-emerald-200/60">
                        <label className="text-xs font-semibold text-zinc-700 block mb-1">
                          Payment Screenshot (Optional)
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-semibold border border-zinc-200 transition-all shadow-xs">
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
                            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                              <FileCheck2 size={15} /> Screenshot Attached
                            </span>
                          )}
                        </div>
                        {uploadError && (
                          <p className="text-rose-600 text-xs mt-1.5">{uploadError}</p>
                        )}
                        {screenshotUrl && (
                          <div className="mt-3 relative w-24 h-24 rounded-xl overflow-hidden border border-zinc-200 bg-white">
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
              disabled={
                createOrderMutation.isPending ||
                (effectiveMethod === "easypaisa" && (!isEasyPaisaConfigured || screenshotUploading))
              }
              className="w-full mt-3 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-wide disabled:opacity-50 flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>
                {createOrderMutation.isPending
                  ? "Recording Order & Opening WhatsApp..."
                  : "Confirm Order via WhatsApp 💬"}
              </span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
