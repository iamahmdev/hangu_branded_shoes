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
  Banknote,
  ShieldAlert,
  Trash2,
  Plus,
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
    address: "Hangu tall road tahir markit hangu brand shoes 👟",
    shopTiming: "8:00 AM to 5:00 PM",
    shippingFee: 250,
    freeShippingThreshold: 5000,
    announcementText: "Free Delivery Across Pakistan on Orders Over Rs. 5,000 | 100% Genuine Sole Footwear",
    isStoreOpen: true,
    enableCod: true,
    codFee: 0,
    blockedPhoneNumbers: [],
    jazzcashNumber: "03275430305",
    jazzcashTitle: "Muhammad Atif Ibrahim",
    easypaisaNumber: "",
    easypaisaTitle: "",
  });

  const [saving, setSaving] = useState<boolean>(false);
  const [savedToast, setSavedToast] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [newBlockedPhone, setNewBlockedPhone] = useState<string>("");

  // Change password states
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [passLoading, setPassLoading] = useState<boolean>(false);
  const [passMsg, setPassMsg] = useState<{ text: string; error: boolean } | null>(null);

  useEffect(() => {
    if (initialSettings) {
      setForm((prev) => ({
        ...prev,
        ...initialSettings,
        enableCod: initialSettings.enableCod !== false,
        codFee: initialSettings.codFee ?? 0,
        blockedPhoneNumbers: Array.isArray(initialSettings.blockedPhoneNumbers) ? initialSettings.blockedPhoneNumbers : [],
        jazzcashNumber: initialSettings.jazzcashNumber ?? initialSettings.easypaisaNumber ?? "03275430305",
        jazzcashTitle: initialSettings.jazzcashTitle ?? initialSettings.easypaisaTitle ?? "Muhammad Atif Ibrahim",
        easypaisaNumber: "",
        easypaisaTitle: "",
        shopTiming: initialSettings.shopTiming ?? prev.shopTiming,
      }));
    }
  }, [initialSettings]);

  const handleAddBlockedPhone = () => {
    const clean = newBlockedPhone.trim().replace(/[\s\-]/g, "");
    if (!clean) return;
    const current = form.blockedPhoneNumbers || [];
    if (current.includes(clean)) {
      setNewBlockedPhone("");
      return;
    }
    setForm({ ...form, blockedPhoneNumbers: [...current, clean] });
    setNewBlockedPhone("");
  };

  const handleRemoveBlockedPhone = (phoneToRemove: string) => {
    const current = form.blockedPhoneNumbers || [];
    setForm({ ...form, blockedPhoneNumbers: current.filter((p) => p !== phoneToRemove) });
  };

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
      {/* Header Bar Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Settings size={18} className="text-emerald-600" />
            <span>Store Configuration & JazzCash Account</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage store brand details, timings, delivery rates, and official JazzCash account
          </p>
        </div>

        {savedToast && (
          <div className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 animate-fadeIn">
            <Check size={14} />
            <span>Settings Saved to Database!</span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Section 1: Store & Contact Channels */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>Store Details & Operating Channels</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Store Name</label>
              <input
                type="text"
                required
                value={form.shopName}
                onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Official WhatsApp Number</label>
              <input
                type="text"
                required
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                placeholder="923333147691"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Customer Helpline Phone</label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Support Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Shop Operating Timings</label>
              <input
                type="text"
                required
                value={form.shopTiming || "8:00 AM to 5:00 PM"}
                onChange={(e) => setForm({ ...form, shopTiming: e.target.value })}
                placeholder="8:00 AM to 5:00 PM"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>

            <div className="sm:col-span-2 md:col-span-1">
              <label className="text-slate-700 font-semibold block mb-1">Showroom Address</label>
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Delivery & Shipping Rates */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Truck size={16} className="text-blue-600" />
            <span>Shipping Fees & Store Availability</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Standard Delivery Fee (Rs.)</label>
              <input
                type="number"
                required
                min={0}
                value={form.shippingFee}
                onChange={(e) => setForm({ ...form, shippingFee: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Free Delivery Threshold (Rs.)</label>
              <input
                type="number"
                required
                min={0}
                value={form.freeShippingThreshold}
                onChange={(e) => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-emerald-700 font-mono font-bold outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isStoreOpen"
                checked={form.isStoreOpen}
                onChange={(e) => setForm({ ...form, isStoreOpen: e.target.checked })}
                className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
              />
              <label htmlFor="isStoreOpen" className="text-slate-800 cursor-pointer font-semibold">
                Store Open for Online Orders
              </label>
            </div>

            <div className="sm:col-span-3">
              <label className="text-slate-700 font-semibold block mb-1">Top Announcement Marquee Bar</label>
              <input
                type="text"
                required
                value={form.announcementText}
                onChange={(e) => setForm({ ...form, announcementText: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Cash on Delivery (COD) & Fake Order Protection */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Banknote size={16} className="text-amber-600" />
              <span>Cash on Delivery (COD) & Fake Order Protection</span>
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Enable or disable COD payments, set optional handling fees, and manage blocked numbers to protect against fake orders.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <label className="text-slate-900 font-semibold block mb-1">
                  Cash on Delivery Availability
                </label>
                <p className="text-slate-500 text-[11px] mb-3">
                  When enabled, customers can select COD at checkout without advance transfer.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableCod"
                  checked={form.enableCod !== false}
                  onChange={(e) => setForm({ ...form, enableCod: e.target.checked })}
                  className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                />
                <label htmlFor="enableCod" className="text-slate-900 font-bold cursor-pointer">
                  {form.enableCod !== false ? "COD is Active at Checkout" : "COD Disabled (JazzCash Only)"}
                </label>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="text-slate-900 font-semibold block mb-1">
                COD Extra Handling Fee (Rs.)
              </label>
              <p className="text-slate-500 text-[11px] mb-2">
                Optional extra fee for cash handling (e.g. 0 for free COD, or 50/100).
              </p>
              <input
                type="number"
                min={0}
                value={form.codFee ?? 0}
                onChange={(e) => setForm({ ...form, codFee: Number(e.target.value) })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-mono font-bold outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Blocked Phone Numbers Management */}
          <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldAlert size={14} /> Blocked Customer Phone Numbers (Fake Order Protection)
              </span>
              <span className="text-[10px] text-slate-500">
                {(form.blockedPhoneNumbers || []).length} blocked
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mb-3">
              Phone numbers listed here will be blocked by the server from placing new orders.
            </p>

            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                placeholder="Enter mobile number to block (e.g. 0333 1234567)"
                value={newBlockedPhone}
                onChange={(e) => setNewBlockedPhone(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddBlockedPhone();
                  }
                }}
                className="flex-1 bg-white border border-rose-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono outline-none focus:border-rose-400"
              />
              <button
                type="button"
                onClick={handleAddBlockedPhone}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 transition-all"
              >
                <Plus size={14} /> Add Block
              </button>
            </div>

            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
              {(form.blockedPhoneNumbers || []).length === 0 ? (
                <span className="text-slate-400 text-xs italic">No phone numbers currently blocked.</span>
              ) : (
                form.blockedPhoneNumbers!.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-100 border border-rose-200 text-rose-900 font-mono text-xs"
                  >
                    <span>{p}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlockedPhone(p)}
                      className="text-rose-600 hover:text-rose-900 transition-colors"
                      title="Unblock number"
                    >
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Official JazzCash Payment Configuration */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard size={16} className="text-red-600" />
              <span>Official JazzCash Account (Checkout Payment Account)</span>
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Customers will see these credentials at checkout to make payments.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-red-50/50 border border-red-200 max-w-xl flex flex-col gap-3 text-xs">
            <div className="flex items-center gap-2 text-red-800 font-bold">
              <Smartphone size={16} />
              <span>📱 JazzCash Account Details</span>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                JazzCash Mobile Number
              </label>
              <input
                type="text"
                value={form.jazzcashNumber ?? form.easypaisaNumber ?? ""}
                onChange={(e) => setForm({ ...form, jazzcashNumber: e.target.value, easypaisaNumber: "" })}
                placeholder="e.g. 03275430305"
                className="w-full bg-white border border-red-200 rounded-xl px-3 py-2 text-slate-900 font-mono outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                JazzCash Account Title (Beneficiary Name)
              </label>
              <input
                type="text"
                value={form.jazzcashTitle ?? form.easypaisaTitle ?? ""}
                onChange={(e) => setForm({ ...form, jazzcashTitle: e.target.value, easypaisaTitle: "" })}
                placeholder="e.g. Muhammad Atif Ibrahim"
                className="w-full bg-white border border-red-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="py-3 px-8 text-xs font-bold inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors disabled:opacity-50"
          >
            <Save size={15} />
            <span>{saving ? "Saving Changes..." : "Save Store & Payment Settings"}</span>
          </button>
        </div>
      </form>

      {/* Section 5: Admin Account Security (Change Password) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm mt-2">
        <div className="mb-4">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Lock size={16} className="text-slate-700" />
            <span>Admin Account Security & Password Change</span>
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Update your administrative login password. Make sure to use a strong, unique password.
          </p>
        </div>

        {passMsg && (
          <div
            className={`p-3 rounded-xl text-xs mb-4 flex items-center gap-2 ${
              passMsg.error
                ? "bg-rose-50 border border-rose-200 text-rose-700"
                : "bg-emerald-50 border border-emerald-200 text-emerald-700"
            }`}
          >
            {passMsg.error ? <AlertCircle size={14} /> : <Check size={14} />}
            <span>{passMsg.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="max-w-xl flex flex-col gap-3 text-xs">
          <div>
            <label className="text-slate-700 font-semibold block mb-1">Current Password</label>
            <input
              type="password"
              required
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">New Password (min 6 chars)</label>
              <input
                type="password"
                required
                value={passwords.next}
                onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={passLoading}
              className="py-2.5 px-5 text-xs font-bold inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white transition-colors"
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
