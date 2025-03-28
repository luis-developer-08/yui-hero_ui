import { AiOutlineSearch, AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";
import SectionCard from "@/Components/SectionCard";
import OrionModelsTable from "@/Components/Tables/OrionModelsTable";
import { Button, Input } from "@heroui/react";
import useOrionFetch from "@/Hooks/useOrionFetch";
import DynamicTable from "@/Components/Tables/DynamicTable";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CreateTableForm from "@/Components/Forms/CreateTableForm";
import useOrionModelStore from "@/ZustandStores/useOrionModelStore";
import DynamicForm from "@/Components/Forms/DynamicForm";
import useDynamicFormStore from "@/ZustandStores/useDynamicFormStore";
import useSelectedRowStore from "@/ZustandStores/useSelectedRowStore";
import _ from "lodash"; // ✅ Import lodash

export default function Dashboard() {
    const { data, isLoading, isError } = useOrionFetch("orion-models");
    const [addingModel, setAddingModel] = useState(false);
    const { isOpen, openForm, closeForm, setMethod } = useDynamicFormStore();
    const { selectedRow } = useOrionModelStore();
    const { clearSelectedRowData } = useSelectedRowStore();

    const [filterValue, setFilterValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // ✅ Debounced handler
    const debouncedFilterChange = useCallback(
        _.debounce((value) => {
            setCurrentPage(1);
            setFilterValue(value);
        }, 500),
        []
    );

    const handleInputChange = (e) => {
        const value = e.target.value;
        debouncedFilterChange(value);
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    const buttonVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 10 },
        visible: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: -10 },
    };

    return (
        <div className="min-h-screen overflow-auto-y py-5">
            <Head title="Dashboard" />

            <SectionCard>
                <div className="grid grid-cols-6 md:grid-cols-12 gap-3 md:gap-5 items-center justify-center h-[75vh]">
                    <div className="flex flex-col col-span-6 md:col-span-9 h-full w-full">
                        <div className="flex-1 w-full h-full">
                            <AnimatePresence mode="wait">
                                {addingModel ? (
                                    <motion.div
                                        key="create-form"
                                        variants={contentVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        transition={{
                                            duration: 0.2,
                                            ease: "easeInOut",
                                        }}
                                        className="h-full"
                                    >
                                        <CreateTableForm />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="dynamic-table"
                                        variants={contentVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        transition={{
                                            duration: 0.2,
                                            ease: "easeInOut",
                                        }}
                                        className=" h-full flex flex-col gap-1"
                                    >
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex justify-between mb-4 capitalize bg-white rounded-md py-2 px-4">
                                                <h2 className="text-xl font-semibold">
                                                    {selectedRow}
                                                </h2>
                                                {isOpen ? (
                                                    <Button
                                                        color="danger"
                                                        className="rounded-md"
                                                        size="sm"
                                                        onPress={() =>
                                                            closeForm()
                                                        }
                                                    >
                                                        <AiOutlineClose />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        color="primary"
                                                        className="rounded-md"
                                                        size="sm"
                                                        onPress={() => {
                                                            clearSelectedRowData();
                                                            setMethod("post");
                                                            openForm();
                                                            setFilterValue("");
                                                        }}
                                                    >
                                                        <AiOutlinePlus />
                                                    </Button>
                                                )}
                                            </div>
                                            {isOpen ? (
                                                <motion.div
                                                    key="dynamic-form"
                                                    variants={contentVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    transition={{
                                                        duration: 0.2,
                                                        ease: "easeInOut",
                                                    }}
                                                    className="h-full"
                                                >
                                                    <DynamicForm />
                                                </motion.div>
                                            ) : (
                                                <>
                                                    <div className="flex mb-2">
                                                        <Input
                                                            type="text"
                                                            placeholder="Search..."
                                                            onChange={
                                                                handleInputChange
                                                            } // ✅ Debounced input
                                                            endContent={
                                                                <AiOutlineSearch />
                                                            }
                                                        />
                                                    </div>
                                                    <motion.div
                                                        key={`dynamic-table-${selectedRow}`}
                                                        variants={
                                                            contentVariants
                                                        }
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        transition={{
                                                            duration: 0.2,
                                                            ease: "easeInOut",
                                                        }}
                                                    >
                                                        <DynamicTable
                                                            filterValue={
                                                                filterValue
                                                            }
                                                            currentPage={
                                                                currentPage
                                                            }
                                                            setCurrentPage={
                                                                setCurrentPage
                                                            }
                                                        />
                                                    </motion.div>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex flex-col col-span-6 md:col-span-3 h-full w-full">
                        <div className="flex-1 w-full">
                            <OrionModelsTable
                                setAddingModel={setAddingModel}
                                isLoading={isLoading}
                                isError={isError}
                                data={data}
                            />
                        </div>

                        <AnimatePresence mode="wait">
                            {addingModel ? (
                                <motion.div
                                    key="cancel-buttons"
                                    variants={buttonVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeInOut",
                                    }}
                                    className="flex w-full gap-2"
                                >
                                    <Button
                                        className="w-full rounded-md"
                                        color="danger"
                                        onPress={() => setAddingModel(false)}
                                    >
                                        Cancel
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="new-table-button"
                                    variants={buttonVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeInOut",
                                    }}
                                    className="w-full"
                                >
                                    <Button
                                        className="w-full rounded-md"
                                        color="secondary"
                                        onPress={() => setAddingModel(true)}
                                    >
                                        New Model
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </SectionCard>
        </div>
    );
}

Dashboard.layout = (page) => <MainLayout>{page}</MainLayout>;
