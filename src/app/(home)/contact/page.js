"use client";

import React, { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function validate() {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in your name, email and message.");
      return false;
    }

    // simple email sanity check without regex
    if (!email.includes("@") || (email.split("@")[1] || "").indexOf('.') === -1) {
      setError("Please enter a valid email address.");
      return false;
    }

    setError("");
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!res.ok) throw new Error((await res.text()) || "Failed to send message");

      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="my-6 max-w-3xl mx-auto p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-md">
      <h3 className="text-2xl font-bold text-slate-900">Contact us</h3>
      <p className="mt-1 text-sm text-slate-500">Questions? Partnerships? Send a message and we'll reply within 24 hours.</p>

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-slate-700 mb-2">Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-slate-700 mb-2">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </label>
        </div>

        <label className="flex flex-col">
          <span className="text-sm font-medium text-slate-700 mb-2">Subject</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief subject"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium text-slate-700 mb-2">Message</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            placeholder="Write your message..."
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm resize-none outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </label>

        {error && <div className="text-sm text-red-600">{error}</div>}
        {success && <div className="text-sm text-emerald-700">Thanks — your message was sent!</div>}

        <div className="flex items-center gap-3 mt-2">
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send message"}
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-2">We respect your privacy — your information will never be shared.</p>
      </form>
    </div>
  );
}
