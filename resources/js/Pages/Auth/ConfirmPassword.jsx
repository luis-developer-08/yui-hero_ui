import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import MainLayout from "@/Layouts/MainLayout";
import { Card, CardBody, Form, Input } from "@heroui/react";
import { Head, useForm } from "@inertiajs/react";

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("password.confirm"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-[70vh]">
            <Head title="Confirm Password" />

            <Card
                isBlurred
                className="border-none bg-white/70 dark:bg-default-100/50 p-2 md:p-5 w-full rounded-none md:rounded-2xl md:w-5/12"
                shadow="sm"
            >
                <CardBody className="overflow-visible py-2">
                    <div className="grid grid-cols-6 md:grid-cols-12 gap-4 md:gap-10 items-center justify-center">
                        <div className="flex flex-col col-span-6 md:col-span-12">
                            <div className="mb-4 text-sm text-gray-600">
                                This is a secure area of the application. Please
                                confirm your password before continuing.
                            </div>

                            <Form onSubmit={submit}>
                                <div className="mt-4 w-full">
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full"
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

                                <div className="mt-4 flex items-center justify-end w-full">
                                    <PrimaryButton
                                        type="submit"
                                        className="ms-4"
                                        disabled={processing}
                                    >
                                        Confirm
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

ConfirmPassword.layout = (page) => <MainLayout>{page}</MainLayout>;
