import React, { useState } from "react";
import {
    addToast,
    Button,
    Divider,
    Form,
    Input,
    Select,
    SelectItem,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import useGenerateTable from "@/Hooks/useGenerateTable";
import useOrionModelStore from "@/ZustandStores/useOrionModelStore";
import { v4 as uuidv4 } from "uuid"; // ✅ Generate unique IDs

const DATA_TYPES = [
    { name: "Text", value: "string" },
    { name: "Long text", value: "text" },
    { name: "Numbers", value: "integer" },
    { name: "Decimals", value: "float" },
    { name: "Price", value: "decimal:10,2" },
    { name: "True or False (Boolean)", value: "boolean" },
    { name: "Date and time", value: "datetime" },
    { name: "Date", value: "date" },
    { name: "Time", value: "time" },
];

const CONSTRAINTS_TYPES = [
    { name: "Required", value: "not_nullable" },
    { name: "Is not Required", value: "nullable" },
];

const CreateTableForm = () => {
    const [tableName, setTableName] = useState("");
    const { setSelectedRow } = useOrionModelStore();

    const [columns, setColumns] = useState([
        { id: uuidv4(), name: "", type: "string", constraint: "not_nullable" },
    ]);

    const queryClient = useQueryClient();
    const {
        mutate: generateTable,
        isLoading,
        isError,
        error,
    } = useGenerateTable({
        onSuccess: (data) => {
            addToast({
                title: "Success",
                description: data.message,
            });

            queryClient.invalidateQueries(["orion", "orion-models"]);
            // setSelectedRow(tableName);

            setTableName("");
            setColumns([
                {
                    id: uuidv4(),
                    name: "",
                    type: "string",
                    constraint: "not_nullable",
                },
            ]);
        },
        onError: (error) => {
            addToast({
                title: "Error",
                description:
                    error.response?.data?.message || "Failed to generate table",
                color: "danger",
            });
            console.error("❌ Error generating table:", error.message);
        },
    });

    // ✅ Add a new column with a unique ID
    const handleAddColumn = () => {
        setColumns((prevColumns) => [
            ...prevColumns,
            {
                id: uuidv4(),
                name: "",
                type: "string",
                constraint: "not_nullable",
            },
        ]);
    };

    // ✅ Remove column by filtering out the ID
    const handleRemoveColumn = (id) => {
        setColumns((prevColumns) => prevColumns.filter((col) => col.id !== id));
    };

    // ✅ Ensure correct value updates
    const handleColumnChange = (id, field, value) => {
        let selectedValue =
            typeof value === "object"
                ? value.currentKey || value.anchorKey || value.value
                : value;

        // Convert spaces to underscores only for the "name" field
        if (field === "name") {
            selectedValue = selectedValue.toLowerCase().replace(/\s+/g, "_");
        }

        setColumns((prevColumns) =>
            prevColumns.map((col) =>
                col.id === id ? { ...col, [field]: selectedValue } : col
            )
        );
    };
    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     const formattedColumns = columns.map((col) => ({
    //         name: col.name,
    //         type: col.type, // Now correctly extracting the raw value
    //         constraint: col.constraint,
    //     }));

    //     const payload = {
    //         table_name: tableName,
    //         columns: formattedColumns,
    //     };

    //     console.log(payload);
    //     // generateTable(payload);
    // };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Format table name by replacing spaces with underscores
        const formattedTableName = tableName.toLowerCase().replace(/\s+/g, "_");

        // Send the properly formatted table name and columns

        // console.log({
        //     table_name: formattedTableName,
        //     columns: columns.map(({ id, ...col }) => col), // Remove ID before sending
        // });

        generateTable({
            table_name: formattedTableName,
            columns: columns.map(({ id, ...col }) => col), // Remove ID before sending
        });
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
                            <Input
                                type="text"
                                placeholder="Enter table name (Singular form)"
                                value={tableName}
                                onChange={(e) => setTableName(e.target.value)}
                                isRequired
                                className="w-full"
                                label={"Model Name"}
                                radius="sm"
                            />
                        </div>

                        <Divider className="my-3" />

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
                                {columns.map((col) => (
                                    <div
                                        key={col.id}
                                        className="flex gap-2 justify-between"
                                    >
                                        <Input
                                            type="text"
                                            label="Column Name"
                                            value={col.name}
                                            onChange={(e) =>
                                                handleColumnChange(
                                                    col.id,
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            className="w-2/3"
                                            isRequired
                                            size="sm"
                                        />

                                        <Select
                                            selectedKey={col.type}
                                            onSelectionChange={(value) =>
                                                handleColumnChange(
                                                    col.id,
                                                    "type",
                                                    value
                                                )
                                            }
                                            className="w-1/4"
                                            isRequired
                                            label={"Type"}
                                            size="sm"
                                        >
                                            {DATA_TYPES.map((type) => (
                                                <SelectItem
                                                    key={type.value}
                                                    value={type.value}
                                                >
                                                    {type.name}
                                                </SelectItem>
                                            ))}
                                        </Select>

                                        <Select
                                            selectedKey={col.constraint}
                                            onSelectionChange={(value) =>
                                                handleColumnChange(
                                                    col.id,
                                                    "constraint",
                                                    value
                                                )
                                            }
                                            className="w-1/4"
                                            isRequired
                                            label={"Constraint"}
                                            size="sm"
                                        >
                                            {CONSTRAINTS_TYPES.map(
                                                (constraint) => (
                                                    <SelectItem
                                                        key={constraint.value}
                                                        value={constraint.value}
                                                    >
                                                        {constraint.name}
                                                    </SelectItem>
                                                )
                                            )}
                                        </Select>

                                        <Button
                                            color="danger"
                                            onPress={() =>
                                                handleRemoveColumn(col.id)
                                            }
                                            isDisabled={columns.length === 1}
                                            className="rounded-md"
                                            size="lg"
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
                        isDisabled={isLoading}
                    >
                        {isLoading ? "Creating..." : "Create Model"}
                    </Button>

                    {isError && (
                        <p className="text-red-500">Error: {error.message}</p>
                    )}
                </Form>
            </div>
        </div>
    );
};

export default CreateTableForm;
