import Head from "next/head";
import Link from "next/link";
import { useState, FormEvent } from "react";
import {
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  X,
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
        <title>Admin Login — Hangu Branded Shoes</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>

      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between p-4 md:p-6 relative">
        {/* Top return button */}
        <div className="w-full max-w-sm mx-auto flex items-center justify-start z-10 pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-xs font-bold text-slate-800 hover:text-black shadow-xs hover:shadow-sm transition-all cursor-pointer group"
          >
            <ArrowLeft size={16} className="text-slate-700 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Website</span>
          </Link>
        </div>

        {/* Center Clean Card */}
        <div className="w-full max-w-sm mx-auto my-auto z-10 py-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-lg">
            <div className="text-center mb-6">
              {/* Store Logo */}
              <img
                src="/images/logo.png"
                alt="Hangu Branded Shoes"
                className="w-16 h-16 rounded-full object-contain mx-auto bg-white p-1 ring-1 ring-slate-200 shadow-sm mb-3"
              />

              <h1 className="text-2xl font-bold text-slate-900">
                Admin Login
              </h1>
            </div>

            {/* Success notification */}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs mb-4 flex items-center gap-2 font-semibold">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Error notification */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs mb-4 flex items-center gap-2 font-semibold">
                <span className="shrink-0 font-bold text-rose-600">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Username or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={form.usernameOrEmail}
                    onChange={(e) => setForm({ ...form, usernameOrEmail: e.target.value })}
                    placeholder="Username or email"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-800 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-slate-900 text-sm outline-none transition-colors placeholder:text-slate-400"
                  />
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Password"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-800 focus:bg-white rounded-xl pl-10 pr-10 py-2.5 text-slate-900 text-sm outline-none transition-colors placeholder:text-slate-400"
                  />
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Solid Black Button - Clean Inline Arrow - No Hover Color Shift */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-1 font-semibold text-sm bg-black hover:bg-black active:bg-black text-white rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer transition-opacity hover:opacity-90 active:opacity-100 disabled:opacity-50"
              >
                <span>{loading ? "Signing In..." : "Sign In"}</span>
                {!loading && <ArrowRight size={16} className="shrink-0" />}
              </button>
            </form>
          </div>
        </div>

        {/* Minimal Bottom Spacer */}
        <div className="py-2" />
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

            <div className="text-center mb-5">
              <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-800 mx-auto flex items-center justify-center border border-slate-200 mb-2.5">
                <KeyRound size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Reset Password</h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your credentials and recovery key.
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
                  Email or Username
                </label>
                <input
                  type="text"
                  required
                  value={recoveryForm.emailOrUser}
                  onChange={(e) => setRecoveryForm({ ...recoveryForm, emailOrUser: e.target.value })}
                  placeholder="admin@hangubrandedshoes.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-800 focus:bg-white font-sans transition-all"
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
                  placeholder="Enter recovery key"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-800 focus:bg-white font-mono transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={recoveryForm.newPassword}
                    onChange={(e) => setRecoveryForm({ ...recoveryForm, newPassword: e.target.value })}
                    placeholder="Enter new password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-800 focus:bg-white font-sans transition-all"
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
                  className="w-full h-11 rounded-xl bg-black hover:bg-black active:bg-black text-white font-semibold text-xs transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {recoveryLoading ? "Updating..." : "Reset Password"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-full h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
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
