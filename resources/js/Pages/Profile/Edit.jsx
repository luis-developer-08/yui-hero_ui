import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import MainLayout from "@/Layouts/MainLayout";
import { Card, CardBody, Form, Input } from "@heroui/react";

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <>
            <Head title="Profile" />

            <div className="py-12 flex flex-col gap-10">
                <Card
                    isBlurred
                    className="border-none bg-white/70 dark:bg-default-100/50 p-2 md:p-5 w-full rounded-none md:rounded-2xl"
                    shadow="sm"
                >
                    <CardBody className="overflow-visible py-2">
                        <div className="grid grid-cols-6 md:grid-cols-12 gap-4 md:gap-10 items-center justify-center">
                            <div className="flex flex-col col-span-6 md:col-span-12">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    className="max-w-xl"
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card
                    isBlurred
                    className="border-none bg-white/70 dark:bg-default-100/50 p-2 md:p-5 w-full rounded-none md:rounded-2xl"
                    shadow="sm"
                >
                    <CardBody className="overflow-visible py-2">
                        <div className="grid grid-cols-6 md:grid-cols-12 gap-4 md:gap-10 items-center justify-center">
                            <div className="flex flex-col col-span-6 md:col-span-12">
                                <UpdatePasswordForm className="max-w-xl" />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card
                    isBlurred
                    className="border-none bg-white/70 dark:bg-default-100/50 p-2 md:p-5 w-full rounded-none md:rounded-2xl"
                    shadow="sm"
                >
                    <CardBody className="overflow-visible py-2">
                        <div className="grid grid-cols-6 md:grid-cols-12 gap-4 md:gap-10 items-center justify-center">
                            <div className="flex flex-col col-span-6 md:col-span-12">
                                <DeleteUserForm className="max-w-xl" />
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}

Edit.layout = (page) => <MainLayout>{page}</MainLayout>;
