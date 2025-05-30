import { create } from "zustand";

export const useOrderStore = create((set) => ({
    orders: [],
    loading: false,
    error: null,

    // fetch user orders

    fetchUserOrders: async (userId) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`/api/orders/user/${userId}`);
            const data = await response.json();

            if (data.success) {
                set({ orders: data.orders, loading: false});
            } else {
                set({ error: data.message, loading: false });
            }
        } catch (error) {
            set({ error: "Failed to fetch orders", loading: false });
        }
    },

    clearOrders: () => set({ orders: [], error: null}),
}));
