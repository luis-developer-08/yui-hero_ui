import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { Card, CardBody, Form, Input } from "@heroui/react";
import MainLayout from "@/Layouts/MainLayout";
import { Head, useForm } from "@inertiajs/react";

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("password.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-[70vh]">
            <Head title="Reset Password" />

            <Card
                isBlurred
                className="border-none bg-white/70 dark:bg-default-100/50 p-2 md:p-5 w-full rounded-none md:rounded-2xl md:w-5/12"
                shadow="sm"
            >
                <CardBody className="overflow-visible py-2">
                    <div className="grid grid-cols-6 md:grid-cols-12 gap-4 md:gap-10 items-center justify-center">
                        <div className="flex flex-col col-span-6 md:col-span-12">
                            <Form onSubmit={submit}>
                                <div className="w-full">
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        autoComplete="username"
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        labelPlacement="outside"
                                        label="Email"
                                    />

                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4 w-full">
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        labelPlacement="outside"
                                        label="Password"
                                    />

                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4 w-full">
                                    <Input
                                        type="password"
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        labelPlacement="outside"
                                        label="Confirm Password"
                                    />

                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4 flex items-center justify-end w-full">
                                    <PrimaryButton
                                        type="submit"
                                        className="ms-4"
                                        disabled={processing}
                                    >
                                        Reset Password
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

ResetPassword.layout = (page) => <MainLayout>{page}</MainLayout>;
