import { ReactNode } from "react";
import Layout from "../Layout";
import AdminHeader from "./AdminHeader";
import AdminNav from "./AdminNav";
import { AdminTab, AdminUser } from "./types";

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  adminUser: AdminUser | null;
  onRefresh: () => void;
  onLogout: () => void;
  isRefreshing?: boolean;
  counts: {
    orders: number;
    products: number;
    coupons: number;
    inquiries: number;
    reviews: number;
    subscribers: number;
  };
}

export default function AdminLayout({
  children,
  activeTab,
  onTabChange,
  adminUser,
  onRefresh,
  onLogout,
  isRefreshing = false,
  counts,
}: AdminLayoutProps) {
  return (
    <Layout title={`Admin Portal — ${activeTab.toUpperCase()} | Hangu Branded Shoes`}>
      <div className="pt-28 pb-20 min-h-screen">
        <div className="wrap">
          {/* Header Bar */}
          <AdminHeader
            adminUser={adminUser}
            onRefresh={onRefresh}
            onLogout={onLogout}
            isRefreshing={isRefreshing}
          />

          {/* Navigation Pill Bar */}
          <AdminNav
            activeTab={activeTab}
            onTabChange={onTabChange}
            counts={counts}
          />

          {/* Tab Content Body */}
          <main>{children}</main>
        </div>
      </div>
    </Layout>
  );
}
