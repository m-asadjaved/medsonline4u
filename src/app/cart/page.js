"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "@/context/CartContext"; // ✅ use your existing CartContext

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart(); // [{ id, quantity }]
  const [products, setProducts] = useState([]); // Full product data from server
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Fetch product details from the backend
  useEffect(() => {
    if (cartItems.length === 0) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: cartItems }),
        });

        if (!res.ok) throw new Error("Failed to fetch cart data");

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, [cartItems]);

  const subtotal = useMemo(
    () => products.reduce((s, p) => s + p.price * p.quantity, 0),
    [products]
  );
  const discount = appliedCoupon === "SAVE10" ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 499 ? 0 : 49;
  const total = subtotal - discount + shipping;

  function applyCoupon() {
    if (coupon.trim().toUpperCase() === "SAVE10") {
      setAppliedCoupon("SAVE10");
    } else {
      setAppliedCoupon(null);
      alert("Invalid coupon.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold">Your cart</h1>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items Section */}
          <section className="lg:col-span-2">
            <div className="space-y-4">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl shadow-sm flex gap-4"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-24 w-24 object-cover rounded-md"
                  />
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          Manufacturer • {item.pack_size || "1 unit"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{item.price}</div>
                        <div className="text-xs text-slate-500">each</div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 border rounded-md overflow-hidden">
                        <button
                          onClick={() =>
                            console.log("Decrease qty feature here")
                          }
                          className="px-3 py-1 text-sm"
                        >
                          -
                        </button>
                        <div className="px-4 py-1 text-sm">{item.quantity}</div>
                        <button
                          onClick={() =>
                            console.log("Increase qty feature here")
                          }
                          className="px-3 py-1 text-sm"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-sm text-rose-600"
                        >
                          Remove
                        </button>
                        <button className="text-sm text-emerald-600">
                          Save for later
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {products.length === 0 && (
                <div className="bg-white p-6 rounded-xl text-center text-slate-600">
                  Your cart is empty.
                </div>
              )}
            </div>
          </section>

          {/* Summary Section */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="font-semibold">Order summary</h3>
              <div className="mt-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm">Coupon</label>
                <div className="mt-2 flex gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 rounded-md border text-sm"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="mt-2 text-xs text-emerald-600">
                    Coupon {appliedCoupon} applied.
                  </div>
                )}
              </div>

              <div className="mt-4">
                <Link
                  href="/checkout"
                  className="block text-center px-4 py-3 rounded-md bg-emerald-600 text-white font-semibold"
                >
                  Proceed to checkout
                </Link>
              </div>

              <div className="mt-3 text-xs text-slate-500">
                Secure checkout · Easy returns · 24/7 support
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-8 text-sm text-slate-600">
          Questions? Contact our support or call 0800-123-4567.
        </div>
      </div>
    </main>
  );
}
