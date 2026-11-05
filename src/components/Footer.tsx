import Link from "next/link";
import { SHOP, WA, wa, SOCIALS } from "../data/config";
import { WhatsAppIcon, InstagramIcon, TikTokIcon, FacebookIcon } from "./WhatsAppButton";
import { useStoreSettings } from "../hooks/useApi";
import { MapPin, Phone, Clock, ArrowRight, ShieldCheck, Truck, RefreshCw, CheckCircle2 } from "lucide-react";

export default function Footer() {
  const { data: storeSettingsData } = useStoreSettings();
  const settings = storeSettingsData?.data;
  const address = settings?.address?.trim() || "Hangu tall road tahir markit hangu brand shoes 👟";
  const whatsappNum = settings?.whatsappNumber?.trim() || WA;
  const shopTiming = settings?.shopTiming?.trim() || "8:00 AM to 5:00 PM";

  return (
    <footer className="ft-wrap">
      {/* 1. Value Highlights Bar (Clean Light Luxury Style) */}
      <div className="ft-perks wrap">
        <div className="ft-perk">
          <span className="ft-perk-icon">🚚</span>
          <div>
            <b>Free Nationwide Delivery</b>
            <p>On all footwear orders over Rs. 5,000</p>
          </div>
        </div>

        <div className="ft-perk">
          <span className="ft-perk-icon">⚡</span>
          <div>
            <b>Fast EasyPaisa & COD</b>
            <p>Doorstep cash delivery or direct mobile transfer</p>
          </div>
        </div>

        <div className="ft-perk">
          <span className="ft-perk-icon">🔄</span>
          <div>
            <b>7-Day Free Size Exchange</b>
            <p>Hassle-free size replacement guarantee</p>
          </div>
        </div>

        <div className="ft-perk">
          <span className="ft-perk-icon">⭐</span>
          <div>
            <b>100% Genuine Sole Footwear</b>
            <p>Triple-inspected for durability and premium comfort</p>
          </div>
        </div>
      </div>

      {/* 2. Main 4-Column Footer Body (Logical Sequence & Clean Layout) */}
      <div className="ft-body wrap">
        {/* Column 1: Brand Identity & Physical Showroom */}
        <div className="ft-col ft-brand">
          <Link href="/" className="flex items-center gap-4 mb-4 group">
            <img
              src="/images/logo.png"
              alt="Hangu Branded Shoes"
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-contain bg-white ring-2 ring-white/20 p-0.5 group-hover:scale-105 transition-transform shrink-0 shadow-lg"
            />
            <div>
              <span className="font-extrabold text-xl md:text-2xl tracking-[0.22em] text-white uppercase group-hover:text-emerald-400 transition-colors block leading-tight">
                H A N G U .
              </span>
              <span className="block text-[10px] md:text-[11px] font-bold tracking-[0.22em] text-zinc-400 uppercase mt-1">
                BRANDED FOOTWEAR
              </span>
            </div>
          </Link>

          <p className="ft-bio">
            Pakistan’s trusted footwear brand for handcrafted formal shoes, cushioned daily
            sneakers, and genuine comfort driving loafers. Engineered for elegance, built for endurance.
          </p>

          {/* Showroom & Helpline Details */}
          <div className="ft-contact-list">
            <div className="ft-contact-item">
              <span className="ft-icon text-emerald-400">📍</span>
              <div className="min-w-0">
                <small>Physical Showroom</small>
                <b className="truncate block" title={address}>{address}</b>
              </div>
            </div>

            <a
              href={wa("Assalam-o-Alaikum! I have an inquiry about Hangu Branded Shoes.", whatsappNum)}
              target="_blank"
              rel="noopener noreferrer"
              className="ft-contact-item"
            >
              <span className="ft-icon text-emerald-400">📱</span>
              <div>
                <small>Official WhatsApp Helpline</small>
                <b>+{whatsappNum}</b>
              </div>
            </a>

            <div className="ft-contact-item">
              <span className="ft-icon text-emerald-400">🕒</span>
              <div>
                <small>Showroom Operating Hours</small>
                <b>{shopTiming}</b>
              </div>
            </div>
          </div>

          {/* Social Channels */}
          <div className="ft-socials">
            <a
              href={wa("Assalam-o-Alaikum! I want to inquire about footwear.", whatsappNum)}
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp Concierge"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon size={16} color="#10b981" />
            </a>

            <a
              href={SOCIALS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              title="TikTok Official"
              aria-label="TikTok"
            >
              <TikTokIcon size={16} color="#ffffff" />
            </a>

            <a
              href={SOCIALS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook Official"
              aria-label="Facebook"
            >
              <FacebookIcon size={16} color="#38bdf8" />
            </a>

            <a
              href={SOCIALS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              aria-label="Instagram"
            >
              <InstagramIcon size={16} color="#f472b6" />
            </a>
          </div>
        </div>

        {/* Column 2: Footwear Collections */}
        <div className="ft-col">
          <h4 className="ft-heading">Footwear Collections</h4>
          <ul className="ft-links">
            <li>
              <Link href="/shop">
                <span>All Footwear Pairs</span>
              </Link>
            </li>
            <li>
              <Link href="/shop?cat=Sneakers">
                <span>Performance Sneakers</span>
              </Link>
            </li>
            <li>
              <Link href="/shop?cat=Formal">
                <span>Executive Formal Shoes</span>
              </Link>
            </li>
            <li>
              <Link href="/shop?cat=Comfort">
                <span>Everyday Comfort Slip-Ons</span>
              </Link>
            </li>
            <li>
              <Link href="/shop?cat=Loafers">
                <span>Classic Driving Loafers</span>
              </Link>
            </li>
            <li>
              <Link href="/shop?sort=newest">
                <span>New Seasonal Arrivals</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Customer Care & Services */}
        <div className="ft-col">
          <h4 className="ft-heading">Customer Care</h4>
          <ul className="ft-links">
            <li>
              <Link href="/track" className="font-semibold text-emerald-400 hover:text-emerald-300">
                <span>📦 Track Your Live Order</span>
              </Link>
            </li>
            <li>
              <Link href="/size-guide">
                <span>Interactive Size Guide</span>
              </Link>
            </li>
            <li>
              <Link href="/reviews">
                <span>Verified Customer Reviews</span>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <span>About Our Heritage & Brand</span>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <span>Contact & Store Location</span>
              </Link>
            </li>
            <li>
              <Link href="/about#exchange">
                <span>7-Day Free Exchange Policy</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Direct Support & Payment Methods */}
        <div className="ft-col">
          <h4 className="ft-heading">Direct Concierge</h4>
          <p className="ft-sub-text">
            Need sizing advice or want to place a custom order? Our WhatsApp concierge is ready to assist you.
          </p>

          <a
            href={wa("Assalam-o-Alaikum! I need help with shoe sizing and ordering.", whatsappNum)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors mb-4 shadow-xs"
          >
            <WhatsAppIcon size={16} color="#fff" />
            <span>Chat on WhatsApp</span>
          </a>

          <div className="ft-pay-section">
            <small>Accepted Payment Methods</small>
            <div className="ft-pay-chips">
              <span className="pay-chip">
                <span>💵</span> Cash on Delivery (COD)
              </span>
              <span className="pay-chip">
                <span>📱</span> EasyPaisa Transfer
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal & Navigation Strip */}
      <div className="ft-bottom">
        <div className="wrap ft-bottom-inner">
          <p>© 2026 {SHOP}. All rights reserved. Crafted for footwear enthusiasts across Pakistan.</p>
          <div className="ft-bottom-links">
            <Link href="/about">About Us</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/track">Track Order</Link>
            <Link href="/size-guide">Size Guide</Link>
            <Link href="/reviews">Reviews</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/admin" className="opacity-60 hover:opacity-100">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
