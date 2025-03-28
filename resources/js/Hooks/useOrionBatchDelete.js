import { useMutation } from "@tanstack/react-query";

const useOrionBatchDelete = (model, options = {}) => {
    const batchDelete = async (data) => {
        const url = `/api/${model}/batch?force=${data.force}`;

        const { status } = await axios.delete(url, {
            data: { resources: data.idsToDelete }, // Pass the IDs in the request body
        });

        // ✅ Return true if delete was successful (status 200 or 204)
        return status === 200 || status === 204;
    };

    return useMutation({
        mutationFn: batchDelete,
        ...options, // Additional options like onSuccess, onError, etc.
    });
};

export default useOrionBatchDelete;
