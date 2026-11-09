import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface SlideData {
  id: number;
  tag: string;
  title: string;
  highlight: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryText: string;
  secondaryLink: string;
  bgImage: string;
  badgeColor?: string;
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    tag: "HANDCRAFTED HERITAGE 2026",
    title: "Pure Leather.",
    highlight: "Executive Class.",
    description:
      "Mastercrafted formal oxfords and penny loafers. Tailored from premium full-grain leathers with ergonomic cushioning for all-day distinction.",
    ctaText: "Shop Formal & Loafers",
    ctaLink: "/shop?cat=Formal",
    secondaryText: "Track Order",
    secondaryLink: "/track",
    bgImage: "/images/h3.jpg",
    badgeColor: "text-amber-400",
  },
  {
    id: 2,
    tag: "RESPONSIVE CUSHIONING",
    title: "All-Day Energy.",
    highlight: "Street Runners.",
    description:
      "High-performance sneakers engineered with ultra-light shock-absorbing soles for unmatched daily walking comfort across Pakistan.",
    ctaText: "Explore Sneaker Line",
    ctaLink: "/shop?cat=Sneakers",
    secondaryText: "View All 50+ Shoes",
    secondaryLink: "/shop",
    bgImage: "/images/h1.jpg",
    badgeColor: "text-emerald-400",
  },
  {
    id: 3,
    tag: "NATIONWIDE CASH ON DELIVERY",
    title: "Effortless Fit.",
    highlight: "Everyday Luxury.",
    description:
      "Hand-finished comfort slip-ons and casual driving shoes. Free express delivery nationwide on all orders above Rs. 5,000.",
    ctaText: "Shop Casual Comfort",
    ctaLink: "/shop?cat=Comfort",
    secondaryText: "About Our Craft",
    secondaryLink: "/about",
    bgImage: "/images/h2.jpg",
    badgeColor: "text-cyan-400",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Auto-play timer (changes every 5.5 seconds unless hovered)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, current]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  // Swipe support for mobile
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
      className="relative w-full overflow-hidden bg-zinc-950 text-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container - Sleek Compact Proportional Height */}
      <div className="relative h-[290px] sm:h-[330px] md:h-[370px] lg:h-[400px] w-full">
        {SLIDES.map((slide, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Cinematic Background Image with Subtle Ken Burns Zoom Effect */}
              <div
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-7000 ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
                style={{ backgroundImage: `url(${slide.bgImage})` }}
              />

              {/* Multi-layered Dark Luxury Gradients for crisp text contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/35 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/30 z-10" />

              {/* Slide Content Wrap */}
              <div className="relative z-20 max-w-7xl mx-auto h-full px-6 sm:px-12 lg:px-16 flex items-center">
                <div className="max-w-2xl flex flex-col items-start">
                  {/* Top Pill Tag */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] sm:text-[11px] font-bold tracking-[0.22em] uppercase mb-2 sm:mb-3 text-white">
                    <span className={`w-1.5 h-1.5 rounded-full bg-current ${slide.badgeColor}`} />
                    <span>{slide.tag}</span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
                    {slide.title}{" "}
                    <span className="text-zinc-300 font-extrabold">{slide.highlight}</span>
                  </h1>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-zinc-300 mt-2 sm:mt-3 max-w-xl leading-relaxed font-normal line-clamp-2 sm:line-clamp-none">
                    {slide.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-3">
                    <Link
                      href={slide.ctaLink}
                      className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all shadow-md hover:scale-103 active:scale-97"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight size={14} />
                    </Link>

                    <Link
                      href={slide.secondaryLink}
                      className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 backdrop-blur-md transition-all active:scale-97"
                    >
                      {slide.secondaryText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows (Desktop & Tablet) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/75 text-white/90 hover:text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all hover:scale-108 active:scale-95 shadow-md"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/75 text-white/90 hover:text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all hover:scale-108 active:scale-95 shadow-md"
      >
        <ChevronRight size={20} />
      </button>

      {/* Bottom Slide Indicators / Dots */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              idx === current
                ? "w-7 h-1.5 bg-white"
                : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
