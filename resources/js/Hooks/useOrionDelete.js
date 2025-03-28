import { useMutation } from "@tanstack/react-query";

const useOrionDelete = (model, options = {}) => {
    const deleteData = async (data) => {
        const url = `/api/${model}/${data.id}?force=${data.force}`;

        const { status } = await axios.delete(url);

        // ✅ Return true if delete was successful (status 200 or 204)
        return status === 200 || status === 204;
    };

    return useMutation({
        mutationFn: deleteData,
        ...options, // Additional options like onSuccess, onError, etc.
    });
};

export default useOrionDelete;
