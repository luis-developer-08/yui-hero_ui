import React from "react";
import {
    Card,
    CardBody,
    Code,
    Divider,
    Snippet,
    addToast,
} from "@heroui/react";

const GettingStarted = () => {
    return (
        <div
            className="min-h-[80vh] flex flex-col justify-center items-center w-full py-20"
            id="getting-started"
        >
            <Card
                isBlurred
                className="border-none bg-white/70 dark:bg-default-100/50 p-2 md:p-5 w-full rounded-none md:rounded-2xl"
                shadow="sm"
            >
                <CardBody className="overflow-visible py-2">
                    <div className="grid grid-cols-6 md:grid-cols-12 gap-4 md:gap-10 items-center justify-center">
                        <div className="flex flex-col col-span-6 md:col-span-12">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-0 w-full">
                                    <h1 className="text-2xl md:text-3xl font-medium mt-2">
                                        🛠 Getting Started
                                    </h1>
                                    <Divider className="my-4" />

                                    {/* Step 1: Install */}
                                    <h1 className="text-lg md:text-xl font-medium mt-2">
                                        1️⃣ Install
                                    </h1>
                                    <Snippet
                                        size="sm"
                                        className="p-4 mt-2 mb-5 bg-slate-400/50"
                                        symbol={false}
                                        onCopy={() =>
                                            addToast({ title: "Copied!" })
                                        }
                                    >
                                        <span className="text-wrap overflow-x-auto">
                                            composer global require
                                            luis-developer-08/yui-installer
                                        </span>
                                    </Snippet>

                                    {/* Step 2: Create Project */}
                                    <h1 className="text-lg md:text-xl font-medium mt-2">
                                        2️⃣ Create a New Laravel Project
                                    </h1>
                                    <Snippet
                                        size="sm"
                                        className="p-4 mt-2 mb-5 bg-slate-400/50"
                                        symbol={false}
                                        onCopy={() =>
                                            addToast({ title: "Copied!" })
                                        }
                                    >
                                        <span className="text-wrap">
                                            yui new yui-app
                                        </span>
                                    </Snippet>

                                    {/* Step 3: Database Selection */}
                                    <h1 className="text-lg md:text-xl font-medium mt-2">
                                        3️⃣ Select Your Database
                                    </h1>
                                    <Code
                                        size="sm"
                                        className="p-4 mt-2 mb-5 bg-slate-400/50"
                                        symbol={false}
                                        onCopy={() =>
                                            addToast({ title: "Copied!" })
                                        }
                                    >
                                        <span className="text-wrap">
                                            [0] sqlite <br />
                                            [1] mysql
                                        </span>
                                    </Code>

                                    {/* Step 4: UI Provider Selection */}
                                    <h1 className="text-lg md:text-xl font-medium mt-2">
                                        4️⃣ Choose a UI Provider (Select Hero UI)
                                    </h1>
                                    <Code
                                        size="sm"
                                        className="p-4 mt-2 mb-5 bg-slate-400/50"
                                        symbol={false}
                                        onCopy={() =>
                                            addToast({ title: "Copied!" })
                                        }
                                    >
                                        <span className="text-wrap">
                                            [0] None <br />
                                            [1] Hero UI
                                        </span>
                                    </Code>

                                    {/* Step 5: Go to Project Directory */}
                                    <h1 className="text-lg md:text-xl font-medium mt-2">
                                        5️⃣ Navigate to Your Project Directory
                                    </h1>
                                    <Snippet
                                        size="sm"
                                        className="p-4 mt-2 mb-5 bg-slate-400/50"
                                        symbol={false}
                                        onCopy={() =>
                                            addToast({ title: "Copied!" })
                                        }
                                    >
                                        <span className="text-wrap">
                                            cd yui-app
                                        </span>
                                    </Snippet>

                                    {/* Step 6: Run Composer Dev */}
                                    <h1 className="text-lg md:text-xl font-medium mt-2">
                                        6️⃣ Run Server
                                    </h1>
                                    <Snippet
                                        size="sm"
                                        className="p-4 mt-2 mb-5 bg-slate-400/50"
                                        symbol={false}
                                        onCopy={() =>
                                            addToast({ title: "Copied!" })
                                        }
                                    >
                                        <span className="text-wrap">
                                            composer run dev
                                        </span>
                                    </Snippet>

                                    <h1 className="text-lg md:text-xl font-medium mt-2 mb-10">
                                        🎉 Your application is now configured
                                        and running!
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default GettingStarted;
