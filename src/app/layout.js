import Navbar from "./_components/Navbar";
import "./globals.css";
import Footer from "./_components/Footer";
import NextTopLoader from "nextjs-toploader";

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
      <NextTopLoader showSpinner={false} />
      <main className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Navbar />
        {children}
        <Footer />
      </main>
      </body>
    </html>
  );
}
