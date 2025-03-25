import React, { useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Spinner,
    getKeyValue,
    Button,
    addToast,
} from "@heroui/react";
import useOrionFetch from "@/Hooks/useOrionFetch";
import useOrionModelStore from "@/ZustandStores/useOrionModelStore";
import useOrionDelete from "@/Hooks/useOrionDelete";
import { useQueryClient } from "@tanstack/react-query";
import useDynamicFormStore from "@/ZustandStores/useDynamicFormStore";
import useSelectedRowStore from "@/ZustandStores/useSelectedRowStore";

const DynamicTable = () => {
    const { selectedRow } = useOrionModelStore();
    const { data, isLoading, isError } = useOrionFetch(selectedRow);
    const queryClient = useQueryClient();
    const { openForm, setMethod } = useDynamicFormStore();
    const { setSelectedRowData } = useSelectedRowStore();

    const { mutate: deleteItem, isLoading: isDeleting } =
        useOrionDelete(selectedRow);

    // ✅ Handle delete click
    const handleDelete = (id) => {
        deleteItem(id, {
            onSuccess: (success) => {
                if (success) {
                    addToast({
                        title: "Success",
                        description: `Item with ID ${id} deleted successfully.`,
                        type: "success",
                    });
                    queryClient.invalidateQueries(["orion", selectedRow]);
                } else {
                    addToast({
                        title: "Error",
                        description: `Failed to delete item with ID ${id}.`,
                        type: "error",
                    });
                }
            },
            onError: () => {
                addToast({
                    title: "Error",
                    description: "An error occurred while deleting the item.",
                    type: "error",
                });
            },
        });
    };

    // Handle loading and error states
    if (isLoading) {
        return (
            <div className="h-full w-full bg-sky-200/50 rounded-md flex items-center justify-center p-20">
                <Spinner label="Loading..." />
            </div>
        );
    }

    const columns = data.columns.map((col) => ({
        key: col.name,
        label: col.name,
    }));

    // ✅ Add "Actions" column at the end
    const allColumns = [...columns, { key: "actions", label: "Actions" }];

    return (
        <Table
            aria-label={selectedRow}
            removeWrapper
            selectionMode="multiple"
            isCompact
            color="secondary"
        >
            <TableHeader>
                {allColumns.map((column) => (
                    <TableColumn
                        key={column.key}
                        className={`${
                            column.key === "actions"
                                ? "flex justify-end items-center"
                                : ""
                        }`}
                    >
                        {column.label}
                    </TableColumn>
                ))}
            </TableHeader>
            <TableBody items={data} emptyContent={"No rows to display."}>
                {data.data.map((item) => (
                    <TableRow key={item.id || item.key}>
                        {columns.map((column) => (
                            <TableCell key={column.key}>
                                {getKeyValue(item, column.key) ?? "—"}
                            </TableCell>
                        ))}
                        <TableCell className="flex justify-end gap-1">
                            <Button
                                color="success"
                                size="sm"
                                onPress={() => {
                                    setSelectedRowData(item);
                                    setMethod("patch");
                                    openForm();
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                color="danger"
                                size="sm"
                                isLoading={isDeleting}
                                onPress={() => {
                                    handleDelete(item.id);
                                }}
                            >
                                Delete
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default DynamicTable;
