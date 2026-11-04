import Layout from "../src/components/Layout";
import Reveal from "../src/components/Reveal";
import { WhatsAppIcon, FacebookIcon, TikTokIcon, InstagramIcon } from "../src/components/WhatsAppButton";
import { SHOP, WA, wa, SOCIALS } from "../src/data/config";
import { useStoreSettings } from "../src/hooks/useApi";
import { Phone, MapPin, Clock, MessageCircle, ShieldCheck, Truck, RotateCcw } from "lucide-react";

export default function Contact() {
  const { data: storeSettingsData } = useStoreSettings();
  const settings = storeSettingsData?.data;

  const shopName = settings?.shopName?.trim() || SHOP;
  const whatsappNum = settings?.whatsappNumber?.trim() || WA;
  const phoneNum = settings?.phone?.trim() || "0333-3147691";
  const address = settings?.address?.trim() || "Hangu tall road tahir markit hangu brand shoes 👟";
  const shopTiming = settings?.shopTiming?.trim() || "8:00 AM to 5:00 PM";

  const whatsappMsg = `Assalam-o-Alaikum ${shopName}! I would like to inquire about footwear availability and sizes.`;

  return (
    <Layout title={`Contact Us & Store Location — ${shopName}`}>
      <div className="pt-32 pb-24">
        <div className="wrap max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Reveal>
              <small className="text-brand-red uppercase tracking-wider text-xs font-bold">
                CUSTOMER CONCIERGE & SHOWROOM
              </small>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1">
                Contact & Store Location
              </h1>
              <p className="text-zinc-400 max-w-xl mx-auto mt-3 text-sm leading-relaxed">
                Have questions about shoe sizing, order dispatch, or recommendations? Connect with our team directly via WhatsApp or phone hotline.
              </p>
            </Reveal>
          </div>

          {/* Core Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* 1. Official WhatsApp Support */}
            <Reveal delay={100}>
              <div className="glass p-7 rounded-3xl border border-white/10 flex flex-col justify-between h-full relative overflow-hidden group hover:border-[#25d366]/40 transition-all duration-300">
                <div className="absolute top-0 right-0 w-36 h-36 bg-[#25d366]/10 rounded-full blur-3xl pointer-events-none" />
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#25d366]/15 border border-[#25d366]/30 flex items-center justify-center mb-5 text-[#25d366]">
                    <WhatsAppIcon size={26} color="#25d366" />
                  </div>
                  <small className="text-[#25d366] text-xs font-bold uppercase tracking-wider block mb-1">
                    Instant Messaging
                  </small>
                  <h3 className="text-2xl font-bold text-white mb-2">WhatsApp Concierge</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    Direct chat with our footwear specialists for sizing assistance, real product photos, live stock confirmation, and tracking updates.
                  </p>
                  <div className="font-mono text-white text-base font-bold bg-white/5 border border-white/10 px-4 py-2 rounded-xl w-fit mb-5">
                    +{whatsappNum}
                  </div>
                </div>

                <a
                  href={wa(whatsappMsg, whatsappNum)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn inline-flex items-center justify-center gap-2.5 w-full py-3.5 text-sm font-bold bg-[#25d366] hover:bg-[#20ba59] text-black shadow-lg shadow-[#25d366]/20 transition-all"
                >
                  <WhatsAppIcon size={18} color="#000" />
                  <span>Chat on WhatsApp Now</span>
                </a>
              </div>
            </Reveal>

            {/* 2. Direct Phone Helpline */}
            <Reveal delay={200}>
              <div className="glass p-7 rounded-3xl border border-white/10 flex flex-col justify-between h-full relative overflow-hidden group hover:border-brand-gold/40 transition-all duration-300">
                <div className="absolute top-0 right-0 w-36 h-36 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center mb-5 text-brand-gold">
                    <Phone size={24} />
                  </div>
                  <small className="text-brand-gold text-xs font-bold uppercase tracking-wider block mb-1">
                    Customer Hotline
                  </small>
                  <h3 className="text-2xl font-bold text-white mb-2">Call Center Helpline</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    Speak directly with our store support team for urgent order assistance, size inquiries, and delivery questions across Pakistan.
                  </p>
                  <div className="font-mono text-white text-base font-bold bg-white/5 border border-white/10 px-4 py-2 rounded-xl w-fit mb-5">
                    {phoneNum}
                  </div>
                </div>

                <a
                  href={`tel:${phoneNum.replace(/[^0-9+]/g, "")}`}
                  className="btn ghost inline-flex items-center justify-center gap-2.5 w-full py-3.5 text-sm font-bold border-white/20 hover:border-brand-gold hover:text-brand-gold transition-all"
                >
                  <Phone size={18} />
                  <span>Call Us Directly</span>
                </a>
              </div>
            </Reveal>

            {/* 3. Physical Showroom Address */}
            <Reveal delay={300}>
              <div className="glass p-7 rounded-3xl border border-white/10 flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-red/15 border border-brand-red/30 flex items-center justify-center mb-5 text-brand-red">
                    <MapPin size={24} />
                  </div>
                  <small className="text-brand-red text-xs font-bold uppercase tracking-wider block mb-1">
                    Storefront
                  </small>
                  <h3 className="text-2xl font-bold text-white mb-2">Showroom Address</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    Visit our physical store to explore our full collection in person, try different sizes, and experience master craftsmanship firsthand.
                  </p>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-xs text-zinc-300 leading-relaxed mb-4">
                    <b className="text-white block text-sm mb-1">{shopName}</b>
                    {address}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <ShieldCheck size={16} className="text-brand-gold shrink-0" />
                  <span>Physical verification & in-person sizing available</span>
                </div>
              </div>
            </Reveal>

            {/* 4. Operating Hours & Schedule */}
            <Reveal delay={400}>
              <div className="glass p-7 rounded-3xl border border-white/10 flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mb-5 text-blue-400">
                    <Clock size={24} />
                  </div>
                  <small className="text-blue-400 text-xs font-bold uppercase tracking-wider block mb-1">
                    Store Timing
                  </small>
                  <h3 className="text-2xl font-bold text-white mb-2">Operating Hours</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    Our physical outlet and digital customer support operate reliably for seamless footwear shopping.
                  </p>
                  <div className="divide-y divide-white/5 bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs">
                    <div className="flex justify-between py-1.5 text-zinc-300">
                      <span>Store Timings:</span>
                      <b className="text-white font-mono">{shopTiming}</b>
                    </div>
                    <div className="flex justify-between py-1.5 text-zinc-300">
                      <span>WhatsApp Orders:</span>
                      <b className="text-green-400 font-mono">24/7 Available</b>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-4">
                  <MessageCircle size={16} className="text-[#25d366] shrink-0" />
                  <span>Messages sent after hours are answered early next morning</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Official Social Media Channels */}
          <Reveal delay={450}>
            <div className="glass p-6 rounded-3xl border border-white/10 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <b className="text-white text-base block">Connect on Social Media</b>
                <p className="text-zinc-400 text-xs">Watch live shoe unboxings, new arrivals & reviews</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={SOCIALS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black border border-white/15 hover:border-zinc-400 text-white text-xs font-semibold transition-all"
                >
                  <TikTokIcon size={16} color="#fff" />
                  <span>TikTok</span>
                </a>
                <a
                  href={SOCIALS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1877f2]/20 border border-[#1877f2]/40 hover:bg-[#1877f2] text-white text-xs font-semibold transition-all"
                >
                  <FacebookIcon size={16} color="#fff" />
                  <span>Facebook</span>
                </a>
                <a
                  href={SOCIALS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600/20 border border-pink-500/40 hover:bg-pink-600 text-white text-xs font-semibold transition-all"
                >
                  <InstagramIcon size={16} color="#fff" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </Reveal>

          {/* Reassurance Features Bar */}
          <Reveal delay={500}>
            <div className="glass p-6 rounded-3xl border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
              <div className="flex items-center gap-3.5 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-gold shrink-0">
                  <Truck size={20} />
                </div>
                <div>
                  <b className="text-white text-xs block">Nationwide Delivery</b>
                  <span className="text-zinc-400 text-[11px]">Direct courier dispatch across all cities</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-green-400 shrink-0">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <b className="text-white text-xs block">7-Day Free Size Exchange</b>
                  <span className="text-zinc-400 text-[11px]">Hassle-free size replacement guarantee</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-red shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <b className="text-white text-xs block">100% Genuine Quality</b>
                  <span className="text-zinc-400 text-[11px]">High-grade durable soles and materials</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Layout>
  );
}
