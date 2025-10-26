"use client"

import React, { useMemo, useState } from 'react';

const SAMPLE_CART = [
    { id: 1, name: 'Paracetamol 500mg - 20 tabs', price: 129, qty: 2, img: 'https://images.unsplash.com/photo-1580281657521-3d9bd8d45f2b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=1' },
    { id: 2, name: 'Vitamin C 1000mg - 30 caps', price: 449, qty: 1, img: 'https://images.unsplash.com/photo-1582719478250-1f3c95b6b4d6?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=2' },
  ];


export function CheckoutPage() {
    const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Review
    const [form, setForm] = useState({
      fullName: '',
      phone: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      pincode: '',
      shippingMethod: 'standard',
      paymentMethod: 'card',
      cardNumber: '',
      cardName: '',
      cardExpiry: '',
      cardCvv: '',
    });
  
    const cartItems = SAMPLE_CART; // in real app, pass via props or context
    const subtotal = useMemo(() => cartItems.reduce((s, it) => s + it.price * it.qty, 0), [cartItems]);
    const shippingCost = form.shippingMethod === 'standard' ? 49 : 149;
    const total = subtotal + shippingCost;
  
    function updateField(k, v) {
      setForm(prev => ({ ...prev, [k]: v }));
    }
  
    function placeOrder() {
      // In real app: call API, handle payment tokenization, etc.
      alert('Order placed! (demo)');
      setStep(3);
    }
  
    return (
      <main className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold">Checkout</h1>
  
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className={`px-3 py-2 rounded ${step === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-100'}`}>1</div>
                  <div>Address</div>
                </div>
  
                {step === 1 && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input value={form.fullName} onChange={e => updateField('fullName', e.target.value)} placeholder="Full name" className="px-3 py-2 rounded-md border" />
                    <input value={form.phone} onChange={e => updateField('phone', e.target.value)} placeholder="Phone" className="px-3 py-2 rounded-md border" />
                    <input value={form.address1} onChange={e => updateField('address1', e.target.value)} placeholder="Address line 1" className="md:col-span-2 px-3 py-2 rounded-md border" />
                    <input value={form.address2} onChange={e => updateField('address2', e.target.value)} placeholder="Address line 2" className="md:col-span-2 px-3 py-2 rounded-md border" />
                    <input value={form.city} onChange={e => updateField('city', e.target.value)} placeholder="City" className="px-3 py-2 rounded-md border" />
                    <input value={form.state} onChange={e => updateField('state', e.target.value)} placeholder="State" className="px-3 py-2 rounded-md border" />
                    <input value={form.pincode} onChange={e => updateField('pincode', e.target.value)} placeholder="Pincode" className="px-3 py-2 rounded-md border" />
  
                    <div className="md:col-span-2 mt-2">
                      <div className="text-sm font-medium">Shipping method</div>
                      <div className="mt-2 flex gap-2">
                        <label className={`flex-1 p-3 border rounded-md ${form.shippingMethod === 'standard' ? 'ring-2 ring-emerald-500' : ''}`}>
                          <input type="radio" name="ship" checked={form.shippingMethod === 'standard'} onChange={() => updateField('shippingMethod', 'standard')} /> <span className="ml-2">Standard (1-3 days) - ₹49</span>
                        </label>
                        <label className={`flex-1 p-3 border rounded-md ${form.shippingMethod === 'express' ? 'ring-2 ring-emerald-500' : ''}`}>
                          <input type="radio" name="ship" checked={form.shippingMethod === 'express'} onChange={() => updateField('shippingMethod', 'express')} /> <span className="ml-2">Express (same day) - ₹149</span>
                        </label>
                      </div>
                    </div>
  
                    <div className="md:col-span-2 flex items-center justify-end gap-2 mt-4">
                      <button onClick={() => setStep(2)} className="px-4 py-2 rounded-md bg-emerald-600 text-white">Continue to payment</button>
                    </div>
                  </div>
                )}
  
                <div className="mt-6 border-t pt-4">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className={`px-3 py-2 rounded ${step === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-100'}`}>2</div>
                    <div>Payment</div>
                  </div>
  
                  {step === 2 && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-2">
                        <div className="text-sm font-medium">Payment method</div>
                        <div className="mt-2 flex gap-2">
                          <label className={`p-3 border rounded-md flex-1 ${form.paymentMethod === 'card' ? 'ring-2 ring-emerald-500' : ''}`}>
                            <input type="radio" checked={form.paymentMethod === 'card'} onChange={() => updateField('paymentMethod', 'card')} /> <span className="ml-2">Credit / Debit card</span>
                          </label>
                          <label className={`p-3 border rounded-md flex-1 ${form.paymentMethod === 'cod' ? 'ring-2 ring-emerald-500' : ''}`}>
                            <input type="radio" checked={form.paymentMethod === 'cod'} onChange={() => updateField('paymentMethod', 'cod')} /> <span className="ml-2">Cash on delivery</span>
                          </label>
                        </div>
                      </div>
  
                      {form.paymentMethod === 'card' && (
                        <>
                          <input value={form.cardNumber} onChange={e => updateField('cardNumber', e.target.value)} placeholder="Card number" className="px-3 py-2 rounded-md border md:col-span-2" />
                          <input value={form.cardName} onChange={e => updateField('cardName', e.target.value)} placeholder="Name on card" className="px-3 py-2 rounded-md" />
                          <input value={form.cardExpiry} onChange={e => updateField('cardExpiry', e.target.value)} placeholder="MM/YY" className="px-3 py-2 rounded-md" />
                          <input value={form.cardCvv} onChange={e => updateField('cardCvv', e.target.value)} placeholder="CVV" className="px-3 py-2 rounded-md" />
                        </>
                      )}
  
                      <div className="md:col-span-2 flex items-center justify-end gap-2 mt-4">
                        <button onClick={() => setStep(1)} className="px-4 py-2 rounded-md border">Back</button>
                        <button onClick={() => setStep(3)} className="px-4 py-2 rounded-md bg-emerald-600 text-white">Review order</button>
                      </div>
                    </div>
                  )}
                </div>
  
                <div className="mt-6 border-t pt-4">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className={`px-3 py-2 rounded ${step === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-100'}`}>3</div>
                    <div>Review</div>
                  </div>
  
                  {step === 3 && (
                    <div className="mt-4 space-y-3">
                      <div className="bg-slate-50 p-3 rounded-md">
                        <div className="flex justify-between"><div className="text-sm">Shipping to</div><div className="text-sm font-medium">{form.fullName || '—'}</div></div>
                        <div className="text-xs text-slate-500 mt-1">{[form.address1, form.address2, form.city, form.state, form.pincode].filter(Boolean).join(', ')}</div>
                      </div>
  
                      <div className="bg-slate-50 p-3 rounded-md">
                        <div className="text-sm font-medium">Payment</div>
                        <div className="text-xs text-slate-500 mt-1">{form.paymentMethod === 'card' ? `Card ending •••• ${form.cardNumber.slice(-4)}` : 'Cash on delivery'}</div>
                      </div>
  
                      <div className="flex items-center justify-between">
                        <div className="text-sm">Items</div>
                        <div className="text-sm font-medium">₹{subtotal}</div>
                      </div>
  
                      <div className="flex items-center justify-between"><div className="text-sm">Shipping</div><div className="text-sm font-medium">₹{shippingCost}</div></div>
                      <div className="flex items-center justify-between font-semibold text-lg"><div>Total</div><div>₹{total}</div></div>
  
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setStep(2)} className="px-4 py-2 rounded-md border">Back</button>
                        <button onClick={placeOrder} className="px-4 py-2 rounded-md bg-emerald-600 text-white">Place order</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
  
            <aside className="lg:col-span-1">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="font-semibold">Order summary</h3>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  {cartItems.map(it => (
                    <div key={it.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={it.img} className="h-10 w-10 object-cover rounded-md" />
                        <div>
                          <div className="text-sm">{it.name}</div>
                          <div className="text-xs text-slate-500">Qty {it.qty}</div>
                        </div>
                      </div>
                      <div className="font-medium">₹{it.price * it.qty}</div>
                    </div>
                  ))}
  
                  <div className="border-t pt-3 flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>₹{shippingCost}</span></div>
                  <div className="border-t pt-3 font-semibold flex justify-between"><span>Total</span><span>₹{total}</span></div>
                </div>
              </div>
            </aside>
          </div>
  
          <div className="mt-6 text-sm text-slate-600">By placing your order you agree to our Terms & Privacy.</div>
        </div>
      </main>
    );
  }
  
export default CheckoutPage;