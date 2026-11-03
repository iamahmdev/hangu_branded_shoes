import { PaymentAccounts, SocialLinks } from "../types";

// 👉 WhatsApp Configuration
export const WA: string = "923333147691";
export const SHOP: string = "Hangu Branded Shoes";

export const wa = (t?: string): string => {
  const msg = t || "Assalam-o-Alaikum! I want to inquire about Hangu Branded Shoes.";
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
};

// 👉 Official Social Media Links
export const SOCIALS: SocialLinks = {
  instagram: "https://instagram.com/hangubrandedshoes",
  tiktok: "https://tiktok.com/@hangubrandedshoes",
};

// Available standard EU/PK shoe sizes
export const SIZES: string[] = ["40", "41", "42", "43", "44", "45"];

// Free shipping threshold and standard fee
export const FREE: number = 5000;
export const FEE: number = 250;

// 👉 Payment Accounts
export const PAY: PaymentAccounts = {
  jazzcash: { name: "JazzCash", acc: "0333-3147691", title: "Hangu Branded Shoes" },
  easypaisa: { name: "EasyPaisa", acc: "0333-3147691", title: "Hangu Branded Shoes" },
  bank: { name: "Bank Transfer", acc: "PK00 BANK 0000 0000 0000 0000", title: "Hangu Branded Shoes" },
};
