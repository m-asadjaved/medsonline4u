import "./globals.css";
import NextTopLoader from "nextjs-toploader";

export const metadata = {
  title: "Login",
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className="dark">
        <NextTopLoader showSpinner={false} color="lab(56 -45.31 16.82)" />
        <div className="flex justify-center items-center h-screen">
        {children}
        </div>
      </body>
    </html>
  );
}
