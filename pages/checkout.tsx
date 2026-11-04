import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../src/components/Layout";
import { useCart } from "../src/context/CartContext";
import { PAY, wa } from "../src/data/config";
import { useVerifyCoupon, useCreateOrder, useStoreSettings } from "../src/hooks/useApi";
import { Tag, Check, ShieldCheck } from "lucide-react";

type PaymentMethod = "cod" | "jazzcash" | "easypaisa" | "bank";

export default function Checkout() {
  const { items, sub, ship, clear } = useCart();
  const { push } = useRouter();
  const [f, setF] = useState({ name: "", phone: "", city: "", address: "", tid: "" });
  const [m, setM] = useState<PaymentMethod>("cod");

  // Coupon state
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    freeShipping: boolean;
    description?: string;
  } | null>(null);
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  // TanStack Query Mutations & Live Store Settings
  const { data: storeSettingsData } = useStoreSettings();
  const liveSettings = storeSettingsData?.data;

  const currentPay = {
    jazzcash: {
      name: "JazzCash",
      acc: liveSettings?.jazzcashNumber || PAY.jazzcash.acc,
      title: liveSettings?.jazzcashTitle || PAY.jazzcash.title,
    },
    easypaisa: {
      name: "EasyPaisa",
      acc: liveSettings?.easypaisaNumber || PAY.easypaisa.acc,
      title: liveSettings?.easypaisaTitle || PAY.easypaisa.title,
    },
    bank: {
      name: liveSettings?.bankName || PAY.bank.name,
      acc: liveSettings?.bankIban || liveSettings?.bankAccountNumber || PAY.bank.acc,
      title: liveSettings?.bankAccountTitle || PAY.bank.title,
    },
  };

  const verifyCouponMutation = useVerifyCoupon();
  const createOrderMutation = useCreateOrder();

  const set = (k: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  // Effective calculations
  const effectiveShipping = appliedCoupon?.freeShipping ? 0 : ship;
  const discountVal = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const effectiveTotal = Math.max(0, sub + effectiveShipping - discountVal);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    setCouponMsg(null);

    verifyCouponMutation.mutate(
      { code: couponCode.trim(), subtotal: sub },
      {
        onSuccess: (res) => {
          if (res.success && res.coupon) {
            setAppliedCoupon({
              code: res.coupon.code,
              discountAmount: res.coupon.discountAmount,
              freeShipping: res.coupon.freeShipping,
              description: res.coupon.description,
            });
            setCouponMsg({ text: res.message || "Promo code applied!", error: false });
          } else {
            setAppliedCoupon(null);
            setCouponMsg({ text: res.message || "Invalid promo code.", error: true });
          }
        },
        onError: () => {
          setCouponMsg({ text: "Could not verify coupon.", error: true });
        },
      }
    );
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponMsg(null);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const id = "HBS" + Date.now().toString().slice(-6);
    const pay = m === "cod" ? "Cash on Delivery" : `${currentPay[m].name} (TID: ${f.tid})`;

    let discountSummary = "";
    if (appliedCoupon && discountVal > 0) {
      discountSummary = `\nPromo Code (${appliedCoupon.code}): -Rs.${discountVal}`;
    }

    const msg =
      `🛍 NEW ORDER ${id}\n\n` +
      items.map((i) => `• ${i.name} | Size ${i.size} | x${i.q} = Rs.${i.price * i.q}`).join("\n") +
      `\n\nSubtotal: Rs.${sub}\nDelivery: Rs.${effectiveShipping}${discountSummary}\nTOTAL: Rs.${effectiveTotal}\nPayment: ${pay}\n\n👤 ${f.name}\n📞 ${f.phone}\n📍 ${f.address}, ${f.city}`;

    // Persist order to database via TanStack Mutation
    createOrderMutation.mutate({
      orderId: id,
      customer: {
        name: f.name,
        phone: f.phone,
        city: f.city,
        address: f.address,
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
      discountAmount: discountVal,
      couponCode: appliedCoupon?.code || "",
      totalAmount: effectiveTotal,
      paymentMethod: m,
      transactionId: f.tid,
    });

    sessionStorage.setItem("lastOrder", JSON.stringify({ id, msg }));
    window.open(wa(msg), "_blank");
    clear();
    push(`/success?orderId=${id}`);
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
          <h2 className="text-2xl font-bold text-white mb-4">Delivery Details</h2>
          <div className="flex flex-col gap-3">
            <input
              className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-red"
              required
              placeholder="Full Name"
              value={f.name}
              onChange={set("name")}
            />
            <input
              className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-red font-mono"
              required
              type="tel"
              placeholder="Phone / WhatsApp Number"
              value={f.phone}
              onChange={set("phone")}
            />
            <input
              className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-red"
              required
              placeholder="Destination City (e.g. Peshawar, Islamabad, Kohat, Lahore...)"
              value={f.city}
              onChange={set("city")}
            />
            <textarea
              className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-red"
              required
              rows={3}
              placeholder="Complete Delivery Address (House/Shop No, Street, Colony, Landmark)"
              value={f.address}
              onChange={set("address")}
            />
          </div>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Payment Method</h2>
          <div className="flex flex-col gap-2">
            {[
              ["cod", "💵 Cash on Delivery (Inspect shoes before payment)"],
              ["jazzcash", "📱 JazzCash"],
              ["easypaisa", "📱 EasyPaisa"],
              ["bank", "🏦 Bank Transfer"],
            ].map(([k, l]) => (
              <div
                key={k}
                className={`pay p-3.5 rounded-xl border cursor-pointer font-medium text-sm transition-all ${
                  m === k
                    ? "on bg-brand-red/15 border-brand-red text-white"
                    : "bg-white/5 border-white/10 text-zinc-300 hover:text-white"
                }`}
                onClick={() => setM(k as PaymentMethod)}
              >
                {l}
              </div>
            ))}
          </div>

          {m !== "cod" && (
            <div className="glass note p-4 rounded-xl mt-3 text-xs text-zinc-300">
              Transfer to {currentPay[m].name}: <b className="text-white">{currentPay[m].acc}</b> ({currentPay[m].title}
              ). Send Rs. {effectiveTotal.toLocaleString()} and enter the Transaction ID below:
              <input
                className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs mt-2 outline-none focus:border-brand-red font-mono"
                required
                placeholder="Transaction ID (TID)"
                value={f.tid}
                onChange={set("tid")}
              />
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

        {/* Right: Order Summary with Promo Coupon Box */}
        <div className="sum glass p-6 rounded-3xl flex flex-col gap-3 h-fit border border-white/10">
          <h3 className="text-xl font-bold text-white mb-2">Order Summary</h3>

          <div className="divide-y divide-white/5 max-h-60 overflow-y-auto pr-1">
            {items.map((i) => (
              <div key={i.k} className="py-2 flex justify-between items-center text-xs">
                <div>
                  <b className="text-white block">{i.name}</b>
                  <span className="text-zinc-400">
                    Size: {i.size} × {i.q}
                  </span>
                </div>
                <span className="text-zinc-300 font-mono">
                  Rs. {(i.price * i.q).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Promo Code Input Box */}
          <div className="pt-3 border-t border-white/10">
            <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5 mb-1.5">
              <Tag size={13} className="text-brand-gold" /> Have a Promo Code?
            </label>

            {!appliedCoupon ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME10 or HANGU500"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none font-mono placeholder:text-zinc-500 uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={verifyCouponMutation.isPending || !couponCode.trim()}
                  className="btn px-4 py-2 text-xs font-bold whitespace-nowrap disabled:opacity-50"
                >
                  {verifyCouponMutation.isPending ? "Checking..." : "Apply"}
                </button>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-green-500/15 border border-green-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-green-400" />
                  <span className="text-xs font-mono font-bold text-green-300">
                    {appliedCoupon.code} Applied!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-xs text-zinc-400 hover:text-white"
                  title="Remove coupon"
                >
                  ✕
                </button>
              </div>
            )}

            {couponMsg && (
              <p
                className={`text-[11px] mt-1.5 ${
                  couponMsg.error ? "text-brand-red" : "text-green-400"
                }`}
              >
                {couponMsg.text}
              </p>
            )}
          </div>

          <p className="flex justify-between text-zinc-300 text-sm pt-2 border-t border-white/10">
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

          {discountVal > 0 && (
            <p className="flex justify-between text-green-400 text-sm font-semibold">
              <span>Promo Discount</span>
              <span className="font-mono">- Rs. {discountVal.toLocaleString()}</span>
            </p>
          )}

          <p className="t flex justify-between text-white font-extrabold text-lg pt-2 border-t border-white/10">
            <span>Total Payable</span>
            <span className="text-brand-gold font-mono text-xl">
              Rs. {effectiveTotal.toLocaleString()}
            </span>
          </p>

          <button
            type="submit"
            disabled={createOrderMutation.isPending}
            className="btn w-full mt-3 py-3 text-sm font-bold tracking-wide disabled:opacity-50"
          >
            {createOrderMutation.isPending
              ? "Placing Order..."
              : "Confirm Order & Open WhatsApp ✓"}
          </button>
        </div>
      </form>
    </Layout>
  );
}
