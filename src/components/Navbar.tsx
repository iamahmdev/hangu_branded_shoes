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
    setMobileMenu(false);
  }, [router.asPath]);

  return (
    <>
      {/* Top Clean Minimalist White Header (ETQ Reference Style) */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-xs py-3.5"
            : "bg-white border-b border-zinc-100 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
          {/* 1. Brand Logo (Circular Custom Seal + Minimalist Spaced Wordmark) */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <img
              src="/images/logo.png"
              alt="Hangu Branded Shoes"
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-full shadow-xs ring-1 ring-zinc-200/90 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg tracking-[0.22em] text-zinc-950 group-hover:text-emerald-700 transition-colors uppercase leading-none">
                H A N G U .
              </span>
              <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase mt-0.5 hidden sm:block">
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
          <div className="flex items-center gap-3">
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

            {/* Quick WhatsApp Concierge */}
            <a
              href={wa("Assalam-o-Alaikum! I have an inquiry about Hangu Branded Shoes.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors"
              title="Quick WhatsApp Concierge"
            >
              <WhatsAppIcon size={14} color="#059669" />
              <span>WhatsApp</span>
            </a>

            {/* Shopping Cart Button with Circular Badge (matching ETQ top-right circle) */}
            <Link
              href="/cart"
              className="relative p-2 text-zinc-900 hover:text-emerald-700 transition-colors flex items-center gap-1.5"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={20} />
              <span className="w-5 h-5 rounded-full bg-zinc-950 text-white text-[11px] font-bold flex items-center justify-center font-mono">
                {count}
              </span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2 text-zinc-900 hover:text-emerald-700 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenu && (
          <div className="md:hidden border-t border-zinc-200 bg-white px-5 py-6 flex flex-col gap-4 animate-fadeIn">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold tracking-wider uppercase text-zinc-700 hover:text-zinc-950 py-1.5 border-b border-zinc-100 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowUpRight size={14} className="text-zinc-400" />
              </Link>
            ))}

            <div className="pt-2">
              <a
                href={wa("Assalam-o-Alaikum! I have an inquiry about Hangu Branded Shoes.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                <WhatsAppIcon size={16} color="#fff" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
