import { create } from "zustand";

export const useOrderStore = create((set, get) => ({
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

    // fetch all orders
        fetchAllOrders: async () => {
        const res = await fetch("/api/orders");
        const data = await res.json();
        set({ orders: data.orders });
        return { success: true, message: "Orders fetched successfully" };
    },

    // update order status
        updateOrderStatus: async (orderId, status) => {
            try {
            const res = await fetch(`/api/orders/${orderId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });
            const data = await res.json();
           if (data.success) {
                // update the order in the local state
                const updatedOrders = get().orders.map((order) =>
                    order._id === orderId ? data.order : order
                );
                set({ orders: updatedOrders });
                return { success: true, message: "Order status updated" };
            } else {
                return { success: false, message: data.message || "Failed to update order" };
            }
        } catch (error) {
            return { success: false, message: "Error updating order" };
        }
    },
}));
