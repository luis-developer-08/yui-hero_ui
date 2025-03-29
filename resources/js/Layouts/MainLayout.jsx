import NavbarHUI from "@/Components/NavbarHUI";
import { usePage } from "@inertiajs/react";
import React from "react";

const MainLayout = ({ children }) => {
    const user = usePage().props.auth.user;

    return (
        <div
            className="min-h-screen md:max-h-screen flex flex-col bg-cover bg-center bg-fixed"
            style={{ backgroundImage: "url('/images/bg.jpg')" }}
        >
            <NavbarHUI user={user} />
            <main className="flex-1 md:overflow-y-auto md:scrollbar-thin md:scrollbar-track md:scrollbar-thumb">
                <div className="min-h-[92vh]">{children}</div>
            </main>
        </div>
    );
};

export default MainLayout;
