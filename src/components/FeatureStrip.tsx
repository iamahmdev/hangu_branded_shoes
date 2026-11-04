import { useRef, MouseEvent, ReactNode } from "react";
import Reveal from "./Reveal";
import { WhatsAppIcon } from "./WhatsAppButton";

interface Perk {
  icon: ReactNode;
  title: string;
  desc: string;
  badge: string;
  color: string;
}

const PERKS: Perk[] = [
  {
    icon: "🚚",
    title: "Free Express Delivery",
    desc: "Free on all orders over Rs. 5,000 nationwide",
    badge: "Tracked Dispatch",
    color: "#e10600",
  },
  {
    icon: "⚡",
    title: "EasyPaisa Fast Pay",
    desc: "Quick verified mobile payments with instant WhatsApp confirmation",
    badge: "Direct & Safe",
    color: "#d4a857",
  },
  {
    icon: "🔄",
    title: "7-Day Size Exchange",
    desc: "Instant hassle-free swap if fitting isn't perfect",
    badge: "Guaranteed",
    color: "#25d366",
  },
  {
    icon: "🛡️",
    title: "100% Quality Inspected",
    desc: "Triple-checked leather, cushioning & seams",
    badge: "Certified",
    color: "#3b82f6",
  },
  {
    icon: <WhatsAppIcon size={24} color="#25d366" />,
    title: "Live Video Inspection",
    desc: "Request real 360° videos on WhatsApp before dispatch",
    badge: "VIP Service",
    color: "#25d366",
  },
];

function PerkCard({ perk, index }: { perk: Perk; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-8px)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "";
  };

  return (
    <Reveal delay={index * 90}>
      <div
        ref={cardRef}
        className="perk-3d-card glass"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="perk-card-glow" style={{ "--glow-color": perk.color } as any} />
        <div className="perk-card-top">
          <div className="perk-icon-wrap" style={{ borderColor: `${perk.color}40` }}>
            <span className="perk-icon-emoji">{perk.icon}</span>
          </div>
          <span className="perk-badge" style={{ color: perk.color, borderColor: `${perk.color}50` }}>
            {perk.badge}
          </span>
        </div>
        <div className="perk-card-content">
          <h4>{perk.title}</h4>
          <p>{perk.desc}</p>
        </div>
      </div>
    </Reveal>
  );
}

export default function FeatureStrip() {
  return (
    <section className="perks-wave-section">
      <div className="perks-wave-top">
        <svg viewBox="0 0 1440 90" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,30 C320,90 420,10 720,45 C1020,80 1180,20 1440,50 L1440,90 L0,90 Z" fill="url(#waveGradTop)" fillOpacity="0.4" />
          <path d="M0,50 C360,10 520,75 800,40 C1080,10 1260,70 1440,45 L1440,90 L0,90 Z" fill="#101015" />
          <defs>
            <linearGradient id="waveGradTop" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e10600" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#d4a857" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#e10600" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="perks-inner">
        <div className="wrap">
          <div className="perks-header text-center mb-8">
            <span className="pill glass">PREMIUM BUYER PROTECTION</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-2">Why Shoe Lovers Across Pakistan Trust Us</h3>
          </div>

          <div className="perks-5-grid">
            {PERKS.map((perk, i) => (
              <PerkCard key={perk.title} perk={perk} index={i} />
            ))}
          </div>
        </div>
      </div>

      <div className="perks-wave-bottom">
        <svg viewBox="0 0 1440 70" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,0 C300,50 540,10 820,40 C1100,70 1280,20 1440,30 L1440,0 L0,0 Z" fill="#101015" />
        </svg>
      </div>
    </section>
  );
}
