import { PaymentAccounts, SocialLinks } from "../types";

// 👉 WhatsApp Configuration
export const WA: string = "923333147691";
export const SHOP: string = "Hangu Branded Shoes";

export const wa = (t?: string, customNumber?: string): string => {
  const msg = t || "Hello! I want to inquire about Hangu Branded Shoes.";
  const phone = (customNumber || WA).replace(/[^0-9]/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
};

// 👉 Official Social Media Links
export const SOCIALS: SocialLinks = {
  facebook: "https://www.facebook.com/share/19iiUCxH6i/?mibextid=",
  tiktok: "https://www.tiktok.com/@hangubrandshoes?_r=1&_t=ZS-9B83WXlEltd",
  instagram: "https://instagram.com/hangubrandedshoes",
};

// Available standard EU/PK shoe sizes
export const SIZES: string[] = ["40", "41", "42", "43", "44", "45"];

// Free shipping threshold and standard fee
export const FREE: number = 5000;
export const FEE: number = 250;

// 👉 Payment Accounts (Default fallback; live values loaded from MongoDB Settings)
export const PAY: PaymentAccounts = {
  jazzcash: { name: "JazzCash", acc: "03275430305", title: "Muhammad Atif Ibrahim" },
};
