import { useState, useEffect, FormEvent } from "react";
import Layout from "../src/components/Layout";
import { api } from "../src/services/api";
import { wa } from "../src/data/config";
import { WhatsAppIcon } from "../src/components/WhatsAppButton";
import {
  useAdminDashboard,
  useAdminOrders,
  useAdminUpdateOrderStatus,
  useAdminDeleteOrder,
  useProducts,
  useAdminCreateProduct,
  useAdminAdjustStock,
  useAdminDeleteProduct,
  useAdminCoupons,
  useAdminCreateCoupon,
  useAdminDeleteCoupon,
  useAdminInquiries,
  useAdminUpdateInquiryStatus,
  useAdminDeleteInquiry,
  useAdminReviews,
  useAdminUpdateReviewStatus,
  useAdminDeleteReview,
  useAdminSubscribers,
  useAdminDeleteSubscriber,
  useStoreSettings,
  useAdminUpdateSettings,
} from "../src/hooks/useApi";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  MessageSquare,
  Star,
  Users,
  Settings,
  LogOut,
  Plus,
  Search,
  Check,
  AlertTriangle,
  Truck,
  Eye,
  Trash2,
  RefreshCw,
  Copy,
} from "lucide-react";
import { resolveProductImage } from "../src/utils/image";

type AdminTab =
  | "dashboard"
  | "orders"
  | "products"
  | "coupons"
  | "inquiries"
  | "reviews"
  | "subscribers"
  | "settings";

export default function AdminPage() {
  const [token, setToken] = useState<string>("");
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  // Login form state
  const [loginForm, setLoginForm] = useState({ usernameOrEmail: "admin", password: "" });
  const [loginError, setLoginError] = useState<string>("");
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  // Filter states
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>("all");
  const [orderSearch, setOrderSearch] = useState<string>("");
  const [productSearch, setProductSearch] = useState<string>("");
  const [inquiryFilterStatus, setInquiryFilterStatus] = useState<string>("all");

  // Order modal states
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [courierInput, setCourierInput] = useState<string>("TCS Express");
  const [trackingCodeInput, setTrackingCodeInput] = useState<string>("");

  // Product modal
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    cat: "Sneakers",
    price: 6999,
    old: 8499,
    img: "p1.jpg",
    tag: "New",
    stockCount: 50,
    desc: "",
    brand: "Hangu Branded Shoes",
  });

  // Coupon modal
  const [showAddCouponModal, setShowAddCouponModal] = useState<boolean>(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "percentage",
    discountAmount: 10,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    freeShipping: false,
    usageLimit: 500,
    description: "",
  });

  // Settings state
  const [storeSettingsForm, setStoreSettingsForm] = useState<any>({
    shopName: "Hangu Branded Shoes",
    whatsappNumber: "923129876543",
    shippingFee: 250,
    freeShippingThreshold: 5000,
    announcementBar: "🔥 FREE NATIONWIDE DELIVERY ON ORDERS ABOVE RS. 5,000 | 7-DAY HASSLE-FREE SIZE EXCHANGE",
  });
  const [settingsSavedToast, setSettingsSavedToast] = useState<boolean>(false);

  // ----------------------------------------------------
  // TANSTACK QUERY HOOKS (Live Data)
  // ----------------------------------------------------
  const dashboardQuery = useAdminDashboard(token);
  const ordersQuery = useAdminOrders(token, {
    status: orderFilterStatus,
    search: orderSearch,
  });
  const productsQuery = useProducts({ search: productSearch });
  const couponsQuery = useAdminCoupons(token);
  const inquiriesQuery = useAdminInquiries(token, { status: inquiryFilterStatus });
  const reviewsQuery = useAdminReviews(token);
  const subscribersQuery = useAdminSubscribers(token);
  const settingsQuery = useStoreSettings();

  // ----------------------------------------------------
  // TANSTACK MUTATIONS (Auto Cache Invalidation)
  // ----------------------------------------------------
  const updateOrderStatusMutation = useAdminUpdateOrderStatus();
  const deleteOrderMutation = useAdminDeleteOrder();
  const createProductMutation = useAdminCreateProduct();
  const adjustStockMutation = useAdminAdjustStock();
  const deleteProductMutation = useAdminDeleteProduct();
  const createCouponMutation = useAdminCreateCoupon();
  const deleteCouponMutation = useAdminDeleteCoupon();
  const updateInquiryStatusMutation = useAdminUpdateInquiryStatus();
  const deleteInquiryMutation = useAdminDeleteInquiry();
  const updateReviewStatusMutation = useAdminUpdateReviewStatus();
  const deleteReviewMutation = useAdminDeleteReview();
  const deleteSubscriberMutation = useAdminDeleteSubscriber();
  const updateSettingsMutation = useAdminUpdateSettings();

  // Check existing token on mount
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

  useEffect(() => {
    if (settingsQuery.data?.data) {
      setStoreSettingsForm(settingsQuery.data.data);
    }
  }, [settingsQuery.data]);

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await api.adminLogin(loginForm.usernameOrEmail, loginForm.password);
      if (res.success && res.token) {
        setToken(res.token);
        setAdminUser(res.admin);
        localStorage.setItem("hbs_admin_token", res.token);
      } else {
        setLoginError(res.message || "Invalid credentials.");
      }
    } catch (err: any) {
      setLoginError(err?.message || "Connection failed.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setToken("");
    setAdminUser(null);
    localStorage.removeItem("hbs_admin_token");
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    status: string,
    courier?: string,
    tracking?: string
  ) => {
    if (!token) return;
    updateOrderStatusMutation.mutate(
      {
        token,
        orderId,
        payload: {
          status,
          courierName: courier,
          trackingNumber: tracking,
        },
      },
      {
        onSuccess: (res) => {
          if (selectedOrder && selectedOrder.orderId === orderId) {
            setSelectedOrder(res.data);
          }
        },
        onError: (err: any) => {
          alert(err?.message || "Status update failed.");
        },
      }
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    if (!confirm(`Are you sure you want to delete order ${orderId}?`)) return;
    deleteOrderMutation.mutate(
      { token, orderId },
      {
        onSuccess: () => setSelectedOrder(null),
      }
    );
  };

  const handleCreateProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    createProductMutation.mutate(
      { token, payload: newProduct },
      {
        onSuccess: () => {
          setShowAddProductModal(false);
          setNewProduct({
            name: "",
            cat: "Sneakers",
            price: 6999,
            old: 8499,
            img: "p1.jpg",
            tag: "New",
            stockCount: 50,
            desc: "",
            brand: "Hangu Branded Shoes",
          });
        },
        onError: (err: any) => alert(err?.message || "Could not create product."),
      }
    );
  };

  const handleCreateCoupon = (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    createCouponMutation.mutate(
      { token, payload: newCoupon },
      {
        onSuccess: () => {
          setShowAddCouponModal(false);
          setNewCoupon({
            code: "",
            discountType: "percentage",
            discountAmount: 10,
            minOrderAmount: 0,
            maxDiscountAmount: 0,
            freeShipping: false,
            usageLimit: 500,
            description: "",
          });
        },
        onError: (err: any) => alert(err?.message || "Failed to create coupon."),
      }
    );
  };

  const handleSaveSettings = (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    updateSettingsMutation.mutate(
      { token, payload: storeSettingsForm },
      {
        onSuccess: () => {
          setSettingsSavedToast(true);
          setTimeout(() => setSettingsSavedToast(false), 3000);
        },
        onError: () => alert("Failed to save settings"),
      }
    );
  };

  const handleCopySubscribersEmails = () => {
    const list = (subscribersQuery.data?.data || []).map((s: any) => s.email).join(", ");
    navigator.clipboard.writeText(list);
    alert(`Copied email addresses to clipboard!`);
  };

  if (loading) {
    return (
      <Layout title="Admin Portal — Hangu Branded Shoes">
        <div className="pt-36 pb-20 text-center">
          <p className="text-zinc-400">Verifying secure admin credentials...</p>
        </div>
      </Layout>
    );
  }

  // ----------------------------------------------------
  // LOGIN SCREEN
  // ----------------------------------------------------
  if (!token) {
    return (
      <Layout title="Admin Login — Hangu Branded Shoes">
        <div className="pt-32 pb-24 px-4 flex items-center justify-center min-h-[75vh]">
          <div className="glass p-8 md:p-10 rounded-3xl max-w-md w-full border border-white/15 bg-zinc-950/90 shadow-2xl">
            <div className="text-center mb-8">
              <span className="text-brand-red font-bold uppercase tracking-widest text-xs">
                MANAGEMENT SUITE
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
                Admin Authentication
              </h1>
              <p className="text-zinc-400 text-xs mt-2">
                Sign in to manage footwear orders, inventory, customer inquiries, and discount promo codes.
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-brand-red text-xs mb-4 text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Username or Email
                </label>
                <input
                  type="text"
                  required
                  value={loginForm.usernameOrEmail}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, usernameOrEmail: e.target.value })
                  }
                  placeholder="admin"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-gold"
                />
              </div>

              <div className="p-3 rounded-xl bg-white/5 text-[11px] text-zinc-400">
                💡 <b>Default Seeding Credentials:</b>
                <br />
                User: <span className="text-white font-mono">admin</span> | Pass:{" "}
                <span className="text-white font-mono">admin12345</span>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="btn w-full py-3 mt-2 font-bold tracking-wide text-sm disabled:opacity-50"
              >
                {loginLoading ? "Authenticating..." : "Sign In to Admin Portal"}
              </button>
            </form>
          </div>
        </div>
      </Layout>
    );
  }

  const dashboardData = dashboardQuery.data;
  const orders = ordersQuery.data?.data || [];
  const productsList = productsQuery.data || [];
  const coupons = couponsQuery.data?.data || [];
  const inquiries = inquiriesQuery.data?.data || [];
  const reviews = reviewsQuery.data?.data || [];
  const subscribers = subscribersQuery.data?.data || [];

  return (
    <Layout title="Admin Management — Hangu Branded Shoes">
      <div className="pt-28 pb-20">
        <div className="wrap">
          {/* Top Admin Header Bar */}
          <div className="glass p-4 md:p-6 rounded-3xl border border-white/10 flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold font-bold">
                👟
              </div>
              <div>
                <b className="text-white text-base md:text-lg block">
                  Hangu Shoes Operations Console
                </b>
                <span className="text-xs text-zinc-400">
                  Signed in as <span className="text-brand-gold font-mono">{adminUser?.username || "Admin"}</span> ({adminUser?.role || "Manager"})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  dashboardQuery.refetch();
                  ordersQuery.refetch();
                  productsQuery.refetch();
                }}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 text-xs flex items-center gap-1.5 border border-white/10"
                title="Refresh Live Data"
              >
                <RefreshCw size={14} className={dashboardQuery.isFetching ? "animate-spin" : ""} />
                <span className="hidden sm:inline">Refresh Data</span>
              </button>

              <button
                onClick={handleLogout}
                className="btn ghost py-2 px-3.5 text-xs inline-flex items-center gap-1.5 border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
            {[
              { id: "dashboard", label: "Overview", icon: LayoutDashboard },
              { id: "orders", label: `Orders (${orders.length})`, icon: ShoppingBag },
              { id: "products", label: `Shoes Catalog (${productsList.length})`, icon: Package },
              { id: "coupons", label: `Promo Codes (${coupons.length})`, icon: Tag },
              { id: "inquiries", label: `Inquiries (${inquiries.length})`, icon: MessageSquare },
              { id: "reviews", label: `Reviews (${reviews.length})`, icon: Star },
              { id: "subscribers", label: `VIP Subscribers (${subscribers.length})`, icon: Users },
              { id: "settings", label: "Store Settings", icon: Settings },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as AdminTab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-brand-red text-white shadow-lg"
                      : "glass text-zinc-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon size={15} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass p-5 rounded-3xl border border-white/10">
                  <span className="text-xs text-zinc-400 uppercase tracking-wider block">
                    Gross Revenue
                  </span>
                  <b className="text-xl md:text-2xl font-bold text-brand-gold mt-1 block font-mono">
                    Rs. {(dashboardData?.stats?.totalRevenue || 0).toLocaleString()}
                  </b>
                  <span className="text-[11px] text-zinc-500 mt-1 block">Excluding cancelled</span>
                </div>

                <div className="glass p-5 rounded-3xl border border-white/10">
                  <span className="text-xs text-zinc-400 uppercase tracking-wider block">
                    Total Orders
                  </span>
                  <b className="text-xl md:text-2xl font-bold text-white mt-1 block font-mono">
                    {dashboardData?.stats?.totalOrders || 0}
                  </b>
                  <span className="text-[11px] text-brand-gold mt-1 block">
                    {dashboardData?.stats?.pendingOrders || 0} pending dispatch
                  </span>
                </div>

                <div className="glass p-5 rounded-3xl border border-white/10">
                  <span className="text-xs text-zinc-400 uppercase tracking-wider block">
                    Delivered
                  </span>
                  <b className="text-xl md:text-2xl font-bold text-green-400 mt-1 block font-mono">
                    {dashboardData?.stats?.deliveredOrders || 0}
                  </b>
                  <span className="text-[11px] text-zinc-500 mt-1 block">Successfully fulfilled</span>
                </div>

                <div className="glass p-5 rounded-3xl border border-white/10">
                  <span className="text-xs text-zinc-400 uppercase tracking-wider block">
                    Low Stock Alert
                  </span>
                  <b className="text-xl md:text-2xl font-bold text-red-400 mt-1 block font-mono">
                    {dashboardData?.stats?.lowStockCount || 0} pairs
                  </b>
                  <span className="text-[11px] text-zinc-500 mt-1 block">Stock ≤ 10 units</span>
                </div>
              </div>

              {/* Low Stock Warning Section */}
              {dashboardData?.lowStockItems && dashboardData.lowStockItems.length > 0 && (
                <div className="glass p-6 rounded-3xl border border-yellow-500/20 bg-yellow-500/5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="text-yellow-400" size={18} />
                    <h3 className="text-sm font-bold text-white">Low Stock Warning</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {dashboardData.lowStockItems.map((item: any) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3"
                      >
                        <div>
                          <b className="text-xs text-white block">{item.name}</b>
                          <span className="text-[11px] text-red-400 font-mono">
                            Only {item.stockCount} left
                          </span>
                        </div>
                        <button
                          onClick={() => adjustStockMutation.mutate({ token, id: item.id, delta: 10 })}
                          className="btn ghost px-2.5 py-1 text-[11px]"
                          title="Add 10 units to stock"
                        >
                          +10 Stock
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Orders Overview */}
              <div className="glass p-6 rounded-3xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">Recent Customer Orders</h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs text-brand-gold hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-white/5 uppercase text-zinc-400 text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3 rounded-l-xl">Order ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">City</th>
                        <th className="p-3">Items</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 rounded-r-xl">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {dashboardData?.recentOrders?.map((ord: any) => (
                        <tr key={ord.orderId} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-mono font-bold text-white">{ord.orderId}</td>
                          <td className="p-3 text-white">{ord.customer.name}</td>
                          <td className="p-3 text-zinc-400">{ord.customer.city}</td>
                          <td className="p-3">{ord.items.length} pairs</td>
                          <td className="p-3 font-mono text-brand-gold font-bold">
                            Rs. {ord.totalAmount.toLocaleString()}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                ord.status === "delivered"
                                  ? "bg-green-500/20 text-green-400"
                                  : ord.status === "dispatched"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : ord.status === "cancelled"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-brand-gold/20 text-brand-gold"
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => {
                                setSelectedOrder(ord);
                                setActiveTab("orders");
                              }}
                              className="text-xs text-brand-gold hover:underline"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === "orders" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="glass p-4 rounded-3xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {[
                    "all",
                    "pending",
                    "confirmed",
                    "processing",
                    "dispatched",
                    "delivered",
                    "cancelled",
                  ].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilterStatus(st)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                        orderFilterStatus === st
                          ? "bg-white text-black"
                          : "bg-white/5 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-1.5 flex-1 max-w-xs">
                  <Search size={15} className="text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search by order ID, name, phone..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-white text-xs placeholder:text-zinc-500"
                  />
                </div>
              </div>

              {/* Orders Table */}
              <div className="glass p-6 rounded-3xl border border-white/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-white/5 uppercase text-zinc-400 text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3 rounded-l-xl">Order ID</th>
                        <th className="p-3">Customer & Phone</th>
                        <th className="p-3">Address & City</th>
                        <th className="p-3">Items</th>
                        <th className="p-3">Total Payable</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Courier</th>
                        <th className="p-3 rounded-r-xl">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.map((ord: any) => (
                        <tr key={ord.orderId} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-mono font-bold text-white">{ord.orderId}</td>
                          <td className="p-3">
                            <b className="text-white block">{ord.customer.name}</b>
                            <span className="text-zinc-500 font-mono">{ord.customer.phone}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-brand-gold font-semibold">{ord.customer.city}</span>
                            <p className="text-zinc-400 text-[11px] line-clamp-1 max-w-[180px]">
                              {ord.customer.address}
                            </p>
                          </td>
                          <td className="p-3">
                            <div className="flex -space-x-2">
                              {ord.items.map((it: any, i: number) => (
                                <img
                                  key={i}
                                  src={resolveProductImage(it.img)}
                                  alt={it.name}
                                  title={`${it.name} (${it.size}) x${it.quantity}`}
                                  className="w-7 h-7 rounded-full object-cover border border-white/20"
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-zinc-500 mt-1 block">
                              {ord.items.length} shoes
                            </span>
                          </td>
                          <td className="p-3 font-mono text-brand-gold font-bold">
                            Rs. {ord.totalAmount.toLocaleString()}
                          </td>
                          <td className="p-3">
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateOrderStatus(ord.orderId, e.target.value)}
                              className="bg-zinc-900 border border-white/10 text-white rounded-lg px-2 py-1 text-[11px] outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="dispatched">Dispatched</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-3 text-[11px]">
                            {ord.courierName ? (
                              <div>
                                <b className="text-white block">{ord.courierName}</b>
                                <span className="font-mono text-zinc-400">
                                  {ord.trackingNumber || "No CN"}
                                </span>
                              </div>
                            ) : (
                              <span className="text-zinc-500">—</span>
                            )}
                          </td>
                          <td className="p-3 flex items-center gap-2">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-brand-gold"
                              title="Inspect Details"
                            >
                              <Eye size={15} />
                            </button>
                            <a
                              href={wa(
                                `Assalam-o-Alaikum ${ord.customer.name}! Hangu Branded Shoes here regarding your Order ${ord.orderId}.`
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-[#25d366]/20 hover:bg-[#25d366]/30 text-[#25d366]"
                              title="Message on WhatsApp"
                            >
                              <WhatsAppIcon size={14} color="#25d366" />
                            </a>
                            <button
                              onClick={() => handleDeleteOrder(ord.orderId)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                              title="Delete Order"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!orders.length && (
                    <p className="text-center text-zinc-500 py-8">No orders found.</p>
                  )}
                </div>
              </div>

              {/* Order Detail Modal */}
              {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="glass p-6 md:p-8 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-zinc-950 border border-white/20">
                    <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
                      <div>
                        <span className="text-xs text-zinc-400 uppercase">Order Inspection</span>
                        <h2 className="text-2xl font-bold font-mono text-white mt-0.5">
                          {selectedOrder.orderId}
                        </h2>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs mb-6 p-4 rounded-2xl bg-white/5">
                      <div>
                        <span className="text-zinc-500 block">Customer Name</span>
                        <b className="text-white text-sm">{selectedOrder.customer.name}</b>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Phone / WhatsApp</span>
                        <b className="text-white font-mono">{selectedOrder.customer.phone}</b>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">City</span>
                        <b className="text-brand-gold">{selectedOrder.customer.city}</b>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Delivery Address</span>
                        <p className="text-zinc-300">{selectedOrder.customer.address}</p>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">
                      Footwear Items
                    </h4>
                    <div className="divide-y divide-white/10 mb-6">
                      {selectedOrder.items.map((it: any, i: number) => (
                        <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <img
                              src={resolveProductImage(it.img)}
                              alt={it.name}
                              className="w-12 h-12 rounded-xl object-cover bg-zinc-900"
                            />
                            <div>
                              <b className="text-white block">{it.name}</b>
                              <span className="text-zinc-400">
                                Size: {it.size} | Qty: {it.quantity}
                              </span>
                            </div>
                          </div>
                          <b className="text-brand-gold font-mono">
                            Rs. {it.total.toLocaleString()}
                          </b>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6">
                      <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Truck size={14} /> Dispatch & Courier Assignment
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="text-zinc-400 block mb-1">Courier Carrier</label>
                          <input
                            type="text"
                            placeholder="TCS / Leopards / PostEx"
                            value={courierInput}
                            onChange={(e) => setCourierInput(e.target.value)}
                            className="w-full bg-zinc-900 border border-white/15 rounded-xl p-2 text-white text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-zinc-400 block mb-1">Tracking Number / CN</label>
                          <input
                            type="text"
                            placeholder="e.g. 1782910291"
                            value={trackingCodeInput}
                            onChange={(e) => setTrackingCodeInput(e.target.value)}
                            className="w-full bg-zinc-900 border border-white/15 rounded-xl p-2 text-white text-xs outline-none font-mono"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleUpdateOrderStatus(
                            selectedOrder.orderId,
                            "dispatched",
                            courierInput,
                            trackingCodeInput
                          )
                        }
                        className="btn mt-3 py-1.5 px-4 text-xs"
                      >
                        Mark as Dispatched & Save Tracking
                      </button>
                    </div>

                    <div className="flex justify-end gap-3">
                      <a
                        href={wa(
                          `Assalam-o-Alaikum ${selectedOrder.customer.name}! Update on your Hangu Branded Shoes order ${selectedOrder.orderId}: Status is ${selectedOrder.status}.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn inline-flex items-center gap-1.5 text-xs"
                      >
                        <WhatsAppIcon size={14} color="#fff" />
                        <span>Chat Customer</span>
                      </a>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="btn ghost py-2 px-4 text-xs"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRODUCTS CATALOG MANAGEMENT */}
          {activeTab === "products" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="glass p-4 rounded-3xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-1.5 flex-1 max-w-sm">
                  <Search size={15} className="text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-white text-xs placeholder:text-zinc-500"
                  />
                </div>

                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="btn inline-flex items-center gap-1.5 py-2 px-4 text-xs"
                >
                  <Plus size={16} />
                  <span>Add New Shoe</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="glass p-6 rounded-3xl border border-white/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-white/5 uppercase text-zinc-400 text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3 rounded-l-xl">Shoe</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Selling Price</th>
                        <th className="p-3">Old Price</th>
                        <th className="p-3">Stock Units</th>
                        <th className="p-3">Stock Adjust</th>
                        <th className="p-3 rounded-r-xl">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {productsList.map((p: any) => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 flex items-center gap-3">
                            <img
                              src={resolveProductImage(p.img)}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover bg-zinc-900 border border-white/10"
                            />
                            <div>
                              <b className="text-white text-xs block">{p.name}</b>
                              {p.tag && (
                                <span className="text-[10px] text-brand-red font-bold uppercase">
                                  {p.tag}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-zinc-400">{p.cat}</td>
                          <td className="p-3 font-mono font-bold text-brand-gold">
                            Rs. {p.price.toLocaleString()}
                          </td>
                          <td className="p-3 font-mono text-zinc-500 line-through">
                            Rs. {p.old.toLocaleString()}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                (p.stockCount || 50) <= 10
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-green-500/20 text-green-400"
                              }`}
                            >
                              {p.stockCount !== undefined ? p.stockCount : 50} in stock
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="inline-flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
                              <button
                                onClick={() => adjustStockMutation.mutate({ token, id: p.id, delta: -1 })}
                                className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white"
                              >
                                −
                              </button>
                              <span className="px-1 text-[11px] font-mono text-white">
                                {p.stockCount || 50}
                              </span>
                              <button
                                onClick={() => adjustStockMutation.mutate({ token, id: p.id, delta: 5 })}
                                className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => {
                                if (confirm("Delete this shoe from catalog?")) {
                                  deleteProductMutation.mutate({ token, id: p.id });
                                }
                              }}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                              title="Delete Shoe"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Product Modal */}
              {showAddProductModal && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="glass p-6 md:p-8 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto bg-zinc-950 border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-4">Add New Footwear Pair</h3>
                    <form onSubmit={handleCreateProduct} className="flex flex-col gap-3 text-xs">
                      <div>
                        <label className="text-zinc-400 block mb-1">Shoe Name</label>
                        <input
                          type="text"
                          required
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          placeholder="e.g. Royal Oxford Brogue"
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-zinc-400 block mb-1">Category</label>
                          <select
                            value={newProduct.cat}
                            onChange={(e) => setNewProduct({ ...newProduct, cat: e.target.value })}
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2.5 text-white outline-none"
                          >
                            <option value="Sneakers">Sneakers</option>
                            <option value="Comfort">Comfort</option>
                            <option value="Formal">Formal</option>
                            <option value="Loafers">Loafers</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-zinc-400 block mb-1">Tag / Badge</label>
                          <input
                            type="text"
                            value={newProduct.tag}
                            onChange={(e) => setNewProduct({ ...newProduct, tag: e.target.value })}
                            placeholder="New / Hot / Sale"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-zinc-400 block mb-1">Selling Price (Rs.)</label>
                          <input
                            type="number"
                            required
                            value={newProduct.price}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, price: Number(e.target.value) })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-zinc-400 block mb-1">Original Price (Rs.)</label>
                          <input
                            type="number"
                            required
                            value={newProduct.old}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, old: Number(e.target.value) })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-zinc-400 block mb-1">Image File (/public/images/)</label>
                          <input
                            type="text"
                            required
                            value={newProduct.img}
                            onChange={(e) => setNewProduct({ ...newProduct, img: e.target.value })}
                            placeholder="p1.jpg or p2.jpg..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-zinc-400 block mb-1">Initial Stock Units</label>
                          <input
                            type="number"
                            required
                            value={newProduct.stockCount}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, stockCount: Number(e.target.value) })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-zinc-400 block mb-1">Product Description</label>
                        <textarea
                          rows={2}
                          value={newProduct.desc}
                          onChange={(e) => setNewProduct({ ...newProduct, desc: e.target.value })}
                          placeholder="Shoe craftsmanship notes..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-3 mt-4">
                        <button
                          type="button"
                          onClick={() => setShowAddProductModal(false)}
                          className="btn ghost py-2 px-4"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={createProductMutation.isPending}
                          className="btn py-2 px-4"
                        >
                          {createProductMutation.isPending ? "Saving..." : "Save Shoe to Catalog"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: COUPONS & DISCOUNTS */}
          {activeTab === "coupons" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="glass p-4 rounded-3xl border border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Active Promo Coupons</h3>
                  <p className="text-xs text-zinc-400">
                    Discount vouchers verified live during customer cart checkout.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddCouponModal(true)}
                  className="btn inline-flex items-center gap-1.5 py-2 px-4 text-xs"
                >
                  <Plus size={15} />
                  <span>Create Promo Code</span>
                </button>
              </div>

              <div className="glass p-6 rounded-3xl border border-white/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-white/5 uppercase text-zinc-400 text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3 rounded-l-xl">Code</th>
                        <th className="p-3">Discount</th>
                        <th className="p-3">Min Order</th>
                        <th className="p-3">Usage</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 rounded-r-xl">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {coupons.map((c: any) => (
                        <tr key={c._id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-mono font-bold text-brand-gold text-sm">
                            {c.code}
                          </td>
                          <td className="p-3">
                            {c.discountType === "percentage"
                              ? `${c.discountAmount}% OFF`
                              : `Rs. ${c.discountAmount} OFF`}
                            {c.freeShipping && " + Free Delivery"}
                          </td>
                          <td className="p-3 font-mono">
                            {c.minOrderAmount ? `Rs. ${c.minOrderAmount}` : "None"}
                          </td>
                          <td className="p-3 font-mono">
                            {c.usageCount} / {c.usageLimit || "∞"}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                c.isActive
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {c.isActive ? "Active" : "Disabled"}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => {
                                if (confirm("Delete this promo coupon?")) {
                                  deleteCouponMutation.mutate({ token, id: c._id });
                                }
                              }}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                              title="Delete Coupon"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Coupon Modal */}
              {showAddCouponModal && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="glass p-6 md:p-8 rounded-3xl max-w-md w-full bg-zinc-950 border border-white/20">
                    <h3 className="text-lg font-bold text-white mb-4">Create Promo Code</h3>
                    <form onSubmit={handleCreateCoupon} className="flex flex-col gap-3 text-xs">
                      <div>
                        <label className="text-zinc-400 block mb-1">Promo Code</label>
                        <input
                          type="text"
                          required
                          value={newCoupon.code}
                          onChange={(e) =>
                            setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })
                          }
                          placeholder="e.g. VIP20 or EID500"
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-zinc-400 block mb-1">Discount Type</label>
                          <select
                            value={newCoupon.discountType}
                            onChange={(e) =>
                              setNewCoupon({ ...newCoupon, discountType: e.target.value })
                            }
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2.5 text-white outline-none"
                          >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount (Rs.)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-zinc-400 block mb-1">Discount Value</label>
                          <input
                            type="number"
                            required
                            value={newCoupon.discountAmount}
                            onChange={(e) =>
                              setNewCoupon({ ...newCoupon, discountAmount: Number(e.target.value) })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-zinc-400 block mb-1">Min Order (Rs.)</label>
                          <input
                            type="number"
                            value={newCoupon.minOrderAmount}
                            onChange={(e) =>
                              setNewCoupon({ ...newCoupon, minOrderAmount: Number(e.target.value) })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-zinc-400 block mb-1">Usage Limit</label>
                          <input
                            type="number"
                            value={newCoupon.usageLimit}
                            onChange={(e) =>
                              setNewCoupon({ ...newCoupon, usageLimit: Number(e.target.value) })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="checkbox"
                          id="freeShipCheck"
                          checked={newCoupon.freeShipping}
                          onChange={(e) =>
                            setNewCoupon({ ...newCoupon, freeShipping: e.target.checked })
                          }
                          className="rounded"
                        />
                        <label htmlFor="freeShipCheck" className="text-zinc-300">
                          Grant Free Shipping with this coupon
                        </label>
                      </div>

                      <div className="flex justify-end gap-3 mt-4">
                        <button
                          type="button"
                          onClick={() => setShowAddCouponModal(false)}
                          className="btn ghost py-2 px-4"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={createCouponMutation.isPending}
                          className="btn py-2 px-4"
                        >
                          {createCouponMutation.isPending ? "Activating..." : "Activate Code"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: INQUIRIES & SIZE CONSULTATIONS */}
          {activeTab === "inquiries" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="glass p-6 rounded-3xl border border-white/10">
                <h3 className="text-base font-bold text-white mb-4">Customer Support Inquiries</h3>
                <div className="divide-y divide-white/5">
                  {inquiries.map((inq: any) => (
                    <div
                      key={inq._id}
                      className="py-4 flex flex-wrap items-start justify-between gap-4 text-xs"
                    >
                      <div className="flex-1 min-w-[280px]">
                        <div className="flex items-center gap-2 mb-1">
                          <b className="text-white text-sm">
                            {inq.firstName} {inq.lastName}
                          </b>
                          <span className="text-zinc-500">|</span>
                          <span className="text-zinc-400 font-mono">{inq.phone}</span>
                          {inq.city && <span className="text-brand-gold">({inq.city})</span>}
                        </div>
                        <span className="text-brand-red font-bold text-[11px] block mb-1">
                          Subject: {inq.subject}
                        </span>
                        <p className="text-zinc-300 bg-white/5 p-3 rounded-xl leading-relaxed mt-2">
                          "{inq.message}"
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <select
                          value={inq.status}
                          onChange={(e) =>
                            updateInquiryStatusMutation.mutate({
                              token,
                              id: inq._id,
                              payload: { status: e.target.value },
                            })
                          }
                          className="bg-zinc-900 border border-white/10 text-white rounded-lg px-2.5 py-1 text-xs outline-none"
                        >
                          <option value="new">New</option>
                          <option value="in-progress">In-Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>

                        <a
                          href={wa(
                            `Assalam-o-Alaikum ${inq.firstName}! Hangu Branded Shoes replying to your inquiry regarding ${inq.subject}.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn inline-flex items-center gap-1.5 py-1 px-3 text-[11px]"
                        >
                          <WhatsAppIcon size={14} color="#fff" />
                          <span>Reply WhatsApp</span>
                        </a>

                        <button
                          onClick={() => {
                            if (confirm("Delete this customer inquiry?")) {
                              deleteInquiryMutation.mutate({ token, id: inq._id });
                            }
                          }}
                          className="text-red-400 hover:underline text-[11px]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {!inquiries.length && (
                    <p className="text-center text-zinc-500 py-6">No inquiries recorded yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CUSTOMER REVIEWS MODERATION */}
          {activeTab === "reviews" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="glass p-6 rounded-3xl border border-white/10">
                <h3 className="text-base font-bold text-white mb-4">Customer Reviews Moderation</h3>
                <div className="divide-y divide-white/5">
                  {reviews.map((rev: any) => (
                    <div
                      key={rev._id}
                      className="py-4 flex flex-wrap items-start justify-between gap-4 text-xs"
                    >
                      <div className="flex-1 min-w-[280px]">
                        <div className="flex items-center gap-2 mb-1">
                          <b className="text-white text-sm">{rev.name}</b>
                          <span className="text-zinc-500">({rev.city || "Pakistan"})</span>
                          <span className="text-brand-gold font-bold">{"★".repeat(rev.rating)}</span>
                        </div>
                        <span className="text-zinc-400 text-xs block mb-1">
                          Shoe: <b className="text-white">{rev.shoeName}</b>
                        </span>
                        <p className="text-zinc-300 bg-white/5 p-3 rounded-xl leading-relaxed mt-2">
                          "{rev.comment}"
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            rev.status === "approved"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {rev.status}
                        </span>

                        <div className="flex gap-2">
                          {rev.status !== "approved" && (
                            <button
                              onClick={() =>
                                updateReviewStatusMutation.mutate({
                                  token,
                                  id: rev._id,
                                  payload: { status: "approved" },
                                })
                              }
                              className="btn py-1 px-2.5 text-[11px] bg-green-600 hover:bg-green-700"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm("Delete this review?")) {
                                deleteReviewMutation.mutate({ token, id: rev._id });
                              }
                            }}
                            className="btn ghost py-1 px-2.5 text-[11px] text-red-400"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!reviews.length && (
                    <p className="text-center text-zinc-500 py-6">No customer reviews yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: VIP SUBSCRIBERS */}
          {activeTab === "subscribers" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="glass p-4 rounded-3xl border border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">VIP Newsletter Subscribers</h3>
                  <p className="text-xs text-zinc-400">
                    Customers who opted-in for new footwear drops and private sales.
                  </p>
                </div>
                <button
                  onClick={handleCopySubscribersEmails}
                  className="btn inline-flex items-center gap-1.5 py-2 px-4 text-xs"
                >
                  <Copy size={14} />
                  <span>Copy All Emails</span>
                </button>
              </div>

              <div className="glass p-6 rounded-3xl border border-white/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-white/5 uppercase text-zinc-400 text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3 rounded-l-xl">Email Address</th>
                        <th className="p-3">Source</th>
                        <th className="p-3">Subscribed Date</th>
                        <th className="p-3 rounded-r-xl">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {subscribers.map((sub: any) => (
                        <tr key={sub._id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-mono font-bold text-white">{sub.email}</td>
                          <td className="p-3 text-zinc-400">{sub.source || "Website Footer"}</td>
                          <td className="p-3 text-zinc-500">
                            {new Date(sub.subscribedAt || sub.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => {
                                if (confirm("Remove this subscriber?")) {
                                  deleteSubscriberMutation.mutate({ token, id: sub._id });
                                }
                              }}
                              className="p-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: STORE SETTINGS */}
          {activeTab === "settings" && (
            <div className="flex flex-col gap-6 animate-fadeIn max-w-2xl">
              <div className="glass p-6 md:p-8 rounded-3xl border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">General Store Configuration</h3>

                {settingsSavedToast && (
                  <div className="p-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-xs mb-4 text-center font-bold">
                    ✅ Store settings saved successfully!
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="flex flex-col gap-4 text-xs">
                  <div>
                    <label className="text-zinc-400 block mb-1">Store / Brand Name</label>
                    <input
                      type="text"
                      value={storeSettingsForm.shopName || ""}
                      onChange={(e) =>
                        setStoreSettingsForm({ ...storeSettingsForm, shopName: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 block mb-1">Standard Delivery Fee (Rs.)</label>
                      <input
                        type="number"
                        value={storeSettingsForm.shippingFee || 250}
                        onChange={(e) =>
                          setStoreSettingsForm({
                            ...storeSettingsForm,
                            shippingFee: Number(e.target.value),
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-400 block mb-1">
                        Free Delivery Threshold (Rs.)
                      </label>
                      <input
                        type="number"
                        value={storeSettingsForm.freeShippingThreshold || 5000}
                        onChange={(e) =>
                          setStoreSettingsForm({
                            ...storeSettingsForm,
                            freeShippingThreshold: Number(e.target.value),
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">WhatsApp Concierge Number</label>
                    <input
                      type="text"
                      value={storeSettingsForm.whatsappNumber || ""}
                      onChange={(e) =>
                        setStoreSettingsForm({ ...storeSettingsForm, whatsappNumber: e.target.value })
                      }
                      placeholder="923129876543"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1">Top Announcement Marquee Banner</label>
                    <textarea
                      rows={2}
                      value={storeSettingsForm.announcementBar || ""}
                      onChange={(e) =>
                        setStoreSettingsForm({ ...storeSettingsForm, announcementBar: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updateSettingsMutation.isPending}
                    className="btn py-3 mt-2 font-bold text-sm disabled:opacity-50"
                  >
                    {updateSettingsMutation.isPending ? "Saving..." : "Save Store Settings"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
