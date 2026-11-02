import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { WA, wa } from "../data/config";
import { WhatsAppIcon } from "./WhatsAppButton";
import { Search } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/size-guide", label: "Size Guide" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  const { count, openSearch } = useCart();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenu(false);
  }, [router.asPath]);

  return (
    <header className={`nb-header ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap nb-inner flex justify-between items-center gap-4">
        {/* Logo */}
        <Link href="/" className="logo inline-flex flex-col leading-tight cursor-pointer">
          <span className="logo-main font-extrabold text-[23px] tracking-[3.5px] text-white">HANGU</span>
          <span className="logo-sub font-bold text-[10.5px] tracking-[3px] text-brand-red uppercase mt-0.5">BRANDED SHOES</span>
        </Link>

        {/* Desktop Navigation Links (Pill Style) */}
        <nav className="nb-nav-desktop hidden md:flex items-center gap-1.5 bg-[rgba(22,22,32,0.65)] backdrop-blur-md border border-white/10 px-2 py-1.5 rounded-full shadow-glass">
          {NAV_LINKS.map((link) => {
            const isActive = router.pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nb-link relative px-4 py-2 text-[13.5px] font-medium rounded-full transition-all duration-200 ${
                  isActive ? "active text-white font-semibold" : "text-zinc-400 hover:text-white"
                }`}
              >
                {link.label}
                {isActive && <span className="nb-active-indicator" />}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Cluster */}
        <div className="nb-actions flex items-center gap-2.5">
          {/* Quick Search Button */}
          <button
            type="button"
            className="nb-search-btn inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white hover:bg-brand-red/20 hover:border-brand-red transition-all"
            onClick={openSearch}
            title="Search Shoes"
            aria-label="Search Shoes"
          >
            <Search size={18} />
          </button>

          {/* Quick WhatsApp Concierge Button */}
          <a
            href={wa("Assalam-o-Alaikum! I have a question regarding Hangu Branded Shoes.")}
            target="_blank"
            rel="noopener noreferrer"
            className="nb-wa-btn"
            title="Quick WhatsApp Chat"
            aria-label="WhatsApp Concierge"
          >
            <WhatsAppIcon size={16} color="#25d366" />
            <span className="nb-wa-text font-medium text-xs">WhatsApp</span>
          </a>

          {/* Cart Button */}
          <Link href="/cart" className="nb-cart-btn" aria-label="Shopping Cart">
            <span className="nb-cart-icon">🛒</span>
            <span className="nb-cart-label">Cart</span>
            <span className="nb-cart-badge">{count}</span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className={`nb-hamburger md:hidden ${mobileMenu ? "open" : ""}`}
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle Navigation Menu"
          >
            <span className="nb-bar" />
            <span className="nb-bar" />
            <span className="nb-bar" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`nb-mobile-drawer ${mobileMenu ? "open" : ""}`}>
        <div className="nb-mobile-inner">
          <div className="nb-mobile-links">
            {NAV_LINKS.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nb-mobile-link ${isActive ? "active" : ""}`}
                  onClick={() => setMobileMenu(false)}
                >
                  <span>{link.label}</span>
                  <span className="nb-arrow">›</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Drawer Footer with Direct WhatsApp Order */}
          <div className="nb-mobile-footer">
            <a
              href={wa("Assalam-o-Alaikum! I want to order shoes on WhatsApp.")}
              target="_blank"
              rel="noopener noreferrer"
              className="nb-mobile-wa-btn"
            >
              <WhatsAppIcon size={20} color="#fff" />
              <span>Chat on WhatsApp (+{WA})</span>
            </a>
            <div className="nb-mobile-note">
              🚚 Free Delivery over Rs. 5,000 • 💵 Cash on Delivery
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
