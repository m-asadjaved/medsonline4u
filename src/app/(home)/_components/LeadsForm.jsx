"use client";

import React, { useState } from "react";

export default function LeadsForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!name.trim()) return setError("Please enter your name."), false;
    if (!email.trim() || !email.includes("@")) return setError("Please enter a valid email."), false;
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 7) return setError("Please enter a valid phone number."), false;
    setError("");
    return true;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/contact/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email }),
      });

      if (!res.ok) throw new Error("Failed to send");

      setSuccess(true);
      setName("");
      setPhone("");
      setEmail("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 mt-12">
      <div className="bg-linear-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
        {/* LEFT SIDE — VALUE PROP */}
        <div className="flex-1 space-y-5">
          <h3 className="text-3xl md:text-4xl font-extrabold leading-tight">
            Get <span className="text-emerald-100">exclusive discounts</span> and free delivery on your order
          </h3>
          <p className="text-emerald-50/90 max-w-md">
            Join thousands of customers who save time and money by ordering verified medicines online.  
            Stay updated with our offers, refill reminders, and expert health tips.
          </p>

          <ul className="space-y-2 text-emerald-50/90 text-sm">
            <li className="flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-100" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Free first delivery
            </li>
            <li className="flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-100" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Exclusive member-only offers
            </li>
            <li className="flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-100" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Verified genuine medicines
            </li>
          </ul>

          <div className="pt-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&q=80&auto=format&fit=crop"
                alt="Customer"
                className="h-10 w-10 rounded-full object-cover border-2 border-emerald-200"
              />
              <div>
                <p className="text-sm font-medium text-emerald-50">“Super fast delivery and great prices!”</p>
                <p className="text-xs text-emerald-100/80">— Ali, Verified customer</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — FORM */}
        <div className="w-full md:w-96">
          <div className="bg-white rounded-xl p-6 text-slate-900 shadow-lg">
            <h4 className="font-semibold text-lg">Join & Save Today</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Fill out your details and we’ll contact you shortly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
              />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 0000000"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
              />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
              />

              {error && <div className="text-sm text-red-600">{error}</div>}
              {success && <div className="text-sm text-emerald-700">Thanks — we’ll reach out soon!</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Send My Details"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
