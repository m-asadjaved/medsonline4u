import React from 'react'
import Link from 'next/link'

const Sidebar = () => {
    return (
        <>
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 shadow-lg fixed inset-y-0 left-0">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-2xl font-bold text-blue-600">Admin</h2>
                    <p className="text-sm text-gray-500">MedsOnline4u</p>
                </div>

                <nav className="p-4 space-y-2">
                    <Link
                        href="/admin"
                        className="block py-2 px-3 rounded hover:bg-slate-900 transition"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/products"
                        className="block py-2 px-3 rounded hover:bg-slate-900 transition"
                    >
                        Products
                    </Link>
                    <Link
                        href="/admin/orders"
                        className="block py-2 px-3 rounded hover:bg-slate-900 transition"
                    >
                        Orders
                    </Link>
                    <Link
                        href="/admin/customers"
                        className="block py-2 px-3 rounded hover:bg-slate-900 transition"
                    >
                        Customers
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="block py-2 px-3 rounded hover:bg-slate-900 transition"
                    >
                        Settings
                    </Link>
                </nav>
            </aside>
        </>
    )
}

export default Sidebar
