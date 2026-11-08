import Head from "next/head";
import { ReactNode } from "react";
import Loader from "./Loader";
import Cursor from "./Cursor";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import BottomNav from "./BottomNav";
import QuickOrderModal from "./QuickOrderModal";
import QuickSearchModal from "./QuickSearchModal";
import RecentSalesToast from "./RecentSalesToast";
import SEO, { SEOProps } from "./SEO";

interface LayoutProps extends SEOProps {
  children: ReactNode;
}

export default function Layout({
  children,
  title = "Hangu Branded Shoes",
  description,
  keywords,
  ogImage,
  ogType,
  canonical,
  product,
  noIndex,
}: LayoutProps) {
  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        ogImage={ogImage}
        ogType={ogType}
        canonical={canonical}
        product={product}
        noIndex={noIndex}
      />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </Head>
      <Loader />
      <Cursor />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
      <BottomNav />
      <QuickOrderModal />
      <QuickSearchModal />
      <RecentSalesToast />
    </>
  );
}
