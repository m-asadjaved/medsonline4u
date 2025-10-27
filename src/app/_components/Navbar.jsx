import React from 'react'
import Link from 'next/link'

const Navbar = () => {

  return (
    <>      
    {/* NAV */}
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-emerald-600 flex items-center justify-center text-white font-bold">M</div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold">MediKart</h1>
              <p className="text-xs text-slate-500">Trusted online pharmacy</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">Home</Link>
            <Link href="/shop" className="text-sm text-slate-600 hover:text-slate-900">Shop</Link>
            <Link href="/categories" className="text-sm text-slate-600 hover:text-slate-900">Categories</Link>
            <Link href="/how-it-works" className="text-sm text-slate-600 hover:text-slate-900">How it works</Link>
            <Link href="/contact" className="text-sm text-slate-600 hover:text-slate-900">Contact</Link>
          </nav>

          <div className="flex-1 mx-6 max-w-[20rem]">
            <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2 gap-3">
              <input aria-label="search" className="flex-1 bg-transparent outline-none text-sm" placeholder="Search medicines, brands or symptoms" />
              <button className="text-sm px-3 py-1 rounded-md bg-emerald-600 text-white font-medium">Search</button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:inline-block text-sm text-slate-600 hover:text-slate-800">Help</button>
            <button className="text-sm px-3 py-1 rounded-md border border-emerald-600 text-emerald-600">Sign in</button>
            <Link href="/cart" className="text-sm px-3 py-1 rounded-md bg-emerald-600 text-white">Cart</Link>
          </div>
        </div>
      </div>
    </header></>
  )
}

export default Navbar