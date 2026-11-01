import { createContext, useContext, useEffect, useState } from "react";
import { FREE, FEE } from "../data/config";
const C = createContext();
export const useCart = () => useContext(C);
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem("cart") || "[]")); } catch (e) {} }, []);
  useEffect(() => { try { localStorage.setItem("cart", JSON.stringify(items)); } catch (e) {} }, [items]);
  const add = (p, size, q = 1) => setItems((s) => { const k = p.id + "-" + size; return s.find((i) => i.k === k) ? s.map((i) => (i.k === k ? { ...i, q: i.q + q } : i)) : [...s, { k, id: p.id, name: p.name, img: p.img, price: p.price, size, q }]; });
  const setQ = (k, q) => setItems((s) => (q < 1 ? s.filter((i) => i.k !== k) : s.map((i) => (i.k === k ? { ...i, q } : i))));
  const clear = () => setItems([]);
  const sub = items.reduce((a, i) => a + i.price * i.q, 0), ship = !sub || sub >= FREE ? 0 : FEE;
  return <C.Provider value={{ items, add, setQ, clear, sub, ship, total: sub + ship, count: items.reduce((a, i) => a + i.q, 0) }}>{children}</C.Provider>;
}
