import Head from "next/head";
import Loader from "./Loader"; import Cursor from "./Cursor"; import Navbar from "./Navbar"; import Footer from "./Footer"; import WhatsAppButton from "./WhatsAppButton";
export default function Layout({ children, title = "Hangu_branded_shoes" }) {
  return (<>
    <Head><title>{title}</title><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
    <Loader /><Cursor /><Navbar />{children}<Footer /><WhatsAppButton />
  </>);
}
