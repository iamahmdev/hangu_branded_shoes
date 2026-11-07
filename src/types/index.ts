export interface Product {
  id: number;
  name: string;
  cat: string;
  price: number;
  old: number;
  img: string;
  images?: string[];
  tag?: string;
  desc?: string;
  sizes?: string[];
  inStock?: boolean;
  stock?: number;
  stockCount?: number;
  brand?: string;
  rating?: number;
  reviews?: number;
  featured?: boolean;
  isFeatured?: boolean;
  isSale?: boolean;
  isBestseller?: boolean;
  isActive?: boolean;
}

export interface CartItem {
  k: string;
  id: number;
  name: string;
  img: string;
  price: number;
  size: string;
  q: number;
}

export interface PaymentAccount {
  name: string;
  acc: string;
  title: string;
}

export interface PaymentAccounts {
  jazzcash: PaymentAccount;
}

export interface SocialLinks {
  facebook: string;
  tiktok: string;
  instagram: string;
}

export interface CartContextType {
  items: CartItem[];
  add: (p: Product, size: string, q?: number) => void;
  setQ: (k: string, q: number) => void;
  clear: () => void;
  sub: number;
  ship: number;
  total: number;
  count: number;
  quickProduct: Product | null;
  openQuickOrder: (p: Product) => void;
  closeQuickOrder: () => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  openSearch: () => void;
  closeSearch: () => void;
}
