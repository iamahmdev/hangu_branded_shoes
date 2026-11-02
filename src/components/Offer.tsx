import { useEffect, useState } from "react";
import Link from "next/link";

interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export default function Offer() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: "03",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    setMounted(true);
    const target = Date.now() + 3 * 864e5;

    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / 864e5);
      const h = Math.floor((diff / 36e5) % 24);
      const m = Math.floor((diff / 6e4) % 60);
      const s = Math.floor((diff / 1e3) % 60);

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const values = [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds];

  return (
    <div className="offer text-center">
      <p className="text-brand-red font-bold text-sm tracking-widest">⚡ LIMITED TIME OFFER</p>
      <h2 className="text-3xl md:text-5xl font-extrabold text-white my-3">Flat 20% OFF Branded Shoes</h2>
      <div className="cd flex justify-center gap-3 md:gap-5 my-6">
        {["Days", "Hours", "Minutes", "Seconds"].map((label, idx) => (
          <div key={label} className="text-center">
            <b className="text-2xl md:text-4xl font-extrabold text-brand-gold">{mounted ? values[idx] : "03"}</b>
            <small className="block text-zinc-400 text-xs uppercase tracking-wider mt-1">{label}</small>
          </div>
        ))}
      </div>
      <Link className="btn" href="/shop">
        Shop Now
      </Link>
    </div>
  );
}
