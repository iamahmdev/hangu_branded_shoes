import { useState, ChangeEvent, FormEvent } from "react";
import Layout from "../src/components/Layout";
import Reveal from "../src/components/Reveal";
import { WhatsAppIcon } from "../src/components/WhatsAppButton";
import { SHOP, WA, wa } from "../src/data/config";

interface ContactForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  subject: string;
  orderNumber: string;
  message: string;
  preferredMethod: string;
}

export default function Contact() {
  const [form, setForm] = useState<ContactForm>({
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

  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleChange = (field: keyof ContactForm) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const constructMessage = (): string => {
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

  const handleWhatsAppSend = (e: FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.phone || !form.message) {
      alert("Please fill in your First Name, Phone Number, and Message.");
      return;
    }
    const msg = constructMessage();
    window.open(wa(msg), "_blank");
    setSubmitted(true);
  };

  const handleDirectSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.phone || !form.message) {
      alert("Please fill in your First Name, Phone Number, and Message.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <Layout title="Contact Us — Hangu Branded Shoes">
      <div className="pg wrap pt-32 pb-16" style={{ maxWidth: 1180 }}>
        {/* Header */}
        <Reveal>
          <div className="title text-center mb-12">
            <span className="pill glass inline-block mb-3 text-xs font-bold text-brand-gold">WE ARE HERE TO HELP</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">
              Get In Touch With Our Concierge
            </h1>
            <p className="text-zinc-400 max-w-xl mx-auto mt-3 text-sm md:text-base leading-relaxed">
              Have questions regarding sizing, custom recommendations, delivery tracking, or 7-day exchanges? Reach out directly and our footwear specialists will guide you.
            </p>
          </div>
        </Reveal>

        {/* Two-Column Grid */}
        <div className="ct-grid grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8">
          {/* Left Column: Form */}
          <Reveal delay={100}>
            <div className="ct-form-card glass p-6 md:p-8 rounded-3xl">
              <div className="ct-form-head mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">Send Us a Direct Message</h3>
                <p className="text-zinc-400 text-xs md:text-sm">Fill out the details below. We typically reply within 15 to 30 minutes.</p>
              </div>

              {submitted ? (
                <div className="ct-success-box glass p-6 rounded-2xl text-center">
                  <span className="ct-success-icon text-4xl block mb-2">✅</span>
                  <h4 className="text-xl font-bold text-white mb-2">Inquiry Received!</h4>
                  <p className="text-zinc-300 text-sm leading-relaxed max-w-md mx-auto">
                    Thank you, <strong>{form.firstName}</strong>. Your inquiry has been logged. Our footwear support team will reach out via <strong>{form.preferredMethod}</strong> at <strong>{form.phone}</strong> promptly.
                  </p>
                  <div className="flex gap-3 justify-center flex-wrap mt-6">
                    <a
                      className="btn inline-flex items-center gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={wa(constructMessage())}
                    >
                      <span>Open in WhatsApp</span>
                      <WhatsAppIcon size={18} color="#fff" />
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
                <form className="ct-form flex flex-col gap-4" onSubmit={handleWhatsAppSend}>
                  {/* First Name & Last Name */}
                  <div className="ct-two-col grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="ct-label block text-xs font-semibold text-zinc-300 mb-1.5">First Name *</label>
                      <input
                        className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-red"
                        required
                        type="text"
                        placeholder="e.g. Ahmad"
                        value={form.firstName}
                        onChange={handleChange("firstName")}
                      />
                    </div>
                    <div>
                      <label className="ct-label block text-xs font-semibold text-zinc-300 mb-1.5">Last Name *</label>
                      <input
                        className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-red"
                        required
                        type="text"
                        placeholder="e.g. Khan"
                        value={form.lastName}
                        onChange={handleChange("lastName")}
                      />
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div className="ct-two-col grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="ct-label block text-xs font-semibold text-zinc-300 mb-1.5">Phone / WhatsApp Number *</label>
                      <input
                        className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-red"
                        required
                        type="tel"
                        placeholder="0333 3147691"
                        value={form.phone}
                        onChange={handleChange("phone")}
                      />
                    </div>
                    <div>
                      <label className="ct-label block text-xs font-semibold text-zinc-300 mb-1.5">Email Address (Optional)</label>
                      <input
                        className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-red"
                        type="email"
                        placeholder="name@example.com"
                        value={form.email}
                        onChange={handleChange("email")}
                      />
                    </div>
                  </div>

                  {/* City & Subject */}
                  <div className="ct-two-col grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="ct-label block text-xs font-semibold text-zinc-300 mb-1.5">Your City</label>
                      <input
                        className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-red"
                        type="text"
                        placeholder="e.g. Hangu, Peshawar, Lahore"
                        value={form.city}
                        onChange={handleChange("city")}
                      />
                    </div>
                    <div>
                      <label className="ct-label block text-xs font-semibold text-zinc-300 mb-1.5">Topic / Inquiry Type *</label>
                      <select
                        className="inp ct-select w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-red"
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
                    <label className="ct-label block text-xs font-semibold text-zinc-300 mb-1.5">Order Reference ID (Optional)</label>
                    <input
                      className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-red"
                      type="text"
                      placeholder="e.g. HBS789012 (if inquiring about an order)"
                      value={form.orderNumber}
                      onChange={handleChange("orderNumber")}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="ct-label block text-xs font-semibold text-zinc-300 mb-1.5">Your Message / Inquiry Details *</label>
                    <textarea
                      className="inp w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-red"
                      required
                      rows={5}
                      placeholder="Please describe how we can assist you. For size advice, let us know your normal shoe size or brand..."
                      value={form.message}
                      onChange={handleChange("message")}
                    />
                  </div>

                  {/* Preferred Contact Method */}
                  <div className="mb-2">
                    <label className="ct-label block text-xs font-semibold text-zinc-300 mb-2">Preferred Response Channel</label>
                    <div className="ct-radio-group flex gap-2 flex-wrap">
                      {["WhatsApp", "Phone Call", "Email"].map((method) => (
                        <button
                          type="button"
                          key={method}
                          className={"ct-radio-chip px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all " + (form.preferredMethod === method ? "active bg-brand-red border-brand-red text-white" : "bg-white/5 border-white/10 text-zinc-400 hover:text-white")}
                          onClick={() => setForm({ ...form, preferredMethod: method })}
                        >
                          {method === "WhatsApp" ? "💬 WhatsApp" : method === "Phone Call" ? "📞 Phone Call" : "✉️ Email"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="ct-action-buttons flex gap-3 flex-wrap mt-2">
                    <button
                      type="submit"
                      className="btn flex-1 inline-flex items-center justify-center gap-2"
                    >
                      <span>Send on WhatsApp</span>
                      <WhatsAppIcon size={18} color="#fff" />
                    </button>
                    <button
                      type="button"
                      onClick={handleDirectSubmit}
                      className="btn ghost flex-1 text-center"
                    >
                      Submit Ticket ✓
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>

          {/* Right Column: Contact Details & Quick Support */}
          <div className="ct-sidebar flex flex-col gap-6">
            <Reveal delay={200}>
              {/* WhatsApp Live Concierge Card */}
              <div className="ct-card glass p-6 rounded-3xl">
                <div className="ct-card-badge inline-flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 text-[#25d366] text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3">
                  <span className="ct-online-dot w-2 h-2 rounded-full bg-[#25d366] animate-pulse"></span> Active Concierge
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Live WhatsApp Assistance</h3>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-4">
                  Get instant replies, request live photos/videos of your pair, or get real-time sizing measurements.
                </p>
                <div className="ct-card-detail flex items-center gap-3 text-xs text-zinc-300">
                  <span className="text-xl">📱</span>
                  <div>
                    <small className="block text-zinc-500">Official WhatsApp Hotline</small>
                    <b className="text-white text-sm">+{WA}</b>
                  </div>
                </div>
                <a
                  className="btn w-full inline-flex items-center justify-center gap-2 mt-4"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={wa("Hello! I need assistance with Hangu Branded Shoes.")}
                >
                  <span>Start Live Chat on WhatsApp</span>
                  <WhatsAppIcon size={18} color="#fff" />
                </a>
              </div>
            </Reveal>

            <Reveal delay={300}>
              {/* Showroom & Operating Hours */}
              <div className="ct-card glass p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-white mb-1">Flagship Store & Showroom</h3>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-4">
                  Visit us in person to test our cushioned soles, browse the latest arrivals, and receive professional fitting assistance.
                </p>
                <div className="flex flex-col gap-3 text-xs text-zinc-300">
                  <div className="ct-card-detail flex items-center gap-3">
                    <span className="text-xl">📍</span>
                    <div>
                      <small className="block text-zinc-500">Showroom Location</small>
                      <b className="text-white">Main Commercial Bazaar, Hangu, KPK, Pakistan</b>
                    </div>
                  </div>
                  <div className="ct-card-detail flex items-center gap-3">
                    <span className="text-xl">🕒</span>
                    <div>
                      <small className="block text-zinc-500">Opening Hours</small>
                      <b className="text-white">Monday – Sunday: 10:00 AM – 10:00 PM</b>
                    </div>
                  </div>
                  <div className="ct-card-detail flex items-center gap-3">
                    <span className="text-xl">🚚</span>
                    <div>
                      <small className="block text-zinc-500">Nationwide Dispatch</small>
                      <b className="text-white">Daily courier dispatches to all Pakistan cities</b>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={400}>
              {/* Quick FAQs */}
              <div className="ct-card glass p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-white mb-3">Quick Answers</h3>
                <div className="flex flex-col gap-3 text-xs text-zinc-300">
                  <div className="ct-faq-item">
                    <b className="text-white block mb-0.5">📦 How long does delivery take?</b>
                    <p className="text-zinc-400 leading-relaxed">Standard delivery across Pakistan takes 2 to 4 business days with end-to-end SMS tracking.</p>
                  </div>
                  <div className="ct-faq-item">
                    <b className="text-white block mb-0.5">🔄 What if the shoe size does not fit?</b>
                    <p className="text-zinc-400 leading-relaxed">Notify us within 7 days of receiving your order. We will arrange a seamless size swap immediately.</p>
                  </div>
                  <div className="ct-faq-item">
                    <b className="text-white block mb-0.5">💵 Is Cash on Delivery available?</b>
                    <p className="text-zinc-400 leading-relaxed">Yes! We offer 100% Cash on Delivery nationwide. You can inspect the package before paying the courier.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Layout>
  );
}
