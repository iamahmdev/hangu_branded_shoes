import { useEffect, useState } from "react";

export default function Loader() {
  const [h, setH] = useState<boolean>(false);
  useEffect(() => {
    // 2.1 seconds gives the customer enough time to clearly see and read the custom logo emblem
    const t = setTimeout(() => setH(true), 2100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={"loader" + (h ? " hide" : "")} aria-hidden={h}>
      <div className="flex flex-col items-center justify-center p-6 text-center select-none">
        {/* Large, clearly readable official logo */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-full bg-slate-900/10 blur-2xl scale-110 animate-pulse pointer-events-none" />
          <img
            src="/images/logo.png"
            alt="Hangu Branded Shoes Logo"
            className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 object-contain rounded-full shadow-2xl relative z-10 animate-loaderScale ring-2 ring-zinc-200/90 bg-white"
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="font-extrabold text-base sm:text-lg md:text-xl tracking-[0.28em] text-zinc-950 uppercase">
            Hangu Branded Shoes
          </span>
          <span className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-zinc-500 uppercase mt-1">
            Premium Footwear • Est. 2026
          </span>
        </div>
        <div className="w-40 sm:w-48 h-[3px] bg-zinc-200 mt-6 overflow-hidden rounded-full">
          <div className="loader-line-progress w-full h-full bg-zinc-950 rounded-full" />
        </div>
      </div>
    </div>
  );
}
