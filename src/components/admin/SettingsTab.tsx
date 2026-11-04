import { useState, useEffect, FormEvent } from "react";
import { StoreSettingsFormData } from "./types";
import {
  Settings,
  Save,
  Check,
  ShieldCheck,
  Truck,
  CreditCard,
  Smartphone,
  Lock,
  KeyRound,
  Clock,
  AlertCircle,
} from "lucide-react";

interface SettingsTabProps {
  initialSettings: any;
  onSaveSettings: (settings: StoreSettingsFormData) => Promise<void>;
  onChangePassword?: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  isLoading?: boolean;
}

export default function SettingsTab({
  initialSettings,
  onSaveSettings,
  onChangePassword,
  isLoading = false,
}: SettingsTabProps) {
  const [form, setForm] = useState<StoreSettingsFormData>({
    shopName: "Hangu Branded Shoes",
    phone: "0333-3147691",
    whatsappNumber: "923333147691",
    email: "info@hangubrandedshoes.com",
    address: "Main Commercial Bazaar, Hangu District, Khyber Pakhtunkhwa (KP), Pakistan",
    shopTiming: "8:00 AM to 5:00 PM",
    shippingFee: 250,
    freeShippingThreshold: 5000,
    announcementText: "Free Delivery Across Pakistan on Orders Over Rs. 5,000 | 100% Genuine Sole Footwear",
    isStoreOpen: true,
    easypaisaNumber: "",
    easypaisaTitle: "",
  });

  const [saving, setSaving] = useState<boolean>(false);
  const [savedToast, setSavedToast] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Change password states
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [passLoading, setPassLoading] = useState<boolean>(false);
  const [passMsg, setPassMsg] = useState<{ text: string; error: boolean } | null>(null);

  useEffect(() => {
    if (initialSettings) {
      setForm((prev) => ({
        ...prev,
        ...initialSettings,
        easypaisaNumber: initialSettings.easypaisaNumber ?? "",
        easypaisaTitle: initialSettings.easypaisaTitle ?? "",
        shopTiming: initialSettings.shopTiming ?? prev.shopTiming,
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

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    if (passwords.next.length < 6) {
      setPassMsg({ text: "New password must be at least 6 characters long.", error: true });
      return;
    }

    if (passwords.next !== passwords.confirm) {
      setPassMsg({ text: "New passwords do not match.", error: true });
      return;
    }

    if (!onChangePassword) {
      setPassMsg({ text: "Password change is not configured in this view.", error: true });
      return;
    }

    setPassLoading(true);
    try {
      const res = await onChangePassword(passwords.current, passwords.next);
      if (res.success) {
        setPassMsg({ text: res.message || "Password updated successfully!", error: false });
        setPasswords({ current: "", next: "", confirm: "" });
      } else {
        setPassMsg({ text: res.message || "Failed to change password.", error: true });
      }
    } catch (err: any) {
      setPassMsg({ text: err?.message || "Error updating password.", error: true });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="glass p-4 rounded-3xl border border-white/10 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Settings size={18} className="text-brand-gold" />
            <span>Store Configuration & EasyPaisa Account</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage store brand details, timings, delivery rates, and official EasyPaisa account
          </p>
        </div>

        {savedToast && (
          <div className="px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30 flex items-center gap-1.5 animate-fadeIn">
            <Check size={14} />
            <span>Settings Saved to Database!</span>
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
            <span>Store Details & Operating Channels</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Store Name</label>
              <input
                type="text"
                required
                value={form.shopName}
                onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Official WhatsApp Number</label>
              <input
                type="text"
                required
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                placeholder="923333147691"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Customer Helpline Phone</label>
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

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">
                Shop Operating Timings
              </label>
              <input
                type="text"
                required
                value={form.shopTiming || "8:00 AM to 5:00 PM"}
                onChange={(e) => setForm({ ...form, shopTiming: e.target.value })}
                placeholder="8:00 AM to 5:00 PM"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-gold"
              />
            </div>

            <div className="sm:col-span-2 md:col-span-1">
              <label className="text-zinc-300 font-semibold block mb-1">Showroom Address</label>
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
            <span>Shipping Fees & Store Availability</span>
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
                Store Open for Online Orders
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

        {/* Section 3: Official EasyPaisa Payment Configuration (EasyPaisa ONLY) */}
        <div className="glass p-6 rounded-3xl border border-white/10">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard size={16} className="text-brand-gold" />
              <span>Official EasyPaisa Account (Checkout Payment Account)</span>
            </h4>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Customers will see these credentials at checkout to make payments. If left empty,
              checkout will clearly display a &quot;payment details not set&quot; notice and direct customers to WhatsApp.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 max-w-xl flex flex-col gap-3 text-xs">
            <div className="flex items-center gap-2 text-green-400 font-bold">
              <Smartphone size={16} />
              <span>📱 EasyPaisa Account Configuration</span>
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">
                EasyPaisa Mobile Number
              </label>
              <input
                type="text"
                value={form.easypaisaNumber}
                onChange={(e) => setForm({ ...form, easypaisaNumber: e.target.value })}
                placeholder="e.g. 03333147691 (Leave empty until client adds real number)"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">
                EasyPaisa Account Title (Beneficiary Name)
              </label>
              <input
                type="text"
                value={form.easypaisaTitle}
                onChange={(e) => setForm({ ...form, easypaisaTitle: e.target.value })}
                placeholder="e.g. Hangu Branded Shoes"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-brand-gold"
              />
            </div>
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn py-3.5 px-8 text-xs font-bold inline-flex items-center gap-2 shadow-glow disabled:opacity-50"
          >
            <Save size={15} />
            <span>{saving ? "Saving Changes..." : "Save Store & Payment Settings"}</span>
          </button>
        </div>
      </form>

      {/* Section 4: Admin Account Security (Change Password) */}
      <div className="glass p-6 rounded-3xl border border-white/10 mt-2">
        <div className="mb-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock size={16} className="text-brand-gold" />
            <span>Admin Account Security & Password Change</span>
          </h4>
          <p className="text-xs text-zinc-400 mt-1">
            Update your administrative login password. Make sure to use a strong, unique password.
          </p>
        </div>

        {passMsg && (
          <div
            className={`p-3 rounded-2xl text-xs mb-4 flex items-center gap-2 ${
              passMsg.error
                ? "bg-red-500/15 border border-red-500/30 text-red-400"
                : "bg-green-500/15 border border-green-500/30 text-green-400"
            }`}
          >
            {passMsg.error ? <AlertCircle size={14} /> : <Check size={14} />}
            <span>{passMsg.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="max-w-xl flex flex-col gap-3 text-xs">
          <div>
            <label className="text-zinc-300 font-semibold block mb-1">Current Password</label>
            <input
              type="password"
              required
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-gold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-300 font-semibold block mb-1">New Password (min 6 chars)</label>
              <input
                type="password"
                required
                value={passwords.next}
                onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={passLoading}
              className="btn ghost py-2.5 px-5 text-xs font-bold inline-flex items-center gap-2 hover:bg-white/10"
            >
              <KeyRound size={14} />
              <span>{passLoading ? "Updating Password..." : "Change Password"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
