import { create } from "zustand";

export const  useCartStore = create((set) => ({
    cart: null,
    addToCart: async ({ userId, productId, quantity = 1 }) => {
        const res = await fetch("/api/cart/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId, quantity }),
        });
        const data = await res.json();
        if (data.success) set({ cart: data.cart});
        return data;
    },
    fetchCart: async (userId) => {
        const res = await fetch(`/api/cart/${userId}`);
        const data = await res.json();
        if (data.success) set({ cart: data.cart });
        return data;
    },
     removeFromCart: async ({ userId, productId }) => {

        set((state) => ({
        cart: {
            ...state.cart,
            items: state.cart.items.filter(item => item.product._id !== productId)
        }
        }));

        const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ userId, productId }),
        });
        const data = await res.json();

        if (data.success) set({ cart: data.cart });
        return data;
    },

  updateQuantity: async ({ userId, productId, quantity }) => {

    set((state) => ({
      cart: {
        ...state.cart,
        items: state.cart.items.map(item =>
          item.product._id === productId
            ? { ...item, quantity }
            : item
        )
      }
    }));

    const res = await fetch("/api/cart/update-quantity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId, quantity }),
    });
    const data = await res.json();

    if (data.success) set({ cart: data.cart });
    return data;
  },
}));