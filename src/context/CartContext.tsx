import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { FREE, FEE } from "../data/config";
import { Product, CartItem, CartContextType } from "../types";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [quickProduct, setQuickProduct] = useState<Product | null>(null);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) setItems(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to storage", e);
    }
  }, [items]);

  const add = (p: Product, size: string, q: number = 1) => {
    setItems((prev) => {
      const k = `${p.id}-${size}`;
      const exists = prev.find((i) => i.k === k);
      if (exists) {
        return prev.map((i) => (i.k === k ? { ...i, q: i.q + q } : i));
      }
      return [
        ...prev,
        {
          k,
          id: p.id,
          name: p.name,
          img: p.img,
          price: p.price,
          size,
          q,
        },
      ];
    });
  };

  const setQ = (k: string, q: number) => {
    setItems((prev) =>
      q < 1
        ? prev.filter((i) => i.k !== k)
        : prev.map((i) => (i.k === k ? { ...i, q } : i))
    );
  };

  const clear = () => setItems([]);

  const sub = items.reduce((a, i) => a + i.price * i.q, 0);
  const ship = !sub || sub >= FREE ? 0 : FEE;

  const openQuickOrder = (p: Product) => setQuickProduct(p);
  const closeQuickOrder = () => setQuickProduct(null);
  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        add,
        setQ,
        clear,
        sub,
        ship,
        total: sub + ship,
        count: items.reduce((a, i) => a + i.q, 0),
        quickProduct,
        openQuickOrder,
        closeQuickOrder,
        searchOpen,
        setSearchOpen,
        openSearch,
        closeSearch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
