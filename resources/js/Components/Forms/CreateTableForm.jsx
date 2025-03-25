import React, { useState } from "react";
import {
    addToast,
    Button,
    Form,
    Input,
    Select,
    SelectItem,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

const DATA_TYPES = [
    "string",
    "integer",
    "decimal:10,2",
    "text",
    "boolean",
    "datetime",
];

const CreateTableForm = () => {
    const [tableName, setTableName] = useState("");
    const [columns, setColumns] = useState([{ name: "", type: "string" }]);
    const queryClient = useQueryClient();

    const handleAddColumn = () => {
        setColumns([...columns, { name: "", type: "string" }]);
    };

    const handleRemoveColumn = (index) => {
        const updatedColumns = columns.filter((_, i) => i !== index);
        setColumns(updatedColumns);
    };

    const handleColumnChange = (index, field, value) => {
        const updatedColumns = [...columns];

        const selectedValue =
            typeof value === "object"
                ? value.currentKey || value.anchorKey
                : value;

        // Lowercase and replace whitespace with underscores
        updatedColumns[index][field] =
            field === "name"
                ? value.toLowerCase().replace(/\s+/g, "_")
                : selectedValue;

        setColumns(updatedColumns);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                })),
        };

        // Axios request with proper error handling
        try {
            const { data } = await axios.post(
                "/api/generate-table",
                tableSchema,
                {
                    headers: {
                        "Content-Type": "application/json", // Specify content type
                    },
                }
            );

            if (data.message) {
                addToast({
                    title: "Status",
                    description: data.message,
                });

                setTableName("");
                setColumns([{ name: "", type: "" }]);
                queryClient.invalidateQueries(["orion", "orion-models"]);
            }

            console.log("API Response:", response.data);
        } catch (error) {
            console.error("Error generating table:", error);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div>
                <h2 className="text-xl font-semibold mb-4 capitalize bg-white rounded-md py-2 px-4">
                    Create Model
                </h2>
            </div>
            <div className="flex-1">
                <Form
                    onSubmit={handleSubmit}
                    className="space-y-6 flex flex-col h-full"
                >
                    <div className="flex-1 w-full">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Model Name
                            </label>
                            <Input
                                type="text"
                                placeholder="Enter table name (Singular form)"
                                value={tableName}
                                onChange={(e) => setTableName(e.target.value)}
                                isRequired
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2 flex-1 mt-3 h-full">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">Columns</h3>

                                <Button
                                    color="primary"
                                    onPress={handleAddColumn}
                                    className="rounded-md"
                                >
                                    Add Column
                                </Button>
                            </div>
                            <div className="overflow-y-auto h-[35vh] space-y-2 md:overflow-y-auto md:scrollbar-thin md:scrollbar-track md:scrollbar-thumb pr-2">
                                {columns.map((col, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-2 justify-between"
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Column Name"
                                            value={col.name}
                                            onChange={(e) =>
                                                handleColumnChange(
                                                    index,
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            className="w-2/3"
                                            isRequired
                                        />

                                        <Select
                                            selectedKey={col.type}
                                            onSelectionChange={(value) =>
                                                handleColumnChange(
                                                    index,
                                                    "type",
                                                    value
                                                )
                                            }
                                            className="w-1/4"
                                            isRequired
                                        >
                                            {DATA_TYPES.map((type) => (
                                                <SelectItem
                                                    key={type}
                                                    value={type}
                                                >
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </Select>

                                        <Button
                                            color="danger"
                                            onPress={() =>
                                                handleRemoveColumn(index)
                                            }
                                            isDisabled={columns.length === 1}
                                            className="rounded-md"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        color="secondary"
                        className="w-full rounded-md"
                    >
                        Create Model
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default CreateTableForm;
