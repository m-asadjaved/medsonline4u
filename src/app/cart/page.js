"use client"

import React, { useMemo, useState } from 'react';

// Combined Cart and Checkout components in one file for easy integration.

const SAMPLE_CART = [
  { id: 1, name: 'Paracetamol 500mg - 20 tabs', price: 129, qty: 2, img: 'https://images.unsplash.com/photo-1580281657521-3d9bd8d45f2b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=1' },
  { id: 2, name: 'Vitamin C 1000mg - 30 caps', price: 449, qty: 1, img: 'https://images.unsplash.com/photo-1582719478250-1f3c95b6b4d6?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=2' },
];

export function CartPage() {
  const [items, setItems] = useState(SAMPLE_CART);
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);
  const discount = appliedCoupon === 'SAVE10' ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 499 ? 0 : 49;
  const total = subtotal - discount + shipping;

  function updateQty(id, qty) {
    setItems(prev => prev.map(it => it.id === id ? { ...it, qty: Math.max(1, qty) } : it));
  }

  function removeItem(id) {
    setItems(prev => prev.filter(it => it.id !== id));
  }

  function applyCoupon() {
    if (coupon.trim().toUpperCase() === 'SAVE10') {
      setAppliedCoupon('SAVE10');
    } else {
      setAppliedCoupon(null);
      alert('Invalid coupon. Try SAVE10 for 10% off.');
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold">Your cart</h1>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex gap-4">
                  <img src={item.img} alt={item.name} className="h-24 w-24 object-cover rounded-md" />
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-slate-500 mt-1">Manufacturer • 20 tabs</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{item.price}</div>
                        <div className="text-xs text-slate-500">each</div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 border rounded-md overflow-hidden">
                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-3 py-1 text-sm">-</button>
                        <div className="px-4 py-1 text-sm">{item.qty}</div>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-3 py-1 text-sm">+</button>
                      </div>

                      <div className="flex items-center gap-3">
                        <button onClick={() => removeItem(item.id)} className="text-sm text-rose-600">Remove</button>
                        <button className="text-sm text-emerald-600">Save for later</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="bg-white p-6 rounded-xl text-center text-slate-600">Your cart is empty.</div>
              )}
            </div>
          </section>

          <aside className="lg:col-span-1">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="font-semibold">Order summary</h3>
              <div className="mt-3 text-sm text-slate-600">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between mt-2"><span>Discount</span><span>-₹{discount}</span></div>
                <div className="flex justify-between mt-2"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
                <div className="border-t mt-3 pt-3 flex justify-between font-semibold"><span>Total</span><span>₹{total}</span></div>
              </div>

              <div className="mt-4">
                <label className="text-sm">Coupon</label>
                <div className="mt-2 flex gap-2">
                  <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Enter code" className="flex-1 px-3 py-2 rounded-md border text-sm" />
                  <button onClick={applyCoupon} className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm">Apply</button>
                </div>
                {appliedCoupon && <div className="mt-2 text-xs text-emerald-600">Coupon {appliedCoupon} applied.</div>}
              </div>

              <div className="mt-4">
                <a href="#/checkout" className="block text-center px-4 py-3 rounded-md bg-emerald-600 text-white font-semibold">Proceed to checkout</a>
              </div>

              <div className="mt-3 text-xs text-slate-500">Secure checkout · Easy returns · 24/7 support</div>
            </div>
          </aside>
        </div>

        <div className="mt-8 text-sm text-slate-600">Questions? Contact our support or call 0800-123-4567.</div>
      </div>
    </main>
  );
}

export default CartPage;