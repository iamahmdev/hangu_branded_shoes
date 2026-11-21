import { Product as LocalProduct } from "../types";
import { FALLBACK_PRODUCTS } from "../data/fallbackProducts";

function getNormalizedApiBase(): string {
  // If in a browser on production (e.g. hangubrandedshoes.com), always use the current domain's /api
  if (typeof window !== "undefined") {
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (!isLocal) {
      return `${window.location.origin}/api`;
    }
    return "http://localhost:5001/api";
  }

  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (envUrl) {
    const stripped = envUrl.replace(/\/+$/, "");
    return stripped.endsWith("/api") ? stripped : `${stripped}/api`;
  }
  return "http://localhost:5001/api";
}

async function requestApi(path: string, options?: RequestInit, timeoutMs: number = 20000): Promise<Response> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const base = getNormalizedApiBase();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const fetchOptions: RequestInit = {
    ...options,
    signal: options?.signal || controller.signal,
  };

  try {
    const res = await fetch(`${base}${normalizedPath}`, fetchOptions);
    clearTimeout(timeoutId);
    return res;
  } catch (primaryErr: any) {
    clearTimeout(timeoutId);
    // Only attempt localhost port fallback during local development
    if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
      const fallbackBase = base.includes("5000")
        ? "http://localhost:5001/api"
        : "http://localhost:5000/api";
      try {
        const res = await fetch(`${fallbackBase}${normalizedPath}`, options);
        return res;
      } catch {
        // Fallback failed
      }
    }

    if (primaryErr?.name === "AbortError" || String(primaryErr?.message || "").toLowerCase().includes("abort")) {
      throw new Error("Network request timed out. Please check your internet connection and try again.");
    }
    throw primaryErr;
  }
}

export interface CreateOrderPayload {
  orderId?: string;
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
  };
  items: Array<{
    productId: number;
    name: string;
    img: string;
    price: number;
    size: string;
    quantity: number;
    total: number;
  }>;
  subtotal: number;
  shippingFee: number;
  codFee?: number;
  totalAmount: number;
  paymentMethod: "cod" | "jazzcash";
  transactionId?: string;
  paymentScreenshot?: string;
  notes?: string;
  hp?: string;
}

export interface CreateReviewPayload {
  name?: string;
  userName?: string;
  city?: string;
  shoeName: string;
  productId?: number;
  rating: number;
  comment: string;
  verified?: boolean;
}

export interface RecentSale {
  id: string;
  customerName: string;
  city: string;
  productId: number;
  name: string;
  img: string;
  price: number;
  size: string;
  createdAt: string;
}

export function getLocalDeletedIds(): string[] {
  return [];
}

export function addLocalDeletedId(id: string | number) {
  // disabled: rely purely on MySQL database deletion
}

export const api = {
  /**
   * Filter and retrieve cached static fallback products instantly with zero latency
   */
  getFallbackProducts(params?: {
    cat?: string;
    search?: string;
    size?: string;
    sort?: string;
    inStock?: boolean;
  }): LocalProduct[] {
    const deletedIds = getLocalDeletedIds();
    let list = FALLBACK_PRODUCTS.filter((p) => !deletedIds.includes(String(p.id)));
    if (params?.cat && params.cat !== "All") {
      list = list.filter((p) => p.cat.toLowerCase() === params.cat!.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.cat.toLowerCase().includes(q) ||
          (p.tag && p.tag.toLowerCase().includes(q))
      );
    }
    if (params?.sort === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (params?.sort === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (params?.sort === "newest") {
      list.sort((a, b) => b.id - a.id);
    }
    return list;
  },

  /**
   * Retrieve single fallback product by numeric or string ID instantly
   */
  getFallbackProductById(id: number | string): LocalProduct | undefined {
    const deletedIds = getLocalDeletedIds();
    if (deletedIds.includes(String(id))) return undefined;
    const numId = Number(id);
    return FALLBACK_PRODUCTS.find((p) => p.id === numId);
  },

  /**
   * Get all products directly from MongoDB backend API with instant zero-latency fallback
   */
  async getProducts(params?: {
    cat?: string;
    search?: string;
    size?: string;
    sort?: string;
    inStock?: boolean;
    fresh?: boolean;
  }): Promise<LocalProduct[]> {
    const deletedIds = getLocalDeletedIds();
    try {
      const qs = new URLSearchParams();
      if (params?.cat && params.cat !== "All") qs.append("cat", params.cat);
      if (params?.search) qs.append("search", params.search);
      if (params?.size && params.size !== "All") qs.append("size", params.size);
      if (params?.sort) qs.append("sort", params.sort);
      if (params?.inStock) qs.append("inStock", "true");
      if (params?.fresh) qs.append("fresh", "true");
      qs.append("_t", String(Date.now()));

      const path = `/products${qs.toString() ? `?${qs.toString()}` : ""}`;
      const res = await requestApi(path, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      }, 5000);

      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) {
          return json.data.filter((p: any) => !deletedIds.includes(String(p.id)) && !deletedIds.includes(String(p._id)));
        }
      }
    } catch {
      // In production (Vercel) if backend cold-starts or is unreachable, return instant fallback
    }
    return this.getFallbackProducts(params);
  },

  /**
   * Get product by numeric ID or slug directly from backend API with fallback
   */
  async getProductById(id: number | string): Promise<LocalProduct | undefined> {
    try {
      const res = await requestApi(`/products/${id}`, undefined, 3500);
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch {
      // Fallback
    }
    return this.getFallbackProductById(id);
  },

  /**
   * Get category summary counts directly from backend with fallback
   */
  async getCategoriesSummary(): Promise<Array<{ name: string; count: number; img: string }>> {
    try {
      const res = await requestApi(`/products/categories`, undefined, 3500);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) return json.data;
      }
    } catch {
      // Fallback
    }
    const cats = ["Sneakers", "Formal", "Loafers", "Comfort", "Boots"];
    return cats.map((name) => {
      const prods = FALLBACK_PRODUCTS.filter((p) => p.cat === name);
      return {
        name,
        count: prods.length,
        img: prods[0]?.img || "/images/shoes/shoe_1.jpg",
      };
    });
  },

  /**
   * Post an order to backend MongoDB
   */
  async createOrder(payload: CreateOrderPayload): Promise<{ success: boolean; orderId?: string; data?: any; message?: string }> {
    const res = await requestApi(
      `/orders`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
      15000
    );
    const json = await res.json();
    if (!res.ok || json.success === false) {
      throw new Error(json?.message || "Could not record your order in the database. Please check your details.");
    }
    return json;
  },

  /**
   * Fetch genuine recent customer orders for RecentSalesToast
   */
  async getRecentSales(): Promise<RecentSale[]> {
    try {
      const res = await requestApi(`/orders/recent`);
      if (!res.ok) return [];
      const json = await res.json();
      return Array.isArray(json.data) ? json.data : [];
    } catch {
      return [];
    }
  },

  /**
   * Track order by Order ID or Customer Phone
   */
  async trackOrder(orderId: string): Promise<{ success: boolean; data?: any; message?: string }> {
    const clean = orderId.trim();
    const res = await requestApi(`/orders/track/${encodeURIComponent(clean)}`);
    return await res.json();
  },

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, reason?: string): Promise<{ success: boolean; message?: string }> {
    const res = await requestApi(`/orders/${encodeURIComponent(orderId)}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    return await res.json();
  },

  /**
   * Upload customer payment receipt (EasyPaisa transfer screenshot)
   */
  async uploadPaymentReceipt(file: File): Promise<{ success: boolean; data?: { url: string; publicId: string }; message?: string }> {
    const formData = new FormData();
    formData.append("image", file);
    const res = await requestApi(`/upload/receipt`, {
      method: "POST",
      body: formData,
    });
    return await res.json();
  },

  /**
   * Fetch approved reviews directly from backend
   */
  async getReviews(params?: { shoeName?: string; rating?: number }): Promise<{ success: boolean; stats?: any; data?: any[] }> {
    const qs = new URLSearchParams();
    if (params?.shoeName) qs.append("shoeName", params.shoeName);
    if (params?.rating) qs.append("rating", String(params.rating));

    const res = await requestApi(`/reviews${qs.toString() ? `?${qs.toString()}` : ""}`);
    if (!res.ok) throw new Error("Failed to load reviews");
    return await res.json();
  },

  /**
   * Submit customer review
   */
  async createReview(payload: CreateReviewPayload): Promise<{ success: boolean; data?: any; message?: string }> {
    const res = await requestApi(`/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  /**
   * Fetch store public settings with instant resilient fallback
   */
  async getStoreSettings(): Promise<{ success: boolean; data?: any }> {
    try {
      const res = await requestApi(`/settings`, undefined, 3500);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return {
      success: true,
      data: {
        storeName: "Hangu Branded Shoes",
        whatsappNumber: "923333147691",
        address: "Hangu tall road tahir markit hangu brand shoes 👟",
        shopTiming: "8:00 AM to 5:00 PM",
        freeShippingThreshold: 5000,
        standardShippingFee: 250,
      },
    };
  },

  // ----------------------------------------------------
  // ADMIN API CLIENT METHODS (Authenticated with JWT)
  // ----------------------------------------------------
  async adminLogin(usernameOrEmail: string, password: string): Promise<{ success: boolean; token?: string; admin?: any; message?: string }> {
    const res = await requestApi(`/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernameOrEmail, password }),
    });
    return await res.json();
  },

  async adminRecoverPassword(payload: { email: string; recoveryKey: string; newPassword: string }): Promise<{ success: boolean; message?: string }> {
    const res = await requestApi(`/admin/recover-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  async adminChangePassword(token: string, payload: { currentPassword: string; newPassword: string }): Promise<{ success: boolean; message?: string }> {
    const res = await requestApi(`/admin/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  async adminGetMe(token: string): Promise<{ success: boolean; admin?: any }> {
    const res = await requestApi(`/admin/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  },

  async adminGetDashboard(token: string): Promise<{ success: boolean; stats?: any; lowStockItems?: any[]; recentOrders?: any[] }> {
    const res = await requestApi(`/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  },

  async adminGetOrders(token: string, params?: { status?: string; paymentStatus?: string; paymentMethod?: string; search?: string }): Promise<{ success: boolean; count?: number; data?: any[] }> {
    const qs = new URLSearchParams();
    if (params?.status && params.status !== "all") qs.append("status", params.status);
    if (params?.paymentStatus && params.paymentStatus !== "all") qs.append("paymentStatus", params.paymentStatus);
    if (params?.paymentMethod && params.paymentMethod !== "all") qs.append("paymentMethod", params.paymentMethod);
    if (params?.search) qs.append("search", params.search);

    const res = await requestApi(`/orders${qs.toString() ? `?${qs.toString()}` : ""}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  },

  async adminUpdateOrderStatus(token: string, orderId: string, payload: { status?: string; courierName?: string; trackingNumber?: string; deliveryNote?: string; note?: string }): Promise<{ success: boolean; data?: any; message?: string }> {
    const res = await requestApi(`/orders/${encodeURIComponent(orderId)}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  async adminMarkCashCollected(token: string, orderId: string, note?: string): Promise<{ success: boolean; data?: any; message?: string }> {
    const res = await requestApi(`/orders/${encodeURIComponent(orderId)}/cash-collected`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ note }),
    });
    return await res.json();
  },

  async adminMarkFakeOrder(token: string, orderId: string, blockPhone?: boolean, reason?: string): Promise<{ success: boolean; data?: any; message?: string }> {
    const res = await requestApi(`/orders/${encodeURIComponent(orderId)}/fake`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ blockPhone, reason }),
    });
    return await res.json();
  },

  async adminUpdateOrderPayment(token: string, orderId: string, paymentStatus: "pending_verification" | "paid" | "rejected", note?: string): Promise<{ success: boolean; data?: any; message?: string }> {
    const res = await requestApi(`/orders/${encodeURIComponent(orderId)}/payment`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paymentStatus, note }),
    });
    return await res.json();
  },

  async adminDeleteOrder(token: string, orderId: string): Promise<{ success: boolean; message?: string }> {
    const res = await requestApi(`/orders/${encodeURIComponent(orderId)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  },

  async adminCreateProduct(token: string, payload: any): Promise<{ success: boolean; data?: any; message?: string }> {
    const res = await requestApi(`/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  async adminUpdateProduct(token: string, id: number | string, payload: any): Promise<{ success: boolean; data?: any; message?: string }> {
    const res = await requestApi(`/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  async adminAdjustStock(token: string, id: number | string, delta: number): Promise<{ success: boolean; data?: any }> {
    const res = await requestApi(`/products/${id}/stock`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ delta }),
    });
    return await res.json();
  },

  async adminDeleteProduct(token: string, id: number | string): Promise<{ success: boolean; message?: string }> {
    addLocalDeletedId(id);
    const res = await requestApi(`/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) {
      throw new Error(data.message || `Failed to delete product (HTTP ${res.status})`);
    }
    return data;
  },

  async adminGetReviews(token: string, params?: { status?: string; search?: string }): Promise<{ success: boolean; count?: number; data?: any[] }> {
    const qs = new URLSearchParams();
    if (params?.status && params.status !== "all") qs.append("status", params.status);
    if (params?.search) qs.append("search", params.search);

    const res = await requestApi(`/reviews/admin${qs.toString() ? `?${qs.toString()}` : ""}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  },

  async adminUpdateReviewStatus(token: string, id: string, payload: { status: string; verified?: boolean }): Promise<{ success: boolean; data?: any }> {
    const res = await requestApi(`/reviews/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  async adminDeleteReview(token: string, id: string): Promise<{ success: boolean; message?: string }> {
    const res = await requestApi(`/reviews/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  },

  async adminUpdateStoreSettings(token: string, payload: any): Promise<{ success: boolean; data?: any; message?: string }> {
    const res = await requestApi(`/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  /**
   * Upload image via backend API
   */
  async uploadImage(token: string, file: File): Promise<{ success: boolean; data?: { url: string; publicId: string; format: string; bytes: number }; message?: string }> {
    const formData = new FormData();
    formData.append("image", file);
    const res = await requestApi(`/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return await res.json();
  },

  /**
   * Delete image via backend API
   */
  async deleteImage(token: string, publicId: string): Promise<{ success: boolean; message?: string }> {
    const res = await requestApi(`/upload/${encodeURIComponent(publicId)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  },
};
