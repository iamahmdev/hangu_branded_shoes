import { useState } from "react";
import Layout from "../src/components/Layout";
import Reveal from "../src/components/Reveal";
import { WhatsAppIcon } from "../src/components/WhatsAppButton";
import { SHOP, WA, wa } from "../src/data/config";

export default function Contact() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    city: "",
    subject: "Size Fitting Consultation",
    orderNumber: "",
    message: "",
    preferredMethod: "WhatsApp",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const constructMessage = () => {
    const fullName = `${form.firstName} ${form.lastName}`.trim();
    let text = `👋 *NEW INQUIRY — ${SHOP}*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `👤 *Name:* ${fullName || "Customer"}\n`;
    text += `📞 *Phone / WhatsApp:* ${form.phone || "Not provided"}\n`;
    if (form.email) text += `📧 *Email:* ${form.email}\n`;
    if (form.city) text += `📍 *City:* ${form.city}\n`;
    text += `🏷️ *Topic:* ${form.subject}\n`;
    if (form.orderNumber) text += `📦 *Order Number:* ${form.orderNumber}\n`;
    text += `📲 *Preferred Contact:* ${form.preferredMethod}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💬 *Message:*\n${form.message || "Hi, I would like to inquire about your shoes."}\n`;
    return text;
  };

  const handleWhatsAppSend = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.phone || !form.message) {
      alert("Please fill in your First Name, Phone Number, and Message.");
      return;
    }
    const msg = constructMessage();
    window.open(wa(msg), "_blank");
    setSubmitted(true);
  };

  const handleDirectSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.phone || !form.message) {
      alert("Please fill in your First Name, Phone Number, and Message.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <Layout title="Contact Us — Hangu_branded_shoes">
      <div className="pg wrap" style={{ maxWidth: 1180 }}>
        {/* Header */}
        <Reveal>
          <div className="title" style={{ marginBottom: 44 }}>
            <span className="pill glass" style={{ marginBottom: 12 }}>WE ARE HERE TO HELP</span>
            <h1 style={{ fontSize: "clamp(30px, 4.5vw, 48px)", fontWeight: 800 }}>
              Get In Touch With Our Concierge
            </h1>
            <p style={{ color: "var(--mut)", maxWidth: 620, margin: "14px auto 0", lineHeight: 1.7 }}>
              Have questions regarding sizing, custom recommendations, delivery tracking, or 7-day exchanges? Reach out directly and our footwear specialists will guide you.
            </p>
          </div>
        </Reveal>

        {/* Two-Column Grid */}
        <div className="ct-grid">
          {/* Left Column: Form */}
          <Reveal delay={100}>
            <div className="ct-form-card glass">
              <div className="ct-form-head">
                <h3>Send Us a Direct Message</h3>
                <p>Fill out the details below. We typically reply within 15 to 30 minutes.</p>
              </div>

              {submitted ? (
                <div className="ct-success-box glass">
                  <span className="ct-success-icon">✅</span>
                  <h4>Inquiry Received!</h4>
                  <p>
                    Thank you, <strong>{form.firstName}</strong>. Your inquiry has been logged. Our footwear support team will reach out via <strong>{form.preferredMethod}</strong> at <strong>{form.phone}</strong> promptly.
                  </p>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
                    <a
                      className="btn"
                      style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
                      target="_blank"
                      rel="noopener noreferrer"
                      href={wa(constructMessage())}
                    >
                      Open in WhatsApp <WhatsAppIcon size={18} color="#fff" />
                    </a>
                    <button
                      className="btn ghost"
                      onClick={() => {
                        setSubmitted(false);
                        setForm({
                          firstName: "",
                          lastName: "",
                          phone: "",
                          email: "",
                          city: "",
                          subject: "Size Fitting Consultation",
                          orderNumber: "",
                          message: "",
                          preferredMethod: "WhatsApp",
                        });
                      }}
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form className="ct-form" onSubmit={handleWhatsAppSend}>
                  {/* First Name & Last Name */}
                  <div className="ct-two-col">
                    <div>
                      <label className="ct-label">First Name *</label>
                      <input
                        className="inp"
                        required
                        type="text"
                        placeholder="e.g. Ahmad"
                        value={form.firstName}
                        onChange={handleChange("firstName")}
                      />
                    </div>
                    <div>
                      <label className="ct-label">Last Name *</label>
                      <input
                        className="inp"
                        required
                        type="text"
                        placeholder="e.g. Khan"
                        value={form.lastName}
                        onChange={handleChange("lastName")}
                      />
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div className="ct-two-col">
                    <div>
                      <label className="ct-label">Phone / WhatsApp Number *</label>
                      <input
                        className="inp"
                        required
                        type="tel"
                        placeholder="0333 3147691"
                        value={form.phone}
                        onChange={handleChange("phone")}
                      />
                    </div>
                    <div>
                      <label className="ct-label">Email Address (Optional)</label>
                      <input
                        className="inp"
                        type="email"
                        placeholder="name@example.com"
                        value={form.email}
                        onChange={handleChange("email")}
                      />
                    </div>
                  </div>

                  {/* City & Subject */}
                  <div className="ct-two-col">
                    <div>
                      <label className="ct-label">Your City</label>
                      <input
                        className="inp"
                        type="text"
                        placeholder="e.g. Hangu, Peshawar, Lahore"
                        value={form.city}
                        onChange={handleChange("city")}
                      />
                    </div>
                    <div>
                      <label className="ct-label">Topic / Inquiry Type *</label>
                      <select
                        className="inp ct-select"
                        value={form.subject}
                        onChange={handleChange("subject")}
                      >
                        <option value="Size Fitting Consultation">Size Fitting Consultation</option>
                        <option value="Order Tracking & Status">Order Tracking & Status</option>
                        <option value="7-Day Exchange / Return">7-Day Exchange / Return</option>
                        <option value="Product Availability & Restock">Product Availability & Restock</option>
                        <option value="Wholesale / Bulk Orders">Wholesale / Bulk Orders</option>
                        <option value="General Question / Feedback">General Question / Feedback</option>
                      </select>
                    </div>
                  </div>

                  {/* Order Number (Optional) */}
                  <div>
                    <label className="ct-label">Order Reference ID (Optional)</label>
                    <input
                      className="inp"
                      type="text"
                      placeholder="e.g. HBS789012 (if inquiring about an order)"
                      value={form.orderNumber}
                      onChange={handleChange("orderNumber")}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="ct-label">Your Message / Inquiry Details *</label>
                    <textarea
                      className="inp"
                      required
                      rows={5}
                      placeholder="Please describe how we can assist you. For size advice, let us know your normal shoe size or brand..."
                      value={form.message}
                      onChange={handleChange("message")}
                    />
                  </div>

                  {/* Preferred Contact Method */}
                  <div style={{ marginBottom: 20 }}>
                    <label className="ct-label">Preferred Response Channel</label>
                    <div className="ct-radio-group">
                      {["WhatsApp", "Phone Call", "Email"].map((method) => (
                        <button
                          type="button"
                          key={method}
                          className={"ct-radio-chip" + (form.preferredMethod === method ? " active" : "")}
                          onClick={() => setForm({ ...form, preferredMethod: method })}
                        >
                          {method === "WhatsApp" ? "💬 WhatsApp" : method === "Phone Call" ? "📞 Phone Call" : "✉️ Email"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="ct-action-buttons">
                    <button
                      type="submit"
                      className="btn"
                      style={{ flex: 1.2, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                    >
                      Send on WhatsApp <WhatsAppIcon size={18} color="#fff" />
                    </button>
                    <button
                      type="button"
                      onClick={handleDirectSubmit}
                      className="btn ghost"
                      style={{ flex: 1 }}
                    >
                      Submit Ticket ✓
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>

          {/* Right Column: Contact Details & Quick Support */}
          <div className="ct-sidebar">
            <Reveal delay={200}>
              {/* WhatsApp Live Concierge Card */}
              <div className="ct-card glass">
                <div className="ct-card-badge">
                  <span className="ct-online-dot"></span> Active Concierge
                </div>
                <h3>Live WhatsApp Assistance</h3>
                <p>
                  Get instant replies, request live photos/videos of your pair, or get real-time sizing measurements.
                </p>
                <div className="ct-card-detail">
                  <span>📱</span>
                  <div>
                    <small>Official WhatsApp Hotline</small>
                    <b>+{WA}</b>
                  </div>
                </div>
                <a
                  className="btn"
                  style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 14 }}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={wa("Hello! I need assistance with Hangu Branded Shoes.")}
                >
                  Start Live Chat on WhatsApp <WhatsAppIcon size={18} color="#fff" />
                </a>
              </div>
            </Reveal>

            <Reveal delay={300}>
              {/* Showroom & Operating Hours */}
              <div className="ct-card glass">
                <h3>Flagship Store & Showroom</h3>
                <p>
                  Visit us in person to test our cushioned soles, browse the latest arrivals, and receive professional fitting assistance.
                </p>
                <div className="ct-card-detail">
                  <span>📍</span>
                  <div>
                    <small>Showroom Location</small>
                    <b>Main Commercial Bazaar, Hangu, KPK, Pakistan</b>
                  </div>
                </div>
                <div className="ct-card-detail">
                  <span>🕒</span>
                  <div>
                    <small>Opening Hours</small>
                    <b>Monday – Sunday: 10:00 AM – 10:00 PM</b>
                  </div>
                </div>
                <div className="ct-card-detail">
                  <span>🚚</span>
                  <div>
                    <small>Nationwide Dispatch</small>
                    <b>Daily courier dispatches to all Pakistan cities</b>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={400}>
              {/* Quick FAQs */}
              <div className="ct-card glass">
                <h3>Quick Answers</h3>
                <div className="ct-faq-item">
                  <b>📦 How long does delivery take?</b>
                  <p>Standard delivery across Pakistan takes 2 to 4 business days with end-to-end SMS tracking.</p>
                </div>
                <div className="ct-faq-item">
                  <b>🔄 What if the shoe size does not fit?</b>
                  <p>Notify us within 7 days of receiving your order. We will arrange a seamless size swap immediately.</p>
                </div>
                <div className="ct-faq-item">
                  <b>💵 Is Cash on Delivery available?</b>
                  <p>Yes! We offer 100% Cash on Delivery nationwide. You can inspect the package before paying the courier.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Layout>
  );
}
