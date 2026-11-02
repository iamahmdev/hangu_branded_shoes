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
        <Link href="/" className={`bnav-item ${isHome ? "active text-brand-red" : "text-zinc-400 hover:text-white"}`}>
          <div className="bnav-icon-wrap relative flex items-center justify-center w-6 h-6">
            <Home size={20} />
          </div>
          <span className="bnav-label text-[11px] font-medium tracking-wide">Home</span>
        </Link>

        {/* Shop */}
        <Link href="/shop" className={`bnav-item ${isShop ? "active text-brand-red" : "text-zinc-400 hover:text-white"}`}>
          <div className="bnav-icon-wrap relative flex items-center justify-center w-6 h-6">
            <ShoppingBag size={20} />
          </div>
          <span className="bnav-label text-[11px] font-medium tracking-wide">Shop</span>
        </Link>

        {/* Search */}
        <button
          type="button"
          onClick={openSearch}
          className="bnav-item text-zinc-400 hover:text-white"
          aria-label="Search shoes"
        >
          <div className="bnav-icon-wrap relative flex items-center justify-center w-6 h-6">
            <Search size={20} />
          </div>
          <span className="bnav-label text-[11px] font-medium tracking-wide">Search</span>
        </button>

        {/* Cart */}
        <Link href="/cart" className={`bnav-item ${isCart ? "active text-brand-red" : "text-zinc-400 hover:text-white"}`}>
          <div className="bnav-icon-wrap relative flex items-center justify-center w-6 h-6">
            <ShoppingCart size={20} />
            {count > 0 && (
              <span className="bnav-badge absolute -top-1.5 -right-2.5 bg-brand-red text-white text-[10px] font-bold min-w-[17px] h-[17px] leading-[17px] text-center rounded-full px-1 shadow-glow">
                {count}
              </span>
            )}
          </div>
          <span className="bnav-label text-[11px] font-medium tracking-wide">Cart</span>
        </Link>

        {/* WhatsApp */}
        <a
          href={wa("Assalam-o-Alaikum! I want to order shoes on WhatsApp.")}
          target="_blank"
          rel="noopener noreferrer"
          className="bnav-item bnav-wa text-[#25d366]"
          aria-label="Direct WhatsApp Order"
        >
          <div className="bnav-icon-wrap bnav-wa-pulse relative flex items-center justify-center w-6 h-6">
            <WhatsAppIcon size={20} color="#25d366" />
          </div>
          <span className="bnav-label text-[11px] font-medium tracking-wide text-[#25d366]">WhatsApp</span>
        </a>
      </div>
    </nav>
  );
}
