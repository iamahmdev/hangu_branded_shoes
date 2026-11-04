export type AdminTab =
  | "dashboard"
  | "orders"
  | "products"
  | "coupons"
  | "inquiries"
  | "reviews"
  | "subscribers"
  | "settings";

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: "superadmin" | "admin" | "manager";
}

export interface ProductFormData {
  id?: number;
  name: string;
  cat: string;
  price: number;
  old: number;
  img: string;
  tag?: string;
  stock: number;
  desc: string;
  brand?: string;
  sizes: string[];
}

export interface CouponFormData {
  code: string;
  discountType: "percentage" | "fixed";
  discountAmount: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  freeShipping: boolean;
  usageLimit: number;
  description: string;
}

export interface StoreSettingsFormData {
  shopName?: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  shippingFee: number;
  freeShippingThreshold: number;
  announcementText: string;
  isStoreOpen: boolean;
  jazzcashNumber: string;
  jazzcashTitle: string;
  easypaisaNumber: string;
  easypaisaTitle: string;
  bankName: string;
  bankAccountTitle: string;
  bankAccountNumber: string;
  bankIban: string;
}

export const ORDER_STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
  confirmed: { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/30" },
  processing: { bg: "bg-purple-500/15", text: "text-purple-400", border: "border-purple-500/30" },
  dispatched: { bg: "bg-cyan-500/15", text: "text-cyan-400", border: "border-cyan-500/30" },
  delivered: { bg: "bg-green-500/15", text: "text-green-400", border: "border-green-500/30" },
  cancelled: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30" },
};
