import { useMutation } from "@tanstack/react-query";

const useDeleteTable = (options = {}) => {
    const deleteTable = async (tableName) => {
        if (!tableName) {
            throw new Error("Table name is required!");
        }

        const { data } = await axios.delete("/api/remove-table", {
            data: { table_name: tableName },
        });

        return data;
    };

    return useMutation({
        mutationFn: deleteTable,
        ...options, // Include onSuccess, onError, etc.
    });
};

export default useDeleteTable;
