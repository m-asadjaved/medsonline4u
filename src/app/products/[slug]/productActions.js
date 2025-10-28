"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function ProductActions({ productId, variations }) {
  const [selectedVariation, setSelectedVariation] = useState(variations[0]);
  const [addToCartAlert, setAddToCartAlert] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Compute price ranges
  const variationPrices = variations
    .map((v) => parseFloat(v.variation_price))
    .filter((p) => p > 0);
  const variationMrps = variations.map((v) => parseFloat(v.variation_mrp));
  const minPrice = variationPrices.length ? Math.min(...variationPrices) : 0;
  const maxPrice = variationPrices.length ? Math.max(...variationPrices) : 0;
  const minMrp = Math.min(...variationMrps);
  const maxMrp = Math.max(...variationMrps);

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    if (!selectedVariation) return alert("Please select a variation first.");
    addToCart(productId, selectedVariation.id, quantity);
    setAddToCartAlert(true);
    setTimeout(() => setAddToCartAlert(false), 2500);
  };

  const displayPrice = selectedVariation
    ? parseFloat(
        selectedVariation.variation_price > 0
          ? selectedVariation.variation_price
          : selectedVariation.variation_mrp
      ).toFixed(2)
    : null;

  const displayMrp =
    selectedVariation && parseFloat(selectedVariation.variation_mrp).toFixed(2);

  return (
    <div className="relative md:mt-4 mt-0">
      {/* Price Section */}
      <div className="md:my-3 my-2 px-3 py-0">
        {selectedVariation ? (
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-slate-900">
              ${displayPrice}
            </div>
            {selectedVariation.variation_price > 0 && (
              <div className="text-sm text-slate-500 line-through">
                ${displayMrp}
              </div>
            )}
          </div>
        ) : (
          <div className="text-3xl font-bold text-slate-900">
            ${minMrp} - ${maxMrp}
          </div>
        )}
      </div>

      {/* Variation Pills */}
      <div className="flex flex-wrap gap-2 px-3 py-2">
        {variations.map((v) => (
          <button
            key={v.id}
            onClick={() => setSelectedVariation(v)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              selectedVariation?.id === v.id
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-slate-200 text-slate-800 hover:bg-slate-300"
            }`}
          >
            {v.variation_name}
          </button>
        ))}
      </div>

      {/* Quantity + Actions */}
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="text-md text-slate-600">Qty</span>
          <div className="flex items-center border border-emerald-600 rounded-md overflow-hidden">
            <button
              onClick={decrease}
              className="px-3 py-2 text-sm hover:bg-emerald-200"
            >
              -
            </button>
            <div className="px-4 py-2 text-sm">{quantity}</div>
            <button
              onClick={increase}
              className="px-3 py-2 text-sm hover:bg-emerald-200"
            >
              +
            </button>
          </div>
        </div>

        {/* ✅ Toast Alert */}
        {addToCartAlert && (
          <div className="md:absolute md:top-[-95px] right-0 bg-emerald-600 text-white px-4 mx-0 py-2 rounded-lg shadow-md animate-fadeIn">
            ✅ Added to cart!{" "}
            <Link href="/cart" className="border-b-2">
              View Cart
            </Link>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariation}
            className={`hover:cursor-pointer flex-1 px-4 py-3 rounded-lg font-semibold transition ${
              selectedVariation
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            }`}
          >
            Add to Cart
          </button>

          <button
            disabled={!selectedVariation}
            className={`hover:cursor-pointer px-4 py-3 rounded-lg border font-semibold transition ${
              selectedVariation
                ? "border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                : "border-slate-300 text-slate-400 cursor-not-allowed"
            }`}
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
