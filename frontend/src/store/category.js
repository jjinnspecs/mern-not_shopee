import { create } from "zustand";

export const useCategoryStore = create((set) => ({
    categories: [],
    setCategories: (categories) => set({ categories }),
    createCategory: async (newCategory) => {
        if (!newCategory.name) {
            return { success: false, message: "Please fill in the category name field." };
        }
        const res = await fetch("/api/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newCategory),
        });
        const data = await res.json();
        set((state) => ({
            categories: [...state.categories, data.data]
        }));
        return { success: true, message: "Category created successfully" };
    },

    fetchCategories: async () => {
        const res = await fetch("/api/categories");
        const data = await res.json();
        set({ categories: data.data });
        return { success: true, message: "Categories fetched successfully" };
    },

    deleteCategory: async (pid) => {
        const res = await fetch(`/api/categories/${pid}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if (!data.success) 
            return { success: false, message: data.message };

        // Remove the category from the store without refreshing the page
        set((state) => ({
            categories: state.categories.filter(category => category._id !== pid) }));
        return { success: true, message: data.message };
        },

    updateCategory: async (pid, updatedCategory) => {
            const res = await fetch(`/api/categories/${pid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedCategory),
            });
            const data = await res.json();
            if (!data.success)
                return { success: false, message: data.message};
            
            // Update the category in the store without refreshing the page
            set((state) => ({
                categories: state.categories.map((category) =>
                    (category._id === pid ? data.data : category
                )),
            }));
            return { success: true, message: "Category updated successfully" };
        },
}));