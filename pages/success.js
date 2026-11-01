import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../src/components/Layout";
import { wa } from "../src/data/config";
export default function Success() {
  const [o, setO] = useState(null);
  useEffect(() => { try { setO(JSON.parse(sessionStorage.getItem("lastOrder"))); } catch (e) {} }, []);
  return (
    <Layout title="Order Placed — Hangu_branded_shoes"><div className="pg wrap ok"><i>✅</i><h1>Thank You! Order Received</h1>
      <p style={{ color: "var(--mut)", margin: "14px 0 26px" }}>Order No: <b style={{ color: "var(--gold)" }}>{o ? o.id : "—"}</b><br />We will contact you shortly to confirm.</p>
      {o && <a className="btn" target="_blank" href={wa(o.msg)}>Resend on WhatsApp 💬</a>} <Link className="btn ghost" href="/shop">Continue Shopping</Link></div></Layout>
  );
}
