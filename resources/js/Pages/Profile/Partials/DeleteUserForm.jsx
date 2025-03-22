import DangerButton from "@/Components/DangerButton";
import InputError from "@/Components/InputError";
import SecondaryButton from "@/Components/SecondaryButton";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    Input,
} from "@heroui/react";
import { useForm } from "@inertiajs/react";
import { useRef, useState } from "react";

export default function DeleteUserForm({ className = "" }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Delete Account
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Before deleting your account,
                    please download any data or information that you wish to
                    retain.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                Delete Account
            </DangerButton>

            <Modal
                isOpen={confirmingUserDeletion}
                size={"2xl"}
                onClose={closeModal}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <Form onSubmit={deleteUser} className="p-6 w-full">
                                <ModalHeader className="flex flex-col gap-1">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Are you sure you want to delete your
                                        account?
                                    </h2>
                                </ModalHeader>
                                <ModalBody>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Once your account is deleted, all of its
                                        resources and data will be permanently
                                        deleted. Please enter your password to
                                        confirm you would like to permanently
                                        delete your account.
                                    </p>

                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        ref={passwordInput}
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="mt-1 block w-3/4"
                                        isFocused
                                        // placeholder="Password"
                                        labelPlacement="outside"
                                        label="Password"
                                    />

                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <div className="mt-6 flex justify-end gap-3">
                                        <SecondaryButton onPress={closeModal}>
                                            Cancel
                                        </SecondaryButton>

                                        <DangerButton
                                            type="submit"
                                            className="ms-3"
                                            disabled={processing}
                                        >
                                            Delete Account
                                        </DangerButton>
                                    </div>
                                </ModalFooter>
                            </Form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </section>
    );
}
