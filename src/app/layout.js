import Navbar from "./_components/Navbar";
import "./globals.css";
import Footer from "./_components/Footer";
import NextTopLoader from "nextjs-toploader";
import { CartProvider } from "@/context/CartContext";
import Script from "next/script";

export const metadata = {
  title: "MedsOnline4u",
  description: "Discover most trending products here!",
  keywords: "ecommerce",
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KRN5D84095"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KRN5D84095');
          `}
        </Script>
      </head>
      <body>
        <NextTopLoader showSpinner={false} color="lab(56 -45.31 16.82)" />
        <main className="min-h-screen bg-slate-50 text-slate-900 antialiased">
          <Navbar />
          <CartProvider>{children}</CartProvider>
          <Footer />
        </main>
      </body>
    </html>
  );
}
