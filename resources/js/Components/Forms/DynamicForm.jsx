import React, { useState } from "react";
import {
    Button,
    Form,
    Input,
    Spinner,
    Checkbox,
    Textarea,
    addToast,
} from "@heroui/react";
import useOrionModelStore from "@/ZustandStores/useOrionModelStore";
import useOrionFetch from "@/Hooks/useOrionFetch";
import useOrionPost from "@/Hooks/useOrionPost";
import { useQueryClient } from "@tanstack/react-query";

const DynamicForm = ({ setAddingRow }) => {
    const { selectedRow } = useOrionModelStore();
    const { data, isLoading, isError } = useOrionFetch(selectedRow);
    const queryClient = useQueryClient();

    const { mutate, isLoading: isPosting } = useOrionPost(selectedRow, {
        onSuccess: (response) => {
            if (response) {
                addToast({
                    title: "Status",
                    description: "A record is succesfully added.",
                });
                queryClient.invalidateQueries(["orion", selectedRow]);
                setAddingRow(false);
            }
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const [formData, setFormData] = useState({});

    if (isLoading) {
        return (
            <div className="h-full w-full bg-sky-200/50 rounded-md flex items-center justify-center p-20">
                <Spinner label="Loading..." />
            </div>
        );
    }

    if (isError) {
        return <div className="text-red-500">Failed to load data.</div>;
    }

    // Map API columns to form fields
    const columns = data.columns
        .filter((col) => col.name !== "id") // ✅ Exclude the "id" column
        .map((col) => ({
            key: col.name,
            label: col.name,
            type: getInputTypeByName(col.name, col.type),
        }));

    // Handle input changes
    const handleChange = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...formData };
        if (selectedRow === "users" && formData.password) {
            payload.password = formData.password;
        }
        mutate(payload);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1">
                <Form
                    onSubmit={handleSubmit}
                    className="space-y-6 flex flex-col h-full"
                >
                    {/* ✅ Model Form */}
                    <div className="flex-1 w-full">
                        <div className="space-y-2 flex-1 mt-3 h-full">
                            <div className="overflow-y-auto h-[50vh] space-y-2 md:overflow-y-auto md:scrollbar-thin md:scrollbar-track md:scrollbar-thumb pr-2">
                                {columns.map((col, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-4 items-center"
                                    >
                                        <label className="w-1/3 font-medium capitalize">
                                            {col.label}
                                        </label>

                                        {/* Render appropriate field types */}
                                        {col.type === "boolean" ? (
                                            <Checkbox
                                                isSelected={!!formData[col.key]}
                                                onChange={(e) =>
                                                    handleChange(
                                                        col.key,
                                                        e.target.checked
                                                    )
                                                }
                                                className="w-2/3"
                                            >
                                                {col.label}
                                            </Checkbox>
                                        ) : col.type === "textarea" ? (
                                            <Textarea
                                                className="w-2/3"
                                                placeholder={`Enter ${col.label}`}
                                                value={formData[col.key] || ""}
                                                onChange={(e) =>
                                                    handleChange(
                                                        col.key,
                                                        e.target.value
                                                    )
                                                }
                                                isRequired
                                            />
                                        ) : (
                                            <Input
                                                type={col.type}
                                                value={formData[col.key] || ""}
                                                onChange={(e) =>
                                                    handleChange(
                                                        col.key,
                                                        e.target.value
                                                    )
                                                }
                                                placeholder={`Enter ${col.label}`}
                                                className="w-2/3"
                                                isRequired
                                            />
                                        )}
                                    </div>
                                ))}

                                {/* ✅ Add password field dynamically for users */}
                                {selectedRow === "users" && (
                                    <div className="flex gap-4 items-center">
                                        <label className="w-1/3 font-medium capitalize">
                                            Password
                                        </label>
                                        <Input
                                            type="password"
                                            value={formData["password"] || ""}
                                            onChange={(e) =>
                                                handleChange(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter Password"
                                            className="w-2/3"
                                            isRequired
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        color="secondary"
                        className="w-full rounded-md"
                        isDisabled={isPosting}
                        isLoading={isPosting}
                    >
                        {isPosting ? "Creating..." : "Create"}
                    </Button>
                </Form>
            </div>
        </div>
    );
};

// ✅ Helper function to determine input type by name or fallback to column type
const getInputTypeByName = (name, type) => {
    const lowerName = name.toLowerCase();

    if (lowerName.includes("email")) return "email";
    if (lowerName.includes("password")) return "password";
    if (lowerName.includes("description")) return "textarea";
    if (lowerName.includes("boolean")) return "boolean";
    if (lowerName.includes("date") || lowerName.includes("created_at"))
        return "datetime-local";
    if (lowerName.includes("price")) return "number";

    // Fallback to the original type or default to "text"
    return type === "string" ? "text" : type;
};

export default DynamicForm;
