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
      <div className="bg-[#fafafa] text-zinc-900 min-h-screen pt-8 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <Reveal>
            <div className="text-center mb-10">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-400">
                PRECISION FIT GUARANTEE
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-950 mt-1 tracking-tight">
                Find Your Perfect Shoe Size
              </h1>
              <p className="text-zinc-500 max-w-xl mx-auto mt-3 text-xs sm:text-sm leading-relaxed">
                Use our interactive size converter, follow our 3-step foot measurement guide, or speak with our sizing concierge.
              </p>
            </div>
          </Reveal>

          {/* Interactive Size Explorer */}
          <Reveal delay={100}>
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-xs mb-10">
              <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div>
                  <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2.5 py-0.5 rounded-full">
                    STEP 1
                  </span>
                  <h2 className="text-xl font-bold text-zinc-950 mt-1">Interactive Size Converter</h2>
                  <p className="text-zinc-500 text-xs mt-1">
                    Select your usual European (EU) shoe size to view instant UK, US, and foot length measurements.
                  </p>
                </div>

                {/* Shoe Type Switcher */}
                <div className="flex bg-[#f4f4f6] border border-zinc-200 p-1 rounded-full">
                  <button
                    type="button"
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      shoeType === "sneakers" ? "bg-zinc-950 text-white shadow-xs" : "text-zinc-600 hover:text-zinc-950"
                    }`}
                    onClick={() => setShoeType("sneakers")}
                  >
                    👟 Sneakers / Athletic
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      shoeType === "formal" ? "bg-zinc-950 text-white shadow-xs" : "text-zinc-600 hover:text-zinc-950"
                    }`}
                    onClick={() => setShoeType("formal")}
                  >
                    👞 Formal / Loafers
                  </button>
                </div>
              </div>

              {/* Size Selector Pills */}
              <div className="flex gap-2 flex-wrap mb-6">
                {SIZE_DATA.map((item) => (
                  <button
                    key={item.eu}
                    type="button"
                    onClick={() => setSelectedSize(item.eu)}
                    className={`px-4 py-2 rounded-2xl border text-center transition-all ${
                      selectedSize === item.eu
                        ? "bg-zinc-950 border-zinc-950 text-white scale-105 shadow-xs"
                        : "bg-[#f4f4f6] border-zinc-200 text-zinc-700 hover:border-zinc-400"
                    }`}
                  >
                    <span className="block text-[10px] text-zinc-400 uppercase">EU</span>
                    <span className="block font-bold text-base font-mono">{item.eu}</span>
                  </button>
                ))}
              </div>

              {/* Selected Size Highlight Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
                <div className="bg-[#f4f4f6] p-4 rounded-2xl border border-zinc-200/60">
                  <small className="block text-zinc-500 text-xs">EU Sizing (Pakistan Standard)</small>
                  <b className="text-xl md:text-2xl font-bold text-zinc-950 my-1 block font-mono">EU {current.eu}</b>
                  <span className="text-[11px] text-zinc-400">Most common local tag</span>
                </div>
                <div className="bg-[#f4f4f6] p-4 rounded-2xl border border-zinc-200/60">
                  <small className="block text-zinc-500 text-xs">UK Equivalent</small>
                  <b className="text-xl md:text-2xl font-bold text-zinc-950 my-1 block font-mono">UK {current.uk}</b>
                  <span className="text-[11px] text-zinc-400">British sizing standard</span>
                </div>
                <div className="bg-[#f4f4f6] p-4 rounded-2xl border border-zinc-200/60">
                  <small className="block text-zinc-500 text-xs">US Men's Equivalent</small>
                  <b className="text-xl md:text-2xl font-bold text-zinc-950 my-1 block font-mono">US {current.us}</b>
                  <span className="text-[11px] text-zinc-400">North American scale</span>
                </div>
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
                  <small className="block text-emerald-800 text-xs font-semibold">Foot Length</small>
                  <b className="text-xl md:text-2xl font-extrabold text-emerald-800 my-1 block font-mono">{current.cm} cm</b>
                  <span className="text-[11px] text-emerald-700">or {current.in} inches heel-to-toe</span>
                </div>
              </div>

              {/* Context Note based on shoe type */}
              <div className="p-4 rounded-2xl flex items-start gap-3 bg-[#f4f4f6] border border-zinc-200/60">
                <span className="text-xl">💡</span>
                <div className="text-xs text-zinc-700 leading-relaxed">
                  <b className="text-zinc-900 block mb-0.5">
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
          <div className="my-14">
            <Reveal delay={150}>
              <div className="text-center mb-8">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">HOW TO MEASURE</span>
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-950 mt-1">
                  Measure Your Feet At Home In 3 Minutes
                </h2>
                <p className="text-zinc-500 max-w-lg mx-auto mt-2 text-xs sm:text-sm">
                  A quick measurement using a ruler and paper guarantees your shoes fit comfortably.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs relative">
                <div className="font-extrabold text-3xl text-zinc-200 absolute top-4 right-5 font-mono">01</div>
                <div className="text-3xl mb-3">📄</div>
                <h3 className="text-base font-bold text-zinc-950 mb-2">Step On a Paper Sheet</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Tape a clean sheet of A4 paper to a flat floor against a wall. Stand upright on the paper with your heel pressed firmly against the wall.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs relative">
                <div className="font-extrabold text-3xl text-zinc-200 absolute top-4 right-5 font-mono">02</div>
                <div className="text-3xl mb-3">✏️</div>
                <h3 className="text-base font-bold text-zinc-950 mb-2">Mark Your Longest Toe</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Hold a pen or pencil vertically (90° angle) and mark the exact tip of your longest toe on the paper.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs relative">
                <div className="font-extrabold text-3xl text-zinc-200 absolute top-4 right-5 font-mono">03</div>
                <div className="text-3xl mb-3">📏</div>
                <h3 className="text-base font-bold text-zinc-950 mb-2">Measure CM & Compare</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Use a ruler or measuring tape to measure the distance from the heel line to the marked point in centimeters. Match in our chart above.
                </p>
              </div>
            </div>
          </div>

          {/* Master Comparison Table */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-xs mb-10">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-lg font-bold text-zinc-950">Comprehensive Footwear Sizing Chart</h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Complete international conversion guide for all Hangu Branded Shoes pairs.
                </p>
              </div>
              <span className="text-xs bg-[#f4f4f6] border border-zinc-200 px-3 py-1 rounded-full text-zinc-700 font-semibold">
                Standard Width (D)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-zinc-700">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">EU Size</th>
                    <th className="py-3 px-3">UK Size</th>
                    <th className="py-3 px-3">US Men</th>
                    <th className="py-3 px-3">Foot Length (CM)</th>
                    <th className="py-3 px-3">Foot Length (Inches)</th>
                    <th className="py-3 px-3">Fit Profile</th>
                    <th className="py-3 px-3 text-right">Select</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {SIZE_DATA.map((row) => {
                    const isSelected = row.eu === selectedSize;
                    return (
                      <tr
                        key={row.eu}
                        className={`transition-colors ${
                          isSelected ? "bg-emerald-50/50" : "hover:bg-[#f4f4f6]/80"
                        }`}
                      >
                        <td className="py-3 px-3 font-mono font-bold text-zinc-950">
                          EU {row.eu}
                          {isSelected && (
                            <span className="text-[10px] ml-2 text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">
                              Selected
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-zinc-600 font-mono">UK {row.uk}</td>
                        <td className="py-3 px-3 text-zinc-600 font-mono">US {row.us}</td>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-800">{row.cm} cm</td>
                        <td className="py-3 px-3 text-zinc-500 font-mono">{row.in}″</td>
                        <td className="py-3 px-3">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#f4f4f6] text-zinc-700 border border-zinc-200">
                            {row.fit}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                              isSelected
                                ? "bg-zinc-950 text-white"
                                : "bg-[#f4f4f6] text-zinc-700 hover:bg-zinc-200"
                            }`}
                            onClick={() => setSelectedSize(row.eu)}
                          >
                            {isSelected ? "Active ✓" : "View"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* WhatsApp Consultation Call to Action */}
          <div className="p-8 sm:p-10 rounded-3xl bg-zinc-950 text-white text-center">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-emerald-400 mb-2 block">
              STILL UNSURE ABOUT YOUR SIZE?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              Get Live Size Fitting On WhatsApp
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto mb-6">
              Send us a photo of your current shoe tag or your foot measurement in centimeters. Our specialists will recommend your exact fit in 15 minutes.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a
                className="py-3 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-2 transition-colors shadow-xs"
                target="_blank"
                rel="noopener noreferrer"
                href={wa(
                  `Assalam-o-Alaikum! I need advice selecting the right shoe size for my feet. My usual size is EU ${selectedSize}.`
                )}
              >
                <span>Ask Sizing Specialist on WhatsApp</span>
                <WhatsAppIcon size={16} color="#fff" />
              </a>
              <Link
                className="py-3 px-6 rounded-full bg-white border border-zinc-300 hover:bg-zinc-100 text-zinc-900 text-xs font-semibold transition-colors"
                href="/shop"
              >
                Browse Footwear Collection →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
