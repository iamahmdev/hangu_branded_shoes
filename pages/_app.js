import "../src/styles/globals.css";
import { CartProvider } from "../src/context/CartContext";
export default function App({ Component, pageProps }) { return <CartProvider><Component {...pageProps} /></CartProvider>; }
