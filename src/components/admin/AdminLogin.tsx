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

      <div className="min-h-screen bg-[#0b0b0e] text-[#f5f5f5] font-sans flex flex-col justify-between p-4 md:p-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Top return link */}
        <div className="w-full max-w-md mx-auto flex items-center justify-between z-10 pt-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <Store size={15} className="text-amber-400" />
            <span>Back to Storefront</span>
          </Link>
          <span className="text-[11px] text-zinc-500 font-mono">Hangu Shoes OS v2.0</span>
        </div>

        {/* Center Card */}
        <div className="w-full max-w-md mx-auto my-auto z-10 py-8">
          <div className="glass p-8 md:p-10 rounded-3xl border border-white/15 bg-[#121218]/90 shadow-2xl backdrop-blur-xl">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white mx-auto flex items-center justify-center shadow-lg mb-4 border border-white/20">
                <ShieldCheck size={28} />
              </div>
              <span className="text-amber-400 font-bold uppercase tracking-widest text-[11px] inline-flex items-center gap-1.5">
                <Sparkles size={12} /> HANGU FOOTWEAR OPERATIONS
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
                Admin Authentication
              </h1>
              <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                Sign in with your authorized administrator credentials to manage catalog, orders, and store operations.
              </p>
            </div>

            {/* Success notification */}
            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs mb-5 flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Error notification */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs mb-5 flex items-center gap-2 animate-fadeIn">
                <span className="shrink-0 font-bold">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  Username or Official Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={form.usernameOrEmail}
                    onChange={(e) => setForm({ ...form, usernameOrEmail: e.target.value })}
                    placeholder="Enter your username or email"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-amber-400 focus:bg-white/10 transition-all font-sans placeholder:text-zinc-600"
                  />
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-xs text-amber-400/90 hover:text-amber-300 transition-colors underline"
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
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-11 py-3 text-white text-sm outline-none focus:border-amber-400 focus:bg-white/10 transition-all font-sans placeholder:text-zinc-600"
                  />
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors p-1"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn w-full py-3.5 mt-2 font-bold tracking-wide text-sm disabled:opacity-50 inline-flex items-center justify-center gap-2 shadow-lg bg-zinc-100 hover:bg-white text-zinc-950 rounded-2xl transition-all"
              >
                <span>{loading ? "Verifying Credentials..." : "Sign In to Admin Portal"}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-zinc-600 pb-4 z-10">
          Protected Administrative Area • Hangu Branded Shoes KP, Pakistan
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* FORGOT PASSWORD & STORE RECOVERY MODAL */}
      {/* ---------------------------------------------------- */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#16161e] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/30 mb-3">
                <KeyRound size={24} />
              </div>
              <h2 className="text-xl font-bold">Admin Account Recovery</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Enter your registered username/email and Store Recovery Key to set a new password.
              </p>
            </div>

            {recoveryError && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs mb-4">
                ⚠️ {recoveryError}
              </div>
            )}

            <form onSubmit={handleRecoverySubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Admin Email or Username
                </label>
                <input
                  type="text"
                  required
                  value={recoveryForm.emailOrUser}
                  onChange={(e) => setRecoveryForm({ ...recoveryForm, emailOrUser: e.target.value })}
                  placeholder="admin@hangubrandedshoes.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-amber-400 font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Store Master Recovery Key
                </label>
                <input
                  type="password"
                  required
                  value={recoveryForm.recoveryKey}
                  onChange={(e) => setRecoveryForm({ ...recoveryForm, recoveryKey: e.target.value })}
                  placeholder="Enter Store Recovery Key (from .env)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-white outline-none focus:border-amber-400 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={recoveryLoading}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors shadow-lg disabled:opacity-50"
                >
                  {recoveryLoading ? "Verifying & Updating..." : "Reset Admin Password"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>

            <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <p className="text-[11px] text-zinc-500">
                Terminal CLI Recovery: You can also reset anytime using:
              </p>
              <code className="text-[11px] font-mono text-amber-400 bg-black/40 px-2 py-0.5 rounded mt-1 inline-block">
                npm run reset-admin
              </code>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
