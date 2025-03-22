import { Button } from "@heroui/react";

export default function PrimaryButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <Button {...props} color="primary" isDisabled={disabled}>
            {children}
        </Button>
    );
}
