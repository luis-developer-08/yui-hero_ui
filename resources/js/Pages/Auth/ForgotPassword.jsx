import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { Card, CardBody, Form, Input } from "@heroui/react";
import MainLayout from "@/Layouts/MainLayout";
import { Head, useForm } from "@inertiajs/react";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-[70vh]">
            <Head title="Forgot Password" />

            <Card
                isBlurred
                className="border-none bg-white/70 dark:bg-default-100/50 p-2 md:p-5 w-full rounded-none md:rounded-2xl md:w-5/12"
                shadow="sm"
            >
                <CardBody className="overflow-visible py-2">
                    <div className="grid grid-cols-6 md:grid-cols-12 gap-4 md:gap-10 items-center justify-center">
                        <div className="flex flex-col col-span-6 md:col-span-12">
                            <div className="mb-4 text-sm text-gray-600">
                                Forgot your password? No problem. Just let us
                                know your email address and we will email you a
                                password reset link that will allow you to
                                choose a new one.
                            </div>

                            {status && (
                                <div className="mb-4 text-sm font-medium text-green-600">
                                    {status}
                                </div>
                            )}

                            <Form onSubmit={submit}>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    labelPlacement="outside"
                                    label={"Email"}
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />

                                <div className="mt-4 flex items-center justify-end w-full">
                                    <PrimaryButton
                                        className="ms-4"
                                        disabled={processing}
                                    >
                                        Email Password Reset Link
                                    </PrimaryButton>
                                </div>
                            </Form>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

ForgotPassword.layout = (page) => <MainLayout>{page}</MainLayout>;
