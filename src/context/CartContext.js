"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); // [{ id, variationId, quantity }]

  // Load from localStorage on startup (safe JSON parsing)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) setCartItems(JSON.parse(saved));
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      localStorage.removeItem("cart");
    }
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Add item to cart (merge if same product + same variation)
  const addToCart = (productId, variationId, qty = 1) => {
    if (!productId) {
      console.error("Missing productId in addToCart");
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.id === productId && item.variationId === variationId
      );

      if (existing) {
        return prev.map((item) =>
          item.id === productId && item.variationId === variationId
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }

      return [...prev, { id: productId, variationId, quantity: qty }];
    });
  };

  // ✅ Remove item completely
  const removeFromCart = (productId, variationId) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.id === productId && item.variationId === variationId)
      )
    );
  };

  // ✅ Clear entire cart
  const clearCart = () => setCartItems([]);

  // ✅ Compute total quantity (optional helper)
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, totalQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ✅ Safe hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart must be used within a CartProvider");
  return context;
};
