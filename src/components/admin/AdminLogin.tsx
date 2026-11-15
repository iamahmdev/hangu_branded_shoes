import Head from "next/head";
import Link from "next/link";
import { useState, FormEvent } from "react";
import {
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Store,
  Eye,
  EyeOff,
  KeyRound,
  X,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import { api } from "../../services/api";

interface AdminLoginProps {
  onLogin: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; message?: string }>;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  // Forgot Password / Recovery Modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState<boolean>(false);
  const [recoveryForm, setRecoveryForm] = useState({
    emailOrUser: "",
    recoveryKey: "",
    newPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [recoveryLoading, setRecoveryLoading] = useState<boolean>(false);
  const [recoveryError, setRecoveryError] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await onLogin(form.usernameOrEmail, form.password);
      if (!res.success) {
        setError(res.message || "Invalid administrative credentials. Please verify and try again.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setRecoveryError("");
    setRecoveryLoading(true);

    try {
      const res = await api.adminRecoverPassword({
        email: recoveryForm.emailOrUser.trim(),
        recoveryKey: recoveryForm.recoveryKey.trim(),
        newPassword: recoveryForm.newPassword.trim(),
      });

      if (res.success) {
        setIsForgotModalOpen(false);
        setRecoveryForm({ emailOrUser: "", recoveryKey: "", newPassword: "" });
        setSuccessMsg(res.message || "Password successfully reset! You can now sign in with your new password.");
      } else {
        setRecoveryError(res.message || "Invalid recovery details. Please check your recovery key.");
      }
    } catch (err: any) {
      setRecoveryError(err?.message || "Recovery service error. Please try again.");
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Portal Login — Hangu Branded Shoes</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100/80 text-slate-800 font-sans flex flex-col justify-between p-4 md:p-6 relative overflow-hidden">
        {/* Subtle modern ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

        {/* Top return link */}
        <div className="w-full max-w-md mx-auto flex items-center justify-between z-10 pt-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:border-emerald-300 shadow-2xs transition-all"
          >
            <Store size={14} className="text-emerald-600" />
            <span>Back to Storefront</span>
          </Link>
          <span className="text-[11px] text-slate-500 font-mono bg-white border border-slate-200/90 px-2.5 py-1 rounded-full shadow-2xs">
            Hangu Shoes OS v2.0
          </span>
        </div>

        {/* Center Modern Luxury Card */}
        <div className="w-full max-w-md mx-auto my-auto z-10 py-6">
          <div className="bg-white p-7 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50">
            <div className="text-center mb-7">
              {/* Official Store Logo with Emerald Ring */}
              <img
                src="/images/logo.png"
                alt="Hangu Branded Shoes"
                className="w-16 h-16 rounded-full object-contain mx-auto bg-white p-1 ring-4 ring-emerald-500/20 shadow-md mb-3.5"
              />

              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-bold tracking-widest uppercase mb-2">
                <ShieldCheck size={12} className="text-emerald-600" />
                <span>STORE ADMINISTRATION</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Admin Portal
              </h1>
              <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                Sign in with authorized administrator credentials to manage catalog, orders, and store operations.
              </p>
            </div>

            {/* Success notification */}
            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs mb-5 flex items-center gap-2 animate-fadeIn font-semibold">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Error notification */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs mb-5 flex items-center gap-2 animate-fadeIn font-semibold">
                <span className="shrink-0 font-bold text-rose-600">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Username or Official Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={form.usernameOrEmail}
                    onChange={(e) => setForm({ ...form, usernameOrEmail: e.target.value })}
                    placeholder="Enter your username or email"
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:bg-white rounded-2xl pl-11 pr-4 py-3 text-slate-900 text-sm outline-none transition-all font-sans placeholder:text-slate-400 shadow-2xs"
                  />
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter your password"
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:bg-white rounded-2xl pl-11 pr-11 py-3 text-slate-900 text-sm outline-none transition-all font-sans placeholder:text-slate-400 shadow-2xs"
                  />
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 font-bold tracking-wide text-sm disabled:opacity-50 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl shadow-md shadow-emerald-600/25 transition-all active:scale-98 cursor-pointer"
              >
                <span>{loading ? "Verifying Credentials..." : "Sign In to Admin Portal"}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 pb-4 z-10">
          Protected Administrative Area • Hangu Branded Shoes KP, Pakistan
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* FORGOT PASSWORD & STORE RECOVERY MODAL */}
      {/* ---------------------------------------------------- */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-800">
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200 mb-3 shadow-2xs">
                <KeyRound size={22} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Admin Account Recovery</h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your registered username/email and Store Recovery Key to set a new password.
              </p>
            </div>

            {recoveryError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs mb-4 font-semibold">
                ⚠️ {recoveryError}
              </div>
            )}

            <form onSubmit={handleRecoverySubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Admin Email or Username
                </label>
                <input
                  type="text"
                  required
                  value={recoveryForm.emailOrUser}
                  onChange={(e) => setRecoveryForm({ ...recoveryForm, emailOrUser: e.target.value })}
                  placeholder="admin@hangubrandedshoes.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:bg-white font-sans transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Store Master Recovery Key
                </label>
                <input
                  type="password"
                  required
                  value={recoveryForm.recoveryKey}
                  onChange={(e) => setRecoveryForm({ ...recoveryForm, recoveryKey: e.target.value })}
                  placeholder="Enter Store Recovery Key (from .env)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:bg-white font-mono transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  New Strong Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={recoveryForm.newPassword}
                    onChange={(e) => setRecoveryForm({ ...recoveryForm, newPassword: e.target.value })}
                    placeholder="Enter new strong password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:bg-white font-sans transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={recoveryLoading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {recoveryLoading ? "Verifying & Updating..." : "Reset Admin Password"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-500">
                Terminal CLI Recovery: You can also reset anytime using:
              </p>
              <code className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded mt-1 inline-block">
                npm run reset-admin
              </code>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
