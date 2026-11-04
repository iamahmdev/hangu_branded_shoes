import { Product as LocalProduct } from "../types";

let cachedApiBase: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function requestApi(path: string, options?: RequestInit): Promise<Response> {
  try {
    return await fetch(`${cachedApiBase}${path}`, options);
  } catch (primaryErr) {
    // If port 5000 has permission denied / occupied on Windows, auto try 5001
    const fallbackBase = cachedApiBase.includes("5000")
      ? "http://localhost:5001/api"
      : "http://localhost:5000/api";
    try {
      const res = await fetch(`${fallbackBase}${path}`, options);
      cachedApiBase = fallbackBase;
      return res;
    } catch {
      throw primaryErr;
    }
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
  discountAmount?: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: "cod" | "jazzcash" | "easypaisa";
  transactionId?: string;
  notes?: string;
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

export interface CouponVerifyResult {
  success: boolean;
  valid?: boolean;
  coupon?: {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    discountAmount: number;
    freeShipping: boolean;
    description?: string;
  };
  message?: string;
}

export const api = {
  /**
   * Get all products directly from MongoDB backend API
   */
  async getProducts(params?: {
    cat?: string;
    search?: string;
    size?: string;
    sort?: string;
    inStock?: boolean;
  }): Promise<LocalProduct[]> {
    const qs = new URLSearchParams();
    if (params?.cat && params.cat !== "All") qs.append("cat", params.cat);
    if (params?.search) qs.append("search", params.search);
    if (params?.size && params.size !== "All") qs.append("size", params.size);
    if (params?.sort) qs.append("sort", params.sort);
    if (params?.inStock) qs.append("inStock", "true");

    const path = `/products${qs.toString() ? `?${qs.toString()}` : ""}`;
    const res = await requestApi(path, { headers: { "Content-Type": "application/json" } });
    if (!res.ok) throw new Error("Failed to load products from backend");
    const json = await res.json();
    return json.data || [];
  },

  /**
   * Get product by numeric ID or slug directly from backend API
   */
  async getProductById(id: number | string): Promise<LocalProduct | undefined> {
    const res = await requestApi(`/products/${id}`);
    if (!res.ok) throw new Error("Product not found");
    const json = await res.json();
    return json.data;
  },

  /**
   * Get category summary counts directly from backend
   */
  async getCategoriesSummary(): Promise<Array<{ name: string; count: number; img: string }>> {
    const res = await requestApi(`/products/categories`);
    if (!res.ok) throw new Error("Failed to load categories");
    const json = await res.json();
    return json.data || [];
  },

  /**
   * Post an order to backend MongoDB
   */
  async createOrder(payload: CreateOrderPayload): Promise<{ success: boolean; orderId?: string; data?: any; message?: string }> {
    const res = await requestApi(`/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
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
   * Verify coupon promo code against subtotal
   */
  async verifyCoupon(code: string, subtotal: number): Promise<CouponVerifyResult> {
    const res = await requestApi(`/coupons/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, subtotal }),
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
   * Fetch store public settings
   */
  async getStoreSettings(): Promise<{ success: boolean; data?: any }> {
    const res = await requestApi(`/settings`);
    if (!res.ok) throw new Error("Failed to load settings");
    return await res.json();
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

  async adminGetOrders(token: string, params?: { status?: string; search?: string }): Promise<{ success: boolean; count?: number; data?: any[] }> {
    const qs = new URLSearchParams();
    if (params?.status && params.status !== "all") qs.append("status", params.status);
    if (params?.search) qs.append("search", params.search);

    const res = await requestApi(`/orders${qs.toString() ? `?${qs.toString()}` : ""}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  },

  async adminUpdateOrderStatus(token: string, orderId: string, payload: { status?: string; courierName?: string; trackingNumber?: string; note?: string }): Promise<{ success: boolean; data?: any; message?: string }> {
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
    const res = await requestApi(`/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  },

  async adminGetCoupons(token: string): Promise<{ success: boolean; data?: any[] }> {
    const res = await requestApi(`/coupons`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  },

  async adminCreateCoupon(token: string, payload: any): Promise<{ success: boolean; data?: any; message?: string }> {
    const res = await requestApi(`/coupons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  async adminDeleteCoupon(token: string, id: string): Promise<{ success: boolean; message?: string }> {
    const res = await requestApi(`/coupons/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
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
   * Upload image to Cloudinary via backend API
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
   * Delete image from Cloudinary via backend API
   */
  async deleteImage(token: string, publicId: string): Promise<{ success: boolean; message?: string }> {
    const res = await requestApi(`/upload/${encodeURIComponent(publicId)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  },
};
