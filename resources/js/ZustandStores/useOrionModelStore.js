import { create } from "zustand";
import { persist } from "zustand/middleware";

const useOrionModelStore = create(
    persist(
        (set, get) => ({
            selectedRow: "users",

            setSelectedRow: (row) => {
                const currentRow = get().selectedRow;
                set({ selectedRow: currentRow === row ? null : row });
            },
        }),
        {
            name: "orion-selected-row", // LocalStorage key
            getStorage: () => localStorage, // Use localStorage
        }
    )
);

export default useOrionModelStore;
