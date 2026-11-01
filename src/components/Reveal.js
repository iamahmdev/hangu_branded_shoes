import { useEffect, useRef } from "react";
export default function Reveal({ children, delay = 0, className = "" }) {
  const r = useRef();
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => e.isIntersecting && (r.current.classList.add("in"), o.disconnect()), { threshold: 0.15 });
    o.observe(r.current); return () => o.disconnect();
  }, []);
  return <div ref={r} className={"rv " + className} style={{ transitionDelay: delay + "ms" }}>{children}</div>;
}
