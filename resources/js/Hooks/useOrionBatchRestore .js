import { useMutation } from "@tanstack/react-query";

const useOrionBatchRestore = (model, options = {}) => {
    const batchRestore = async (ids) => {
        const url = `/api/${model}/batch/restore`; // Batch restore endpoint

        const { status } = await axios.post(url, {
            resources: ids, // Pass the IDs in the request body
        });

        // ✅ Return true if restore was successful (status 200 or 204)
        return status === 200 || status === 204;
    };

    return useMutation({
        mutationFn: batchRestore,
        ...options, // Additional options like onSuccess, onError, etc.
    });
};

export default useOrionBatchRestore;
