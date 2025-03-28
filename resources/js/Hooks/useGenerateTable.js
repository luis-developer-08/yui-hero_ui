import { useMutation } from "@tanstack/react-query";

const useGenerateTable = (options = {}) => {
    const generateTable = async ({ tableName, columns }) => {
        const normalizedTableName = tableName
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "_");

        const tableSchema = {
            table_name: normalizedTableName,
            columns: columns
                .filter((col) => col.name.trim())
                .map((col) => ({
                    name: col.name.toLowerCase().replace(/\s+/g, "_"),
                    type: col.type,
                    constraint: col.constraint,
                })),
        };

        const { data } = await axios.post("/api/generate-table", tableSchema, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return data;
    };

    return useMutation({
        mutationFn: generateTable,
        ...options, // Spread additional options like `onSuccess`, `onError`
    });
};

export default useGenerateTable;
