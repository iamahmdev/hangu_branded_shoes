import { useState } from "react";
import Link from "next/link";
import Layout from "../src/components/Layout";
import Reveal from "../src/components/Reveal";
import { wa } from "../src/data/config";
import { WhatsAppIcon } from "../src/components/WhatsAppButton";

interface SizeEntry {
  eu: string;
  uk: string;
  us: string;
  cm: number;
  in: number;
  fit: string;
  note: string;
}

const SIZE_DATA: SizeEntry[] = [
  { eu: "39", uk: "6.0", us: "6.5", cm: 24.5, in: 9.6, fit: "Snug Fit", note: "Standard entry size" },
  { eu: "40", uk: "6.5", us: "7.0", cm: 25.0, in: 9.8, fit: "True to Size", note: "Popular standard fit" },
  { eu: "41", uk: "7.5", us: "8.0", cm: 25.7, in: 10.1, fit: "True to Size", note: "Most ordered men's size in Pakistan" },
  { eu: "42", uk: "8.0", us: "8.5", cm: 26.5, in: 10.4, fit: "True to Size", note: "Top seller size across all pairs" },
  { eu: "43", uk: "9.0", us: "9.5", cm: 27.2, in: 10.7, fit: "Comfort Fit", note: "Ideal for wider foot profiles" },
  { eu: "44", uk: "9.5", us: "10.0", cm: 28.0, in: 11.0, fit: "Relaxed Fit", note: "Generous toe room" },
  { eu: "45", uk: "10.5", us: "11.0", cm: 28.7, in: 11.3, fit: "Large Profile", note: "Maximum cushioning volume" },
  { eu: "46", uk: "11.5", us: "12.0", cm: 29.5, in: 11.6, fit: "Extended Size", note: "Available on special request" },
];

export default function SizeGuide() {
  const [selectedSize, setSelectedSize] = useState<string>("42");
  const [shoeType, setShoeType] = useState<"sneakers" | "formal">("sneakers");

  const current = SIZE_DATA.find((s) => s.eu === selectedSize) || SIZE_DATA[3];

  return (
    <Layout title="Shoe Size Guide — Hangu Branded Shoes">
      <div className="pg wrap" style={{ maxWidth: 1140, paddingTop: 40, paddingBottom: 80 }}>
        {/* Page Header */}
        <Reveal>
          <div className="title text-center mb-10">
            <span className="pill glass inline-block mb-3 tracking-widest text-xs font-bold text-brand-gold">
              PRECISION FIT GUARANTEE
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">
              Find Your Perfect Shoe Size
            </h1>
            <p className="text-zinc-400 max-w-xl mx-auto mt-3 text-sm md:text-base leading-relaxed">
              Never second-guess your footwear size again. Use our interactive Pakistani & International size converter, follow the 3-step foot measurement guide, or speak with our sizing concierge.
            </p>
          </div>
        </Reveal>

        {/* Interactive Size Explorer */}
        <Reveal delay={100}>
          <div className="sg-calc-card glass p-6 md:p-8 rounded-3xl">
            <div className="sg-calc-header flex flex-wrap justify-between items-center gap-4 mb-6">
              <div>
                <span className="sg-badge text-xs bg-brand-red/20 text-brand-red font-bold px-2.5 py-0.5 rounded-full">STEP 1</span>
                <h3 className="text-xl md:text-2xl font-bold text-white mt-1">Interactive Size Converter</h3>
                <p className="text-zinc-400 text-xs md:text-sm mt-1">
                  Select your usual European (EU) shoe size to view instant UK, US, and foot length measurements.
                </p>
              </div>

              {/* Shoe Type Switcher */}
              <div className="sg-type-toggle flex bg-white/5 border border-white/10 p-1 rounded-full">
                <button
                  type="button"
                  className={"sg-toggle-btn px-4 py-1.5 rounded-full text-xs font-semibold transition-all " + (shoeType === "sneakers" ? "active bg-brand-red text-white" : "text-zinc-400 hover:text-white")}
                  onClick={() => setShoeType("sneakers")}
                >
                  👟 Sneakers / Athletic
                </button>
                <button
                  type="button"
                  className={"sg-toggle-btn px-4 py-1.5 rounded-full text-xs font-semibold transition-all " + (shoeType === "formal" ? "active bg-brand-red text-white" : "text-zinc-400 hover:text-white")}
                  onClick={() => setShoeType("formal")}
                >
                  👞 Formal / Loafers
                </button>
              </div>
            </div>

            {/* Size Selector Pills */}
            <div className="sg-pill-row flex gap-2 flex-wrap mb-6">
              {SIZE_DATA.map((item) => (
                <button
                  key={item.eu}
                  type="button"
                  onClick={() => setSelectedSize(item.eu)}
                  className={"sg-size-pill px-4 py-2 rounded-2xl border text-center transition-all " + (selectedSize === item.eu ? "active bg-brand-red border-brand-red text-white scale-105 shadow-glow" : "bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:border-brand-gold")}
                >
                  <span className="sg-pill-label block text-[10px] text-zinc-400 uppercase">EU</span>
                  <span className="sg-pill-val block font-bold text-base">{item.eu}</span>
                </button>
              ))}
            </div>

            {/* Selected Size Highlight Grid */}
            <div className="sg-metrics-grid grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
              <div className="sg-metric-box glass p-4 rounded-2xl">
                <small className="block text-zinc-400 text-xs">EU Sizing (Pakistan Standard)</small>
                <b className="text-xl md:text-2xl font-bold text-white my-1 block">EU {current.eu}</b>
                <span className="text-[11px] text-zinc-500">Most common local tag</span>
              </div>
              <div className="sg-metric-box glass p-4 rounded-2xl">
                <small className="block text-zinc-400 text-xs">UK Equivalent</small>
                <b className="text-xl md:text-2xl font-bold text-white my-1 block">UK {current.uk}</b>
                <span className="text-[11px] text-zinc-500">British sizing standard</span>
              </div>
              <div className="sg-metric-box glass p-4 rounded-2xl">
                <small className="block text-zinc-400 text-xs">US Men's Equivalent</small>
                <b className="text-xl md:text-2xl font-bold text-white my-1 block">US {current.us}</b>
                <span className="text-[11px] text-zinc-500">North American scale</span>
              </div>
              <div className="sg-metric-box highlight glass p-4 rounded-2xl border-brand-gold/40">
                <small className="block text-brand-gold text-xs font-semibold">Foot Length (Recommended)</small>
                <b className="text-xl md:text-2xl font-extrabold text-brand-gold my-1 block">{current.cm} cm</b>
                <span className="text-[11px] text-zinc-400">or {current.in} inches heel-to-toe</span>
              </div>
            </div>

            {/* Context Note based on shoe type */}
            <div className="sg-advice-banner glass p-4 rounded-2xl flex items-start gap-3 bg-white/[0.03]">
              <span className="text-xl">💡</span>
              <div className="text-xs text-zinc-300 leading-relaxed">
                <b className="text-white block mb-0.5">
                  {shoeType === "sneakers"
                    ? `Sneakers Fit Advice for EU ${current.eu}:`
                    : `Formal Shoes / Loafers Advice for EU ${current.eu}:`}
                </b>
                <p>
                  {shoeType === "sneakers"
                    ? `Our sneakers feature responsive memory-foam insoles. If you prefer wearing thick sports socks or have wide arches, EU ${current.eu} gives an optimal 0.8 cm toe clearance.`
                    : `Hand-finished formal loafers have structured leather uppers. They fit snug initially and soften within 2–3 wears. If your feet are broader than average, order one half-size up.`}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* 3-Step Measurement Guide */}
        <div className="my-16">
          <Reveal delay={150}>
            <div className="title text-center mb-8">
              <span className="pill glass inline-block mb-2 text-xs font-bold text-brand-gold">HOW TO MEASURE</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Measure Your Feet At Home In 3 Minutes
              </h2>
              <p className="text-zinc-400 max-w-lg mx-auto mt-2 text-xs md:text-sm">
                A quick measurement using a ruler and a piece of paper guarantees your shoes fit like a glove.
              </p>
            </div>
          </Reveal>

          <div className="sg-steps-grid grid grid-cols-1 md:grid-cols-3 gap-5">
            <Reveal delay={200}>
              <div className="sg-step-card glass p-6 rounded-3xl relative">
                <div className="sg-step-num font-extrabold text-3xl text-brand-red/40 absolute top-4 right-5">01</div>
                <div className="sg-step-icon text-3xl mb-3">📄</div>
                <h4 className="text-lg font-bold text-white mb-2">Step On a Paper Sheet</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Tape a clean sheet of A4 paper to a hard, flat floor against a wall. Stand upright on the paper with your heel pressed firmly against the wall.
                </p>
              </div>
            </Reveal>

            <Reveal delay={250}>
              <div className="sg-step-card glass p-6 rounded-3xl relative">
                <div className="sg-step-num font-extrabold text-3xl text-brand-red/40 absolute top-4 right-5">02</div>
                <div className="sg-step-icon text-3xl mb-3">✏️</div>
                <h4 className="text-lg font-bold text-white mb-2">Mark Your Longest Toe</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Hold a pen or pencil vertically (90° angle) and mark the exact tip of your longest toe on the paper. Repeat for both feet as one is often slightly larger.
                </p>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="sg-step-card glass p-6 rounded-3xl relative">
                <div className="sg-step-num font-extrabold text-3xl text-brand-red/40 absolute top-4 right-5">03</div>
                <div className="sg-step-icon text-3xl mb-3">📏</div>
                <h4 className="text-lg font-bold text-white mb-2">Measure CM & Compare</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Use a ruler or measuring tape to measure the distance from the heel line to the marked point in centimeters. Match the measurement in our chart above.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Master Comparison Table */}
        <Reveal delay={150}>
          <div className="sg-table-card glass p-6 md:p-8 rounded-3xl mt-12">
            <div className="sg-table-head flex justify-between items-center mb-5">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white">Comprehensive Footwear Sizing Chart</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Complete international conversion guide for all Hangu Branded Shoes pairs.
                </p>
              </div>
              <span className="sg-table-badge text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-brand-gold font-semibold">Standard Width (D)</span>
            </div>

            <div className="sg-table-overflow overflow-x-auto">
              <table className="sg-table w-full text-left text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400">
                    <th className="py-3 px-3">EU Size</th>
                    <th className="py-3 px-3">UK Size</th>
                    <th className="py-3 px-3">US Men</th>
                    <th className="py-3 px-3">Foot Length (CM)</th>
                    <th className="py-3 px-3">Foot Length (Inches)</th>
                    <th className="py-3 px-3">Fit Profile</th>
                    <th className="py-3 px-3">Select</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_DATA.map((row) => {
                    const isSelected = row.eu === selectedSize;
                    return (
                      <tr key={row.eu} className={"border-b border-white/5 transition-colors " + (isSelected ? "selected-row bg-brand-red/10" : "hover:bg-white/[0.02]")}>
                        <td className="py-3.5 px-3">
                          <b className="text-white font-bold">EU {row.eu}</b>
                          {isSelected && <span className="sg-active-tag text-[10px] ml-2 text-brand-red bg-brand-red/20 px-1.5 py-0.5 rounded">Active</span>}
                        </td>
                        <td className="py-3.5 px-3 text-zinc-300">UK {row.uk}</td>
                        <td className="py-3.5 px-3 text-zinc-300">US {row.us}</td>
                        <td className="py-3.5 px-3"><strong className="text-brand-gold">{row.cm} cm</strong></td>
                        <td className="py-3.5 px-3 text-zinc-400">{row.in}″</td>
                        <td className="py-3.5 px-3"><span className="sg-fit-pill text-xs px-2 py-0.5 rounded-full bg-white/5 text-zinc-300">{row.fit}</span></td>
                        <td className="py-3.5 px-3">
                          <button
                            type="button"
                            className={"sg-sel-btn px-3 py-1 rounded-xl text-xs font-semibold border transition-all " + (isSelected ? "on bg-brand-red border-brand-red text-white" : "border-white/10 text-zinc-300 hover:text-white")}
                            onClick={() => setSelectedSize(row.eu)}
                          >
                            {isSelected ? "Selected ✓" : "View"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        {/* Expert Fit Advisory Grid */}
        <div className="sg-tips-grid grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="sg-tip-box glass p-5 rounded-2xl flex gap-3">
            <span className="sg-tip-icon text-2xl">🦶</span>
            <div>
              <b className="text-white text-sm block mb-1">Broader / Wider Feet</b>
              <p className="text-zinc-400 text-xs leading-relaxed">
                If you have wide feet or a high instep, order 1 size up (e.g., if you are between 41 and 42, go with 42) for ideal midfoot breathability.
              </p>
            </div>
          </div>

          <div className="sg-tip-box glass p-5 rounded-2xl flex gap-3">
            <span className="sg-tip-icon text-2xl">🌆</span>
            <div>
              <b className="text-white text-sm block mb-1">Measure in the Evening</b>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Feet naturally expand slightly during daytime walking and standing. Measuring your feet in the late afternoon guarantees the most comfortable fit.
              </p>
            </div>
          </div>

          <div className="sg-tip-box glass p-5 rounded-2xl flex gap-3">
            <span className="sg-tip-icon text-2xl">🔄</span>
            <div>
              <b className="text-white text-sm block mb-1">7-Day Free Size Exchange</b>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Received your pair and need a different size? Don't worry. We provide hassle-free nationwide size exchanges right to your doorstep.
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp Consultation Call to Action */}
        <Reveal delay={200}>
          <div className="sg-cta-card glass p-8 md:p-12 rounded-3xl mt-12 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-brand-red/30">
            <div className="sg-cta-content text-center max-w-2xl mx-auto">
              <span className="pill glass inline-block mb-3 text-xs font-bold text-brand-gold">STILL UNSURE ABOUT YOUR SIZE?</span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3">
                Get Live Size Fitting On WhatsApp
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-6">
                Send us a photo of your current shoe tag or your foot measurement in centimeters. Our footwear specialists will recommend the exact size for your selected model in 15 minutes.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <a
                  className="btn inline-flex items-center gap-2 py-3 px-6"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={wa(`Assalam-o-Alaikum! I need advice selecting the right shoe size for my feet. My usual size is EU ${selectedSize}.`)}
                >
                  <span>Ask Sizing Specialist on WhatsApp</span>
                  <WhatsAppIcon size={20} color="#fff" />
                </a>
                <Link className="btn ghost py-3 px-6" href="/shop">
                  Browse Footwear Collection →
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Layout>
  );
}
