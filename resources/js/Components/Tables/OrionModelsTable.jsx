import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    getKeyValue,
    Spinner,
} from "@heroui/react";
import useOrionModelStore from "@/ZustandStores/useOrionModelStore";

const OrionModels = ({
    data = [],
    isLoading,
    isError,
    setAddingModel,
    setAddingRow,
}) => {
    const { selectedRow, setSelectedRow } = useOrionModelStore();

    // Handle selection and store the "name" in Zustand
    const handleSelectionChange = (keys) => {
        const selectedKey = Array.from(keys)[0]; // Get the first selected key

        if (!data.data.length) return; // Prevent errors on empty data

        // Ensure selectedKey is properly compared as a number
        const selectedItem = data.data.find(
            (item) => String(item.id) === String(selectedKey)
        );

        if (selectedItem) {
            setSelectedRow(selectedItem.name);
        }
    };

    // Map the stored "name" back to its "id" for proper selection
    const selectedId = !isLoading
        ? data.data.find((item) => item.name === selectedRow)?.id
        : 1;

    return (
        <Table
            aria-label="OrionModels"
            selectionMode="single"
            selectedKeys={
                selectedId ? new Set([String(selectedId)]) : new Set()
            }
            onSelectionChange={handleSelectionChange}
            color="primary"
            removeWrapper
            isCompact
        >
            <TableHeader>
                <TableColumn>Existing Models</TableColumn>
            </TableHeader>
            {isLoading ? (
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <div className="flex justify-center">
                                <Spinner label="Loading..." />
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            ) : (
                <TableBody items={data.data}>
                    {(item) => (
                        <TableRow
                            key={String(item.id)}
                            onClick={() => {
                                setAddingModel(false);
                                setAddingRow(false);
                            }}
                            className="cursor-pointer"
                        >
                            <TableCell className="rounded-md">
                                <span className="capitalize">{item.name}</span>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            )}
        </Table>
    );
};

export default OrionModels;
