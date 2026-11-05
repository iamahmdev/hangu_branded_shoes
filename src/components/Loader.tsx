import { useEffect, useState } from "react";

export default function Loader() {
  const [h, setH] = useState<boolean>(false);
  useEffect(() => {
    const t = setTimeout(() => setH(true), 1300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={"loader" + (h ? " hide" : "")} aria-hidden={h}>
      <div className="flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="relative flex items-center justify-center mb-4">
          <div className="absolute inset-0 rounded-full bg-slate-900/10 blur-xl scale-125 animate-pulse" />
          <img
            src="/images/logo.png"
            alt="Hangu Branded Shoes Logo"
            className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 object-contain rounded-full shadow-2xl relative z-10 animate-loaderScale"
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="font-extrabold text-sm sm:text-base tracking-[0.28em] text-zinc-950 uppercase">
            Hangu Branded Shoes
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-zinc-500 uppercase mt-1">
            Premium Footwear • Est. 2026
          </span>
        </div>
        <div className="w-28 sm:w-32 h-[2.5px] bg-zinc-200 mt-5 overflow-hidden rounded-full">
          <div className="loader-line-progress w-full h-full bg-zinc-950 rounded-full" />
        </div>
      </div>
    </div>
  );
}
