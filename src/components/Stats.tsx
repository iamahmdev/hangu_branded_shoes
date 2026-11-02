import { useEffect, useRef, useState } from "react";

interface NumProps {
  to: number;
  suf?: string;
}

function Num({ to, suf = "" }: NumProps) {
  const r = useRef<HTMLElement>(null);
  const [v, setV] = useState<number>(0);

  useEffect(() => {
    if (!r.current) return;
    const el = r.current;
    const o = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      o.disconnect();
      let t = 0;
      const id = setInterval(() => {
        t += to / 60;
        if (t >= to) {
          t = to;
          clearInterval(id);
        }
        setV(Math.floor(t));
      }, 25);
    });
    o.observe(el);
    return () => o.disconnect();
  }, [to]);

  return (
    <b ref={r} className="text-3xl md:text-5xl font-extrabold text-white block">
      {v.toLocaleString()}
      {suf}
    </b>
  );
}

export default function Stats() {
  return (
    <div className="stats grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="glass p-6 rounded-2xl text-center">
        <Num to={5000} suf="+" />
        <p className="text-zinc-400 text-sm mt-2">Happy Customers</p>
      </div>
      <div className="glass p-6 rounded-2xl text-center">
        <Num to={300} suf="+" />
        <p className="text-zinc-400 text-sm mt-2">Shoe Designs</p>
      </div>
      <div className="glass p-6 rounded-2xl text-center">
        <Num to={10} suf="+" />
        <p className="text-zinc-400 text-sm mt-2">Top Brands</p>
      </div>
      <div className="glass p-6 rounded-2xl text-center">
        <Num to={100} suf="%" />
        <p className="text-zinc-400 text-sm mt-2">Quality Checked</p>
      </div>
    </div>
  );
}
