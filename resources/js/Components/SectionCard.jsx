import React from "react";
import { Card, CardBody } from "@heroui/react";

const SectionCard = ({ children }) => {
    return (
        <Card
            isBlurred
            className="border-none bg-white/70 dark:bg-default-100/50 p-2 md:p-5 w-full rounded-none md:rounded-2xl"
            shadow="sm"
        >
            <CardBody className="overflow-visible py-2">{children}</CardBody>
        </Card>
    );
};

export default SectionCard;
