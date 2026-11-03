import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  api,
  CreateOrderPayload,
  CreateInquiryPayload,
  CreateReviewPayload,
} from "../services/api";
import { Product } from "../types";

// ----------------------------------------------------
// PUBLIC STORE QUERIES
// ----------------------------------------------------

export function useProducts(params?: {
  cat?: string;
  search?: string;
  size?: string;
  sort?: string;
  inStock?: boolean;
}) {
  return useQuery<Product[]>({
    queryKey: ["products", params],
    queryFn: () => api.getProducts(params),
  });
}

export function useProduct(id: number | string | undefined) {
  return useQuery<Product | undefined>({
    queryKey: ["product", id],
    queryFn: () => (id ? api.getProductById(id) : Promise.resolve(undefined)),
    enabled: Boolean(id),
  });
}

export function useCategories() {
  return useQuery<Array<{ name: string; count: number; img: string }>>({
    queryKey: ["categories"],
    queryFn: () => api.getCategoriesSummary(),
  });
}

export function useReviews(params?: { shoeName?: string; rating?: number }) {
  return useQuery<{ success: boolean; stats?: any; data?: any[] }>({
    queryKey: ["reviews", params],
    queryFn: () => api.getReviews(params),
  });
}

export function useOrderTracking(orderId: string, enabled: boolean = true) {
  return useQuery<{ success: boolean; data?: any; message?: string }>({
    queryKey: ["order-tracking", orderId],
    queryFn: () => api.trackOrder(orderId),
    enabled: Boolean(orderId && enabled),
  });
}

export function useStoreSettings() {
  return useQuery<{ success: boolean; data?: any }>({
    queryKey: ["store-settings"],
    queryFn: () => api.getStoreSettings(),
  });
}

// ----------------------------------------------------
// PUBLIC STORE MUTATIONS
// ----------------------------------------------------

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => api.createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
}

export function useVerifyCoupon() {
  return useMutation({
    mutationFn: ({ code, subtotal }: { code: string; subtotal: number }) =>
      api.verifyCoupon(code, subtotal),
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      api.cancelOrder(orderId, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["order-tracking", variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
}

export function useSubscribeNewsletter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, source }: { email: string; source?: string }) =>
      api.subscribeNewsletter(email, source),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscribers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
}

export function useCreateInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInquiryPayload) => api.createInquiry(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => api.createReview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
  });
}

// ----------------------------------------------------
// ADMIN OPERATIONS HOOKS
// ----------------------------------------------------

export interface AdminDashboardData {
  success: boolean;
  stats?: {
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    deliveredOrders: number;
    lowStockCount: number;
    todayOrders: number;
    subscriberCount: number;
    unreadInquiries: number;
  };
  lowStockItems?: any[];
  recentOrders?: any[];
  recentInquiries?: any[];
}

export function useAdminDashboard(token: string | null) {
  return useQuery<AdminDashboardData>({
    queryKey: ["admin-dashboard", token],
    queryFn: () => (token ? api.adminGetDashboard(token) : Promise.resolve({ success: false })),
    enabled: Boolean(token),
  });
}

export function useAdminOrders(token: string | null, params?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ["admin-orders", token, params],
    queryFn: () =>
      token
        ? api.adminGetOrders(token, params)
        : Promise.resolve({ success: false, data: [] }),
    enabled: Boolean(token),
  });
}

export function useAdminUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      orderId,
      payload,
    }: {
      token: string;
      orderId: string;
      payload: { status?: string; courierName?: string; trackingNumber?: string; note?: string };
    }) => api.adminUpdateOrderStatus(token, orderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["order-tracking"] });
    },
  });
}

export function useAdminDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, orderId }: { token: string; orderId: string }) =>
      api.adminDeleteOrder(token, orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
}

export function useAdminCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, payload }: { token: string; payload: any }) =>
      api.adminCreateProduct(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
}

export function useAdminUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, id, payload }: { token: string; id: number | string; payload: any }) =>
      api.adminUpdateProduct(token, id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useAdminAdjustStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, id, delta }: { token: string; id: number | string; delta: number }) =>
      api.adminAdjustStock(token, id, delta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
}

export function useAdminDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, id }: { token: string; id: number | string }) =>
      api.adminDeleteProduct(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
}

export function useAdminCoupons(token: string | null) {
  return useQuery({
    queryKey: ["admin-coupons", token],
    queryFn: () => (token ? api.adminGetCoupons(token) : Promise.resolve({ success: false, data: [] })),
    enabled: Boolean(token),
  });
}

export function useAdminCreateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, payload }: { token: string; payload: any }) =>
      api.adminCreateCoupon(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
  });
}

export function useAdminDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, id }: { token: string; id: string }) =>
      api.adminDeleteCoupon(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
  });
}

export function useAdminInquiries(token: string | null, params?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ["admin-inquiries", token, params],
    queryFn: () =>
      token
        ? api.adminGetInquiries(token, params)
        : Promise.resolve({ success: false, data: [] }),
    enabled: Boolean(token),
  });
}

export function useAdminUpdateInquiryStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      id,
      payload,
    }: {
      token: string;
      id: string;
      payload: { status?: string; adminNotes?: string };
    }) => api.adminUpdateInquiryStatus(token, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
}

export function useAdminDeleteInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, id }: { token: string; id: string }) =>
      api.adminDeleteInquiry(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
}

export function useAdminReviews(token: string | null, params?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ["admin-reviews", token, params],
    queryFn: () =>
      token
        ? api.adminGetReviews(token, params)
        : Promise.resolve({ success: false, data: [] }),
    enabled: Boolean(token),
  });
}

export function useAdminUpdateReviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      token,
      id,
      payload,
    }: {
      token: string;
      id: string;
      payload: { status: string; verified?: boolean };
    }) => api.adminUpdateReviewStatus(token, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
  });
}

export function useAdminDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, id }: { token: string; id: string }) =>
      api.adminDeleteReview(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
  });
}

export function useAdminSubscribers(token: string | null) {
  return useQuery({
    queryKey: ["admin-subscribers", token],
    queryFn: () =>
      token
        ? api.adminGetSubscribers(token)
        : Promise.resolve({ success: false, data: [] }),
    enabled: Boolean(token),
  });
}

export function useAdminDeleteSubscriber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, id }: { token: string; id: string }) =>
      api.adminDeleteSubscriber(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscribers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
}

export function useAdminUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, payload }: { token: string; payload: any }) =>
      api.adminUpdateStoreSettings(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-settings"] });
    },
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: ({ token, file }: { token: string; file: File }) =>
      api.uploadImage(token, file),
  });
}

export function useDeleteImage() {
  return useMutation({
    mutationFn: ({ token, publicId }: { token: string; publicId: string }) =>
      api.deleteImage(token, publicId),
  });
}
