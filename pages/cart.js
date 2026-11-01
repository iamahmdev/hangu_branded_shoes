import Link from "next/link";
import Layout from "../src/components/Layout";
import { useCart } from "../src/context/CartContext";
export default function Cart() {
  const { items, setQ, sub, ship, total } = useCart();
  return (
    <Layout title="Cart — Hangu_branded_shoes"><div className="pg wrap">
      <div className="title"><small>YOUR CART</small><h2>Shopping Cart</h2></div>
      {!items.length ? <div style={{ textAlign: "center" }}><p style={{ color: "var(--mut)", marginBottom: 20 }}>Your cart is empty 🛒</p><Link className="btn" href="/shop">Start Shopping</Link></div> :
        <div className="two" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
          <div>{items.map((i) => (
            <div className="row glass" key={i.k}><img src={"/images/" + i.img} alt="" />
              <div className="g"><b>{i.name}</b><br /><small style={{ color: "var(--mut)" }}>Size {i.size}</small><div className="price" style={{ margin: 0 }}>Rs. {i.price.toLocaleString()}</div></div>
              <div className="qty"><button onClick={() => setQ(i.k, i.q - 1)}>−</button><b>{i.q}</b><button onClick={() => setQ(i.k, i.q + 1)}>+</button></div>
            </div>))}</div>
          <div className="sum glass"><h3>Order Summary</h3>
            <p>Subtotal<span>Rs. {sub.toLocaleString()}</span></p><p>Delivery<span>{ship ? "Rs. " + ship : "FREE"}</span></p>
            <p className="t">Total<span>Rs. {total.toLocaleString()}</span></p>
            <Link className="btn" style={{ width: "100%", textAlign: "center", marginTop: 10 }} href="/checkout">Checkout →</Link></div>
        </div>}
    </div></Layout>
  );
}
