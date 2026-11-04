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
  enableCod?: boolean;
  codFee?: number;
  blockedPhoneNumbers?: string[];
}

export const ORDER_STATUS_COLORS: Record<string, { bg: string; text: string; border: string; label?: string }> = {
  awaiting_confirmation: {
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    border: "border-amber-500/30",
    label: "Awaiting Confirmation",
  },
  pending: { bg: "bg-yellow-500/15", text: "text-yellow-400", border: "border-yellow-500/30", label: "Pending" },
  confirmed: { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/30", label: "Confirmed" },
  dispatched: { bg: "bg-purple-500/15", text: "text-purple-400", border: "border-purple-500/30", label: "Dispatched" },
  delivered: { bg: "bg-green-500/15", text: "text-green-400", border: "border-green-500/30", label: "Delivered" },
  cancelled: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30", label: "Cancelled" },
};

export const PAYMENT_STATUS_COLORS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  cod_pending: {
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    border: "border-blue-500/30",
    label: "COD Pending",
  },
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
    label: "Paid & Collected",
  },
  rejected: {
    bg: "bg-red-500/15",
    text: "text-red-400",
    border: "border-red-500/30",
    label: "Payment Rejected",
  },
};
