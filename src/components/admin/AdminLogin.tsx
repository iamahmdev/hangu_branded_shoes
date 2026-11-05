import Head from "next/head";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { Lock, User, ArrowRight, ShieldCheck, Sparkles, Store } from "lucide-react";

interface AdminLoginProps {
  onLogin: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; message?: string }>;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await onLogin(form.usernameOrEmail, form.password);
      if (!res.success) {
        setError(res.message || "Invalid administrative credentials.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to connect to authentication server.");
    } finally {
      setLoading(false);
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
            <Store size={15} className="text-brand-gold" />
            <span>Back to Storefront</span>
          </Link>
          <span className="text-[11px] text-zinc-500 font-mono">Hangu Shoes OS v2.0</span>
        </div>

        {/* Center Card */}
        <div className="w-full max-w-md mx-auto my-auto z-10 py-8">
          <div className="glass p-8 md:p-10 rounded-3xl border border-white/15 bg-[#121218]/90 shadow-2xl backdrop-blur-xl">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-red to-brand-redDark text-white mx-auto flex items-center justify-center shadow-glow mb-4 border border-white/20">
                <ShieldCheck size={28} />
              </div>
              <span className="text-brand-gold font-bold uppercase tracking-widest text-[11px] inline-flex items-center gap-1.5">
                <Sparkles size={12} /> HANGU FOOTWEAR OPERATIONS
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
                Admin Authentication
              </h1>
              <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                Sign in with your administrative credentials to manage footwear catalog, live customer orders, inventory stock, and store operations.
              </p>
            </div>

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
                    placeholder="admin"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-brand-gold focus:bg-white/10 transition-all font-sans"
                  />
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-brand-gold focus:bg-white/10 transition-all font-sans"
                  />
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn w-full py-3.5 mt-2 font-bold tracking-wide text-sm disabled:opacity-50 inline-flex items-center justify-center gap-2 shadow-glow"
              >
                <span>{loading ? "Authenticating with MongoDB..." : "Sign In to Admin Portal"}</span>
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
    </>
  );
}
