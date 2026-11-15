import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";
import { wa } from "../data/config";
import { WhatsAppIcon } from "./WhatsAppButton";
import { Home, ShoppingBag, Search, ShoppingCart } from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const { count, openSearch } = useCart();

  const isHome = router.pathname === "/";
  const isShop = router.pathname === "/shop";
  const isCart = router.pathname === "/cart";

  return (
    <nav className="bnav-bar" aria-label="Mobile Navigation">
      <div className="bnav-container flex justify-around items-center max-w-lg mx-auto">
        {/* Home */}
        <Link href="/" className={`bnav-item ${isHome ? "active text-zinc-950" : "text-zinc-500 hover:text-zinc-950"}`}>
          <div className="bnav-icon-wrap relative flex items-center justify-center w-6 h-6">
            <Home size={20} strokeWidth={isHome ? 2.5 : 2} />
          </div>
          <span className="bnav-label text-[10px] font-semibold tracking-wide">Home</span>
        </Link>

        {/* Shop */}
        <Link href="/shop" className={`bnav-item ${isShop ? "active text-zinc-950" : "text-zinc-500 hover:text-zinc-950"}`}>
          <div className="bnav-icon-wrap relative flex items-center justify-center w-6 h-6">
            <ShoppingBag size={20} strokeWidth={isShop ? 2.5 : 2} />
          </div>
          <span className="bnav-label text-[10px] font-semibold tracking-wide">Shop</span>
        </Link>

        {/* Search */}
        <button
          type="button"
          onClick={openSearch}
          className="bnav-item text-zinc-500 hover:text-zinc-950"
          aria-label="Search shoes"
        >
          <div className="bnav-icon-wrap relative flex items-center justify-center w-6 h-6">
            <Search size={20} />
          </div>
          <span className="bnav-label text-[10px] font-semibold tracking-wide">Search</span>
        </button>

        {/* Cart */}
        <Link href="/cart" className={`bnav-item ${isCart ? "active text-zinc-950" : "text-zinc-500 hover:text-zinc-950"}`}>
          <div className="bnav-icon-wrap relative flex items-center justify-center w-6 h-6">
            <ShoppingCart size={20} strokeWidth={isCart ? 2.5 : 2} />
            {count > 0 && (
              <span className="bnav-badge">
                {count}
              </span>
            )}
          </div>
          <span className="bnav-label text-[10px] font-semibold tracking-wide">Cart</span>
        </Link>

        {/* WhatsApp */}
        <a
          href={wa("Hello! I want to order shoes on WhatsApp.")}
          target="_blank"
          rel="noopener noreferrer"
          className="bnav-item bnav-wa text-emerald-600 hover:text-emerald-700"
          aria-label="Direct WhatsApp Order"
        >
          <div className="bnav-icon-wrap bnav-wa-pulse relative flex items-center justify-center w-6 h-6">
            <WhatsAppIcon size={20} color="#059669" />
          </div>
          <span className="bnav-label text-[10px] font-bold tracking-wide text-emerald-700">WhatsApp</span>
        </a>
      </div>
    </nav>
  );
}
