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
    badge: "100% REAL LEATHER",
    title: "Handmade Leather Shoes.",
    highlight: "Soft & Comfortable.",
    description: "Real leather formal shoes & loafers made for all-day comfort. Cash on Delivery across Pakistan.",
    ctaText: "Shop Formal & Loafers",
    ctaLink: "/shop?cat=Formal",
    bgImage: "/images/h3.jpg",
  },
  {
    id: 2,
    badge: "DAILY COMFORT",
    title: "Lightweight Sneakers.",
    highlight: "Super Soft Sole.",
    description: "Flexible and durable footwear for everyday walking. Delivered safely to your doorstep.",
    ctaText: "Shop Sneakers",
    ctaLink: "/shop?cat=Sneakers",
    bgImage: "/images/h1.jpg",
  },
  {
    id: 3,
    badge: "EASY SIZE EXCHANGE",
    title: "Casual Leather Slip-Ons.",
    highlight: "Perfect Fit.",
    description: "7-day hassle-free size exchange guarantee with fast Cash on Delivery nationwide.",
    ctaText: "Shop Casual Shoes",
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
      {/* Spacious High-Impact Flagship Banner */}
      <div className="relative h-[440px] sm:h-[500px] md:h-[560px] lg:h-[620px] w-full">
        {SLIDES.map((slide, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
            >
              {/* Natural High-Definition Background Image */}
              <div
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-7000 ease-out ${isActive ? "scale-102" : "scale-100"
                  }`}
                style={{ backgroundImage: `url(${slide.bgImage})` }}
              />

              {/* Refined Modern Tint: Soft gradient so photography stays bright & alive */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/15 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 z-10" />

              {/* Content Box */}
              <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-12 lg:px-16 flex items-center">
                <div className="max-w-xl pr-2 sm:pr-0">
                  {/* Modern Minimalist Badge */}
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[9px] sm:text-[11px] font-bold tracking-[0.18em] sm:tracking-[0.2em] uppercase text-white shadow-xs mb-2 sm:mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{slide.badge}</span>
                  </div>

                  {/* Clean High-Fashion Headline */}
                  <h1 className="text-xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white drop-shadow-md">
                    {slide.title}{" "}
                    <span className="text-zinc-200 font-medium block sm:inline">
                      {slide.highlight}
                    </span>
                  </h1>

                  {/* Short 1-Line Description */}
                  <p className="text-[11px] sm:text-sm text-zinc-200/90 mt-2 sm:mt-2.5 max-w-lg leading-relaxed font-normal drop-shadow line-clamp-2 sm:line-clamp-none">
                    {slide.description}
                  </p>

                  {/* Modern Pill CTA Button */}
                  <div className="mt-3.5 sm:mt-5 flex items-center gap-2 sm:gap-3">
                    <Link
                      href={slide.ctaLink}
                      prefetch={true}
                      className="px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 sm:gap-2 transition-all shadow-md hover:shadow-lg hover:scale-102 active:scale-97"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight size={13} />
                    </Link>

                    <Link
                      href="/shop"
                      prefetch={true}
                      className="px-3.5 sm:px-5 py-2 sm:py-3 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold border border-white/30 backdrop-blur-md transition-all active:scale-97"
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

      {/* Subtle Sleek Floating Navigation Arrows (Hidden on Mobile to Never Block Text; Touch Swipe is Active) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="hidden sm:flex absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/60 text-white border border-white/20 backdrop-blur-md items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 shadow-md"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Slide"
        className="hidden sm:flex absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/60 text-white border border-white/20 backdrop-blur-md items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 shadow-md"
      >
        <ChevronRight size={20} />
      </button>

      {/* Sleek Minimal Progress Indicators */}
      <div className="absolute bottom-2.5 sm:bottom-4 right-3 sm:right-12 z-30 flex items-center gap-1.5 sm:gap-2 bg-black/30 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/15">
        <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-white">
          0{current + 1} <span className="text-white/40">/ 0{SLIDES.length}</span>
        </span>
        <div className="w-px h-2.5 sm:h-3 bg-white/20 mx-0.5 sm:mx-1" />
        <div className="flex items-center gap-1 sm:gap-1.5">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrent(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${idx === current
                ? "w-4 sm:w-5 h-1 sm:h-1.5 bg-white"
                : "w-1 sm:w-1.5 h-1 sm:h-1.5 bg-white/40 hover:bg-white/70"
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
