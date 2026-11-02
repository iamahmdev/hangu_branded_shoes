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
      <div className="bnav-container">
        {/* Home */}
        <Link href="/" className={`bnav-item ${isHome ? "active" : ""}`}>
          <div className="bnav-icon-wrap">
            <Home size={20} />
          </div>
          <span className="bnav-label">Home</span>
        </Link>

        {/* Shop */}
        <Link href="/shop" className={`bnav-item ${isShop ? "active" : ""}`}>
          <div className="bnav-icon-wrap">
            <ShoppingBag size={20} />
          </div>
          <span className="bnav-label">Shop</span>
        </Link>

        {/* Search */}
        <button
          type="button"
          onClick={openSearch}
          className="bnav-item"
          aria-label="Search shoes"
        >
          <div className="bnav-icon-wrap">
            <Search size={20} />
          </div>
          <span className="bnav-label">Search</span>
        </button>

        {/* Cart */}
        <Link href="/cart" className={`bnav-item ${isCart ? "active" : ""}`}>
          <div className="bnav-icon-wrap">
            <ShoppingCart size={20} />
            {count > 0 && <span className="bnav-badge">{count}</span>}
          </div>
          <span className="bnav-label">Cart</span>
        </Link>

        {/* WhatsApp */}
        <a
          href={wa("Assalam-o-Alaikum! I want to order shoes on WhatsApp.")}
          target="_blank"
          rel="noopener noreferrer"
          className="bnav-item bnav-wa"
          aria-label="Direct WhatsApp Order"
        >
          <div className="bnav-icon-wrap bnav-wa-pulse">
            <WhatsAppIcon size={20} color="#25d366" />
          </div>
          <span className="bnav-label" style={{ color: "#25d366" }}>WhatsApp</span>
        </a>
      </div>
    </nav>
  );
}
