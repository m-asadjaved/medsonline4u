"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function ProductActions({ productId }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

    const handleAddToCart = () => addToCart(productId, quantity);

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Qty</span>
          <div className="flex items-center border rounded-md overflow-hidden">
            <button onClick={decrease} className="px-3 py-2 text-sm">-</button>
            <div className="px-4 py-2 text-sm">{quantity}</div>
            <button onClick={increase} className="px-3 py-2 text-sm">+</button>
          </div>
          <div className="text-sm text-slate-600">⭐5 reviews</div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          className="flex-1 px-4 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
        >
          Add to cart
        </button>
        <button
          className="px-4 py-3 rounded-lg border border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition"
        >
          Buy now
        </button>
      </div>
    </div>
  );
}
