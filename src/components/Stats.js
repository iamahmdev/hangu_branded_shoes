import { useEffect, useRef, useState } from "react";
function Num({ to, suf = "" }) {
  const r = useRef(); const [v, setV] = useState(0);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; o.disconnect(); let t = 0; const id = setInterval(() => { t += to / 60; if (t >= to) { t = to; clearInterval(id); } setV(Math.floor(t)); }, 25); });
    o.observe(r.current); return () => o.disconnect();
  }, [to]);
  return <b ref={r}>{v.toLocaleString()}{suf}</b>;
}
export default function Stats() {
  return <div className="stats">
    <div className="glass"><Num to={5000} suf="+" /><p>Happy Customers</p></div>
    <div className="glass"><Num to={300} suf="+" /><p>Shoe Designs</p></div>
    <div className="glass"><Num to={10} suf="+" /><p>Top Brands</p></div>
    <div className="glass"><Num to={100} suf="%" /><p>Quality Checked</p></div>
  </div>;
}
