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
              <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-900 mt-1">
                Contact & Store Location
              </h1>
              <p className="text-zinc-600 max-w-xl mx-auto mt-3 text-sm leading-relaxed">
                Have questions about shoe sizing, order dispatch, or recommendations? Connect with our team directly via WhatsApp or phone hotline.
              </p>
            </Reveal>
          </div>

          {/* Core Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* 1. Official WhatsApp Support */}
            <Reveal delay={100}>
              <div className="bg-white border border-zinc-200/80 shadow-sm p-7 rounded-3xl flex flex-col justify-between h-full relative overflow-hidden group hover:border-[#25d366] transition-all duration-300">
                <div className="absolute top-0 right-0 w-36 h-36 bg-[#25d366]/5 rounded-full blur-3xl pointer-events-none" />
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#25d366]/10 border border-[#25d366]/20 flex items-center justify-center mb-5 text-[#25d366]">
                    <WhatsAppIcon size={26} color="#25d366" />
                  </div>
                  <small className="text-[#10b981] text-xs font-bold uppercase tracking-wider block mb-1">
                    Instant Messaging
                  </small>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2">WhatsApp Concierge</h3>
                  <p className="text-zinc-600 text-xs leading-relaxed mb-4">
                    Direct chat with our footwear specialists for sizing assistance, real product photos, live stock confirmation, and tracking updates.
                  </p>
                  <div className="font-mono text-zinc-900 text-base font-bold bg-zinc-50 border border-zinc-200 px-4 py-2 rounded-xl w-fit mb-5">
                    +{whatsappNum}
                  </div>
                </div>

                <a
                  href={wa(whatsappMsg, whatsappNum)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn inline-flex items-center justify-center gap-2.5 w-full py-3.5 text-sm font-bold bg-[#25d366] hover:bg-[#20ba59] text-white shadow-md shadow-[#25d366]/20 transition-all"
                >
                  <WhatsAppIcon size={18} color="#fff" />
                  <span>Chat on WhatsApp Now</span>
                </a>
              </div>
            </Reveal>

            {/* 2. Direct Phone Helpline */}
            <Reveal delay={200}>
              <div className="bg-white border border-zinc-200/80 shadow-sm p-7 rounded-3xl flex flex-col justify-between h-full relative overflow-hidden group hover:border-zinc-400 transition-all duration-300">
                <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 text-amber-600">
                    <Phone size={24} />
                  </div>
                  <small className="text-amber-600 text-xs font-bold uppercase tracking-wider block mb-1">
                    Customer Hotline
                  </small>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2">Call Center Helpline</h3>
                  <p className="text-zinc-600 text-xs leading-relaxed mb-4">
                    Speak directly with our store support team for urgent order assistance, size inquiries, and delivery questions across Pakistan.
                  </p>
                  <div className="font-mono text-zinc-900 text-base font-bold bg-zinc-50 border border-zinc-200 px-4 py-2 rounded-xl w-fit mb-5">
                    {phoneNum}
                  </div>
                </div>

                <a
                  href={`tel:${phoneNum.replace(/[^0-9+]/g, "")}`}
                  className="btn ghost inline-flex items-center justify-center gap-2.5 w-full py-3.5 text-sm font-bold border-zinc-300 text-zinc-900 hover:border-zinc-900 hover:bg-zinc-50 transition-all"
                >
                  <Phone size={18} />
                  <span>Call Us Directly</span>
                </a>
              </div>
            </Reveal>

            {/* 3. Physical Showroom Address */}
            <Reveal delay={300}>
              <div className="bg-white border border-zinc-200/80 shadow-sm p-7 rounded-3xl flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center mb-5 text-brand-red">
                    <MapPin size={24} />
                  </div>
                  <small className="text-brand-red text-xs font-bold uppercase tracking-wider block mb-1">
                    Storefront
                  </small>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2">Showroom Address</h3>
                  <p className="text-zinc-600 text-xs leading-relaxed mb-4">
                    Visit our physical store to explore our full collection in person, try different sizes, and experience master craftsmanship firsthand.
                  </p>
                  <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl text-xs text-zinc-700 leading-relaxed mb-4">
                    <b className="text-zinc-900 block text-sm mb-1">{shopName}</b>
                    {address}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <ShieldCheck size={16} className="text-amber-600 shrink-0" />
                  <span>Physical verification & in-person sizing available</span>
                </div>
              </div>
            </Reveal>

            {/* 4. Operating Hours & Schedule */}
            <Reveal delay={400}>
              <div className="bg-white border border-zinc-200/80 shadow-sm p-7 rounded-3xl flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 text-blue-600">
                    <Clock size={24} />
                  </div>
                  <small className="text-blue-600 text-xs font-bold uppercase tracking-wider block mb-1">
                    Store Timing
                  </small>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2">Operating Hours</h3>
                  <p className="text-zinc-600 text-xs leading-relaxed mb-4">
                    Our physical outlet and digital customer support operate reliably for seamless footwear shopping.
                  </p>
                  <div className="divide-y divide-zinc-200 bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 text-xs">
                    <div className="flex justify-between py-1.5 text-zinc-600">
                      <span>Store Timings:</span>
                      <b className="text-zinc-900 font-mono">{shopTiming}</b>
                    </div>
                    <div className="flex justify-between py-1.5 text-zinc-600">
                      <span>WhatsApp Orders:</span>
                      <b className="text-emerald-600 font-mono">24/7 Available</b>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-500 mt-4">
                  <MessageCircle size={16} className="text-emerald-600 shrink-0" />
                  <span>Messages sent after hours are answered early next morning</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Official Social Media Channels */}
          <Reveal delay={450}>
            <div className="bg-white border border-zinc-200/80 shadow-sm p-6 rounded-3xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <b className="text-zinc-900 text-base block">Connect on Social Media</b>
                <p className="text-zinc-500 text-xs">Watch live shoe unboxings, new arrivals & reviews</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={SOCIALS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition-all shadow-xs"
                >
                  <TikTokIcon size={16} color="#fff" />
                  <span>TikTok</span>
                </a>
                <a
                  href={SOCIALS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200 hover:bg-[#1877f2] hover:text-white text-[#1877f2] text-xs font-semibold transition-all"
                >
                  <FacebookIcon size={16} color="currentColor" />
                  <span>Facebook</span>
                </a>
                <a
                  href={SOCIALS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-50 border border-pink-200 hover:bg-pink-600 hover:text-white text-pink-600 text-xs font-semibold transition-all"
                >
                  <InstagramIcon size={16} color="currentColor" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </Reveal>

          {/* Reassurance Features Bar */}
          <Reveal delay={500}>
            <div className="bg-white border border-zinc-200/80 shadow-sm p-6 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
              <div className="flex items-center gap-3.5 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-amber-600 shrink-0">
                  <Truck size={20} />
                </div>
                <div>
                  <b className="text-zinc-900 text-xs block">Nationwide Delivery</b>
                  <span className="text-zinc-500 text-[11px]">Direct courier dispatch across all cities</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <b className="text-zinc-900 text-xs block">7-Day Free Size Exchange</b>
                  <span className="text-zinc-500 text-[11px]">Hassle-free size replacement guarantee</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-brand-red shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <b className="text-zinc-900 text-xs block">100% Genuine Quality</b>
                  <span className="text-zinc-500 text-[11px]">High-grade durable soles and materials</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Layout>
  );
}
