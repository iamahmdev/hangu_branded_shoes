import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

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
  shoeImage?: string;
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
    shoeImage: "/images/shoes/IMG_3093.jpg",
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
    shoeImage: "/images/shoes/IMG_3092.jpg",
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
    shoeImage: "/images/shoes/IMG_3091.jpg",
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
      {/* Slides Container */}
      <div className="relative h-[440px] sm:h-[480px] md:h-[520px] lg:h-[560px] w-full">
        {SLIDES.map((slide, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Cinematic Background Image with Zoom Effect */}
              <div
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-7000 ease-out ${
                  isActive ? "scale-108" : "scale-100"
                }`}
                style={{ backgroundImage: `url(${slide.bgImage})` }}
              />

              {/* Multi-layered Dark Luxury Gradients for perfect text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/30 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/40 z-10" />

              {/* Slide Content Wrap */}
              <div className="relative z-20 max-w-7xl mx-auto h-full px-5 sm:px-8 lg:px-12 flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
                  {/* Left Column: Typography & CTAs */}
                  <div className="lg:col-span-7 flex flex-col items-start pt-6 sm:pt-0">
                    {/* Top Pill Tag */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase mb-4 text-white">
                      <span className={`w-1.5 h-1.5 rounded-full bg-current ${slide.badgeColor}`} />
                      <span>{slide.tag}</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                      {slide.title} <br />
                      <span className="text-zinc-300 font-extrabold">{slide.highlight}</span>
                    </h1>

                    {/* Description */}
                    <p className="text-xs sm:text-sm md:text-base text-zinc-300 mt-3 sm:mt-4 max-w-lg leading-relaxed font-normal">
                      {slide.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
                      <Link
                        href={slide.ctaLink}
                        className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all shadow-lg hover:scale-103 active:scale-97"
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight size={15} />
                      </Link>

                      <Link
                        href={slide.secondaryLink}
                        className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 backdrop-blur-md transition-all active:scale-97"
                      >
                        {slide.secondaryText}
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Floating Hero Product Showcase (Desktop) */}
                  {slide.shoeImage && (
                    <div className="hidden lg:flex lg:col-span-5 items-center justify-center relative">
                      <div className="relative w-72 h-72 xl:w-84 xl:h-84 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-5 flex items-center justify-center shadow-2xl group/card">
                        <img
                          src={slide.shoeImage}
                          alt={slide.title}
                          className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover/card:scale-108 group-hover/card:-rotate-3"
                        />
                        <div className="absolute bottom-3 left-3 right-3 py-1.5 px-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-center">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                            100% Genuine Sole • Handcrafted in Hangu
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
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
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/75 text-white/90 hover:text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all hover:scale-108 active:scale-95 shadow-lg"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/75 text-white/90 hover:text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all hover:scale-108 active:scale-95 shadow-lg"
      >
        <ChevronRight size={22} />
      </button>

      {/* Bottom Slide Indicators / Dots */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              idx === current
                ? "w-8 h-2 bg-white"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
