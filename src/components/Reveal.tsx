import { useEffect, useRef, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const r = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!r.current) return;
    const el = r.current;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          o.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);

  return (
    <div ref={r} className={"rv " + className} style={{ transitionDelay: delay + "ms" }}>
      {children}
    </div>
  );
}
