import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { WA, wa } from "../data/config";
import { WhatsAppIcon } from "./WhatsAppButton";
import { Search, ShoppingBag, Menu, X, ArrowUpRight } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "New Collection" },
  { href: "/shop", label: "All Footwear" },
  { href: "/track", label: "Track Order" },
  { href: "/size-guide", label: "Size Guide" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  const { count, openSearch } = useCart();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenu]);

  useEffect(() => {
    setMobileMenu(false);
  }, [router.asPath]);

  return (
    <>
      {/* Top Clean Minimalist White Header (ETQ Reference Style) */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-xs py-2 md:py-2.5"
            : "bg-white border-b border-zinc-100 py-2.5 md:py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
          {/* 1. Brand Logo (Prominent Circular Seal + Minimalist Spaced Wordmark) */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0">
            <img
              src="/images/logo.png"
              alt="Hangu Branded Shoes"
              className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain rounded-full shadow-xs ring-2 ring-zinc-200/80 group-hover:scale-105 transition-transform bg-white"
            />
            <div className="flex flex-col justify-center">
              <span className="font-black text-base sm:text-xl md:text-2xl tracking-[0.16em] sm:tracking-[0.2em] text-zinc-950 group-hover:text-emerald-700 transition-colors uppercase leading-none">
                HANGU.
              </span>
              <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase mt-0.5 block leading-none">
                Branded Shoes
              </span>
            </div>
          </Link>

          {/* 2. Center Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-semibold tracking-wider uppercase transition-colors relative py-1 ${
                    isActive
                      ? "text-zinc-950 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-zinc-950"
                      : "text-zinc-500 hover:text-zinc-950"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right Utility Cluster (Search, WhatsApp, Cart with Badge) */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Quick Search Button */}
            <button
              type="button"
              onClick={openSearch}
              className="p-2 text-zinc-600 hover:text-zinc-950 transition-colors"
              title="Search Footwear"
              aria-label="Search Footwear"
            >
              <Search size={18} />
            </button>

            {/* Quick WhatsApp Concierge (Pill on Desktop, Compact Icon on Mobile) */}
            <a
              href={wa("Hello! I have an inquiry about Hangu Branded Shoes.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors"
              title="Quick WhatsApp Concierge"
            >
              <WhatsAppIcon size={14} color="#059669" />
              <span>WhatsApp</span>
            </a>

            <a
              href={wa("Hello! I have an inquiry about Hangu Branded Shoes.")}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden p-2 text-emerald-600 hover:text-emerald-700 transition-colors"
              title="Chat on WhatsApp"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon size={18} color="#059669" />
            </a>

            {/* Shopping Cart Button with Circular Badge */}
            <Link
              href="/cart"
              className="relative p-2 text-zinc-900 hover:text-emerald-700 transition-colors flex items-center gap-1"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={20} />
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-zinc-950 text-white text-[10px] sm:text-[11px] font-bold flex items-center justify-center font-mono">
                {count}
              </span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenu(true)}
              className="md:hidden p-2 text-zinc-900 hover:text-emerald-700 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Drawer Modal (Never pushes page, zero cut-off) */}
      {mobileMenu && (
        <div className="fixed inset-0 z-[1000] md:hidden">
          {/* Dark Glass Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenu(false)}
          />

          {/* Slide-over Drawer Panel */}
          <div className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <Link
                  href="/"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center gap-2.5"
                >
                  <img
                    src="/images/logo.png"
                    alt="Hangu Branded Shoes"
                    className="w-10 h-10 object-contain rounded-full shadow-xs ring-1 ring-zinc-200 bg-white"
                  />
                  <div>
                    <span className="font-black text-sm tracking-[0.16em] text-zinc-950 uppercase leading-none block">
                      HANGU.
                    </span>
                    <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase mt-0.5 block">
                      Branded Shoes
                    </span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenu(false)}
                  className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center transition-colors"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-1.5 py-5">
                {NAV_LINKS.map((link) => {
                  const isActive = router.pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenu(false)}
                      className={`text-xs font-bold tracking-wider uppercase py-3 px-3.5 rounded-xl flex items-center justify-between transition-colors ${
                        isActive
                          ? "bg-zinc-950 text-white font-extrabold shadow-xs"
                          : "text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight size={14} className={isActive ? "text-white" : "text-zinc-400"} />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-4 border-t border-zinc-100 flex flex-col gap-2.5">
              <a
                href={wa("Hello! I have an inquiry about Hangu Branded Shoes.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <WhatsAppIcon size={16} color="#fff" />
                <span>Chat on WhatsApp (+92 333 3147691)</span>
              </a>
              <a
                href="mailto:info@hangubrandedshoes.com"
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>✉️</span>
                <span>info@hangubrandedshoes.com</span>
              </a>
              <div className="text-center text-[11px] text-zinc-400">
                📍 Tahir Market, Hangu • Fast Delivery Across Pakistan
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
