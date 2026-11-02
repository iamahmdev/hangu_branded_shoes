import type { AppProps } from "next/app";
import "../src/styles/globals.css";
import { CartProvider } from "../src/context/CartContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}
