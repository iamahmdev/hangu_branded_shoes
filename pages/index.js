import Link from "next/link";
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

const T = (s, h) => (
  <Reveal>
    <div className="title">
      <small>{s}</small>
      <h2>{h}</h2>
    </div>
  </Reveal>
);

export default function Home() {
  return (
    <Layout title="Hangu_branded_shoes">
      <HeroSlider />
      <Marquee />

      {/* 3D Animated Perks Section with Fluid Shape Waves */}
      <FeatureStrip />

      <section>
        <div className="wrap">
          {T("CATEGORIES", "Choose Your Style")}
          <Reveal>
            <Categories />
          </Reveal>
        </div>
      </section>

      <section style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="wrap">{T("NEW ARRIVALS", "Latest Pairs")}</div>
        <div className="srow">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      <Offer />

      <section>
        <div className="wrap">
          <Reveal>
            <Stats />
          </Reveal>
        </div>
      </section>

      <section>
        <div className="wrap">
          <Reveal>
            <Reviews />
          </Reveal>
        </div>
      </section>

      <Reveal>
        <div className="cta">
          <h2>Order Your Favorite Pair Today</h2>
          <a
            className="btn"
            style={{ display: "inline-flex", alignItems: "center", gap: 10 }}
            target="_blank"
            rel="noopener noreferrer"
            href={wa("Hello! I would like to order shoes from Hangu Branded Shoes.")}
          >
            Order on WhatsApp <WhatsAppIcon size={20} color="#fff" />
          </a>
        </div>
      </Reveal>
    </Layout>
  );
}
