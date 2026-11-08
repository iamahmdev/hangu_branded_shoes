import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../src/components/Layout";
import { wa } from "../src/data/config";
import { useStoreSettings } from "../src/hooks/useApi";
import { PackageCheck, Truck, ArrowRight, Copy, Check, MessageCircle } from "lucide-react";

interface LastOrder {
  id: string;
  msg: string;
}

export default function Success() {
  const router = useRouter();
  const [o, setO] = useState<LastOrder | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [copiedJc, setCopiedJc] = useState<boolean>(false);

  const { data: storeSettingsData } = useStoreSettings();
  const liveSettings = storeSettingsData?.data;
  const jcNumber = liveSettings?.jazzcashNumber?.trim() || liveSettings?.easypaisaNumber?.trim() || "03275430305";
  const jcTitle = liveSettings?.jazzcashTitle?.trim() || liveSettings?.easypaisaTitle?.trim() || "Muhammad Atif Ibrahim";

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("lastOrder");
      if (saved) {
        setO(JSON.parse(saved));
      } else if (router.isReady && router.query.orderId) {
        setO({ id: String(router.query.orderId), msg: "" });
      }
    } catch (e) {}
  }, [router.isReady, router.query.orderId]);

  const orderId = o?.id || (router.query.orderId as string) || "";
  const isJazzCashOrder = o?.msg ? o.msg.includes("JAZZCASH") : false;

  const handleCopyJc = () => {
    navigator.clipboard.writeText(jcNumber);
    setCopiedJc(true);
    setTimeout(() => setCopiedJc(false), 2000);
  };

  return (
    <Layout title="Order Received — Hangu Branded Shoes">
      <div className="pg wrap ok text-center py-20 px-4 max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5 text-emerald-600 shadow-xs">
          <PackageCheck size={36} />
        </div>

        <span className="text-xs uppercase tracking-widest text-brand-red font-bold">
          ORDER CONFIRMATION
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 mt-1">
          Thank You! Order Received
        </h1>

        <div className="bg-white border border-zinc-200/80 shadow-xs p-6 rounded-3xl my-6 text-left">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-zinc-100">
            <div>
              <span className="text-xs text-zinc-500 uppercase tracking-wider block font-semibold">
                Order Tracking ID
              </span>
              <b className="text-2xl font-mono text-zinc-900 font-extrabold block mt-0.5">
                #{orderId || "HBS-CONFIRMED"}
              </b>
            </div>
            {orderId && (
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(orderId);
                  setCopiedId(true);
                  setTimeout(() => setCopiedId(false), 2000);
                }}
                className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-zinc-200"
              >
                {copiedId ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copiedId ? "Copied" : "Copy"}</span>
              </button>
            )}
          </div>
          <p className="text-zinc-600 text-xs mt-3 leading-relaxed">
            Your pair will be inspected for quality, packed securely, and handed over to courier dispatch. You can track its live progress anytime online.
          </p>
        </div>

        {/* Revealed JazzCash Card for JazzCash Orders */}
        {isJazzCashOrder && (
          <div className="bg-red-50/50 border border-red-200 p-5 rounded-3xl mb-6 text-left shadow-xs flex flex-col gap-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-red-200/70">
              <span className="text-xs font-bold text-red-700 uppercase tracking-wide">
                📱 JazzCash Payment Details
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 uppercase">
                Official
              </span>
            </div>

            <div className="text-xs text-zinc-700">
              <span className="text-zinc-500 block text-[11px]">Account Title:</span>
              <b className="text-zinc-950 font-bold text-sm">{jcTitle}</b>
            </div>

            <div className="p-3 bg-white rounded-xl border border-red-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">JazzCash Number</span>
                <span className="font-mono text-xl font-extrabold text-zinc-950">{jcNumber}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyJc}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                {copiedJc ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedJc ? "Copied!" : "Copy"}</span>
              </button>
            </div>

            <p className="text-[11px] text-zinc-500">
              Transfer the order amount and send the payment screenshot on WhatsApp for instant confirmation.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          {orderId && (
            <Link
              href={`/track?orderId=${orderId}`}
              className="btn w-full sm:w-auto inline-flex items-center justify-center gap-2"
            >
              <Truck size={17} />
              <span>Track Live Status</span>
            </Link>
          )}

          {o && o.msg && (
            <a
              className="btn ghost w-full sm:w-auto inline-flex items-center justify-center gap-2 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
              target="_blank"
              rel="noopener noreferrer"
              href={wa(o.msg)}
            >
              <MessageCircle size={16} />
              <span>Resend via WhatsApp</span>
            </a>
          )}

          <Link className="btn ghost w-full sm:w-auto" href="/shop">
            Shop More
          </Link>
        </div>

        <div className="mt-8 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 max-w-md mx-auto">
          🚚 <b>Delivery Timeline:</b> 2 to 4 business days nationwide. Fast express dispatch on all confirmed orders.
        </div>
      </div>
    </Layout>
  );
}
