import { useState } from "react";
import Link from "next/link";
import { SHOP, WA, wa, SOCIALS } from "../data/config";
import { WhatsAppIcon, InstagramIcon, TikTokIcon } from "./WhatsAppButton";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subbed, setSubbed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubbed(true);
      setEmail("");
      setTimeout(() => setSubbed(false), 5000);
    }
  };

  return (
    <footer className="ft-wrap">
      {/* Top Value Highlights */}
      <div className="ft-perks wrap">
        <div className="ft-perk glass">
          <span className="ft-perk-icon">🚚</span>
          <div>
            <b>Free Nationwide Delivery</b>
            <p>On all orders above Rs. 5,000</p>
          </div>
        </div>
        <div className="ft-perk glass">
          <span className="ft-perk-icon">💵</span>
          <div>
            <b>Cash On Delivery (COD)</b>
            <p>Inspect your shoes before payment</p>
          </div>
        </div>
        <div className="ft-perk glass">
          <span className="ft-perk-icon">🔄</span>
          <div>
            <b>7-Day Free Size Exchange</b>
            <p>Hassle-free replacement guarantee</p>
          </div>
        </div>
        <div className="ft-perk glass">
          <span className="ft-perk-icon">⭐</span>
          <div>
            <b>100% Quality Inspected</b>
            <p>Triple-checked before dispatch</p>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="ft-body wrap">
        {/* Col 1: Brand & Contact Info */}
        <div className="ft-col ft-brand">
          <Link href="/" className="logo">
            <span className="logo-main">HANGU</span>
            <span className="logo-sub">BRANDED SHOES</span>
          </Link>
          <p className="ft-bio">
            Pakistan’s trusted footwear destination for executive formal wear, cushioned performance sneakers, and hand-finished comfort loafers. Engineered for performance, designed for prestige.
          </p>

          <div className="ft-contact-list">
            <a
              href={wa("Hello! I have a question regarding Hangu Branded Shoes.")}
              target="_blank"
              rel="noopener noreferrer"
              className="ft-contact-item"
            >
              <span className="ft-icon">📱</span>
              <div>
                <small>WhatsApp Concierge</small>
                <b>+{WA}</b>
              </div>
            </a>
            <div className="ft-contact-item">
              <span className="ft-icon">📍</span>
              <div>
                <small>Physical Showroom</small>
                <b>Main Commercial Bazaar, Hangu, KPK</b>
              </div>
            </div>
            <div className="ft-contact-item">
              <span className="ft-icon">🕒</span>
              <div>
                <small>Operating Hours</small>
                <b>Mon – Sun: 10:00 AM – 10:00 PM</b>
              </div>
            </div>
          </div>

          <div className="ft-socials">
            <a href={wa("Assalam-o-Alaikum! I want to inquire about footwear.")} target="_blank" rel="noopener noreferrer" title="WhatsApp" aria-label="WhatsApp">
              <WhatsAppIcon size={18} color="#fff" />
            </a>
            <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram">
              <InstagramIcon size={19} color="#fff" />
            </a>
            <a href={SOCIALS.tiktok} target="_blank" rel="noopener noreferrer" title="TikTok" aria-label="TikTok">
              <TikTokIcon size={18} color="#fff" />
            </a>
          </div>
        </div>

        {/* Col 2: Shoe Collections */}
        <div className="ft-col">
          <h4 className="ft-heading">Shoe Collections</h4>
          <ul className="ft-links">
            <li><Link href="/shop">All Footwear Pairs</Link></li>
            <li><Link href="/shop">Performance Sneakers</Link></li>
            <li><Link href="/shop">Executive Formal Shoes</Link></li>
            <li><Link href="/shop">Everyday Comfort Slip-Ons</Link></li>
            <li><Link href="/shop">Classic Driving Loafers</Link></li>
            <li><Link href="/shop">Latest 2026 Arrivals</Link></li>
          </ul>
        </div>

        {/* Col 3: Customer Care & Services */}
        <div className="ft-col">
          <h4 className="ft-heading">Customer Care</h4>
          <ul className="ft-links">
            <li><Link href="/about">About Our Heritage & Brand</Link></li>
            <li><Link href="/size-guide">Interactive Shoe Size Guide</Link></li>
            <li><Link href="/reviews">Genuine Customer Reviews</Link></li>
            <li><Link href="/contact">Contact & Store Location</Link></li>
            <li><Link href="/about#delivery">Nationwide Delivery Guide</Link></li>
            <li><Link href="/about#exchange">7-Day Exchange Policy</Link></li>
            <li>
              <a href={wa("Hi! I need help with shoe sizing.")} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                Size Fitting Assistance <WhatsAppIcon size={14} color="#25d366" />
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: VIP Newsletter & Payment Options */}
        <div className="ft-col">
          <h4 className="ft-heading">HBS VIP Club</h4>
          <p className="ft-sub-text">
            Subscribe for early access to private footwear drops, exclusive discount vouchers, and seasonal releases.
          </p>

          <form className="ft-form" onSubmit={handleSubscribe}>
            <div className="ft-input-group">
              <input
                type="text"
                placeholder="Enter email or WhatsApp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn">Join</button>
            </div>
            {subbed && (
              <div className="ft-success">
                ✓ Welcome to VIP Club! We will keep you updated with the latest drops.
              </div>
            )}
          </form>

          <div className="ft-pay-section">
            <small>Accepted Payment Methods</small>
            <div className="ft-pay-chips">
              <span className="pay-chip">💵 Cash on Delivery</span>
              <span className="pay-chip">📱 JazzCash</span>
              <span className="pay-chip">📱 EasyPaisa</span>
              <span className="pay-chip">🏦 Bank Transfer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="ft-bottom">
        <div className="wrap ft-bottom-inner">
          <p>© 2026 {SHOP}. All rights reserved. Crafted for footwear lovers across Pakistan.</p>
          <div className="ft-bottom-links">
            <Link href="/about">About Us</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/size-guide">Size Guide</Link>
            <Link href="/reviews">Reviews</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
