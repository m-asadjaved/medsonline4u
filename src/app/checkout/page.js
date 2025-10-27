"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
    shippingMethod: "standard",
    paymentMethod: "card",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  });
  const [step, setStep] = useState(1);

  // Fetch product data based on IDs in localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (storedCart.length === 0) return;

    fetch("/api/products/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: storedCart }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Merge server product info with local qty
        const merged = data.map((product) => {
          const match = storedCart.find((it) => it.id === product.id);
          return { ...product, qty: match?.qty || 1 };
        });
        setCartItems(merged);
      })
      .catch((err) => console.error("Fetch cart products error:", err));
  }, []);

  const subtotal = useMemo(
    () => cartItems.reduce((s, it) => s + it.price * it.qty, 0),
    [cartItems]
  );
  const shippingCost = form.shippingMethod === "standard" ? 49 : 149;
  const total = subtotal + shippingCost;

  function updateField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  function placeOrder() {
    alert("Order placed! (demo)");
    setStep(3);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold">Checkout</h1>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              {/* Step Indicators */}
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div
                  className={`px-3 py-2 rounded ${
                    step === 1 ? "bg-emerald-600 text-white" : "bg-slate-100"
                  }`}
                >
                  1
                </div>
                <div>Address</div>
              </div>

              {/* STEP 1: ADDRESS */}
              {step === 1 && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Full name"
                    className="px-3 py-2 rounded-md border"
                  />
                  <input
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="Phone"
                    className="px-3 py-2 rounded-md border"
                  />
                  <input
                    value={form.address1}
                    onChange={(e) => updateField("address1", e.target.value)}
                    placeholder="Address line 1"
                    className="md:col-span-2 px-3 py-2 rounded-md border"
                  />
                  <input
                    value={form.address2}
                    onChange={(e) => updateField("address2", e.target.value)}
                    placeholder="Address line 2"
                    className="md:col-span-2 px-3 py-2 rounded-md border"
                  />
                  <input
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="City"
                    className="px-3 py-2 rounded-md border"
                  />
                  <input
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    placeholder="State"
                    className="px-3 py-2 rounded-md border"
                  />
                  <input
                    value={form.pincode}
                    onChange={(e) => updateField("pincode", e.target.value)}
                    placeholder="Pincode"
                    className="px-3 py-2 rounded-md border"
                  />

                  <div className="md:col-span-2 mt-2">
                    <div className="text-sm font-medium">Shipping method</div>
                    <div className="mt-2 flex gap-2">
                      <label
                        className={`flex-1 p-3 border rounded-md ${
                          form.shippingMethod === "standard"
                            ? "ring-2 ring-emerald-500"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="ship"
                          checked={form.shippingMethod === "standard"}
                          onChange={() =>
                            updateField("shippingMethod", "standard")
                          }
                        />{" "}
                        <span className="ml-2">
                          Standard (1-3 days) - ₹49
                        </span>
                      </label>
                      <label
                        className={`flex-1 p-3 border rounded-md ${
                          form.shippingMethod === "express"
                            ? "ring-2 ring-emerald-500"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="ship"
                          checked={form.shippingMethod === "express"}
                          onChange={() =>
                            updateField("shippingMethod", "express")
                          }
                        />{" "}
                        <span className="ml-2">
                          Express (same day) - ₹149
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex items-center justify-end gap-2 mt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="px-4 py-2 rounded-md bg-emerald-600 text-white"
                    >
                      Continue to payment
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 & 3 remain the same as your current code */}
            </div>
          </section>

          {/* SIDEBAR: Order Summary */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="font-semibold">Order summary</h3>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                {cartItems.length === 0 ? (
                  <div className="text-center text-slate-400 py-4">
                    Loading cart...
                  </div>
                ) : (
                  cartItems.map((it) => (
                    <div key={it.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image
                          src={it.image_url}
                          className="h-10 w-10 object-cover rounded-md"
                          width={40}
                          height={40}
                          alt={it.name}
                        ></Image>
                        <div>
                          <div className="text-sm">{it.name}</div>
                          <div className="text-xs text-slate-500">
                            Qty {it.qty}
                          </div>
                        </div>
                      </div>
                      <div className="font-medium">₹{it.price * it.qty}</div>
                    </div>
                  ))
                )}

                <div className="border-t pt-3 flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shippingCost}</span>
                </div>
                <div className="border-t pt-3 font-semibold flex justify-between">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-6 text-sm text-slate-600">
          By placing your order you agree to our Terms & Privacy.
        </div>
      </div>
    </main>
  );
}
