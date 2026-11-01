import { useEffect, useState } from "react";
import Link from "next/link";

export default function Offer() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: "03",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    setMounted(true);
    const target = Date.now() + 3 * 864e5; // 3 days from mount

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
    <div className="offer">
      <p>⚡ LIMITED TIME OFFER</p>
      <h2>Flat 20% OFF Branded Shoes</h2>
      <div className="cd">
        {["Days", "Hours", "Minutes", "Seconds"].map((label, idx) => (
          <div key={label}>
            <b>{mounted ? values[idx] : "03"}</b>
            <small>{label}</small>
          </div>
        ))}
      </div>
      <Link className="btn" href="/shop">
        Shop Now
      </Link>
    </div>
  );
}
