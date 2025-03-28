import { create } from "zustand";

const useSelectedRowStore = create((set) => ({
    selectedRowData: null, // Store the selected row data
    setSelectedRowData: (row) => set({ selectedRowData: row }), // Action to update the row data
    clearSelectedRowData: () => set({ selectedRowData: null }), // Clear action
}));

export default useSelectedRowStore;
