import PrimaryButton from "@/Components/PrimaryButton";
import { Card, CardBody, Form, Input } from "@heroui/react";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route("verification.send"));
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-[70vh]">
            <Head title="Email Verification" />

            <Card
                isBlurred
                className="border-none bg-white/70 dark:bg-default-100/50 p-2 md:p-5 w-full rounded-none md:rounded-2xl md:w-5/12"
                shadow="sm"
            >
                <CardBody className="overflow-visible py-2">
                    <div className="grid grid-cols-6 md:grid-cols-12 gap-4 md:gap-10 items-center justify-center">
                        <div className="flex flex-col col-span-6 md:col-span-12">
                            <div className="mb-4 text-sm text-gray-600">
                                Thanks for signing up! Before getting started,
                                could you verify your email address by clicking
                                on the link we just emailed to you? If you
                                didn't receive the email, we will gladly send
                                you another.
                            </div>

                            {status === "verification-link-sent" && (
                                <div className="mb-4 text-sm font-medium text-green-600">
                                    A new verification link has been sent to the
                                    email address you provided during
                                    registration.
                                </div>
                            )}

                            <Form onSubmit={submit}>
                                <div className="mt-4 flex items-center justify-between w-full">
                                    <PrimaryButton
                                        type="submit"
                                        disabled={processing}
                                    >
                                        Resend Verification Email
                                    </PrimaryButton>

                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Log Out
                                    </Link>
                                </div>
                            </Form>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

VerifyEmail.layout = (page) => <MainLayout>{page}</MainLayout>;
