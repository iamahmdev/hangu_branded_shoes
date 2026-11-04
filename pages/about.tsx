import { useRef, MouseEvent } from "react";
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
  Sparkles,
  ArrowRight,
  LucideIcon,
} from "lucide-react";

interface Pillar {
  num: string;
  tag: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  accent: string;
  bg: string;
  border: string;
  glow: string;
  specs: string[];
}

const PILLARS: Pillar[] = [
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

function PillarCardItem({ pillar, index }: { pillar: Pillar; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const IconComponent = pillar.icon;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
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
        style={
          {
            "--card-accent": pillar.accent,
            "--card-bg": pillar.bg,
            "--card-border": pillar.border,
            "--card-glow": pillar.glow,
          } as any
        }
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
    <Layout title="About Us — Hangu Branded Shoes">
      <div className="pg wrap pt-32 pb-16" style={{ maxWidth: 1180 }}>
        {/* Hero Header */}
        <Reveal>
          <div className="ab-hero text-center mb-12">
            <span className="pill glass inline-block mb-3 text-xs font-bold text-brand-gold">
              <Sparkles size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />
              ESTABLISHED IN HANGU, KPK • NATIONWIDE RECOGNITION
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white my-3">
              Crafted For Distinction. <br />
              <em className="text-brand-red not-italic">Engineered For All-Day Comfort.</em>
            </h1>
            <p className="ab-hero-lead text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Welcome to {SHOP}. We are dedicated to elevating Pakistan's footwear standard by bridging master artisan shoemaking traditions with modern ergonomic innovation. Every pair delivers genuine luxury, lasting durability, and distinguished style at accessible, direct-to-consumer prices.
            </p>

            <div className="ab-hero-actions flex gap-3 justify-center flex-wrap mt-6">
              <Link className="btn inline-flex items-center gap-2" href="/shop">
                <span>Explore Collection</span>
                <ArrowRight size={16} />
              </Link>
              <a
                className="btn ghost inline-flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
                href={wa("Hello! I would like to learn more about your shoe collection.")}
              >
                <span>Chat with Footwear Specialist</span>
                <WhatsAppIcon size={18} color="var(--gold)" />
              </a>
            </div>
          </div>
        </Reveal>

        {/* Quick In-Page Jump Bar */}
        <div className="ab-nav-bar flex justify-center gap-3 flex-wrap mb-12 p-3 bg-white/5 border border-white/10 rounded-2xl">
          <a href="#story" className="ab-nav-link text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5">📖 Our Story</a>
          <a href="#pillars" className="ab-nav-link text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5">👑 Core Pillars</a>
          <a href="#anatomy" className="ab-nav-link text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5">🔬 Shoe Anatomy</a>
          <a href="#policies" className="ab-nav-link text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5">🚚 Delivery & Policies</a>
          <a href="#showroom" className="ab-nav-link text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5">📍 Showroom Visit</a>
        </div>

        {/* Brand Story Section */}
        <div className="ab-story-section grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16" id="story">
          <Reveal>
            <div className="ab-story-text text-zinc-300 text-sm leading-relaxed flex flex-col gap-3.5">
              <div className="title text-left mb-2">
                <small className="text-brand-red uppercase text-xs font-bold">OUR HERITAGE & ORIGINS</small>
                <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">The Journey From Hangu to Across Pakistan</h2>
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
            <div className="ab-story-card glass relative rounded-3xl overflow-hidden p-3 bg-zinc-950">
              <img
                src="/images/h3.jpg"
                alt="Shoe Craftsmanship at Hangu Branded Shoes"
                className="ab-story-img w-full rounded-2xl object-cover aspect-video"
              />
              <div className="ab-story-badge glass absolute bottom-6 left-6 right-6 p-3 rounded-2xl flex items-center gap-3 bg-black/80 backdrop-blur-md border border-brand-gold/30">
                <Crown size={28} color="#d4a857" style={{ flexShrink: 0 }} />
                <div>
                  <b className="text-white text-xs block font-bold">100% Hand-Inspected Quality</b>
                  <small className="text-zinc-400 text-[11px]">Every pair is triple-checked before packaging</small>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* The Four Core Pillars */}
        <div id="pillars" className="mb-16" style={{ scrollMarginTop: 120 }}>
          <Reveal>
            <div className="title text-center mb-8">
              <small className="text-brand-red uppercase text-xs font-bold">THE HBS PROMISE</small>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1">The Four Pillars That Define Our Work</h2>
            </div>
          </Reveal>

          <div className="ab-pillars-grid grid grid-cols-1 md:grid-cols-2 gap-6">
            {PILLARS.map((pillar, i) => (
              <PillarCardItem key={pillar.title} pillar={pillar} index={i} />
            ))}
          </div>
        </div>

        {/* High-Tech Blueprint: Anatomy of Our Footwear */}
        <div id="anatomy" className="ab-blueprint-wrap glass p-8 md:p-12 rounded-3xl mb-16" style={{ scrollMarginTop: 120 }}>
          <Reveal>
            <div className="ab-blueprint-header text-center mb-10">
              <span className="pill glass inline-block mb-3 text-xs font-bold text-brand-gold">
                <Compass size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />
                ENGINEERED FOR EXCELLENCE
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white">The Anatomy of Our Footwear</h2>
              <p className="text-zinc-400 text-xs md:text-sm max-w-xl mx-auto mt-2">
                A breakdown of the materials, sole kinetics, and ergonomic engineering inside every pair we create.
              </p>
            </div>
          </Reveal>

          <div className="ab-blueprint-grid grid grid-cols-1 md:grid-cols-2 gap-6">
            <Reveal delay={100}>
              <div className="ab-blueprint-card glass p-5 rounded-2xl flex items-start gap-3.5">
                <div className="ab-blueprint-icon text-brand-red shrink-0 mt-1">
                  <Layers size={24} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">1. Hydro-Treated Upper Leathers & Mesh</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Selected high-tensile engineered mesh and full-grain calfskin leathers, specially treated for natural suppleness, crack resistance, and shape retention across seasons.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="ab-blueprint-card glass p-5 rounded-2xl flex items-start gap-3.5">
                <div className="ab-blueprint-icon text-brand-gold shrink-0 mt-1">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">2. Dynamic Kinetic Cushioning Core</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Dual-layer high-rebound EVA polymers that absorb up to 45% of vertical heel-strike energy, drastically reducing impact on knees, ankles, and lumbar spine.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="ab-blueprint-card glass p-5 rounded-2xl flex items-start gap-3.5">
                <div className="ab-blueprint-icon text-[#38bdf8] shrink-0 mt-1">
                  <Compass size={24} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">3. Vulcanized All-Terrain Grip Outsole</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Multi-directional siped rubber tread engineered from oil-resistant vulcanized compounds, ensuring zero-slip traction across polished marble and outdoor pavement.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="ab-blueprint-card glass p-5 rounded-2xl flex items-start gap-3.5">
                <div className="ab-blueprint-icon text-[#25d366] shrink-0 mt-1">
                  <Wind size={24} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">4. Micro-Perforated Thermal Ventilation</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Silky moisture-wicking microfibers with antimicrobial silver-ion infusion, guaranteeing 14+ hours of sweat-free, odor-resistant comfort in diverse Pakistani weather.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Milestone Stats Bar */}
        <Reveal>
          <div className="ab-stats-bar glass grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl text-center mb-16">
            <div className="ab-stat-item">
              <b className="text-2xl md:text-3xl font-extrabold text-white block">15,000+</b>
              <p className="text-xs text-zinc-400 mt-1">Pairs Delivered Across Pakistan</p>
            </div>
            <div className="ab-stat-item">
              <b className="text-2xl md:text-3xl font-extrabold text-white block">120+</b>
              <p className="text-xs text-zinc-400 mt-1">Cities & Towns Reached</p>
            </div>
            <div className="ab-stat-item">
              <b className="text-2xl md:text-3xl font-extrabold text-white block">99.2%</b>
              <p className="text-xs text-zinc-400 mt-1">Positive Fitting & Quality Rating</p>
            </div>
            <div className="ab-stat-item">
              <b className="text-2xl md:text-3xl font-extrabold text-white block">7 Days</b>
              <p className="text-xs text-zinc-400 mt-1">Risk-Free Exchange Window</p>
            </div>
          </div>
        </Reveal>

        {/* Comprehensive Customer Policies */}
        <div id="policies" className="mb-16" style={{ scrollMarginTop: 120 }}>
          <Reveal>
            <div className="title text-center mb-8">
              <small className="text-brand-red uppercase text-xs font-bold">CUSTOMER COMMITMENT</small>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1">Delivery, Payment & Exchange Policies</h2>
            </div>
          </Reveal>

          <div className="ab-policies grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal delay={100}>
              <div className="ab-policy-card glass p-6 rounded-3xl flex flex-col gap-2">
                <h4 className="text-lg font-bold text-white flex items-center gap-2.5">
                  <Truck size={22} color="var(--red)" /> Nationwide Tracked Delivery
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  We deliver to every corner of Pakistan through reliable courier services, ensuring your shoes arrive safely packed in rigid protective boxes.
                </p>
                <ul className="text-xs text-zinc-300 list-disc pl-4 flex flex-col gap-1 mt-2">
                  <li>Free shipping on all orders over Rs. 5,000</li>
                  <li>Flat Rs. 250 fee for orders under Rs. 5,000</li>
                  <li>Express delivery within 2 to 4 business days</li>
                  <li>Real-time tracking updates via SMS & WhatsApp</li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="ab-policy-card glass p-6 rounded-3xl flex flex-col gap-2">
                <h4 className="text-lg font-bold text-white flex items-center gap-2.5">
                  <Banknote size={22} color="#d4a857" /> Cash on Delivery & Digital Payments
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Shop with complete peace of mind. You can pay with your preferred payment method seamlessly and securely.
                </p>
                <ul className="text-xs text-zinc-300 list-disc pl-4 flex flex-col gap-1 mt-2">
                  <li>Cash on Delivery (COD) available nationwide</li>
                  <li>Pay only after verifying the package at your doorstep</li>
                  <li>JazzCash & EasyPaisa instant mobile transfers</li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="ab-policy-card glass p-6 rounded-3xl flex flex-col gap-2">
                <h4 className="text-lg font-bold text-white flex items-center gap-2.5">
                  <RotateCcw size={22} color="#25d366" /> 7-Day Hassle-Free Exchange
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  We understand that shoe sizing can vary across designs. If your pair is slightly tight or loose, we make the exchange process effortless.
                </p>
                <ul className="text-xs text-zinc-300 list-disc pl-4 flex flex-col gap-1 mt-2">
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
        <div id="showroom" className="mb-16" style={{ scrollMarginTop: 120 }}>
          <Reveal>
            <div className="ab-store-box glass p-8 md:p-10 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="ab-store-info">
                <span className="pill glass inline-block mb-3 text-xs font-bold text-brand-gold">
                  <Store size={14} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />
                  VISIT OUR SHOWROOM
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">Experience Hangu Branded Shoes In Person</h3>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-4">
                  If you are in Khyber Pakhtunkhwa or passing through Hangu, we warmly invite you to visit our flagship retail outlet. Try on different pairs, test our memory cushioning on our fitting lounge, and receive tailored styling advice.
                </p>
                <div className="ab-store-details flex flex-col gap-2 text-xs text-zinc-300">
                  <div className="ab-store-detail-row flex items-center gap-2">
                    <Store size={18} color="var(--red)" style={{ flexShrink: 0 }} />
                    <span><strong>Address:</strong> Main Commercial Bazaar, Hangu, KPK, Pakistan</span>
                  </div>
                  <div className="ab-store-detail-row flex items-center gap-2">
                    <Clock size={18} color="var(--gold)" style={{ flexShrink: 0 }} />
                    <span><strong>Store Timings:</strong> Monday to Sunday, 10:00 AM – 10:00 PM</span>
                  </div>
                  <div className="ab-store-detail-row flex items-center gap-2">
                    <PhoneCall size={18} color="#25d366" style={{ flexShrink: 0 }} />
                    <span><strong>Direct Helpline:</strong> +{WA} (WhatsApp & Voice Call)</span>
                  </div>
                </div>
              </div>

              <div className="ab-store-actions flex flex-col gap-3">
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Not in Hangu? No problem! You can request high-resolution photos and live 360-degree video inspection of your exact pair on WhatsApp before we ship it to you.
                </p>
                <a
                  className="btn flex items-center justify-center gap-2 text-center text-xs py-3 px-5"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={wa("Hi! I would like to see live photos/videos of your shoes before ordering.")}
                >
                  <Video size={18} />
                  <span>Request Live Pair Video on WhatsApp</span>
                  <WhatsAppIcon size={18} color="#fff" />
                </a>
                <Link className="btn ghost text-center text-xs py-3 px-5" href="/shop">
                  Browse Online Catalog →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Bottom CTA */}
        <Reveal>
          <div className="cta text-center py-16 px-4 rounded-3xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Ready to Elevate Your Stride?</h2>
            <p className="text-zinc-400 max-w-lg mx-auto mb-6 text-sm">
              Explore our handpicked curation of high-traction athletic sneakers, executive leather derby shoes, and luxurious comfort slip-ons.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link className="btn" href="/shop">Shop Now</Link>
              <Link className="btn ghost" href="/reviews">Read Customer Reviews</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </Layout>
  );
}
