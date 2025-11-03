import "./globals.css";
import Sidebar from "./_components/Sidebar"
import NextTopLoader from "nextjs-toploader";

export const metadata = {
  title: "Admin Dashboard",
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className="dark">
        <NextTopLoader showSpinner={false} color="RGB(139,148,165)" />
        <Sidebar>
        {children}
        </Sidebar>
      </body>
    </html>
  );
}
