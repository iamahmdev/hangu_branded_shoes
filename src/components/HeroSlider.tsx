import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface SlideData {
  id: number;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  bgImage: string;
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    badge: "NEW SEASON 2026",
    title: "Handcrafted Leather.",
    highlight: "Pure Elegance.",
    description: "Authentic full-grain formal shoes & penny loafers, tailored for all-day comfort.",
    ctaText: "Shop Formal & Loafers",
    ctaLink: "/shop?cat=Formal",
    bgImage: "/images/h3.jpg",
  },
  {
    id: 2,
    badge: "ACTIVE COMFORT",
    title: "Street Runners.",
    highlight: "Ultra-Light Sole.",
    description: "Engineered with responsive shock-absorbing cushioning for daily movement.",
    ctaText: "Explore Sneakers",
    ctaLink: "/shop?cat=Sneakers",
    bgImage: "/images/h1.jpg",
  },
  {
    id: 3,
    badge: "FREE DELIVERY OVER RS. 5,000",
    title: "Casual Slip-Ons.",
    highlight: "Effortless Fit.",
    description: "Premium comfort footwear delivered nationwide with Cash on Delivery & size exchange.",
    ctaText: "Shop Casual Collection",
    ctaLink: "/shop?cat=Comfort",
    bgImage: "/images/h2.jpg",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, current]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  // Touch Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-zinc-900 text-white select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sleek Compact Height Banner */}
      <div className="relative h-[290px] sm:h-[340px] md:h-[380px] lg:h-[410px] w-full">
        {SLIDES.map((slide, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Natural High-Definition Background Image */}
              <div
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-7000 ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
                style={{ backgroundImage: `url(${slide.bgImage})` }}
              />

              {/* Refined Modern Tint: Soft gradient so photography stays bright & alive */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/15 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 z-10" />

              {/* Content Box */}
              <div className="relative z-20 max-w-7xl mx-auto h-full px-6 sm:px-12 lg:px-16 flex items-center">
                <div className="max-w-xl">
                  {/* Modern Minimalist Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-white shadow-sm mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{slide.badge}</span>
                  </div>

                  {/* Clean High-Fashion Headline */}
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white drop-shadow-md">
                    {slide.title}{" "}
                    <span className="text-zinc-200 font-medium block sm:inline">
                      {slide.highlight}
                    </span>
                  </h1>

                  {/* Short 1-Line Description */}
                  <p className="text-xs sm:text-sm text-zinc-200/90 mt-2.5 max-w-lg leading-relaxed font-normal drop-shadow">
                    {slide.description}
                  </p>

                  {/* Modern Pill CTA Button */}
                  <div className="mt-5 flex items-center gap-3">
                    <Link
                      href={slide.ctaLink}
                      className="px-6 py-2.5 sm:py-3 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-103 active:scale-97"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight size={14} />
                    </Link>

                    <Link
                      href="/shop"
                      className="px-5 py-2.5 sm:py-3 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold border border-white/30 backdrop-blur-md transition-all active:scale-97"
                    >
                      View All
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtle Sleek Floating Navigation Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/60 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 shadow-md"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/60 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 shadow-md"
      >
        <ChevronRight size={20} />
      </button>

      {/* Sleek Minimal Progress Indicators */}
      <div className="absolute bottom-3 sm:bottom-4 right-6 sm:right-12 z-30 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
        <span className="text-[11px] font-bold tracking-wider text-white">
          0{current + 1} <span className="text-white/40">/ 0{SLIDES.length}</span>
        </span>
        <div className="w-px h-3 bg-white/20 mx-1" />
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrent(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                idx === current
                  ? "w-5 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
