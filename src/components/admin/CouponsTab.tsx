import { useState, FormEvent } from "react";
import { CouponFormData } from "./types";
import { Plus, Tag, Trash2, X, Check, Percent, DollarSign } from "lucide-react";

interface CouponsTabProps {
  coupons: any[];
  onCreateCoupon: (coupon: CouponFormData) => Promise<void>;
  onDeleteCoupon: (id: string) => void;
  isLoading?: boolean;
}

export default function CouponsTab({
  coupons,
  onCreateCoupon,
  onDeleteCoupon,
  isLoading = false,
}: CouponsTabProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form, setForm] = useState<CouponFormData>({
    code: "",
    discountType: "percentage",
    discountAmount: 10,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    freeShipping: false,
    usageLimit: 500,
    description: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) return;

    setSubmitting(true);
    try {
      await onCreateCoupon({
        ...form,
        code: form.code.toUpperCase().trim(),
      });
      setShowModal(false);
      setForm({
        code: "",
        discountType: "percentage",
        discountAmount: 10,
        minOrderAmount: 0,
        maxDiscountAmount: 0,
        freeShipping: false,
        usageLimit: 500,
        description: "",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="glass p-4 rounded-3xl border border-white/10 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Tag size={18} className="text-brand-gold" />
            <span>Store Promo Codes & Discount Vouchers</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage promotional discount codes validated on cart & checkout
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn py-2.5 px-4 text-xs font-bold inline-flex items-center gap-1.5 shadow-glow"
        >
          <Plus size={15} />
          <span>Create Promo Code</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-white/5 uppercase text-zinc-400 text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount Value</th>
                <th className="p-4">Minimum Spend</th>
                <th className="p-4">Usage Counter</th>
                <th className="p-4">Free Delivery</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-zinc-400">
                    Loading promo codes from database...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-zinc-500">
                    No active discount coupons found. Click "Create Promo Code" to add one.
                  </td>
                </tr>
              ) : (
                coupons.map((c: any) => {
                  const isExpired = c.usageLimit && c.usageCount >= c.usageLimit;
                  const discountDisplay =
                    c.discountType === "percentage"
                      ? `${c.discountPercent || c.discountAmount}% OFF`
                      : `Rs. ${c.discountAmount} OFF`;

                  return (
                    <tr key={c._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <b className="text-brand-gold font-mono text-sm block tracking-widest font-extrabold">
                          {c.code}
                        </b>
                        {c.description && (
                          <span className="text-[11px] text-zinc-400 block mt-0.5">
                            {c.description}
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                          {discountDisplay}
                        </span>
                      </td>

                      <td className="p-4 font-mono text-zinc-300">
                        {c.minOrderAmount > 0
                          ? `Rs. ${c.minOrderAmount.toLocaleString()}`
                          : "No Minimum"}
                      </td>

                      <td className="p-4 font-mono text-zinc-300">
                        <span className="text-white font-bold">{c.usageCount || 0}</span>
                        <span className="text-zinc-500"> / {c.usageLimit || "∞"}</span>
                      </td>

                      <td className="p-4">
                        {c.freeShipping ? (
                          <span className="text-green-400 font-bold text-xs">✓ Included</span>
                        ) : (
                          <span className="text-zinc-500">Standard</span>
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            isExpired
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-green-500/20 text-green-400 border border-green-500/30"
                          }`}
                        >
                          {isExpired ? "Limit Reached" : "Active"}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Delete coupon "${c.code}"?`)) {
                              onDeleteCoupon(c._id);
                            }
                          }}
                          className="p-2 rounded-xl bg-white/5 hover:bg-red-500/15 text-zinc-400 hover:text-red-400 border border-white/10 transition-colors"
                          title="Delete Coupon"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="glass p-6 md:p-8 rounded-3xl max-w-md w-full border border-white/15 bg-zinc-950/95 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h2 className="text-lg font-bold text-white">Create New Promo Voucher</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Coupon Promo Code</label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. HANGU10 or EID2026"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-brand-gold font-mono font-bold tracking-widest outline-none focus:border-brand-gold uppercase text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Discount Type</label>
                  <select
                    value={form.discountType}
                    onChange={(e) =>
                      setForm({ ...form, discountType: e.target.value as "percentage" | "fixed" })
                    }
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none focus:border-brand-gold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">
                    {form.discountType === "percentage" ? "Discount %" : "Discount (Rs.)"}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.discountAmount}
                    onChange={(e) => setForm({ ...form, discountAmount: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Min Order (Rs.)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.minOrderAmount}
                    onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 font-semibold block mb-1">Usage Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="freeShipCheckbox"
                  checked={form.freeShipping}
                  onChange={(e) => setForm({ ...form, freeShipping: e.target.checked })}
                  className="rounded accent-brand-red w-4 h-4 cursor-pointer"
                />
                <label htmlFor="freeShipCheckbox" className="text-zinc-300 cursor-pointer">
                  Grant Free Nationwide Shipping with this code
                </label>
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Description / Notes</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Exclusive Eid al-Adha 10% Discount"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-gold"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn ghost py-2.5 px-4 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn py-2.5 px-5 text-xs font-bold disabled:opacity-50 inline-flex items-center gap-1.5 shadow-glow"
                >
                  <Check size={14} />
                  <span>{submitting ? "Creating..." : "Save Coupon"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

