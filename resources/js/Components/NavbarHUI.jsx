import React, { Fragment, useState } from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Avatar,
} from "@heroui/react";
import ApplicationLogo from "./ApplicationLogo";
import useLatestVersion from "@/Hooks/useLatestVersion";
import GithubStarButton from "./GithubStarButton";
import { router, Link } from "@inertiajs/react";
import useGravatar from "@/Hooks/useGravatar";

const NavbarHUI = ({ user }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { version } = useLatestVersion("luis-developer-08/yui-installer");

    const menuItems = user
        ? [
              { name: "Home", url: "home" },
              { name: "Dashboard", url: "dashboard" },
          ]
        : [{ name: "Home", url: "home" }];

    const gravatarUrl = useGravatar(user?.email, 200);

    return (
        <Navbar
            onMenuOpenChange={setIsMenuOpen}
            className="bg-sky-300/70"
            maxWidth="xl"
            isMenuOpen={isMenuOpen}
        >
            <NavbarContent justify="start" className="gap-20">
                <NavbarBrand>
                    <div className="w-9 me-3">
                        <ApplicationLogo />
                    </div>
                    <p className="font-bold text-inherit">YUI</p>
                </NavbarBrand>
                <div className="hidden sm:flex gap-4">
                    {menuItems.map((item, index) => (
                        <NavbarItem key={`${item.url}-${index}`}>
                            <Link
                                className={`hover:bg-blue-600 duration-500 hover:text-white hover:cursor-pointer w-full px-4 py-2 rounded-md transition ${
                                    route().current() == item.url
                                        ? "bg-blue-700 text-white"
                                        : ""
                                }`}
                                href={route(item.url)}
                                prefetch
                                preserveScroll={false}
                            >
                                {item.name}
                            </Link>
                        </NavbarItem>
                    ))}
                </div>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Link color="foreground">{version}</Link>
                </NavbarItem>
                <div className="hidden md:flex gap-2 items-center">
                    {user ? (
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform w-8 h-8"
                                    name={user.name.slice(0, 1)}
                                    src={gravatarUrl}
                                />
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Profile Actions"
                                variant="flat"
                            >
                                <DropdownItem className="h-14 gap-2">
                                    <p className="font-semibold">
                                        Signed in as
                                    </p>
                                    <p className="font-semibold">
                                        {user.email}
                                    </p>
                                </DropdownItem>
                                <DropdownItem
                                    key="profile"
                                    onPress={() =>
                                        router.visit(route("profile.edit"))
                                    }
                                >
                                    Profile
                                </DropdownItem>
                                <DropdownItem
                                    key="logout"
                                    color="danger"
                                    onPress={() =>
                                        router.visit(route("logout"), {
                                            method: "post",
                                        })
                                    }
                                >
                                    Log Out
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    ) : (
                        <>
                            <NavbarItem>
                                <Button
                                    color="secondary"
                                    radius="sm"
                                    onPress={() => router.visit(route("login"))}
                                >
                                    Login
                                </Button>
                            </NavbarItem>
                            <NavbarItem>
                                <Button
                                    color="secondary"
                                    radius="sm"
                                    onPress={() =>
                                        router.visit(route("register"))
                                    }
                                >
                                    Sign In
                                </Button>
                            </NavbarItem>
                        </>
                    )}

                    <NavbarItem>
                        <GithubStarButton repo="luis-developer-08/yui-installer" />
                    </NavbarItem>
                </div>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
            </NavbarContent>

            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`mobile-${item.url}-${index}`}>
                        <div
                            className="w-full"
                            size="lg"
                            onClick={() => {
                                setIsMenuOpen(false);
                                router.visit(route(item.url));
                            }}
                        >
                            {item.name}
                        </div>
                    </NavbarMenuItem>
                ))}
                {user ? (
                    <>
                        <div
                            className="w-full"
                            size="lg"
                            onClick={() => {
                                setIsMenuOpen(false);
                                router.visit(route("profile.edit"));
                            }}
                        >
                            Profile
                        </div>
                        <div
                            className="w-full"
                            size="lg"
                            onClick={() => {
                                setIsMenuOpen(false);
                                router.visit(route("logout"), {
                                    method: "post",
                                });
                            }}
                        >
                            Logout
                        </div>
                    </>
                ) : (
                    <>
                        <div
                            className="w-full"
                            size="lg"
                            onClick={() => {
                                setIsMenuOpen(false);
                                router.visit(route("login"));
                            }}
                        >
                            Login
                        </div>
                        <div
                            className="w-full"
                            size="lg"
                            onClick={() => {
                                setIsMenuOpen(false);
                                router.visit(route("register"));
                            }}
                        >
                            Sign In
                        </div>
                    </>
                )}
            </NavbarMenu>
        </Navbar>
    );
};

export default NavbarHUI;
