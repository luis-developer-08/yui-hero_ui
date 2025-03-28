import useSelectedRowStore from "@/ZustandStores/useSelectedRowStore";
import { useMutation } from "@tanstack/react-query";

const useOrionPatch = (model, options = {}) => {
    const { selectedRowData } = useSelectedRowStore(); // ✅ Selected row data

    const patchData = async (payload) => {
        const url = `/api/${model}/${selectedRowData.id}`;

        const { data } = await axios.patch(url, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return data;
    };

    return useMutation({
        mutationFn: patchData,
        ...options, // Additional options like onSuccess, onError, etc.
    });
};

export default useOrionPatch;
