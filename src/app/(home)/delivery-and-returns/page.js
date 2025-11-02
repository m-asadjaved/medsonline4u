// app/delivery/page.jsx
import Link from "next/link";

export default function DeliveryAndReturnsPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      {/* HERO */}
      <section className="bg-linear-to-r from-emerald-600 to-emerald-500 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                Fast Turnaround & Returns Policy
              </h1>
              <p className="mt-4 text-emerald-100/90 max-w-2xl">
                We ship via registered airmail using reputable couriers.
                Get real-time tracking and reliable doorstep delivery
                — every time.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="inline-block px-5 py-3 rounded-md bg-white text-emerald-700 font-semibold shadow"
                >
                  Shop Medicines
                </Link>
                <Link
                  href="/contact"
                  className="inline-block px-5 py-3 rounded-md border border-white/30 text-white font-medium"
                >
                  Contact Support
                </Link>
              </div>
            </div>

            <div className="order-first lg:order-last">
              <div className="bg-white/10 rounded-2xl p-6 shadow-inner">
                <div className="space-y-2">
                  <div className="text-sm">Need assistance?</div>
                  <h3 className="text-xl font-semibold">+1 (909) 407-7730</h3>
                  <p className="text-sm text-emerald-50/90">
                    Call us for delivery updates or refund assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Main Details */}
          <article className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Delivery Information
            </h2>

            <p className="mt-4 text-slate-700 leading-relaxed">
              At Meds Online 4U, we take pride in our fast and reliable
              delivery service. All orders are shipped via registered airmail.
              Please provide a valid billing and shipping address to ensure
              smooth delivery.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900">
              Total delivery time depends on:
            </h3>
            <ul className="list-disc ml-6 mt-3 text-slate-700 space-y-1">
              <li>Payment authorization</li>
              <li>Order processing and verification</li>
              <li>Carrier transit time</li>
            </ul>
            <p className="mt-3 text-slate-700">
              Once shipped, you’ll receive a confirmation email with your
              tracking number — that’s when your official shipping time starts.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900">
              Fast Delivery Options
            </h3>
            <p className="mt-2 text-slate-700">
              We offer both express and standard delivery worldwide.
              Shipping times can vary depending on customs, local
              regulations, or external delays.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left">
                    <th className="py-2 px-3 bg-slate-100 text-slate-700 rounded-tl-lg">
                      Shipping Type
                    </th>
                    <th className="py-2 px-3 bg-slate-100 text-slate-700">
                      Fee
                    </th>
                    <th className="py-2 px-3 bg-slate-100 text-slate-700 rounded-tr-lg">
                      Estimated Delivery Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="py-3 px-3 text-slate-700">
                      Standard International Shipping
                    </td>
                    <td className="py-3 px-3 text-slate-700">$40</td>
                    <td className="py-3 px-3 text-slate-700">
                      5–7 business days (after fulfillment)
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-3 px-3 text-slate-700">
                      Express Shipping
                    </td>
                    <td className="py-3 px-3 text-slate-700">$70</td>
                    <td className="py-3 px-3 text-slate-700">
                      5–7 business days after fulfillment
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="mt-6 text-lg font-semibold text-slate-900">
              Important Notes
            </h3>
            <ul className="mt-3 list-disc ml-6 text-slate-700 space-y-1">
              <li>
                Delivery timelines start once you receive your shipping
                confirmation email.
              </li>
              <li>
                Delays may occur due to customs, holidays, or local health
                restrictions.
              </li>
              <li>
                You’ll get a tracking number to monitor your order in real time.
              </li>
            </ul>

            <hr className="my-6 border-slate-100" />

            <h2 className="text-2xl font-bold text-slate-900">
              Returns & Refunds
            </h2>
            <p className="mt-3 text-slate-700 leading-relaxed">
              Due to federal and local laws, we cannot accept returns of
              medications once shipped. This ensures product safety and
              authenticity.
            </p>
            <p className="mt-3 text-slate-700">
              If you receive a damaged or incorrect item, contact our support
              team at{" "}
              <a
                href="mailto:support@medsonline4u.com"
                className="text-emerald-600 font-medium"
              >
                support@medsonline4u.com
              </a>{" "}
              within 7 days of delivery.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900">
              Refunds
            </h3>
            <p className="mt-2 text-slate-700">
              Refunds are processed after claim verification. Timelines may vary
              depending on your bank or payment provider.
            </p>

            <hr className="my-6 border-slate-100" />

            <h2 className="text-2xl font-bold text-slate-900">
              Bank Wire Payments & Ownership
            </h2>
            <p className="mt-3 text-slate-700 leading-relaxed">
              All products remain the property of Meds Online 4U until full
              payment is received. By choosing bank wire payment, you agree to
              these terms.
            </p>
          </article>

          {/* RIGHT: Contact Sidebar */}
          <aside className="bg-white rounded-2xl p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-slate-900">
              Need help with your order?
            </h4>
            <p className="mt-2 text-sm text-slate-700">
              Call our support line or use our contact form below.
            </p>

            <div className="mt-4 space-y-3">
              <a
                href="tel:+19094077730"
                className="block w-full text-center px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold"
              >
                +1 (909) 407-7730
              </a>
              <Link
                href="/contact"
                className="block w-full text-center px-4 py-2 rounded-lg border border-emerald-600 text-emerald-600"
              >
                Contact Form
              </Link>
            </div>

            <div className="mt-6 border-t pt-4 text-xs text-slate-500">
              <div>
                Estimated delivery:{" "}
                <strong className="text-slate-700">5–12 working days</strong>
              </div>
              <div className="mt-2">
                Carrier:{" "}
                <strong className="text-slate-700">
                  USPS / Registered Airmail
                </strong>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
