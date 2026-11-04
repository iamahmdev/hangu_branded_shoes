import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../src/components/Layout";
import { wa } from "../src/data/config";
import { PackageCheck, Truck, ArrowRight } from "lucide-react";

interface LastOrder {
  id: string;
  msg: string;
}

export default function Success() {
  const router = useRouter();
  const [o, setO] = useState<LastOrder | null>(null);

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

  return (
    <Layout title="Order Received — Hangu Branded Shoes">
      <div className="pg wrap ok text-center py-32 px-5 max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-6 text-green-400">
          <PackageCheck size={36} />
        </div>

        <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">
          ORDER CONFIRMATION
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-1">
          Thank You! Order Received
        </h1>

        <div className="glass p-5 rounded-3xl border border-white/10 my-6 bg-white/5">
          <span className="text-xs text-zinc-400 uppercase tracking-wider block">
            Your Tracking Order Number
          </span>
          <b className="text-3xl font-mono text-brand-gold font-bold block my-1">
            {orderId || "HBS-CONFIRMED"}
          </b>
          <p className="text-zinc-400 text-xs mt-2">
            Your pair will be inspected for quality, packed securely, and handed over to courier dispatch. You can track its live progress anytime online.
          </p>
        </div>

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
              className="btn ghost w-full sm:w-auto inline-flex items-center justify-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
              href={wa(o.msg)}
            >
              <span>Resend WhatsApp</span>
            </a>
          )}

          <Link className="btn ghost w-full sm:w-auto" href="/shop">
            Shop More
          </Link>
        </div>

        <div className="mt-10 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-zinc-400 max-w-md mx-auto">
          🚚 <b>Delivery Timeline:</b> 2 to 4 business days nationwide. Fast express dispatch with verified EasyPaisa payment.
        </div>
      </div>
    </Layout>
  );
}
