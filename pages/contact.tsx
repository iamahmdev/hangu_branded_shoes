import { useState, ChangeEvent, FormEvent } from "react";
import Layout from "../src/components/Layout";
import Reveal from "../src/components/Reveal";
import { WhatsAppIcon } from "../src/components/WhatsAppButton";
import { SHOP, WA, wa } from "../src/data/config";
import { useCreateInquiry } from "../src/hooks/useApi";
import { MessageSquare, Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";

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
  const createInquiryMutation = useCreateInquiry();

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

    createInquiryMutation.mutate({
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      email: form.email,
      city: form.city,
      subject: form.subject,
      orderNumber: form.orderNumber,
      message: form.message,
      preferredMethod: form.preferredMethod,
    });

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

    createInquiryMutation.mutate(
      {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email,
        city: form.city,
        subject: form.subject,
        orderNumber: form.orderNumber,
        message: form.message,
        preferredMethod: form.preferredMethod,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
      }
    );
  };

  return (
    <Layout title="Contact & Showroom Location — Hangu Branded Shoes">
      <div className="pt-32 pb-20">
        <div className="wrap max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <small className="text-brand-red uppercase tracking-wider text-xs font-bold">
              CUSTOMER CONCIERGE & SHOWROOM
            </small>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1">
              Contact & Footwear Inquiries
            </h1>
            <p className="text-zinc-400 max-w-xl mx-auto mt-2.5 text-sm">
              Need assistance selecting your ideal size, custom recommendations, or tracking updates? We are here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
            {/* Left: Contact / Consultation Form */}
            <div className="glass p-6 md:p-8 rounded-3xl border border-white/10">
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <MessageSquare size={20} className="text-brand-gold" />
                <span>Send Us an Inquiry</span>
              </h2>
              <p className="text-zinc-400 text-xs mb-6">
                Fill out the details below. Our team logs inquiries directly to our database and responds within minutes.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-green-500/15 border border-green-500/30 text-center animate-fadeIn">
                  <CheckCircle2 size={36} className="text-green-400 mx-auto mb-2" />
                  <b className="text-white text-base block">Inquiry Submitted Successfully!</b>
                  <p className="text-zinc-300 text-xs mt-1">
                    Thank you, {form.firstName}! Our footwear specialists will get in touch with you shortly.
                  </p>
                  <button
                    type="button"
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
                    className="btn ghost mt-4 py-2 px-4 text-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="flex flex-col gap-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 block mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tariq"
                        value={form.firstName}
                        onChange={handleChange("firstName")}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-brand-red"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1">Last Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Khan"
                        value={form.lastName}
                        onChange={handleChange("lastName")}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-brand-red"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 block mb-1">WhatsApp / Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0300 1234567"
                        value={form.phone}
                        onChange={handleChange("phone")}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1">City</label>
                      <input
                        type="text"
                        placeholder="Peshawar, Kohat, Islamabad..."
                        value={form.city}
                        onChange={handleChange("city")}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-brand-red"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 block mb-1">Topic / Subject</label>
                      <select
                        value={form.subject}
                        onChange={handleChange("subject")}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-brand-red"
                      >
                        <option value="Size Fitting Consultation">Size Fitting Consultation</option>
                        <option value="Order Tracking & Status">Order Tracking & Status</option>
                        <option value="7-Day Size Exchange">7-Day Size Exchange</option>
                        <option value="Bulk / Wholesale Inquiry">Bulk / Wholesale Inquiry</option>
                        <option value="General Question">General Question</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-zinc-400 block mb-1">Order Number (if any)</label>
                      <input
                        type="text"
                        placeholder="HBS123456"
                        value={form.orderNumber}
                        onChange={handleChange("orderNumber")}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">Message *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Write your questions or describe your sizing needs..."
                      value={form.message}
                      onChange={handleChange("message")}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-brand-red"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleWhatsAppSend}
                      disabled={createInquiryMutation.isPending}
                      className="btn flex-1 py-3 text-xs font-bold inline-flex items-center justify-center gap-2"
                    >
                      <WhatsAppIcon size={16} color="#fff" />
                      <span>Send via WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDirectSubmit}
                      disabled={createInquiryMutation.isPending}
                      className="btn ghost flex-1 py-3 text-xs font-bold inline-flex items-center justify-center gap-2"
                    >
                      <Send size={15} />
                      <span>Submit Direct Inquiry</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right: Showroom & Direct Contact Details */}
            <div className="flex flex-col gap-6">
              <div className="glass p-6 md:p-8 rounded-3xl border border-white/10 flex flex-col gap-5">
                <h3 className="text-lg font-bold text-white">Showroom & Support</h3>

                <div className="flex items-start gap-3 text-xs">
                  <div className="w-8 h-8 rounded-full bg-brand-red/15 text-brand-red border border-brand-red/30 flex items-center justify-center shrink-0">
                    <MapPin size={15} />
                  </div>
                  <div>
                    <b className="text-white block text-sm">Physical Showroom</b>
                    <p className="text-zinc-400 mt-0.5">Main Commercial Bazaar, Hangu, KPK, Pakistan</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="w-8 h-8 rounded-full bg-[#25d366]/15 text-[#25d366] border border-[#25d366]/30 flex items-center justify-center shrink-0">
                    <Phone size={15} />
                  </div>
                  <div>
                    <b className="text-white block text-sm">WhatsApp Concierge</b>
                    <p className="text-zinc-400 mt-0.5 font-mono">+{WA}</p>
                    <small className="text-[#25d366] block mt-0.5">Average reply time: under 5 minutes</small>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="w-8 h-8 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <Mail size={15} />
                  </div>
                  <div>
                    <b className="text-white block text-sm">Email Support</b>
                    <p className="text-zinc-400 mt-0.5 font-mono">support@hangubrandedshoes.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="w-8 h-8 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30 flex items-center justify-center shrink-0">
                    <Clock size={15} />
                  </div>
                  <div>
                    <b className="text-white block text-sm">Opening Hours</b>
                    <p className="text-zinc-400 mt-0.5">Monday – Sunday: 10:00 AM – 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
