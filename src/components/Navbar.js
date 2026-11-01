import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { WA, wa } from "../data/config";
import { WhatsAppIcon } from "./WhatsAppButton";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/size-guide", label: "Size Guide" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { count } = useCart();
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
      <div className="wrap nb-inner">
        {/* Logo */}
        <Link href="/" className="logo">
          <span className="logo-main">HANGU</span>
          <span className="logo-sub">BRANDED SHOES</span>
        </Link>

        {/* Desktop Navigation Links (Pill Style) */}
        <nav className="nb-nav-desktop">
          {NAV_LINKS.map((link) => {
            const isActive = router.pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nb-link ${isActive ? "active" : ""}`}
              >
                {link.label}
                {isActive && <span className="nb-active-indicator" />}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Cluster */}
        <div className="nb-actions">
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
            <span className="nb-wa-text">WhatsApp</span>
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
            className={`nb-hamburger ${mobileMenu ? "open" : ""}`}
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
