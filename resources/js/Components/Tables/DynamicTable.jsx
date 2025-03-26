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
} from "@heroui/react";
import useOrionSearch from "@/Hooks/useOrionSearch";
import useOrionModelStore from "@/ZustandStores/useOrionModelStore";
import useOrionDelete from "@/Hooks/useOrionDelete";
import { useQueryClient } from "@tanstack/react-query";
import useDynamicFormStore from "@/ZustandStores/useDynamicFormStore";
import useSelectedRowStore from "@/ZustandStores/useSelectedRowStore";

const DynamicTable = ({ filterValue, currentPage, setCurrentPage }) => {
    const { selectedRow } = useOrionModelStore();
    const queryClient = useQueryClient();
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
        filterValue || ""
    );

    const { mutate: deleteItem, isLoading: isDeleting } =
        useOrionDelete(selectedRow);

    // ✅ Update total pages only when data changes
    useEffect(() => {
        if (data?.pagination?.last_page) {
            setTotalPages(data.pagination.last_page);
            setTotalResults(data.pagination.total);
        }
    }, [data]);

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
                    queryClient.invalidateQueries(["orionSearch", selectedRow]);
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

    // ✅ Prepare columns for rendering
    const allColumns = [
        ...columns.map((col) => ({ key: col.name, label: col.name })),
        { key: "actions", label: "Actions" },
    ];

    return (
        <div className="flex flex-col gap-4">
            {isLoading ? (
                <div className="h-[50vh] w-full bg-sky-300/50 rounded-md flex items-center justify-center p-20">
                    <Spinner label="Loading..." />
                </div>
            ) : isError ? (
                <div className="text-center text-red-500">
                    Error loading data. Please try again.
                </div>
            ) : (
                <Table
                    aria-label={selectedRow}
                    removeWrapper
                    selectionMode="multiple"
                    isCompact
                    color="secondary"
                    rowHeight={50}
                    isHeaderSticky
                    className="h-[50vh] overflow-auto md:overflow-y-auto md:scrollbar-thin md:scrollbar-track md:scrollbar-thumb pr-2"
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
                                {column.label}
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
                    <TableBody emptyContent={"No rows to display."}>
                        {sortedItems.map((item) => (
                            <TableRow key={item.id || item.key}>
                                {columns.map((column) => (
                                    <TableCell key={column.name}>
                                        {getKeyValue(item, column.name) ?? "—"}
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
                                        <DropdownMenu aria-label="Static Actions">
                                            <DropdownItem
                                                key="edit"
                                                color="success"
                                                onPress={() => {
                                                    setSelectedRowData(item);
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
                                                    handleDelete(item.id);
                                                }}
                                            >
                                                Delete file
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* ✅ Hero UI Pagination */}
            <div className="flex justify-between items-center mt-4">
                <span className="text-xs">Total Results: {totalResults}</span>
                <span className="text-xs">
                    Page {currentPage} of {totalPages}
                </span>
                <Pagination
                    total={totalPages || 1}
                    initialPage={1}
                    page={currentPage || 1}
                    onChange={setCurrentPage}
                    color="secondary"
                    showControls
                    isCompact
                />
                {/* <Pagination
                    total={3}
                    page={1}
                    color="secondary"
                    showControls
                    isCompact
                /> */}
            </div>
        </div>
    );
};

export default DynamicTable;
