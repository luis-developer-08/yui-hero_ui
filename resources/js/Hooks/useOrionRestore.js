import { useMutation } from "@tanstack/react-query";

const useOrionRestore = (model, options = {}) => {
    const restoreData = async (id) => {
        const url = `/api/${model}/${id}/restore`; // Use the restore endpoint

        const { status } = await axios.post(url); // Use POST request for restore

        // ✅ Return true if restore was successful (status 200 or 204)
        return status === 200 || status === 204;
    };

    return useMutation({
        mutationFn: restoreData,
        ...options, // Additional options like onSuccess, onError, etc.
    });
};

export default useOrionRestore;
