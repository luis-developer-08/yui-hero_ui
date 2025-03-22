import { Button } from "@heroui/react";

export default function DangerButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <Button color="danger" {...props} isDisabled={disabled}>
            {children}
        </Button>
    );
}
