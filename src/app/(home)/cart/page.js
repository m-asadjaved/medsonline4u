"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { removeFromCart } = useCart();
  const [products, setProducts] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false); // default false

  useEffect(() => {
    // Check localStorage immediately
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

    if (storedCart.length === 0) {
      // no items → no loading delay
      setLoading(false);
      setProducts([]);
    } else {
      // show loading until fetched
      setLoading(true);
      fetchProducts(storedCart);
    }
  }, []);

  async function fetchProducts(items) {
    try {
      const res = await fetch("/api/products/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) throw new Error("Failed to fetch cart data");

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleRemove(id, variationId) {
    setProducts((prev) =>
      prev.filter(
        (p) =>
          !(
            p.id === id &&
            (p.variation?.id === variationId || p.variation_id === variationId)
          )
      )
    );
    removeFromCart(id, variationId);
  }

  // 🧮 subtotal, discount, total
  const subtotal = useMemo(
    () => products.reduce((sum, p) => sum + p.price * p.quantity, 0),
    [products]
  );
  // const discount = appliedCoupon === "SAVE10" ? Math.round(subtotal * 0.1) : 0;
  const discount = 0;
  // const shipping = subtotal > 499 ? 0 : 49;
  const shipping = 30;
  const total = subtotal - discount + shipping;
  // const total = subtotal - discount;

  function applyCoupon() {
    if (coupon.trim().toUpperCase() === "SAVE10") {
      setAppliedCoupon("SAVE10");
    } else {
      setAppliedCoupon(null);
      alert("Invalid coupon code.");
    }
  }

  return (
    <main className="bg-slate-50 p-4 md:p-8 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold">Your cart</h1>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <section className="lg:col-span-2">
            <div className="space-y-4">
              {loading ? (
                <div className="bg-white p-6 rounded-xl text-center text-slate-600">
                  Loading your cart Please wait...
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white p-6 rounded-xl text-center text-slate-600">
                  Your cart is empty.
                </div>
              ) : (
                products.map((item) => (
                  <div
                    key={`${item.id}-${item.variation?.id}`}
                    className="bg-white p-4 rounded-xl shadow-sm flex gap-4"
                  >
                    <Link href={`/products/${item.slug}`}>
                      <Image
                        width={100}
                        height={100}
                        src={item.image}
                        alt={item.name}
                        className="h-24 w-24 object-cover rounded-md"
                      />
                    </Link>
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between">
                        <Link href={`/products/${item.slug}`}>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {item.variation && (
                              <div className="text-xs text-slate-500 mt-1">
                                Variation: {item.variation.name}
                              </div>
                            )}
                            <div className="text-xs text-slate-500 mt-1">
                              Qty: {item.quantity}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              Price: ${item.price}
                            </div>
                          </div>
                        </Link>
                        <div className="text-right">
                          <div className="font-semibold text-center">
                            Total: $
                            {(item.price * item.quantity).toLocaleString()}
                          </div>
                          <div className="mt-4 flex items-center justify-center">
                            <button
                              onClick={() =>
                                handleRemove(item.id, item.variation?.id)
                              }
                              className="bg-rose-500 text-sm text-white px-2 py-1 rounded hover:cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Order Summary */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="font-semibold">Order summary</h3>
              <div className="mt-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Discount</span>
                  <span>-${discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
                </div>
                <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>

              {/* Coupon Input */}
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

              {/* Checkout */}
              <div className="mt-4">
                <button
                  onClick={() => router.push("/checkout")}
                  disabled={products.length === 0 || loading}
                  className={`block w-full text-center px-4 py-3 rounded-md font-semibold 
                  ${
                    products.length === 0 || loading
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                  }`}
                >
                  Proceed to checkout
                </button>
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
