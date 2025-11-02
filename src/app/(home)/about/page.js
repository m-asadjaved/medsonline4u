// app/about/page.jsx   (or pages/about.jsx)
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      {/* HERO */}
      <section className="bg-linear-to-r from-emerald-600 to-emerald-500 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                About <span className="text-emerald-100">Meds Online 4U</span>
              </h1>
              <p className="mt-4 text-emerald-100/90 max-w-2xl">
                A leading U.S.-based online pharmacy delivering verified, high-quality medicines at prices
                that beat the market. Order branded or generic medicines 24/7 — with flat-rate shipping and
                easy home delivery.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/shop" className="inline-block px-5 py-3 rounded-md bg-white text-emerald-700 font-semibold shadow">
                  Shop Medicines
                </Link>
                <Link href="/contact" className="inline-block px-5 py-3 rounded-md border border-white/30 text-white font-medium">
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="order-first lg:order-last">
              <div className="bg-white/10 rounded-2xl p-6 shadow-inner">
                <div className="space-y-3">
                  <div className="text-sm font-medium">Trusted & Secure</div>
                  <h3 className="text-xl font-semibold">Safe medicines • Verified suppliers</h3>
                  <p className="text-sm text-emerald-50/90">
                    Our inventory is checked and verified to meet the highest safety standards.
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                    <div>
                      <div className="text-lg font-bold">99%</div>
                      <div className="mt-1">Authenticity</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">5-12</div>
                      <div className="mt-1">Business days (USPS)</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">24/7</div>
                      <div className="mt-1">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main text */}
          <article className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">About Meds Online 4U</h2>

            <p className="mt-4 text-slate-700 leading-relaxed">
              Meds Online 4U is a leading U.S.-based online pharmacy store that provides high-quality medications
              across the United States at prices more competitive than the market. We offer top-quality drugs with
              savings of up to <strong>10% off</strong> across our product range.
            </p>

            <p className="mt-3 text-slate-700 leading-relaxed">
              Customers can order branded and generic medicines through our secure website 24 hours a day, 7 days a week.
              Whether you need medicines with or without a prescription, Meds Online 4U is committed to providing top-of-the-line
              medications and reliable service, with flat-rate shipping and convenient home delivery.
            </p>

            <hr className="my-6 border-slate-100" />

            <h3 className="text-lg font-semibold text-slate-900">Trusted Global Network</h3>
            <p className="mt-2 text-slate-700 leading-relaxed">
              We collaborate with a network of trusted, authentic, and reputable international pharmacy brands to ensure our
              customers always receive genuine medications at low prices. All products are checked and verified to meet safety standards.
            </p>

            <h3 className="text-lg font-semibold text-slate-900 mt-6">FDA Verification</h3>
            <p className="mt-2 text-slate-700 leading-relaxed">
              All the drugs sold by our pharmacy are thoroughly checked and verified by the U.S. Food and Drug Administration (FDA)
              to ensure customers get the safest possible medications when they choose our service.
            </p>

            <h3 className="text-lg font-semibold text-slate-900 mt-6">Secured Payments</h3>
            <p className="mt-2 text-slate-700 leading-relaxed">
              Our website is secured with an SSL certificate, ensuring all communication is encrypted and protected 24/7.
              We use a globally recognized and secure payment gateway that processes transactions using advanced encryption technology,
              protecting customers' payment information.
            </p>

            <h3 className="text-lg font-semibold text-slate-900 mt-6">Reliable USPS Delivery</h3>
            <p className="mt-2 text-slate-700 leading-relaxed">
              Shipping is handled via USPS across the United States. Estimated delivery time is <strong>5–12 working days</strong>.
              Delivery timelines may vary due to public holidays or external restrictions. Tracking numbers are provided for every order.
            </p>
          </article>

          {/* Sidebar / Quick facts */}
          <aside className="bg-white rounded-2xl p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-slate-900">Why choose us</h4>

            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-semibold">✓</span>
                <div>
                  <div className="font-medium">Verified suppliers</div>
                  <div className="text-xs text-slate-500">Genuine medicines only</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-semibold">🚚</span>
                <div>
                  <div className="font-medium">Fast delivery</div>
                  <div className="text-xs text-slate-500">USPS shipping & tracking</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-semibold">🔒</span>
                <div>
                  <div className="font-medium">Secure payments</div>
                  <div className="text-xs text-slate-500">Industry standard encryption</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-semibold">⭐</span>
                <div>
                  <div className="font-medium">Trusted by thousands</div>
                  <div className="text-xs text-slate-500">High customer satisfaction</div>
                </div>
              </li>
            </ul>

            <div className="mt-6">
              <Link href="/contact" className="block w-full text-center px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold">
                Contact Support
              </Link>
            </div>
          </aside>
        </div>
      </section>

    </main>
  );
}
