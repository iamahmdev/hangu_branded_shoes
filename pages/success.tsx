import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../src/components/Layout";
import { wa } from "../src/data/config";

interface LastOrder {
  id: string;
  msg: string;
}

export default function Success() {
  const [o, setO] = useState<LastOrder | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("lastOrder");
      if (saved) setO(JSON.parse(saved));
    } catch (e) {}
  }, []);

  return (
    <Layout title="Order Placed — Hangu Branded Shoes">
      <div className="pg wrap ok text-center py-32 px-5 max-w-lg mx-auto">
        <i className="text-5xl not-italic block mb-4">✅</i>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">Thank You! Order Received</h1>
        <p className="text-zinc-400 my-4 text-base">
          Order No: <b className="text-brand-gold">{o ? o.id : "—"}</b>
          <br />
          We will contact you shortly to confirm your delivery.
        </p>
        <div className="flex gap-3 justify-center flex-wrap mt-6">
          {o && (
            <a className="btn" target="_blank" rel="noopener noreferrer" href={wa(o.msg)}>
              Resend on WhatsApp 💬
            </a>
          )}
          <Link className="btn ghost" href="/shop">
            Continue Shopping
          </Link>
        </div>
      </div>
    </Layout>
  );
}
