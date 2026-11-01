import { useRef } from "react";
import Link from "next/link";
import Layout from "../src/components/Layout";
import Reveal from "../src/components/Reveal";
import { WhatsAppIcon } from "../src/components/WhatsAppButton";
import { SHOP, WA, wa } from "../src/data/config";
import {
  Crown,
  Feather,
  BadgePercent,
  ShieldCheck,
  Layers,
  Zap,
  Compass,
  Wind,
  Truck,
  Banknote,
  RotateCcw,
  Store,
  Clock,
  PhoneCall,
  Video,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const PILLARS = [
  {
    num: "01",
    tag: "Artisanal Integrity",
    title: "Uncompromising Craftsmanship",
    desc: "Every silhouette is tailored from premium full-grain leathers, burnished hides, and high-tensile technical meshes. Double-lock reinforced stitching ensures zero sole separation and preserves structure across years of daily use.",
    icon: Crown,
    accent: "#d4a857",
    bg: "rgba(212, 168, 87, 0.12)",
    border: "rgba(212, 168, 87, 0.35)",
    glow: "rgba(212, 168, 87, 0.2)",
    specs: ["100% Full-Grain Calfskin", "Double-Welt Stitching", "Hand-Polished Finish"],
  },
  {
    num: "02",
    tag: "Biomechanical Engineering",
    title: "Ergonomic All-Day Comfort",
    desc: "Footwear should empower your day, not exhaust your legs. Our soles integrate multi-density EVA polymers, contoured anatomical arch cradles, and memory cushioning that absorb kinetic shock through 12+ hours of non-stop wear.",
    icon: Feather,
    accent: "#38bdf8",
    bg: "rgba(56, 189, 248, 0.12)",
    border: "rgba(56, 189, 248, 0.35)",
    glow: "rgba(56, 189, 248, 0.2)",
    specs: ["Multi-Density EVA Midsole", "Contoured Arch Support", "Anti-Fatigue Footbed"],
  },
  {
    num: "03",
    tag: "Direct-To-Consumer Value",
    title: "Honest & Transparent Pricing",
    desc: "We believe true luxury should never require unjustifiable markups. By managing our own supply chain directly from master workshop benches, we bypass distributor margins and high-mall overheads to pass direct savings to you.",
    icon: BadgePercent,
    accent: "#22c55e",
    bg: "rgba(34, 197, 94, 0.12)",
    border: "rgba(34, 197, 94, 0.35)",
    glow: "rgba(34, 197, 94, 0.2)",
    specs: ["Direct-From-Workshop", "Zero Mall Rent Markups", "Fair & Fixed Pricing"],
  },
  {
    num: "04",
    tag: "100% Client Protection",
    title: "Risk-Free Shopping Trust",
    desc: "Ordering footwear online should be effortless and risk-free. Enjoy complete doorstep Cash on Delivery verification, 24/7 dedicated WhatsApp concierge support, and an ironclad 7-day hassle-free size replacement policy.",
    icon: ShieldCheck,
    accent: "#e10600",
    bg: "rgba(225, 6, 0, 0.12)",
    border: "rgba(225, 6, 0, 0.35)",
    glow: "rgba(225, 6, 0, 0.2)",
    specs: ["Cash on Delivery (COD)", "7-Day Size Exchange", "Pre-Dispatch Live Video"],
  },
];

function PillarCardItem({ pillar, index }) {
  const cardRef = useRef(null);
  const IconComponent = pillar.icon;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-8px)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "";
  };

  return (
    <Reveal delay={index * 120}>
      <div
        ref={cardRef}
        className="ab-pillar-card glass"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          "--card-accent": pillar.accent,
          "--card-bg": pillar.bg,
          "--card-border": pillar.border,
          "--card-glow": pillar.glow,
        }}
      >
        <span className="ab-pillar-watermark">{pillar.num}</span>

        <div>
          <div className="ab-pillar-icon-box">
            <IconComponent size={28} />
          </div>

          <span className="ab-pillar-tag">{pillar.tag}</span>
          <h3 className="ab-pillar-title">{pillar.title}</h3>
          <p className="ab-pillar-desc">{pillar.desc}</p>
        </div>

        <div className="ab-pillar-chips">
          {pillar.specs.map((spec) => (
            <span key={spec} className="ab-spec-chip">
              ✓ {spec}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export default function About() {
  return (
    <Layout title="About Us — Hangu_branded_shoes">
      <div className="pg wrap" style={{ maxWidth: 1180 }}>
        {/* Hero Header */}
        <Reveal>
          <div className="ab-hero">
            <span className="pill glass">
              <Sparkles size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />
              ESTABLISHED IN HANGU, KPK • NATIONWIDE RECOGNITION
            </span>
            <h1>
              Crafted For Distinction. <br />
              <em>Engineered For All-Day Comfort.</em>
            </h1>
            <p className="ab-hero-lead">
              Welcome to {SHOP}. We are dedicated to elevating Pakistan's footwear standard by bridging master artisan shoemaking traditions with modern ergonomic innovation. Every pair delivers genuine luxury, lasting durability, and distinguished style at accessible, direct-to-consumer prices.
            </p>

            <div className="ab-hero-actions">
              <Link className="btn" href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                Explore Collection <ArrowRight size={16} />
              </Link>
              <a
                className="btn ghost"
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
                target="_blank"
                rel="noopener noreferrer"
                href={wa("Hello! I would like to learn more about your shoe collection.")}
              >
                Chat with Footwear Specialist <WhatsAppIcon size={18} color="var(--gold)" />
              </a>
            </div>
          </div>
        </Reveal>

        {/* Quick In-Page Jump Bar (100% Asan Navigation for Customers) */}
        <div className="ab-nav-bar">
          <a href="#story" className="ab-nav-link">📖 Our Story</a>
          <a href="#pillars" className="ab-nav-link">👑 Core Pillars</a>
          <a href="#anatomy" className="ab-nav-link">🔬 Shoe Anatomy</a>
          <a href="#policies" className="ab-nav-link">🚚 Delivery & Policies</a>
          <a href="#showroom" className="ab-nav-link">📍 Showroom Visit</a>
        </div>

        {/* Brand Story Section */}
        <div className="ab-story-section" id="story">
          <Reveal>
            <div className="ab-story-text">
              <div className="title" style={{ textAlign: "left", marginBottom: 20 }}>
                <small>OUR HERITAGE & ORIGINS</small>
                <h2 style={{ fontSize: 32 }}>The Journey From Hangu to Across Pakistan</h2>
              </div>
              <p>
                {SHOP} was founded in Hangu, Khyber Pakhtunkhwa, out of a simple observation: Pakistani shoe buyers were routinely forced to choose between overpriced foreign imports in big-city shopping malls or fragile local footwear that compromised on foot health and longevity.
              </p>
              <p>
                We set out to eliminate that compromise. By partnering directly with seasoned shoemakers and certified production facilities, we cut out intermediary markups, distributor margins, and unnecessary retail overheads. This allows us to deliver high-grade leathers, resilient shock-dampening soles, and precision stitching directly to your doorstep.
              </p>
              <p>
                Today, what started as a beloved local footwear boutique has grown into a nationwide brand trusted by over 15,000 satisfied professionals, athletes, and style connoisseurs in Karachi, Lahore, Islamabad, Peshawar, Quetta, and remote districts across Pakistan.
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="ab-story-card glass">
              <img
                src="/images/h3.jpg"
                alt="Shoe Craftsmanship at Hangu Branded Shoes"
                className="ab-story-img"
              />
              <div className="ab-story-badge glass">
                <Crown size={28} color="#d4a857" style={{ flexShrink: 0 }} />
                <div>
                  <b>100% Hand-Inspected Quality</b>
                  <small>Every pair is triple-checked before packaging</small>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* The Four Core Pillars (3D Lucide Animated Cards) */}
        <div id="pillars" style={{ scrollMarginTop: 120 }}>
          <Reveal>
            <div className="title">
              <small>THE STEPZONE PROMISE</small>
              <h2>The Four Pillars That Define Our Work</h2>
            </div>
          </Reveal>

          <div className="ab-pillars-grid">
            {PILLARS.map((pillar, i) => (
              <PillarCardItem key={pillar.title} pillar={pillar} index={i} />
            ))}
          </div>
        </div>

        {/* High-Tech Blueprint: Anatomy of Our Footwear */}
        <div id="anatomy" className="ab-blueprint-wrap" style={{ scrollMarginTop: 120 }}>
          <Reveal>
            <div className="ab-blueprint-header">
              <span className="pill glass">
                <Compass size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />
                ENGINEERED FOR EXCELLENCE
              </span>
              <h2>The Anatomy of Our Footwear</h2>
              <p style={{ color: "var(--mut)", marginTop: 10, fontSize: 14 }}>
                A breakdown of the materials, sole kinetics, and ergonomic engineering inside every pair we create.
              </p>
            </div>
          </Reveal>

          <div className="ab-blueprint-grid">
            <Reveal delay={100}>
              <div className="ab-blueprint-card">
                <div className="ab-blueprint-icon">
                  <Layers size={24} />
                </div>
                <div>
                  <h4>1. Hydro-Treated Upper Leathers & Mesh</h4>
                  <p>
                    Selected high-tensile engineered mesh and full-grain calfskin leathers, specially treated for natural suppleness, crack resistance, and shape retention across seasons.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="ab-blueprint-card">
                <div className="ab-blueprint-icon">
                  <Zap size={24} />
                </div>
                <div>
                  <h4>2. Dynamic Kinetic Cushioning Core</h4>
                  <p>
                    Dual-layer high-rebound EVA polymers that absorb up to 45% of vertical heel-strike energy, drastically reducing impact on knees, ankles, and lumbar spine.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="ab-blueprint-card">
                <div className="ab-blueprint-icon">
                  <Compass size={24} />
                </div>
                <div>
                  <h4>3. Vulcanized All-Terrain Grip Outsole</h4>
                  <p>
                    Multi-directional siped rubber tread engineered from oil-resistant vulcanized compounds, ensuring zero-slip traction across polished marble and outdoor pavement.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="ab-blueprint-card">
                <div className="ab-blueprint-icon">
                  <Wind size={24} />
                </div>
                <div>
                  <h4>4. Micro-Perforated Thermal Ventilation</h4>
                  <p>
                    Silky moisture-wicking microfibers with antimicrobial silver-ion infusion, guaranteeing 14+ hours of sweat-free, odor-resistant comfort in diverse Pakistani weather.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Milestone Stats Bar */}
        <Reveal>
          <div className="ab-stats-bar glass">
            <div className="ab-stat-item">
              <b>15,000+</b>
              <p>Pairs Delivered Across Pakistan</p>
            </div>
            <div className="ab-stat-item">
              <b>120+</b>
              <p>Cities & Towns Reached</p>
            </div>
            <div className="ab-stat-item">
              <b>99.2%</b>
              <p>Positive Fitting & Quality Rating</p>
            </div>
            <div className="ab-stat-item">
              <b>7 Days</b>
              <p>Risk-Free Exchange Window</p>
            </div>
          </div>
        </Reveal>

        {/* Comprehensive Customer Policies */}
        <div id="policies" style={{ scrollMarginTop: 120 }}>
          <Reveal>
            <div className="title">
              <small>CUSTOMER COMMITMENT</small>
              <h2>Delivery, Payment & Exchange Policies</h2>
            </div>
          </Reveal>

          <div className="ab-policies">
            <Reveal delay={100}>
              <div className="ab-policy-card glass">
                <h4 style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Truck size={22} color="var(--red)" /> Nationwide Tracked Delivery
                </h4>
                <p>
                  We deliver to every corner of Pakistan through reliable courier services, ensuring your shoes arrive safely packed in rigid protective boxes.
                </p>
                <ul>
                  <li>Free shipping on all orders over Rs. 5,000</li>
                  <li>Flat Rs. 250 fee for orders under Rs. 5,000</li>
                  <li>Express delivery within 2 to 4 business days</li>
                  <li>Real-time tracking updates via SMS & WhatsApp</li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="ab-policy-card glass">
                <h4 style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Banknote size={22} color="#d4a857" /> Cash on Delivery & Digital Payments
                </h4>
                <p>
                  Shop with complete peace of mind. You can pay with your preferred payment method seamlessly and securely.
                </p>
                <ul>
                  <li>Cash on Delivery (COD) available nationwide</li>
                  <li>Pay only after verifying the package at your doorstep</li>
                  <li>JazzCash & EasyPaisa instant mobile transfers</li>
                  <li>Direct Bank Wire Transfer with instant confirmation</li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="ab-policy-card glass">
                <h4 style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <RotateCcw size={22} color="#25d366" /> 7-Day Hassle-Free Exchange
                </h4>
                <p>
                  We understand that shoe sizing can vary across designs. If your pair is slightly tight or loose, we make the exchange process effortless.
                </p>
                <ul>
                  <li>Notify our WhatsApp team within 7 days of delivery</li>
                  <li>Shoes must be in unworn, original condition with box</li>
                  <li>Prompt replacement pair dispatched immediately</li>
                  <li>Direct personalized guidance from our sizing team</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Physical Showroom & Sizing Assistance */}
        <div id="showroom" style={{ scrollMarginTop: 120 }}>
          <Reveal>
            <div className="ab-store-box glass">
              <div className="ab-store-info">
                <span className="pill glass" style={{ marginBottom: 12 }}>
                  <Store size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />
                  VISIT OUR SHOWROOM
                </span>
                <h3>Experience Hangu Branded Shoes In Person</h3>
                <p>
                  If you are in Khyber Pakhtunkhwa or passing through Hangu, we warmly invite you to visit our flagship retail outlet. Try on different pairs, test our memory cushioning on our fitting lounge, and receive tailored styling advice.
                </p>
                <div className="ab-store-details">
                  <div className="ab-store-detail-row">
                    <Store size={18} color="var(--red)" style={{ flexShrink: 0 }} />
                    <span><strong>Address:</strong> Main Commercial Bazaar, Hangu, Khyber Pakhtunkhwa, Pakistan</span>
                  </div>
                  <div className="ab-store-detail-row">
                    <Clock size={18} color="var(--gold)" style={{ flexShrink: 0 }} />
                    <span><strong>Store Timings:</strong> Monday to Sunday, 10:00 AM – 10:00 PM</span>
                  </div>
                  <div className="ab-store-detail-row">
                    <PhoneCall size={18} color="#25d366" style={{ flexShrink: 0 }} />
                    <span><strong>Direct Helpline:</strong> +{WA} (WhatsApp & Voice Call)</span>
                  </div>
                </div>
              </div>

              <div className="ab-store-actions">
                <p style={{ color: "var(--mut)", fontSize: 13, lineHeight: 1.6 }}>
                  Not in Hangu? No problem! You can request high-resolution photos and live 360-degree video inspection of your exact pair on WhatsApp before we ship it to you.
                </p>
                <a
                  className="btn"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, textAlign: "center" }}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={wa("Hi! I would like to see live photos/videos of your shoes before ordering.")}
                >
                  <Video size={18} /> Request Live Pair Video on WhatsApp <WhatsAppIcon size={18} color="#fff" />
                </a>
                <Link className="btn ghost" style={{ textAlign: "center" }} href="/shop">
                  Browse Online Catalog →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Bottom CTA */}
        <Reveal>
          <div className="cta" style={{ borderRadius: 26, padding: "60px 24px" }}>
            <h2>Ready to Elevate Your Stride?</h2>
            <p style={{ color: "var(--mut)", maxWidth: 540, margin: "0 auto 26px", lineHeight: 1.7 }}>
              Explore our handpicked curation of high-traction athletic sneakers, executive leather derby shoes, and luxurious comfort slip-ons.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link className="btn" href="/shop">Shop Now</Link>
              <Link className="btn ghost" href="/reviews">Read Customer Reviews</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </Layout>
  );
}
