// 👉 Yahan apna WhatsApp number likho (country code ke saath, + ke baghair)
export const WA = "923333147691";
export const SHOP = "Hangu Branded Shoes";
export const wa = (t) => {
  const msg = t || "Assalam-o-Alaikum! I want to inquire about Hangu Branded Shoes.";
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
};
// 👉 Social Media Links (Client jab apna link de to yahan replace kar dein)
export const SOCIALS = {
  instagram: "https://instagram.com/hangubrandedshoes",
  tiktok: "https://tiktok.com/@hangubrandedshoes",
};
export const products = [
  { id: 1, name: "Skylite Slip-On Sneaker", cat: "Sneakers", price: 6499, old: 7999, img: "p1.jpg", tag: "New" },
  { id: 2, name: "Cloud Run Pro", cat: "Sneakers", price: 8999, old: 10999, img: "p2.jpg", tag: "Hot" },
  { id: 3, name: "Xarasoft Air Comfort", cat: "Comfort", price: 7499, old: 8999, img: "p3.jpg", tag: "Best Seller" },
  { id: 4, name: "Executive Derby", cat: "Formal", price: 7999, old: 9499, img: "p4.jpg", tag: "Premium" },
  { id: 5, name: "Gentleman Loafer", cat: "Formal", price: 6999, old: 8499, img: "p5.jpg", tag: "New" },
  { id: 6, name: "Classic Driving Loafer", cat: "Loafers", price: 5999, old: 7299, img: "p6.jpg", tag: "Sale" },
  { id: 7, name: "Street Sport Runner", cat: "Sneakers", price: 5499, old: 6999, img: "p7.jpg", tag: "Sale" },
  { id: 8, name: "Leather Casual Slip-On", cat: "Comfort", price: 6299, old: 7599, img: "p9.jpg", tag: "Limited" },
];
export const SIZES = ["40", "41", "42", "43", "44", "45"];
export const FREE = 5000, FEE = 250; // Rs. 5000 se upar delivery free
// 👉 Online payment accounts — apne asli numbers likho
export const PAY = {
  jazzcash: { name: "JazzCash", acc: "0333-3147691", title: "Hangu Branded Shoes" },
  easypaisa: { name: "EasyPaisa", acc: "0333-3147691", title: "Hangu Branded Shoes" },
  bank: { name: "Bank Transfer", acc: "PK00 BANK 0000 0000 0000 0000", title: "Hangu Branded Shoes" },
};
