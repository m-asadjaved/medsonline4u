import Navbar from "./_components/Navbar";
import "./globals.css";
import Footer from "./_components/Footer";
import NextTopLoader from "nextjs-toploader";
import { CartProvider } from "@/context/CartContext";

export const metadata = {
  title: "Ecommerce",
  description:
    "Discover most trending products here!",
  keywords: "ecommerce",
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
      <NextTopLoader showSpinner={false} color="lab(56 -45.31 16.82)" />
      <main className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Navbar />
        <CartProvider>
          {children}
        </CartProvider>
        <Footer />
      </main>
      </body>
    </html>
  );
}
