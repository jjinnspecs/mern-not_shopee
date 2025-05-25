import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    token: localStorage.getItem('token') || null,
    user: localStorage.getItem('userEmail') ? { email: localStorage.getItem('userEmail') } : null,

    setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        set({ token: null, user: null });
    },

    loginAdmin: async (username, password) => {
        const res = await fetch("/api/auth/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('token', data.token);
            set({ token: data.token });
        }
        return data;
    },

    requestUserOtp: async (email) => {
        const res = await fetch("/api/auth/user/request-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        return await res.json();
    },

    verifyUserOtp: async (email, otp) => {
        const res = await fetch ("/api/auth/user/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', email)
            set({ token: data.token, user: { email }});
        }
        return data;
        
    }
}))