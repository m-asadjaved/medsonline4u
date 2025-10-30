import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import Sidebar from "@/app/(admin)/_components/Sidebar";

export const metadata = {
    title: "Admin Dashboard"
};

export default function Layout({ children }) {
    return (
        <html lang="en">
            <head />
            <body>
                <NextTopLoader showSpinner={false} color="lab(56 -45.31 16.82)" />
                <div className="flex min-h-screen bg-gray-100">
                    <Sidebar />
                    {/* Content area */}
                    <main className="flex-1 ml-64 p-6">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
