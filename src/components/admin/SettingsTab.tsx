import { useState, useEffect, FormEvent } from "react";
import { StoreSettingsFormData } from "./types";
import { Settings, Save, Check, ShieldCheck, Truck, CreditCard, Building2, Smartphone } from "lucide-react";

interface SettingsTabProps {
  initialSettings: any;
  onSaveSettings: (settings: StoreSettingsFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function SettingsTab({
  initialSettings,
  onSaveSettings,
  isLoading = false,
}: SettingsTabProps) {
  const [form, setForm] = useState<StoreSettingsFormData>({
    shopName: "Hangu Branded Shoes",
    phone: "+92 345 9680373",
    whatsappNumber: "923459680373",
    email: "info@hangubrandedshoes.com",
    address: "Main Bazar, Hangu, KP, Pakistan",
    shippingFee: 250,
    freeShippingThreshold: 5000,
    announcementText: "Special 10% OFF with code: HANGU10 | Free Delivery Across Pakistan on Rs. 5000+",
    isStoreOpen: true,
    jazzcashNumber: "03333147691",
    jazzcashTitle: "Hangu Branded Shoes",
    easypaisaNumber: "03333147691",
    easypaisaTitle: "Hangu Branded Shoes",
    bankName: "Meezan Bank Limited",
    bankAccountTitle: "Hangu Branded Shoes",
    bankAccountNumber: "01020304050607",
    bankIban: "PK00MEZN0000000102030405",
  });

  const [saving, setSaving] = useState<boolean>(false);
  const [savedToast, setSavedToast] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (initialSettings) {
      setForm((prev) => ({
        ...prev,
        ...initialSettings,
        // Fallback defaults if fields are empty
        jazzcashNumber: initialSettings.jazzcashNumber || prev.jazzcashNumber,
        jazzcashTitle: initialSettings.jazzcashTitle || prev.jazzcashTitle,
        easypaisaNumber: initialSettings.easypaisaNumber || prev.easypaisaNumber,
        easypaisaTitle: initialSettings.easypaisaTitle || prev.easypaisaTitle,
        bankName: initialSettings.bankName || prev.bankName,
        bankAccountTitle: initialSettings.bankAccountTitle || prev.bankAccountTitle,
        bankAccountNumber: initialSettings.bankAccountNumber || prev.bankAccountNumber,
        bankIban: initialSettings.bankIban || prev.bankIban,
      }));
    }
  }, [initialSettings]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await onSaveSettings(form);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    } catch (err: any) {
      setError(err?.message || "Failed to persist store settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="glass p-4 rounded-3xl border border-white/10 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Settings size={18} className="text-brand-gold" />
            <span>Store Configuration & Payment Accounts</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage live contact channels, delivery rates, and genuine JazzCash / EasyPaisa / Bank accounts
          </p>
        </div>

        {savedToast && (
          <div className="px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30 flex items-center gap-1.5 animate-fadeIn">
            <Check size={14} />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Section 1: Store & Contact Channels */}
        <div className="glass p-6 rounded-3xl border border-white/10">
          <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <ShieldCheck size={16} className="text-brand-gold" />
            <span>General Storefront Information</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Brand Name</label>
              <input
                type="text"
                required
                value={form.shopName}
                onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Official WhatsApp Order Number</label>
              <input
                type="text"
                required
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                placeholder="923459680373"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Helpline Phone Call</label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Support Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-gold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-zinc-300 font-semibold block mb-1">Store Physical Location</label>
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-gold"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Delivery & Shipping Rates */}
        <div className="glass p-6 rounded-3xl border border-white/10">
          <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Truck size={16} className="text-brand-gold" />
            <span>Shipping Fees & Announcement Banner</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Standard Delivery Fee (Rs.)</label>
              <input
                type="number"
                required
                min={0}
                value={form.shippingFee}
                onChange={(e) => setForm({ ...form, shippingFee: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Free Delivery Threshold (Rs.)</label>
              <input
                type="number"
                required
                min={0}
                value={form.freeShippingThreshold}
                onChange={(e) => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-brand-gold font-mono font-bold outline-none focus:border-brand-gold"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isStoreOpen"
                checked={form.isStoreOpen}
                onChange={(e) => setForm({ ...form, isStoreOpen: e.target.checked })}
                className="w-4 h-4 rounded accent-brand-red cursor-pointer"
              />
              <label htmlFor="isStoreOpen" className="text-zinc-300 cursor-pointer font-semibold">
                Store Open for Online Checkout
              </label>
            </div>

            <div className="sm:col-span-3">
              <label className="text-zinc-300 font-semibold block mb-1">Top Announcement Marquee Bar</label>
              <input
                type="text"
                required
                value={form.announcementText}
                onChange={(e) => setForm({ ...form, announcementText: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-gold"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Genuine Payment Accounts (JazzCash, EasyPaisa, Bank Transfer) */}
        <div className="glass p-6 rounded-3xl border border-white/10">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard size={16} className="text-brand-gold" />
              <span>Official Payment Accounts (Displayed on Checkout & WhatsApp Invoices)</span>
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Customers who select JazzCash, EasyPaisa, or Direct Bank Transfer will see these exact credentials to make payments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* JazzCash Box */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-brand-gold font-bold">
                <Smartphone size={16} />
                <span>📱 JazzCash Account</span>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Account Number / Mobile</label>
                <input
                  type="text"
                  required
                  value={form.jazzcashNumber}
                  onChange={(e) => setForm({ ...form, jazzcashNumber: e.target.value })}
                  placeholder="0333-3147691"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Account Title (Name)</label>
                <input
                  type="text"
                  required
                  value={form.jazzcashTitle}
                  onChange={(e) => setForm({ ...form, jazzcashTitle: e.target.value })}
                  placeholder="Hangu Branded Shoes"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            {/* EasyPaisa Box */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-green-400 font-bold">
                <Smartphone size={16} />
                <span>📱 EasyPaisa Account</span>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Account Number / Mobile</label>
                <input
                  type="text"
                  required
                  value={form.easypaisaNumber}
                  onChange={(e) => setForm({ ...form, easypaisaNumber: e.target.value })}
                  placeholder="0333-3147691"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Account Title (Name)</label>
                <input
                  type="text"
                  required
                  value={form.easypaisaTitle}
                  onChange={(e) => setForm({ ...form, easypaisaTitle: e.target.value })}
                  placeholder="Hangu Branded Shoes"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            {/* Bank Transfer Box */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Building2 size={16} />
                <span>🏦 Bank Transfer Account</span>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Bank Name</label>
                <input
                  type="text"
                  required
                  value={form.bankName}
                  onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                  placeholder="Meezan Bank Limited"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Account Title</label>
                <input
                  type="text"
                  required
                  value={form.bankAccountTitle}
                  onChange={(e) => setForm({ ...form, bankAccountTitle: e.target.value })}
                  placeholder="Hangu Branded Shoes"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Account / IBAN Number</label>
                <input
                  type="text"
                  required
                  value={form.bankIban || form.bankAccountNumber}
                  onChange={(e) => setForm({ ...form, bankIban: e.target.value, bankAccountNumber: e.target.value })}
                  placeholder="PK00MEZN0000000102030405"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-[11px] outline-none focus:border-brand-gold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn py-3.5 px-8 text-xs font-bold inline-flex items-center gap-2 shadow-glow disabled:opacity-50"
          >
            <Save size={15} />
            <span>{saving ? "Persisting to MongoDB..." : "Save Store & Payment Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
