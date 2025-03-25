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
        </div>
    );
}

Dashboard.layout = (page) => <MainLayout>{page}</MainLayout>;
