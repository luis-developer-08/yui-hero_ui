import { AiOutlineClose } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";
import SectionCard from "@/Components/SectionCard";
import OrionModelsTable from "@/Components/Tables/OrionModelsTable";
import { Button } from "@heroui/react";
import useOrionFetch from "@/Hooks/useOrionFetch";
import DynamicTable from "@/Components/Tables/DynamicTable";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CreateTableForm from "@/Components/Forms/CreateTableForm";
import useOrionModelStore from "@/ZustandStores/useOrionModelStore";
import DynamicForm from "@/Components/Forms/DynamicForm";

export default function Dashboard() {
    const { data, isLoading, isError } = useOrionFetch("orion-models");

    const [addingModel, setAddingModel] = useState(false);
    const [addingRow, setAddingRow] = useState(false);
    const { selectedRow } = useOrionModelStore();

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

            <SectionCard>You are Login!!</SectionCard>

            {/* Ongoing updates use at your own risk */}
            {/* <SectionCard>
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
                                            duration: 0.4,
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
                                            duration: 0.4,
                                            ease: "easeInOut",
                                        }}
                                        className=" h-full flex flex-col gap-1"
                                    >
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex justify-between mb-4 capitalize bg-white rounded-md py-2 px-4">
                                                <h2 className="text-xl font-semibold">
                                                    {selectedRow}
                                                </h2>
                                                {addingRow ? (
                                                    <Button
                                                        color="danger"
                                                        className="rounded-md"
                                                        size="sm"
                                                        onPress={() =>
                                                            setAddingRow(false)
                                                        }
                                                    >
                                                        <AiOutlineClose />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        color="primary"
                                                        className="rounded-md"
                                                        size="sm"
                                                        onPress={() =>
                                                            setAddingRow(true)
                                                        }
                                                    >
                                                        <AiOutlinePlus />
                                                    </Button>
                                                )}
                                            </div>
                                            {addingRow ? (
                                                <DynamicForm
                                                    setAddingRow={setAddingRow}
                                                />
                                            ) : (
                                                <DynamicTable />
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
                                setAddingRow={setAddingRow}
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
            </SectionCard> */}
        </div>
    );
}

Dashboard.layout = (page) => <MainLayout>{page}</MainLayout>;
