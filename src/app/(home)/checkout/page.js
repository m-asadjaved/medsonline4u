"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
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
    paymentMethod: "bank",
  });
  const [step, setStep] = useState(1);
  const requiredFields = [
    "fullName",
    "email",
    "phone",
    "address1",
    "city",
    "state",
    "pincode",
  ];

  // Fetch product data based on IDs in localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (storedCart.length === 0) {
      alert("Please add items to cart first.");
      router.push("/shop");
      return;
    }

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
    () => cartItems.reduce((s, it) => s + it.variation.price * it.quantity, 0),
    [cartItems]
  );
  const shippingCost = form.shippingMethod === "standard" ? 30 : 100;
  const total = subtotal + shippingCost;

  function updateField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function placeOrder() {
    if (!cartItems.length) {
      alert("Cart is empty");
      return;
    }

    // Validate required fields
    const missing = requiredFields.filter((f) => !form[f]?.trim());
    if (missing.length > 0) {
      alert(`Please fill in all required fields:\n${missing.join(", ")}`);
      return;
    }

    setLoading(true);

    const reqBody = {
      orderId: `ORD-${Date.now()}`,
      name: form.fullName,
      email: form.email,
      address: `${form.address1}, ${form.address2}`,
      phone: form.phone,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      shippingMethod:
        form.shippingMethod === "standard" ? "Standard" : "Express",
      total: total,
      items: cartItems.map((it) => ({
        name: it.name,
        variation: it.variation?.name || it.variation,
        qty: it.qty,
        total: it.qty * it.price,
      })),
    };

    // console.log("🚀 Sending Order:", reqBody);

    try {
      const res = await fetch(`/api/orders/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });

      const data = await res.json();

      gtag("event", "purchase", {
        transaction_id: `ORD-${Date.now()}`,    // REQUIRED
        value: total,                 // total order value
        shipping: shippingCost,
        currency: "USD",
        items: cartItems.map((it) => ({
          item_id: it.id,
          item_name: it.name,
          variation: it.variation?.name || it.variation,
          quantity: it.qty,
          price: it.qty * it.price,
        }))
      });
      
      // console.log("✅ Order API Response:", data);

      if (!res.ok) throw new Error(data.error || "Failed to submit order");

      // ✅ Clear cart after successful order
      cartItems.forEach((it) => removeFromCart(it.id, it.variation.id));
      localStorage.removeItem("cart");

      setStep(2);
    } catch (err) {
      console.error("❌ Order submission failed:", err);
      alert("Failed to place order. Try again.");
    }
    setLoading(false);
  }

  return (
    <main
      className={`bg-slate-50 p-4 md:p-8 text-slate-900`}
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        {loading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-100">
            <div className="w-12 h-12 border-4 border-t-transparent border-emerald-500 rounded-full animate-spin"></div>
            <span className="ml-3 text-white font-medium">
              Placing your order...
            </span>
          </div>
        )}

        {step === 1 && !loading && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                {/* STEP 1: ADDRESS */}

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    required={true}
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Full name"
                    className="px-3 py-2 rounded-md border border-emerald-500"
                  />
                  <input
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="Phone"
                    className="px-3 py-2 rounded-md border border-emerald-500"
                  />
                  <input
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="Email Address"
                    className="md:col-span-2 px-3 py-2 rounded-md border border-emerald-500"
                    type="email"
                  />                  
                  <input
                    value={form.address1}
                    onChange={(e) => updateField("address1", e.target.value)}
                    placeholder="Address line 1"
                    className="md:col-span-2 px-3 py-2 rounded-md border border-emerald-500"
                  />
                  <input
                    value={form.address2}
                    onChange={(e) => updateField("address2", e.target.value)}
                    placeholder="Address line 2"
                    className="md:col-span-2 px-3 py-2 rounded-md border border-emerald-500"
                  />
                  <input
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="City"
                    className="px-3 py-2 rounded-md border border-emerald-500"
                  />
                  <input
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    placeholder="State"
                    className="px-3 py-2 rounded-md border border-emerald-500"
                  />
                  <input
                    value={form.pincode}
                    onChange={(e) => updateField("pincode", e.target.value)}
                    placeholder="Pincode"
                    className="px-3 py-2 rounded-md border border-emerald-500"
                  />

                  <div className="md:col-span-2 mt-2">
                    <div className="text-sm font-medium">Shipping method</div>
                    <div className="mt-2 flex gap-2">
                      <label
                        className={`flex-1 p-3 border border-emerald-500 rounded-md ${
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
                        <span className="ml-2">Standard (3-5 days) - $30</span>
                      </label>
                      <label
                        className={`flex-1 p-3 border border-emerald-500 rounded-md ${
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
                        <span className="ml-2">Express (same day) - $100</span>
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex items-center justify-end gap-2 mt-4">
                    <button
                      onClick={() => placeOrder()}
                      className="cursor-pointer px-4 py-2 rounded-md bg-emerald-600 text-white"
                    >
                      Place Order
                    </button>
                  </div>
                </div>

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
                      <div
                        key={`${it.id}-${it.variation.id}`}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={it.image}
                            className="h-10 w-10 object-cover rounded-md"
                            width={40}
                            height={40}
                            alt={it.name}
                          ></Image>
                          <div>
                            <div className="text-sm">{it.name}</div>
                            <div className="text-xs text-slate-500">
                              Qty: {it.quantity}
                            </div>
                            <div className="text-xs text-slate-500">
                              Pills: {it.variation.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              Price: ${it.price}
                            </div>
                          </div>
                        </div>
                        <div className="font-medium">${it.total * it.qty}</div>
                      </div>
                    ))
                  )}

                  <div className="border-t pt-3 flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shippingCost}</span>
                  </div>
                  <div className="border-t pt-3 font-semibold flex justify-between">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>
              </div>
              <label
                htmlFor="bank"
                className={`cursor-pointer bg-white p-4 mt-2 rounded-xl shadow-sm flex items-center gap-3 ${
                  form.paymentMethod === "bank"
                    ? "ring-1 ring-emerald-600 bg-emerald-50"
                    : ""
                }`}
              >
                <input
                  id="bank"
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={form.paymentMethod === "bank"}
                  onChange={() => (form.paymentMethod = "bank")}
                  className="w-4 h-4"
                />
                <span className="font-medium">Direct Bank Transfer</span>
              </label>
            </aside>
            <div className="text-sm text-slate-600">
              By placing your order you agree to our Terms & Privacy.
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white p-10 mt-10 rounded-xl shadow-md text-center">
            <h2 className="text-2xl font-semibold text-emerald-600">
              🎉 Thank you for your order!
            </h2>
            <p className="text-gray-600 mt-2">
              We’ve received your order and will contact you shortly.
            </p>
            <button
              onClick={() => router.push("/shop")}
              className="cursor-pointer mt-6 px-6 py-3 bg-emerald-600 text-white rounded-md font-medium"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
