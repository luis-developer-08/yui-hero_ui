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
    Dropdown,
    DropdownTrigger,
    Button,
    DropdownMenu,
    DropdownItem,
} from "@heroui/react";
import useOrionModelStore from "@/ZustandStores/useOrionModelStore";
import useDynamicFormStore from "@/ZustandStores/useDynamicFormStore";
import { FaEllipsisV } from "react-icons/fa";

const OrionModels = ({ data = [], isLoading, isError, setAddingModel }) => {
    const { selectedRow, setSelectedRow } = useOrionModelStore();
    const { closeForm } = useDynamicFormStore();

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
            isHeaderSticky
        >
            <TableHeader>
                <TableColumn>Existing Models</TableColumn>
                {isLoading ? (
                    <></>
                ) : (
                    <TableColumn className="flex justify-end items-center">
                        Action
                    </TableColumn>
                )}
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
                                closeForm();
                            }}
                            className="cursor-pointer p-0"
                        >
                            <TableCell>
                                <span className="capitalize">{item.name}</span>
                            </TableCell>
                            <TableCell className="flex justify-end items-center">
                                <Dropdown
                                    className="flex justify-end items-center m-0"
                                    placement="bottom-end"
                                >
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
                                        >
                                            Edit Model
                                        </DropdownItem>
                                        <DropdownItem
                                            key="delete"
                                            className="text-danger"
                                            color="danger"
                                        >
                                            Delete Model
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            )}
        </Table>
    );
};

export default OrionModels;
