import { FaEllipsisV } from "react-icons/fa";
import React, { useEffect, useState } from "react";
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
    Pagination,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    DropdownTrigger,
    Divider,
} from "@heroui/react";
import useOrionSearch from "@/Hooks/useOrionSearch";
import useOrionModelStore from "@/ZustandStores/useOrionModelStore";
import useOrionDelete from "@/Hooks/useOrionDelete";
import { useQueryClient } from "@tanstack/react-query";
import useDynamicFormStore from "@/ZustandStores/useDynamicFormStore";
import useSelectedRowStore from "@/ZustandStores/useSelectedRowStore";
import useOrionBatchDelete from "@/Hooks/useOrionBatchDelete";
import { motion } from "framer-motion";
import useOrionRestore from "@/Hooks/useOrionRestore";
import useOrionBatchRestore from "@/Hooks/useOrionBatchRestore ";

const DynamicTable = ({
    filterValue,
    currentPage,
    setCurrentPage,
    isTrashed,
    selectedKeys,
    setSelectedKeys,
    totalSelectedRows,
    setTotalSelectedRows,
}) => {
    const queryClient = useQueryClient();
    const { selectedRow } = useOrionModelStore();
    const { openForm, setMethod } = useDynamicFormStore();
    const { setSelectedRowData } = useSelectedRowStore();

    // ✅ State management
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalResults, setTotalResults] = useState(0);

    const [sortDescriptor, setSortDescriptor] = useState({
        column: "id",
        direction: "ascending",
    });

    // ✅ Fetch data using useQuery-based `useOrionSearch`
    const { data, isLoading, isError } = useOrionSearch(
        selectedRow,
        { page: currentPage, per_page: itemsPerPage },
        filterValue || "",
        isTrashed
    );

    const { mutate: deleteItem, isLoading: isDeleting } =
        useOrionDelete(selectedRow);

    const { mutate: batchDelete, isLoading: isBatchDeleting } =
        useOrionBatchDelete(selectedRow);

    const { mutate: restoreItem, isLoading: isRestoring } =
        useOrionRestore(selectedRow);

    const { mutate: batchRestore, isLoading: isBatchRestoring } =
        useOrionBatchRestore(selectedRow);

    // ✅ Update total pages only when data changes
    useEffect(() => {
        if (data?.pagination?.last_page) {
            setTotalPages(data.pagination.last_page);
            setTotalResults(data.pagination.total);
        }
    }, [data]);

    // ✅ Handle delete click
    const handleDelete = (id, force) => {
        deleteItem(
            { id, force },
            {
                onSuccess: (success) => {
                    if (success) {
                        addToast({
                            title: "Success",
                            description: `Item with ID ${id} ${
                                force ? "permanently" : "soft"
                            } deleted successfully.`,
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
                        description:
                            "An error occurred while deleting the item.",
                        type: "error",
                    });
                },
            }
        );
    };

    const handleBatchDelete = (force) => {
        if (selectedKeys.size === 0) {
            addToast({
                title: "No Selection",
                description: "Please select rows to delete.",
                type: "warning",
            });
            return;
        }

        const idsToDelete = Array.from(selectedKeys);

        batchDelete(
            { idsToDelete, force },
            {
                onSuccess: () => {
                    addToast({
                        title: "Success",
                        description: `${idsToDelete.length} rows deleted successfully.`,
                        type: "success",
                    });

                    // ✅ Clear selection and refresh table
                    setSelectedKeys(new Set());
                    setTotalSelectedRows(0);
                    queryClient.invalidateQueries(["orion", selectedRow]);
                },
                onError: () => {
                    addToast({
                        title: "Error",
                        description: "Failed to delete selected rows.",
                        type: "error",
                    });
                },
            }
        );
    };

    const handleRestore = (id) => {
        restoreItem(id, {
            onSuccess: (success) => {
                if (success) {
                    addToast({
                        title: "Success",
                        description: `Item with ID ${id} restored successfully.`,
                        type: "success",
                    });
                    queryClient.invalidateQueries(["orion", selectedRow]);
                } else {
                    addToast({
                        title: "Error",
                        description: `Failed to restore item with ID ${id}.`,
                        type: "error",
                    });
                }
            },
            onError: () => {
                addToast({
                    title: "Error",
                    description: "An error occurred while restoring the item.",
                    type: "error",
                });
            },
        });
    };

    const handleBatchRestore = () => {
        if (selectedKeys.size === 0) {
            addToast({
                title: "No Selection",
                description: "Please select rows to delete.",
                type: "warning",
            });
            return;
        }

        const idsToRestore = Array.from(selectedKeys);

        batchRestore(idsToRestore, {
            onSuccess: () => {
                addToast({
                    title: "Success",
                    description: `${idsToRestore.length} rows restored successfully.`,
                    type: "success",
                });

                // ✅ Clear selection and refresh table
                setSelectedKeys(new Set());
                setTotalSelectedRows(0);
                queryClient.invalidateQueries(["orion", selectedRow]);
            },
            onError: () => {
                addToast({
                    title: "Error",
                    description: "Failed to restore selected rows.",
                    type: "error",
                });
            },
        });
    };

    // ✅ Extract columns and items
    const { columns = [], data: items = [] } = data || {};

    // ✅ Sorting logic
    const sortedItems = [...items].sort((a, b) => {
        const columnKey = sortDescriptor.column;
        const direction = sortDescriptor.direction === "ascending" ? 1 : -1;

        const aValue = a[columnKey] ?? "";
        const bValue = b[columnKey] ?? "";

        if (typeof aValue === "string" && typeof bValue === "string") {
            return direction * aValue.localeCompare(bValue);
        }
        return direction * (aValue > bValue ? 1 : -1);
    });

    const handleSortChange = (column) => {
        const newDirection =
            sortDescriptor.column === column &&
            sortDescriptor.direction === "ascending"
                ? "descending"
                : "ascending";

        setSortDescriptor({ column, direction: newDirection });
    };

    const handleSelectionChange = (selection) => {
        if (selection === "all") {
            const allIds = sortedItems.map((item) => item.id.toString());
            setSelectedKeys(new Set(allIds));
            setTotalSelectedRows(allIds.length);
        } else {
            setSelectedKeys(selection);
            setTotalSelectedRows(selection.size);
        }
    };
    // ✅ Prepare columns for rendering
    const allColumns = [
        ...columns.map((col) => ({ key: col.name, label: col.name })),
        { key: "actions", label: "Actions" },
    ];

    return (
        <div className="flex flex-col gap-4">
            {isLoading ? (
                <div className="h-[38vh] w-full bg-sky-300/50 rounded-md flex items-center justify-center p-20">
                    <Spinner label="Loading..." />
                </div>
            ) : isError ? (
                <div className="h-[38vh] w-full text-center text-red-500">
                    Error loading data. Please try again.
                </div>
            ) : (
                <motion.div
                    initial={{ x: "-100%", opacity: 0 }}
                    animate={{ x: "0%", opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <Table
                        aria-label={selectedRow}
                        removeWrapper
                        selectionMode="multiple"
                        selectedKeys={selectedKeys}
                        onSelectionChange={handleSelectionChange}
                        isCompact
                        color="secondary"
                        rowHeight={50}
                        isHeaderSticky
                        className="h-[38vh] overflow-auto md:overflow-y-auto md:scrollbar-thin md:scrollbar-track md:scrollbar-thumb pr-2"
                    >
                        <TableHeader>
                            {allColumns.map((column) => (
                                <TableColumn
                                    key={column.key}
                                    onClick={() =>
                                        column.key !== "actions" &&
                                        handleSortChange(column.key)
                                    }
                                    className={`cursor-pointer ${
                                        sortDescriptor.column === column.key
                                            ? "font-bold"
                                            : ""
                                    } ${
                                        column.key === "actions"
                                            ? "flex justify-end items-center"
                                            : ""
                                    }`}
                                >
                                    {column.key === "actions"
                                        ? ""
                                        : column.label}
                                    {sortDescriptor.column === column.key && (
                                        <span className="ml-1">
                                            {sortDescriptor.direction ===
                                            "ascending"
                                                ? "↑"
                                                : "↓"}
                                        </span>
                                    )}
                                </TableColumn>
                            ))}
                        </TableHeader>
                        <TableBody
                            emptyContent={"No rows to display."}
                            items={sortedItems}
                        >
                            {(item) => (
                                <TableRow key={item.id || item.key}>
                                    {columns.map((column) => (
                                        <TableCell key={column.name}>
                                            {getKeyValue(item, column.name) ??
                                                "—"}
                                        </TableCell>
                                    ))}
                                    <TableCell className="flex justify-end gap-1">
                                        <Dropdown>
                                            <DropdownTrigger>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="border-none"
                                                >
                                                    <FaEllipsisV className="text-gray-500" />
                                                </Button>
                                            </DropdownTrigger>
                                            {isTrashed ? (
                                                <DropdownMenu aria-label="Static Actions">
                                                    <DropdownItem
                                                        key="restore"
                                                        color="success"
                                                        onPress={() => {
                                                            handleRestore(
                                                                item.id
                                                            );
                                                        }}
                                                    >
                                                        Restore
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        key="delete"
                                                        className="text-danger"
                                                        color="danger"
                                                        onPress={() => {
                                                            handleDelete(
                                                                item.id,
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        Delete Permanently
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            ) : (
                                                <DropdownMenu aria-label="Static Actions">
                                                    <DropdownItem
                                                        key="edit"
                                                        color="success"
                                                        onPress={() => {
                                                            setSelectedRowData(
                                                                item
                                                            );
                                                            setMethod("patch");
                                                            openForm();
                                                        }}
                                                    >
                                                        Edit file
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        key="delete"
                                                        className="text-danger"
                                                        color="danger"
                                                        onPress={() => {
                                                            handleDelete(
                                                                item.id,
                                                                false
                                                            );
                                                        }}
                                                    >
                                                        Delete file
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            )}
                                        </Dropdown>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </motion.div>
            )}

            {/* ✅ Hero UI Pagination */}

            <div className="flex justify-between items-center mt-4">
                <div className="flex flex-col">
                    <span className="text-xs">
                        Total Results: {totalResults}
                    </span>
                    <span className="text-xs">
                        Page {currentPage} of {totalPages}
                    </span>
                </div>

                <Pagination
                    total={totalPages || 1}
                    initialPage={1}
                    page={currentPage || 1}
                    onChange={setCurrentPage}
                    color="secondary"
                    showControls
                    isCompact
                />
            </div>
            <Divider />
            <div className="flex justify-between items-center mt-6">
                <span className="text-xs">
                    Total Selected Rows: {totalSelectedRows}
                </span>
                <div className="flex gap-2">
                    {isTrashed ? (
                        <Button
                            color="success"
                            radius="sm"
                            isLoading={isBatchDeleting}
                            onPress={() => {
                                handleBatchRestore();
                            }}
                            isDisabled={
                                totalSelectedRows <= 0 ||
                                totalSelectedRows == "all"
                            }
                        >
                            Bulk Restore
                        </Button>
                    ) : null}
                    <Button
                        color="danger"
                        radius="sm"
                        isLoading={isBatchDeleting}
                        onPress={() => {
                            isTrashed
                                ? handleBatchDelete(true)
                                : handleBatchDelete(false);
                        }}
                        isDisabled={
                            totalSelectedRows <= 0 || totalSelectedRows == "all"
                        }
                    >
                        {isTrashed ? "Bulk Permanent Delete" : "Bulk Delete"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DynamicTable;
