import { create } from "zustand";

const useDynamicFormStore = create((set) => ({
    isOpen: false,
    method: "post", // Default value

    openForm: () => set({ isOpen: true }),
    closeForm: () => set({ isOpen: false }),
    toggleForm: () => set((state) => ({ isOpen: !state.isOpen })),

    setMethod: (newMethod) => {
        if (newMethod === "post" || newMethod === "patch") {
            set({ method: newMethod });
        } else {
            console.warn("Invalid method. Use 'post' or 'patch'.");
        }
    },
}));

export default useDynamicFormStore;
