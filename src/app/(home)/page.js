import React from "react";
import FeaturedProducts from '@/app/(home)/_components/FeaturedProducts'
import Categories from '@/app/(home)/_components/Categories'
import Link from "next/link";
import LeadsForm from "@/app/(home)/_components/LeadsForm";

export default function Home() {

  return (
    <>
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">Fast delivery • Verified medicines</span>
            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">Medicines delivered to your door — safe, fast, and affordable</h2>
            <p className="mt-4 text-slate-600 max-w-xl">Order prescription and OTC medicines online with verified pharmacists, easy refills, and discreet packaging. Same-day delivery in many cities.</p>

            <div className="mt-6 flex gap-3 flex-wrap">
              <Link href="/shop" className="px-5 py-3 rounded-md bg-emerald-600 text-white font-semibold shadow">Shop Medicines</Link>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"/></svg>
                <span>Verified pharmacists</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18"/></svg>
                <span>Easy refills</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"/></svg>
                <span>Fast delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                <span>Secure payments</span>
              </div>
            </div>
          </div>

          <div className="order-first lg:order-last">
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-start gap-4">
              <h3 className="text-lg font-semibold">Why choose MedsOnline4u?</h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Verified, genuine medicines</li>
                <li>• Fast, discreet delivery</li>
                <li>• Repeat orders & subscriptions</li>
              </ul>

              <div className="mt-2 w-full">
                <Link href="/shop"><button className="w-full px-4 py-3 rounded-lg bg-emerald-600 text-white font-semibold cursor-pointer">Shop Now</button></Link>
              </div>

              <div className="w-full mt-3 grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
                <div>
                  <div className="font-semibold">99%</div>
                  <div className="mt-1">Authenticity</div>
                </div>
                <div>
                  <div className="font-semibold">24hr</div>
                  <div className="mt-1">Fast delivery*</div>
                </div>
                <div>
                  <div className="font-semibold">24/7</div>
                  <div className="mt-1">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Categories />

      <FeaturedProducts />

      {/* BENEFITS / HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 mt-12">
        <h3 className="text-xl font-semibold">How it works</h3>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center">1</div>
            <h4 className="mt-4 font-medium">Search or upload</h4>
            <p className="text-sm text-slate-500 mt-2">Find medicines or upload a photo of your medication.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center">2</div>
            <h4 className="mt-4 font-medium">Verified by pharmacist</h4>
            <p className="text-sm text-slate-500 mt-2">Our partnered pharmacists check dosage and interactions.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center">3</div>
            <h4 className="mt-4 font-medium">Delivered fast</h4>
            <p className="text-sm text-slate-500 mt-2">Discreet packaging and contactless delivery options.</p>
          </div>
        </div>
      </section>

      <LeadsForm />
      </>
  );
}
