import React, { useState, useEffect } from "react";
import {
    Button,
    Form,
    Input,
    Spinner,
    Checkbox,
    Textarea,
    addToast,
    DateInput,
    TimeInput,
    DatePicker,
} from "@heroui/react";
import {
    CalendarDate,
    CalendarDateTime,
    parseAbsoluteToLocal,
    Time,
    ZonedDateTime,
} from "@internationalized/date";
import useOrionModelStore from "@/ZustandStores/useOrionModelStore";
import useOrionFetch from "@/Hooks/useOrionFetch";
import useOrionPost from "@/Hooks/useOrionPost";
import { useQueryClient } from "@tanstack/react-query";
import useDynamicFormStore from "@/ZustandStores/useDynamicFormStore";
import useSelectedRowStore from "@/ZustandStores/useSelectedRowStore";
import useOrionPatch from "@/Hooks/useOrionPatch";

const DynamicForm = ({ setFilterValue }) => {
    const { selectedRow } = useOrionModelStore();
    const { data, isLoading, isError } = useOrionFetch(selectedRow);
    const queryClient = useQueryClient();
    const { closeForm, method } = useDynamicFormStore();
    const { selectedRowData } = useSelectedRowStore(); // ✅ Selected row data

    const { mutate: post, isLoading: isPosting } = useOrionPost(selectedRow, {
        onSuccess: (response) => {
            if (response) {
                addToast({
                    title: "Status",
                    description: "A record is successfully saved.",
                });
                queryClient.invalidateQueries(["orion", selectedRow]);
                closeForm();
            }
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const { mutate: patch, isLoading: isPatching } = useOrionPatch(
        selectedRow,
        {
            onSuccess: (response) => {
                if (response) {
                    addToast({
                        title: "Status",
                        description: "A record is successfully updated.",
                    });
                    queryClient.invalidateQueries(["orion", selectedRow]);
                    setFilterValue("");
                    closeForm();
                }
            },
            onError: (error) => {
                console.log(error);
            },
        }
    );

    // ✅ Initialize formData with selected row data (for editing) or empty form (for creating)
    const [formData, setFormData] = useState({});

    // ✅ Load selected row data into form on mount or row change
    useEffect(() => {
        if (selectedRowData) {
            setFormData(selectedRowData); // Pre-fill with selected row data
        } else {
            setFormData({}); // Empty form for creating
        }
    }, [selectedRowData]);

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
            nullable: col.nullable,
            type: getInputTypeByNameAndType(col.name, col.type),
        }));

    console.log(selectedRowData);

    // ✅ Handle input changes
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

        if (method === "post") {
            post(payload);
        }

        if (method === "patch") {
            patch(payload);
        }
    };

    const parseDateTime = (dateTimeString) => {
        if (!dateTimeString) return null;

        try {
            const [datePart, timePart] = dateTimeString.split(" ");

            if (!datePart || !timePart) {
                throw new Error("Invalid date format");
            }

            const [year, month, day] = datePart.split("-").map(Number);
            const [hour, minute, second] = timePart.split(":").map(Number);

            // ✅ Manually create CalendarDateTime (no timezone conversion)
            const localDateTime = new CalendarDateTime(
                year,
                month,
                day,
                hour,
                minute,
                second
            );

            return localDateTime;
        } catch (error) {
            console.error("Invalid date format:", dateTimeString, error);
            return null;
        }
    };

    // ✅ Convert date string to CalendarDate format for DateInput
    const parseDate = (dateString) => {
        if (!dateString) return null;

        const date = new Date(dateString);
        return new CalendarDate(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate()
        );
    };

    const parseTime = (timeString) => {
        if (!timeString) return null;

        const [hours, minutes, seconds] = timeString.split(":").map(Number);

        if (!isNaN(hours) && !isNaN(minutes)) {
            return new Time(hours, minutes, seconds || 0);
        }

        return null;
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1">
                <Form
                    onSubmit={handleSubmit}
                    className="space-y-6 flex flex-col h-full w-full"
                >
                    {/* ✅ Model Form */}
                    <div className="flex-1 w-full">
                        <div className="space-y-2 flex-1 mt-3 h-full w-full">
                            <div className="w-full overflow-y-auto h-[50vh] space-y-2 md:overflow-y-auto md:scrollbar-thin md:scrollbar-track md:scrollbar-thumb pr-2">
                                {columns.map((col, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-4 items-center w-full"
                                    >
                                        {/* ✅ Dynamically render DateInput if date type */}
                                        {col.type === "boolean" ? (
                                            <Checkbox
                                                isSelected={!!formData[col.key]}
                                                onChange={(e) =>
                                                    handleChange(
                                                        col.key,
                                                        e.target.checked
                                                    )
                                                }
                                                className="w-full capitalize"
                                                isRequired={!col.nullable}
                                            >
                                                {col.label}
                                            </Checkbox>
                                        ) : col.type === "textarea" ? (
                                            <Textarea
                                                className="w-full capitalize"
                                                value={formData[col.key] || ""}
                                                onChange={(e) =>
                                                    handleChange(
                                                        col.key,
                                                        e.target.value
                                                    )
                                                }
                                                isRequired={!col.nullable}
                                                label={col.label}
                                                isClearable
                                                onClear={() =>
                                                    handleChange(col.key, "")
                                                }
                                            />
                                        ) : col.type === "time" ? (
                                            <TimeInput
                                                className="w-full capitalize"
                                                label={col.label}
                                                isRequired={!col.nullable}
                                                value={parseTime(
                                                    formData[col.key]
                                                )} // ✅ Use parseTime for proper formatting
                                                onChange={(time) =>
                                                    handleChange(
                                                        col.key,
                                                        time.toString()
                                                    )
                                                }
                                            />
                                        ) : col.type === "date" ? (
                                            <DatePicker
                                                className="w-full capitalize"
                                                label={col.label}
                                                isRequired={!col.nullable}
                                                value={parseDate(
                                                    formData[col.key]
                                                )}
                                                onChange={(date) =>
                                                    handleChange(
                                                        col.key,
                                                        date.toString()
                                                    )
                                                }
                                            />
                                        ) : col.type === "datetime" ? (
                                            <DatePicker
                                                className="w-full capitalize"
                                                label={col.label}
                                                isRequired={!col.nullable}
                                                granularity="minute"
                                                value={parseDateTime(
                                                    formData[col.key]
                                                )} // ✅ Use ZonedDateTime
                                                onChange={(dateTime) => {
                                                    handleChange(
                                                        col.key,
                                                        dateTime.toString()
                                                    ); // Store in ISO format
                                                    console.log(
                                                        dateTime.toString()
                                                    );
                                                }}
                                            />
                                        ) : col.type === "email" ? (
                                            <Input
                                                type="email"
                                                value={formData[col.key] || ""}
                                                onChange={(e) =>
                                                    handleChange(
                                                        col.key,
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full capitalize"
                                                isRequired={!col.nullable}
                                                label={col.label}
                                                isClearable
                                                onClear={() =>
                                                    handleChange(col.key, "")
                                                }
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
                                                className="w-full capitalize"
                                                isRequired={!col.nullable}
                                                label={col.label}
                                                isClearable
                                                onClear={() =>
                                                    handleChange(col.key, "")
                                                }
                                            />
                                        )}
                                    </div>
                                ))}

                                {/* ✅ Add password field dynamically for users */}
                                {selectedRow === "users" && (
                                    <div className="flex gap-4 items-center">
                                        <Input
                                            label="Password"
                                            type="password"
                                            value={formData["password"] || ""}
                                            onChange={(e) =>
                                                handleChange(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full"
                                            isRequired
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        color={`${method === "post" ? "secondary" : "success"}`}
                        className="w-full rounded-md"
                        isDisabled={method === "post" ? isPosting : isPatching}
                        isLoading={method === "post" ? isPosting : isPatching}
                    >
                        {`${
                            method === "post"
                                ? isPosting
                                    ? "Creating..."
                                    : "Create"
                                : isPatching
                                ? "Updating..."
                                : "Update"
                        }`}
                    </Button>
                </Form>
            </div>
        </div>
    );
};

// ✅ Helper function to determine input type by name or fallback to column type
const getInputTypeByNameAndType = (name, type) => {
    const lowerName = name.toLowerCase();
    const lowerType = type.toLowerCase();

    // Handle specific types first
    const typeMapping = {
        email: "email",
        password: "password",
        tel: "tel",
        url: "url",
        color: "color",
        file: "file",
        image: "file",
        date: "date",
        time: "time",
        datetime: "datetime",
        boolean: "checkbox",
        text: "textarea",
        string: "text",
        number: "number",
        integer: "number",
    };

    // Use type directly if it matches a known HTML input type

    // Fallback to name-based rules if type doesn't match
    if (lowerName.includes("email")) return "email";
    if (lowerName.includes("password")) return "password";
    if (lowerName.includes("phone") || lowerName.includes("contact"))
        return "tel";
    if (lowerName.includes("url") || lowerName.includes("website"))
        return "url";
    if (lowerName.includes("color")) return "color";
    if (lowerName.includes("file") || lowerName.includes("upload"))
        return "file";
    if (
        lowerName.includes("image") ||
        lowerName.includes("photo") ||
        lowerName.includes("avatar")
    )
        return "file";

    // Date and time
    if (lowerName.includes("datetime")) return "datetime";
    if (lowerName.includes("date") || lowerName.includes("day")) return "date";
    if (lowerName.includes("time")) return "time";

    // Number-related
    if (
        lowerName.includes("price") ||
        lowerName.includes("amount") ||
        lowerName.includes("total")
    )
        return "number";
    if (
        lowerName.includes("decimal") ||
        lowerName.includes("float") ||
        lowerName.includes("double")
    )
        return "number";
    if (lowerName.includes("quantity") || lowerName.includes("count"))
        return "number";

    // Text area and boolean
    if (
        lowerName.includes("description") ||
        lowerName.includes("comment") ||
        lowerName.includes("notes")
    )
        return "textarea";
    if (lowerName.includes("boolean") || lowerType === "boolean")
        return "checkbox";

    if (typeMapping[lowerType]) {
        return typeMapping[lowerType];
    }

    // Default fallback
    return "text";
};

export default DynamicForm;
