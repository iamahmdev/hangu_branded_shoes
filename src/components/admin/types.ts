export type AdminTab =
  | "dashboard"
  | "orders"
  | "products"
  | "reviews"
  | "settings";

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: "admin";
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
  isActive?: boolean;
}

export interface StoreSettingsFormData {
  shopName?: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  shopTiming?: string;
  shippingFee: number;
  freeShippingThreshold: number;
  announcementText: string;
  isStoreOpen: boolean;
  easypaisaNumber: string;
  easypaisaTitle: string;
}

export const ORDER_STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
  confirmed: { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/30" },
  dispatched: { bg: "bg-purple-500/15", text: "text-purple-400", border: "border-purple-500/30" },
  delivered: { bg: "bg-green-500/15", text: "text-green-400", border: "border-green-500/30" },
  cancelled: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30" },
};

export const PAYMENT_STATUS_COLORS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  pending_verification: {
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    border: "border-amber-500/30",
    label: "Awaiting Verification",
  },
  paid: {
    bg: "bg-green-500/15",
    text: "text-green-400",
    border: "border-green-500/30",
    label: "Verified & Paid",
  },
  rejected: {
    bg: "bg-red-500/15",
    text: "text-red-400",
    border: "border-red-500/30",
    label: "Payment Rejected",
  },
};
