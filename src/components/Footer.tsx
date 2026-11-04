import { useState, FormEvent } from "react";
import Link from "next/link";
import { SHOP, WA, wa, SOCIALS } from "../data/config";
import { WhatsAppIcon, InstagramIcon, TikTokIcon } from "./WhatsAppButton";
import { useSubscribeNewsletter } from "../hooks/useApi";

export default function Footer() {
  const [email, setEmail] = useState<string>("");
  const [subbed, setSubbed] = useState<boolean>(false);
  const [subMsg, setSubMsg] = useState<string>("");

  const subscribeMutation = useSubscribeNewsletter();

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      subscribeMutation.mutate(
        { email: email.trim(), source: "footer_newsletter" },
        {
          onSuccess: (res) => {
            setSubMsg(res.message || "✓ Welcome to HBS VIP Club! Check your inbox.");
            setSubbed(true);
            setEmail("");
            setTimeout(() => setSubbed(false), 6000);
          },
          onError: (err: any) => {
            setSubMsg(err?.message || "✓ Thank you for subscribing!");
            setSubbed(true);
            setEmail("");
            setTimeout(() => setSubbed(false), 6000);
          },
        }
      );
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
            <span className="logo-main font-extrabold text-2xl text-white">HANGU</span>
            <span className="logo-sub font-bold text-xs text-brand-red uppercase">
              BRANDED SHOES
            </span>
          </Link>
          <p className="ft-bio text-zinc-400 text-sm mt-3 leading-relaxed">
            Pakistan’s trusted footwear destination for executive formal wear, cushioned performance
            sneakers, and hand-finished comfort loafers. Engineered for performance, designed for
            prestige.
          </p>

          <div className="ft-contact-list mt-4 flex flex-col gap-2.5">
            <a
              href={wa("Hello! I have a question regarding Hangu Branded Shoes.")}
              target="_blank"
              rel="noopener noreferrer"
              className="ft-contact-item flex items-center gap-2.5 text-zinc-300 hover:text-white"
            >
              <span className="ft-icon">📱</span>
              <div>
                <small className="block text-zinc-500 text-xs">WhatsApp Concierge</small>
                <b className="text-white text-sm">+{WA}</b>
              </div>
            </a>
            <div className="ft-contact-item flex items-center gap-2.5 text-zinc-300">
              <span className="ft-icon">📍</span>
              <div>
                <small className="block text-zinc-500 text-xs">Physical Showroom</small>
                <b className="text-white text-sm">Main Commercial Bazaar, Hangu, KPK</b>
              </div>
            </div>
            <div className="ft-contact-item flex items-center gap-2.5 text-zinc-300">
              <span className="ft-icon">🕒</span>
              <div>
                <small className="block text-zinc-500 text-xs">Operating Hours</small>
                <b className="text-white text-sm">Mon – Sun: 10:00 AM – 10:00 PM</b>
              </div>
            </div>
          </div>

          <div className="ft-socials flex items-center gap-3 mt-4">
            <a
              href={wa("Assalam-o-Alaikum! I want to inquire about footwear.")}
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp"
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#25d366] hover:border-[#25d366] transition-colors"
            >
              <WhatsAppIcon size={18} color="#fff" />
            </a>
            <a
              href={SOCIALS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-pink-600 hover:border-pink-600 transition-colors"
            >
              <InstagramIcon size={18} color="#fff" />
            </a>
            <a
              href={SOCIALS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              title="TikTok"
              aria-label="TikTok"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <TikTokIcon size={18} color="#fff" />
            </a>
          </div>
        </div>

        {/* Col 2: Shoe Collections */}
        <div className="ft-col">
          <h4 className="ft-heading text-white font-bold text-base mb-3">Shoe Collections</h4>
          <ul className="ft-links flex flex-col gap-2 text-zinc-400 text-sm">
            <li>
              <Link href="/shop" className="hover:text-brand-gold transition-colors">
                All Footwear Pairs
              </Link>
            </li>
            <li>
              <Link href="/shop?cat=Sneakers" className="hover:text-brand-gold transition-colors">
                Performance Sneakers
              </Link>
            </li>
            <li>
              <Link href="/shop?cat=Formal" className="hover:text-brand-gold transition-colors">
                Executive Formal Shoes
              </Link>
            </li>
            <li>
              <Link href="/shop?cat=Comfort" className="hover:text-brand-gold transition-colors">
                Everyday Comfort Slip-Ons
              </Link>
            </li>
            <li>
              <Link href="/shop?cat=Loafers" className="hover:text-brand-gold transition-colors">
                Classic Driving Loafers
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Customer Care & Services */}
        <div className="ft-col">
          <h4 className="ft-heading text-white font-bold text-base mb-3">Customer Care</h4>
          <ul className="ft-links flex flex-col gap-2 text-zinc-400 text-sm">
            <li>
              <Link
                href="/track"
                className="text-brand-gold font-bold hover:underline transition-colors flex items-center gap-1.5"
              >
                <span>📦 Track Your Order</span>
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-brand-gold transition-colors">
                About Our Heritage & Brand
              </Link>
            </li>
            <li>
              <Link href="/size-guide" className="hover:text-brand-gold transition-colors">
                Interactive Shoe Size Guide
              </Link>
            </li>
            <li>
              <Link href="/reviews" className="hover:text-brand-gold transition-colors">
                Genuine Customer Reviews
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-brand-gold transition-colors">
                Contact & Showroom Location
              </Link>
            </li>
            <li>
              <Link href="/about#delivery" className="hover:text-brand-gold transition-colors">
                Nationwide Delivery Guide
              </Link>
            </li>
            <li>
              <Link href="/about#exchange" className="hover:text-brand-gold transition-colors">
                7-Day Exchange Policy
              </Link>
            </li>
            <li>
              <a
                href={wa("Hi! I need help with shoe sizing.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-[#25d366] transition-colors"
              >
                Size Fitting Assistance <WhatsAppIcon size={14} color="#25d366" />
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: VIP Newsletter & Payment Options */}
        <div className="ft-col">
          <h4 className="ft-heading text-white font-bold text-base mb-3">HBS VIP Club</h4>
          <p className="ft-sub-text text-zinc-400 text-sm mb-3">
            Subscribe for early access to private footwear drops, exclusive discount vouchers, and
            seasonal releases.
          </p>

          <form className="ft-form" onSubmit={handleSubscribe}>
            <div className="ft-input-group flex gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white text-xs outline-none focus:border-brand-red"
              />
              <button
                type="submit"
                disabled={subscribeMutation.isPending}
                className="btn text-xs py-2 px-5 font-bold disabled:opacity-50"
              >
                {subscribeMutation.isPending ? "Joining..." : "Join"}
              </button>
            </div>
            {subbed && (
              <div className="ft-success text-[#25d366] text-xs mt-2 font-semibold animate-fadeIn">
                {subMsg}
              </div>
            )}
          </form>

          <div className="ft-pay-section mt-5">
            <small className="block text-zinc-500 text-xs mb-2">Accepted Payment Methods</small>
            <div className="ft-pay-chips flex flex-wrap gap-1.5">
              <span className="pay-chip text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-zinc-300">
                💵 Cash on Delivery
              </span>
              <span className="pay-chip text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-zinc-300">
                📱 JazzCash
              </span>
              <span className="pay-chip text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-zinc-300">
                📱 EasyPaisa
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="ft-bottom border-t border-white/10 py-5 mt-10">
        <div className="wrap ft-bottom-inner flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-zinc-500">
          <p>© 2026 {SHOP}. All rights reserved. Crafted for footwear lovers across Pakistan.</p>
          <div className="ft-bottom-links flex gap-4">
            <Link href="/about" className="hover:text-zinc-300">
              About Us
            </Link>
            <Link href="/shop" className="hover:text-zinc-300">
              Shop
            </Link>
            <Link href="/track" className="hover:text-zinc-300 text-brand-gold">
              Track Order
            </Link>
            <Link href="/size-guide" className="hover:text-zinc-300">
              Size Guide
            </Link>
            <Link href="/reviews" className="hover:text-zinc-300">
              Reviews
            </Link>
            <Link href="/contact" className="hover:text-zinc-300">
              Contact
            </Link>
            <Link href="/admin" className="hover:text-zinc-400 opacity-60">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
