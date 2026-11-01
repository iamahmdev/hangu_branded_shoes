import { useState } from "react";
import Link from "next/link";
import Layout from "../src/components/Layout";
import Reveal from "../src/components/Reveal";
import { SHOP, WA, wa } from "../src/data/config";
import { WhatsAppIcon } from "../src/components/WhatsAppButton";

const SIZE_DATA = [
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
  const [selectedSize, setSelectedSize] = useState("42");
  const [shoeType, setShoeType] = useState("sneakers"); // sneakers | formal

  const current = SIZE_DATA.find((s) => s.eu === selectedSize) || SIZE_DATA[3];

  return (
    <Layout title="Shoe Size Guide — Hangu_branded_shoes">
      <div className="pg wrap" style={{ maxWidth: 1140, paddingTop: 40, paddingBottom: 80 }}>
        
        {/* Page Header */}
        <Reveal>
          <div className="title" style={{ marginBottom: 40, textAlign: "center" }}>
            <span className="pill glass" style={{ marginBottom: 12, letterSpacing: "1.5px" }}>
              PRECISION FIT GUARANTEE
            </span>
            <h1 style={{ fontSize: "clamp(30px, 4.5vw, 48px)", fontWeight: 800 }}>
              Find Your Perfect Shoe Size
            </h1>
            <p style={{ color: "var(--mut)", maxWidth: 640, margin: "14px auto 0", lineHeight: 1.7, fontSize: "15px" }}>
              Never second-guess your footwear size again. Use our interactive Pakistani & International size converter, follow the 3-step foot measurement guide, or speak with our sizing concierge.
            </p>
          </div>
        </Reveal>

        {/* Interactive Size Explorer */}
        <Reveal delay={100}>
          <div className="sg-calc-card glass">
            <div className="sg-calc-header">
              <div>
                <span className="sg-badge">STEP 1</span>
                <h3 style={{ fontSize: 22, marginTop: 4 }}>Interactive Size Converter</h3>
                <p style={{ color: "var(--mut)", fontSize: 13.5, margin: "4px 0 0" }}>
                  Select your usual European (EU) shoe size to view instant UK, US, and foot length measurements.
                </p>
              </div>

              {/* Shoe Type Switcher */}
              <div className="sg-type-toggle">
                <button
                  type="button"
                  className={"sg-toggle-btn" + (shoeType === "sneakers" ? " active" : "")}
                  onClick={() => setShoeType("sneakers")}
                >
                  👟 Sneakers / Athletic
                </button>
                <button
                  type="button"
                  className={"sg-toggle-btn" + (shoeType === "formal" ? " active" : "")}
                  onClick={() => setShoeType("formal")}
                >
                  👞 Formal / Loafers
                </button>
              </div>
            </div>

            {/* Size Selector Pills */}
            <div className="sg-pill-row">
              {SIZE_DATA.map((item) => (
                <button
                  key={item.eu}
                  type="button"
                  onClick={() => setSelectedSize(item.eu)}
                  className={"sg-size-pill" + (selectedSize === item.eu ? " active" : "")}
                >
                  <span className="sg-pill-label">EU</span>
                  <span className="sg-pill-val">{item.eu}</span>
                </button>
              ))}
            </div>

            {/* Selected Size Highlight Grid */}
            <div className="sg-metrics-grid">
              <div className="sg-metric-box">
                <small>EU Sizing (Pakistan Standard)</small>
                <b>EU {current.eu}</b>
                <span>Most common local tag</span>
              </div>
              <div className="sg-metric-box">
                <small>UK Equivalent</small>
                <b>UK {current.uk}</b>
                <span>British sizing standard</span>
              </div>
              <div className="sg-metric-box">
                <small>US Men's Equivalent</small>
                <b>US {current.us}</b>
                <span>North American scale</span>
              </div>
              <div className="sg-metric-box highlight">
                <small>Foot Length (Recommended)</small>
                <b>{current.cm} cm</b>
                <span>or {current.in} inches heel-to-toe</span>
              </div>
            </div>

            {/* Context Note based on shoe type */}
            <div className="sg-advice-banner">
              <span style={{ fontSize: 20 }}>💡</span>
              <div>
                <b>
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
        <div style={{ margin: "60px 0 40px" }}>
          <Reveal delay={150}>
            <div className="title" style={{ textAlign: "center", marginBottom: 36 }}>
              <span className="pill glass" style={{ marginBottom: 10 }}>HOW TO MEASURE</span>
              <h2 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 700 }}>
                Measure Your Feet At Home In 3 Minutes
              </h2>
              <p style={{ color: "var(--mut)", maxWidth: 540, margin: "10px auto 0", fontSize: 14 }}>
                A quick measurement using a ruler and a piece of paper guarantees your shoes fit like a glove.
              </p>
            </div>
          </Reveal>

          <div className="sg-steps-grid">
            <Reveal delay={200}>
              <div className="sg-step-card glass">
                <div className="sg-step-num">01</div>
                <div className="sg-step-icon">📄</div>
                <h4>Step On a Paper Sheet</h4>
                <p>
                  Tape a clean sheet of A4 paper to a hard, flat floor against a wall. Stand upright on the paper with your heel pressed firmly against the wall.
                </p>
              </div>
            </Reveal>

            <Reveal delay={250}>
              <div className="sg-step-card glass">
                <div className="sg-step-num">02</div>
                <div className="sg-step-icon">✏️</div>
                <h4>Mark Your Longest Toe</h4>
                <p>
                  Hold a pen or pencil vertically (90° angle) and mark the exact tip of your longest toe on the paper. Repeat for both feet as one is often slightly larger.
                </p>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="sg-step-card glass">
                <div className="sg-step-num">03</div>
                <div className="sg-step-icon">📏</div>
                <h4>Measure CM & Compare</h4>
                <p>
                  Use a ruler or measuring tape to measure the distance from the heel line to the marked point in centimeters. Match the measurement in our chart above.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Master Comparison Table */}
        <Reveal delay={150}>
          <div className="sg-table-card glass" style={{ marginTop: 50 }}>
            <div className="sg-table-head">
              <div>
                <h3 style={{ fontSize: 20 }}>Comprehensive Footwear Sizing Chart</h3>
                <p style={{ color: "var(--mut)", fontSize: 13, margin: "4px 0 0" }}>
                  Complete international conversion guide for all Hangu Branded Shoes pairs.
                </p>
              </div>
              <span className="sg-table-badge">Standard Width (D)</span>
            </div>

            <div className="sg-table-overflow">
              <table className="sg-table">
                <thead>
                  <tr>
                    <th>EU Size</th>
                    <th>UK Size</th>
                    <th>US Men</th>
                    <th>Foot Length (CM)</th>
                    <th>Foot Length (Inches)</th>
                    <th>Fit Profile</th>
                    <th>Select</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_DATA.map((row) => {
                    const isSelected = row.eu === selectedSize;
                    return (
                      <tr key={row.eu} className={isSelected ? "selected-row" : ""}>
                        <td>
                          <b>EU {row.eu}</b>
                          {isSelected && <span className="sg-active-tag">Active</span>}
                        </td>
                        <td>UK {row.uk}</td>
                        <td>US {row.us}</td>
                        <td><strong>{row.cm} cm</strong></td>
                        <td>{row.in}″</td>
                        <td><span className="sg-fit-pill">{row.fit}</span></td>
                        <td>
                          <button
                            type="button"
                            className={"sg-sel-btn" + (isSelected ? " on" : "")}
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
        <div className="sg-tips-grid" style={{ marginTop: 40 }}>
          <div className="sg-tip-box glass">
            <span className="sg-tip-icon">🦶</span>
            <div>
              <b>Broader / Wider Feet</b>
              <p>
                If you have wide feet or a high instep, order 1 size up (e.g., if you are between 41 and 42, go with 42) for ideal midfoot breathability.
              </p>
            </div>
          </div>

          <div className="sg-tip-box glass">
            <span className="sg-tip-icon">🌆</span>
            <div>
              <b>Measure in the Evening</b>
              <p>
                Feet naturally expand slightly during daytime walking and standing. Measuring your feet in the late afternoon guarantees the most comfortable fit.
              </p>
            </div>
          </div>

          <div className="sg-tip-box glass">
            <span className="sg-tip-icon">🔄</span>
            <div>
              <b>7-Day Free Size Exchange</b>
              <p>
                Received your pair and need a different size? Don't worry. We provide hassle-free nationwide size exchanges right to your doorstep.
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp Consultation Call to Action */}
        <Reveal delay={200}>
          <div className="sg-cta-card glass" style={{ marginTop: 50 }}>
            <div className="sg-cta-content">
              <span className="pill glass" style={{ marginBottom: 12 }}>STILL UNSURE ABOUT YOUR SIZE?</span>
              <h2 style={{ fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 800 }}>
                Get Live Size Fitting On WhatsApp
              </h2>
              <p style={{ color: "var(--mut)", maxWidth: 580, margin: "12px 0 24px", lineHeight: 1.7, fontSize: 14 }}>
                Send us a photo of your current shoe tag or your foot measurement in centimeters. Our footwear specialists will recommend the exact size for your selected model in 15 minutes.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <a
                  className="btn"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px" }}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={wa(`Assalam-o-Alaikum! I need advice selecting the right shoe size for my feet. My usual size is EU ${selectedSize}.`)}
                >
                  Ask Sizing Specialist on WhatsApp <WhatsAppIcon size={20} color="#fff" />
                </a>
                <Link className="btn ghost" href="/shop">
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
