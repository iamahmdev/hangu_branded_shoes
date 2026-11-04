import { useState, useEffect } from "react";
import Layout from "../src/components/Layout";
import { api } from "../src/services/api";
import { AdminTab, AdminUser, ProductFormData, StoreSettingsFormData } from "../src/components/admin/types";
import AdminLogin from "../src/components/admin/AdminLogin";
import AdminLayout from "../src/components/admin/AdminLayout";
import DashboardOverview from "../src/components/admin/DashboardOverview";
import OrdersTab from "../src/components/admin/OrdersTab";
import OrderDetailModal from "../src/components/admin/OrderDetailModal";
import ProductsTab from "../src/components/admin/ProductsTab";
import ProductModal from "../src/components/admin/ProductModal";
import ReviewsTab from "../src/components/admin/ReviewsTab";
import SettingsTab from "../src/components/admin/SettingsTab";
import {
  useAdminDashboard,
  useAdminOrders,
  useAdminUpdateOrderStatus,
  useAdminUpdateOrderPayment,
  useAdminDeleteOrder,
  useProducts,
  useAdminCreateProduct,
  useAdminUpdateProduct,
  useAdminAdjustStock,
  useAdminDeleteProduct,
  useAdminReviews,
  useAdminUpdateReviewStatus,
  useAdminDeleteReview,
  useStoreSettings,
  useAdminUpdateSettings,
  useAdminChangePassword,
  useUploadImage,
} from "../src/hooks/useApi";

export default function AdminPage() {
  const [token, setToken] = useState<string>("");
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  // Filter & Search states
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>("all");
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<string>("all");
  const [orderSearch, setOrderSearch] = useState<string>("");
  const [productSearch, setProductSearch] = useState<string>("");

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [productModalOpen, setProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null);

  // ----------------------------------------------------
  // TANSTACK QUERY HOOKS (Auto-refreshes every 15s)
  // ----------------------------------------------------
  const dashboardQuery = useAdminDashboard(token);
  const ordersQuery = useAdminOrders(token, {
    status: orderFilterStatus,
    paymentStatus: orderPaymentFilter,
    search: orderSearch,
  });
  const productsQuery = useProducts({ search: productSearch });
  const reviewsQuery = useAdminReviews(token);
  const settingsQuery = useStoreSettings();

  // ----------------------------------------------------
  // MUTATIONS (Auto-Invalidate Queries)
  // ----------------------------------------------------
  const updateOrderStatusMutation = useAdminUpdateOrderStatus();
  const updateOrderPaymentMutation = useAdminUpdateOrderPayment();
  const deleteOrderMutation = useAdminDeleteOrder();
  const createProductMutation = useAdminCreateProduct();
  const updateProductMutation = useAdminUpdateProduct();
  const adjustStockMutation = useAdminAdjustStock();
  const deleteProductMutation = useAdminDeleteProduct();
  const updateReviewStatusMutation = useAdminUpdateReviewStatus();
  const deleteReviewMutation = useAdminDeleteReview();
  const updateSettingsMutation = useAdminUpdateSettings();
  const changePasswordMutation = useAdminChangePassword();
  const uploadImageMutation = useUploadImage();

  // Verify stored token on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("hbs_admin_token");
      if (savedToken) {
        setToken(savedToken);
        api
          .adminGetMe(savedToken)
          .then((res) => {
            if (res.success && res.admin) {
              setAdminUser(res.admin);
            } else {
              handleLogout();
            }
          })
          .catch(() => handleLogout())
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (usernameOrEmail: string, pass: string) => {
    const res = await api.adminLogin(usernameOrEmail, pass);
    if (res.success && res.token) {
      setToken(res.token);
      setAdminUser(res.admin);
      localStorage.setItem("hbs_admin_token", res.token);
    }
    return res;
  };

  const handleLogout = () => {
    setToken("");
    setAdminUser(null);
    localStorage.removeItem("hbs_admin_token");
  };

  const handleRefreshAll = () => {
    dashboardQuery.refetch();
    ordersQuery.refetch();
    productsQuery.refetch();
    reviewsQuery.refetch();
    settingsQuery.refetch();
  };

  // Order Handlers
  const handleUpdateOrderStatus = async (
    orderId: string,
    status: string,
    courierName?: string,
    trackingNumber?: string
  ) => {
    if (!token) return;
    await updateOrderStatusMutation.mutateAsync({
      token,
      orderId,
      payload: { status, courierName, trackingNumber },
    });
    // Keep local modal in sync
    if (selectedOrder && selectedOrder.orderId === orderId) {
      setSelectedOrder((prev: any) => ({
        ...prev,
        status,
        courierName: courierName ?? prev.courierName,
        trackingNumber: trackingNumber ?? prev.trackingNumber,
      }));
    }
  };

  const handleUpdatePaymentStatus = async (
    orderId: string,
    paymentStatus: "paid" | "rejected"
  ) => {
    if (!token) return;
    await updateOrderPaymentMutation.mutateAsync({
      token,
      orderId,
      paymentStatus,
    });
    // Keep local modal in sync
    if (selectedOrder && selectedOrder.orderId === orderId) {
      setSelectedOrder((prev: any) => ({
        ...prev,
        paymentStatus,
      }));
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (!token) return;
    deleteOrderMutation.mutate({ token, orderId });
  };

  // Product Handlers
  const handleSaveProduct = async (formData: ProductFormData) => {
    if (!token) return;
    if (editingProduct?.id) {
      await updateProductMutation.mutateAsync({
        token,
        id: editingProduct.id,
        payload: formData,
      });
    } else {
      await createProductMutation.mutateAsync({
        token,
        payload: formData,
      });
    }
  };

  const handleToggleProductActive = async (product: any) => {
    if (!token) return;
    const nextActive = product.isActive === false;
    await updateProductMutation.mutateAsync({
      token,
      id: product.id,
      payload: { isActive: nextActive },
    });
  };

  const handleAdjustStock = (productId: number, delta: number) => {
    if (!token) return;
    adjustStockMutation.mutate({ token, id: productId, delta });
  };

  const handleDeleteProduct = (productId: number) => {
    if (!token) return;
    deleteProductMutation.mutate({ token, id: productId });
  };

  const handleUploadProductImage = async (file: File) => {
    if (!token) throw new Error("Authentication required");
    return await uploadImageMutation.mutateAsync({ token, file });
  };

  // Review Handlers
  const handleUpdateReviewStatus = (id: string, status: string) => {
    if (!token) return;
    updateReviewStatusMutation.mutate({
      token,
      id,
      payload: { status },
    });
  };

  const handleDeleteReview = (id: string) => {
    if (!token) return;
    deleteReviewMutation.mutate({ token, id });
  };

  // Settings Handlers
  const handleSaveSettings = async (settingsData: StoreSettingsFormData) => {
    if (!token) return;
    await updateSettingsMutation.mutateAsync({ token, payload: settingsData });
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    if (!token) throw new Error("Authentication required");
    return await changePasswordMutation.mutateAsync({
      token,
      payload: { currentPassword, newPassword },
    });
  };

  if (loading) {
    return (
      <Layout title="Admin Portal — Hangu Branded Shoes">
        <div className="pt-36 pb-20 text-center">
          <div className="inline-block w-8 h-8 border-3 border-brand-gold border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-zinc-400 text-xs font-mono">Verifying secure admin authorization...</p>
        </div>
      </Layout>
    );
  }

  // If not authenticated, render login screen
  if (!token) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const orders = ordersQuery.data?.data || [];
  const products = productsQuery.data || [];
  const reviews = reviewsQuery.data?.data || [];
  const initialSettings = settingsQuery.data?.data;

  return (
    <>
      <AdminLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        adminUser={adminUser}
        onRefresh={handleRefreshAll}
        onLogout={handleLogout}
        isRefreshing={dashboardQuery.isFetching || ordersQuery.isFetching}
        counts={{
          orders: orders.length,
          products: products.length,
          reviews: reviews.length,
        }}
      >
        {/* Tab 1: Overview */}
        {activeTab === "dashboard" && (
          <DashboardOverview
            data={dashboardQuery.data}
            onNavigateTab={setActiveTab}
            onInspectOrder={(ord) => {
              setSelectedOrder(ord);
              setActiveTab("orders");
            }}
            onAdjustStock={handleAdjustStock}
          />
        )}

        {/* Tab 2: Orders */}
        {activeTab === "orders" && (
          <OrdersTab
            orders={orders}
            filterStatus={orderFilterStatus}
            onFilterChange={setOrderFilterStatus}
            paymentFilterStatus={orderPaymentFilter}
            onPaymentFilterChange={setOrderPaymentFilter}
            searchQuery={orderSearch}
            onSearchChange={setOrderSearch}
            onSelectOrder={setSelectedOrder}
            onUpdateStatus={(orderId, status) => handleUpdateOrderStatus(orderId, status)}
            onDeleteOrder={handleDeleteOrder}
            isLoading={ordersQuery.isLoading}
          />
        )}

        {/* Tab 3: Products */}
        {activeTab === "products" && (
          <ProductsTab
            products={products}
            searchQuery={productSearch}
            onSearchChange={setProductSearch}
            onAddProduct={() => {
              setEditingProduct(null);
              setProductModalOpen(true);
            }}
            onEditProduct={(p) => {
              setEditingProduct({
                id: p.id,
                name: p.name,
                cat: p.cat,
                price: p.price,
                old: p.old || p.price + 1000,
                img: p.img,
                tag: p.tag || "",
                stock: p.stock ?? p.stockCount ?? 20,
                desc: p.desc || "",
                brand: p.brand || "Hangu Branded Shoes",
                sizes: p.sizes || ["40", "41", "42", "43", "44"],
                isActive: p.isActive !== false,
              });
              setProductModalOpen(true);
            }}
            onToggleActive={handleToggleProductActive}
            onDeleteProduct={handleDeleteProduct}
            onAdjustStock={handleAdjustStock}
            isLoading={productsQuery.isLoading}
          />
        )}

        {/* Tab 4: Reviews */}
        {activeTab === "reviews" && (
          <ReviewsTab
            reviews={reviews}
            onUpdateStatus={handleUpdateReviewStatus}
            onDeleteReview={handleDeleteReview}
            isLoading={reviewsQuery.isLoading}
          />
        )}

        {/* Tab 5: Store Settings */}
        {activeTab === "settings" && (
          <SettingsTab
            initialSettings={initialSettings}
            onSaveSettings={handleSaveSettings}
            onChangePassword={handleChangePassword}
            isLoading={settingsQuery.isLoading}
          />
        )}
      </AdminLayout>

      {/* Inspect Order Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateOrderStatus}
          onUpdatePaymentStatus={handleUpdatePaymentStatus}
          onDeleteOrder={handleDeleteOrder}
        />
      )}

      {/* Add / Edit Product Modal with Cloudinary Upload */}
      {productModalOpen && (
        <ProductModal
          isOpen={productModalOpen}
          initialData={editingProduct}
          onClose={() => {
            setProductModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
          onUploadImage={handleUploadProductImage}
        />
      )}
    </>
  );
}
