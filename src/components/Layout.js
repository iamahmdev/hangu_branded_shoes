import Head from "next/head";
import Loader from "./Loader";
import Cursor from "./Cursor";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import BottomNav from "./BottomNav";
import QuickOrderModal from "./QuickOrderModal";
import QuickSearchModal from "./QuickSearchModal";
import RecentSalesToast from "./RecentSalesToast";

export default function Layout({ children, title = "Hangu Branded Shoes" }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>
      <Loader />
      <Cursor />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
      <BottomNav />
      <QuickOrderModal />
      <QuickSearchModal />
      <RecentSalesToast />
    </>
  );
}
