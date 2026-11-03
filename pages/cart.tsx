import { useState } from "react";
import Link from "next/link";
import Layout from "../src/components/Layout";
import { useCart } from "../src/context/CartContext";
import { useVerifyCoupon } from "../src/hooks/useApi";
import { Tag, Check, ArrowRight } from "lucide-react";

export default function Cart() {
  const { items, setQ, sub, ship } = useCart();
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    freeShipping: boolean;
  } | null>(null);
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  const verifyCouponMutation = useVerifyCoupon();

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

  return (
    <Layout title="Shopping Cart — Hangu Branded Shoes">
      <div className="pg wrap pt-32 pb-16">
        <div className="title text-center mb-8">
          <small className="text-brand-red uppercase tracking-wider text-xs font-bold">
            YOUR CART
          </small>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-1">Shopping Cart</h2>
        </div>

        {!items.length ? (
          <div className="text-center py-16">
            <p className="text-zinc-400 mb-6 text-lg">Your cart is empty 🛒</p>
            <Link className="btn" href="/shop">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="two grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
            <div className="flex flex-col gap-3">
              {items.map((i) => (
                <div
                  className="row glass flex items-center gap-4 p-4 rounded-2xl border border-white/10"
                  key={i.k}
                >
                  <img
                    src={"/images/" + i.img}
                    alt={i.name}
                    className="w-20 h-20 rounded-xl object-cover bg-zinc-900 border border-white/10"
                  />
                  <div className="g flex-1 min-w-0">
                    <b className="text-white text-base block truncate">{i.name}</b>
                    <small className="text-zinc-400 text-xs">
                      Size: <span className="font-mono text-brand-gold">{i.size}</span>
                    </small>
                    <div className="price text-brand-gold font-bold text-sm mt-1 font-mono">
                      Rs. {i.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="qty flex items-center bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
                    <button
                      onClick={() => setQ(i.k, i.q - 1)}
                      className="text-white text-base w-6 h-6 flex items-center justify-center hover:text-brand-red"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <b className="px-2.5 text-xs text-white font-mono">{i.q}</b>
                    <button
                      onClick={() => setQ(i.k, i.q + 1)}
                      className="text-white text-base w-6 h-6 flex items-center justify-center hover:text-brand-red"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="sum glass p-6 rounded-3xl flex flex-col gap-3 h-fit border border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">Order Summary</h3>

              {/* Promo code field */}
              <div className="pb-3 border-b border-white/10">
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5 mb-1.5">
                  <Tag size={13} className="text-brand-gold" /> Promo Code
                </label>

                {!appliedCoupon ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none font-mono uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={verifyCouponMutation.isPending || !couponCode.trim()}
                      className="btn px-3 py-2 text-xs font-bold disabled:opacity-50"
                    >
                      {verifyCouponMutation.isPending ? "Applying..." : "Apply"}
                    </button>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-green-500/15 border border-green-500/30 flex items-center justify-between text-xs text-green-300">
                    <div className="flex items-center gap-1.5 font-mono font-bold">
                      <Check size={14} /> {appliedCoupon.code} Applied
                    </div>
                    <button
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponCode("");
                        setCouponMsg(null);
                      }}
                      className="text-zinc-400 hover:text-white"
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

              <p className="flex justify-between text-zinc-300 text-sm">
                <span>Subtotal</span>
                <span className="font-mono">Rs. {sub.toLocaleString()}</span>
              </p>

              <p className="flex justify-between text-zinc-300 text-sm">
                <span>Delivery</span>
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
                  <span>Discount</span>
                  <span className="font-mono">- Rs. {discountVal.toLocaleString()}</span>
                </p>
              )}

              <div className="border-t border-white/10 my-1" />

              <p className="t flex justify-between text-white font-extrabold text-lg">
                <span>Total</span>
                <span className="text-brand-gold font-mono text-xl">
                  Rs. {effectiveTotal.toLocaleString()}
                </span>
              </p>

              <Link
                className="btn w-full text-center mt-3 py-3 text-sm font-bold flex items-center justify-center gap-2"
                href="/checkout"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
