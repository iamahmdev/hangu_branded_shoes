import Layout from "../src/components/Layout";
import HeroSlider from "../src/components/HeroSlider";
import Marquee from "../src/components/Marquee";
import ProductCard from "../src/components/ProductCard";
import Reveal from "../src/components/Reveal";
import Stats from "../src/components/Stats";
import Categories from "../src/components/Categories";
import Offer from "../src/components/Offer";
import FeatureStrip from "../src/components/FeatureStrip";
import Reviews from "../src/components/Reviews";
import { WhatsAppIcon } from "../src/components/WhatsAppButton";
import { products, wa } from "../src/data/config";

const T = (s: string, h: string) => (
  <Reveal>
    <div className="title text-center mb-8">
      <small className="text-brand-red uppercase tracking-wider text-xs font-bold">{s}</small>
      <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1">{h}</h2>
    </div>
  </Reveal>
);

export default function Home() {
  return (
    <Layout title="Hangu Branded Shoes — Luxury Footwear Pakistan">
      <HeroSlider />
      <Marquee />

      {/* 3D Animated Perks Section with Fluid Shape Waves */}
      <FeatureStrip />

      <section className="py-14">
        <div className="wrap">
          {T("CATEGORIES", "Choose Your Style")}
          <Reveal>
            <Categories />
          </Reveal>
        </div>
      </section>

      <section className="py-14" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="wrap">{T("NEW ARRIVALS", "Latest Pairs")}</div>
        <div className="srow">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      <Offer />

      <section className="py-14">
        <div className="wrap">
          <Reveal>
            <Stats />
          </Reveal>
        </div>
      </section>

      <section className="py-14">
        <div className="wrap">
          <Reveal>
            <Reviews />
          </Reveal>
        </div>
      </section>

      <Reveal>
        <div className="cta text-center py-16 px-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Order Your Favorite Pair Today</h2>
          <a
            className="btn inline-flex items-center gap-2.5"
            target="_blank"
            rel="noopener noreferrer"
            href={wa("Hello! I would like to order shoes from Hangu Branded Shoes.")}
          >
            <span>Order on WhatsApp</span>
            <WhatsAppIcon size={20} color="#fff" />
          </a>
        </div>
      </Reveal>
    </Layout>
  );
}
