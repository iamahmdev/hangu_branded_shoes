import { useEffect, useRef } from "react";

export default function Cursor() {
  const r = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(hover: none)").matches || window.innerWidth <= 1024) return;

    const m = (e: MouseEvent) => {
      if (!r.current) return;
      r.current.classList.add("active");
      r.current.style.left = e.clientX + "px";
      r.current.style.top = e.clientY + "px";
      const target = e.target as HTMLElement | null;
      if (target && typeof target.closest === "function") {
        r.current.classList.toggle("big", !!target.closest("a, button, .card, input, select, textarea, .sz"));
      }
    };

    window.addEventListener("mousemove", m, { passive: true });
    return () => window.removeEventListener("mousemove", m);
  }, []);

  return <div ref={r} className="cursor" />;
}
