import React from "react";
import FeaturedProducts from './_components/FeaturedProducts'

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
              <button className="px-5 py-3 rounded-md bg-emerald-600 text-white font-semibold shadow">Shop Medicines</button>
              <button className="px-5 py-3 rounded-md border border-slate-300 text-slate-700">Upload Prescription</button>
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
              <h3 className="text-lg font-semibold">Why choose MediKart?</h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Verified, genuine medicines</li>
                <li>• Fast, discreet delivery</li>
                <li>• Repeat orders & subscriptions</li>
              </ul>

              <div className="mt-2 w-full">
                <button className="w-full px-4 py-3 rounded-lg bg-emerald-600 text-white font-semibold">Shop Now</button>
              </div>

              <div className="w-full mt-3 grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
                <div>
                  <div className="font-semibold">99%</div>
                  <div className="mt-1">Authenticity</div>
                </div>
                <div>
                  <div className="font-semibold">2hr</div>
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

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 mt-12">
        <h3 className="text-xl font-semibold">Browse by category</h3>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {['Cold & Flu','Vitamins','Pain Relief','Digestive','Skin','Wellness'].map((c)=> (
            <div key={c} className="bg-white p-3 rounded-lg text-center shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-xl">💊</div>
              <div className="mt-2 text-sm font-medium">{c}</div>
            </div>
          ))}
        </div>
      </section>

      <FeaturedProducts />

      {/* BENEFITS / HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 mt-12">
        <h3 className="text-xl font-semibold">How it works</h3>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center">1</div>
            <h4 className="mt-4 font-medium">Search or upload</h4>
            <p className="text-sm text-slate-500 mt-2">Find medicines or upload a photo of your prescription.</p>
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

      {/* TESTIMONIALS + CTA */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 mt-12">
        <div className="bg-linear-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h3 className="text-2xl font-bold">Trusted by thousands across the country</h3>
            <p className="mt-3 text-slate-100/90">"Quick delivery and authentic medicines — saved me a trip to the pharmacy."</p>
            <div className="mt-4 flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.0.3&s=4" alt="user" className="h-12 w-12 rounded-full object-cover" />
              <div>
                <div className="text-sm font-medium">Ayesha</div>
                <div className="text-xs opacity-80">Verified customer</div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-80">
            <div className="bg-white rounded-xl p-4 text-slate-900">
              <h4 className="font-semibold">Start saving on your medicines</h4>
              <p className="text-xs text-slate-500 mt-2">Sign up for price alerts and repeat delivery discounts.</p>
              <div className="mt-4 flex gap-2">
                <input placeholder="Email address" className="flex-1 px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm" />
                <button className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </>
  );
}
