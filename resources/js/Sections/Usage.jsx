import React from "react";
import {
    Card,
    CardBody,
    Divider,
    Snippet,
    Code,
    addToast,
} from "@heroui/react";

const Usage = () => {
    const handleCopy = () => addToast({ title: "Copied!" });

    return (
        <div
            className="min-h-[80vh] flex flex-col justify-center items-center w-full py-20"
            id="usage"
        >
            <Card
                isBlurred
                className="border-none bg-white/70 dark:bg-default-100/50 p-2 md:p-5 w-full rounded-none md:rounded-2xl"
                shadow="sm"
            >
                <CardBody className="overflow-visible py-2">
                    <div className="grid grid-cols-6 md:grid-cols-12 gap-4 md:gap-10">
                        <div className="flex flex-col col-span-6 md:col-span-12">
                            <div className="flex justify-between items-start w-full">
                                <div className="flex flex-col gap-0 w-full">
                                    <h1 className="text-2xl md:text-3xl font-medium mt-2">
                                        ⚡ Usage
                                    </h1>
                                    <Divider className="my-4" />

                                    {/* Create Inertia Components */}
                                    <section className="mb-10">
                                        <h2 className="text-lg md:text-xl font-medium">
                                            🏗️ Create Inertia Components
                                        </h2>

                                        <Snippet
                                            size="sm"
                                            className="p-4 w-full mt-2 bg-slate-400/50"
                                            symbol={false}
                                            onCopy={handleCopy}
                                        >
                                            <div className="w-48 md:w-full text-wrap">
                                                php artisan make:inertia
                                                Components/MyComponent
                                            </div>
                                        </Snippet>

                                        <p className="mt-2">Creates:</p>
                                        <Snippet
                                            size="sm"
                                            className="p-4 w-full mt-2 bg-slate-400/50"
                                            symbol={false}
                                        >
                                            <div className="w-48 md:w-full text-wrap">
                                                resources/js/Components/MyComponent.jsx
                                            </div>
                                        </Snippet>

                                        <h2 className="text-lg md:text-xl font-medium mt-4">
                                            ✨ Example Generated Component
                                        </h2>
                                        <Code
                                            size="sm"
                                            className="p-4 w-full mt-2 bg-slate-400/50 whitespace-pre-wrap"
                                            symbol={false}
                                        >
                                            {`import React from "react";

const MyComponent = () => {
    return <div>{/* MyComponent component */}</div>;
};

export default MyComponent;`}
                                        </Code>

                                        <p className="mt-2">
                                            This command ensures correct
                                            directory placement, prevents
                                            overwriting existing files, and
                                            automatically opens the file for
                                            editing.
                                        </p>
                                    </section>

                                    {/* Flexible Folder Placement */}
                                    <section className="mb-10">
                                        <h1 className="text-lg md:text-xl font-medium mt-2">
                                            📂 Flexible Folder Placement
                                        </h1>
                                        <p className="mt-2 mb-3">
                                            You can specify different folders
                                            using flags:
                                        </p>
                                        <ul className="list-disc ml-6 mt-2 space-y-2 mb-5">
                                            <li>
                                                <strong>-c</strong> or{" "}
                                                <strong>--components</strong>:
                                                Create in{" "}
                                                <Code className="bg-slate-400/50">
                                                    resources/js/Components/
                                                </Code>
                                            </li>
                                            <li>
                                                <strong>-l</strong> or{" "}
                                                <strong>--layouts</strong>:
                                                Create in{" "}
                                                <Code className="bg-slate-400/50">
                                                    resources/js/Layouts/
                                                </Code>
                                            </li>
                                            <li>
                                                <strong>-s</strong> or{" "}
                                                <strong>--sections</strong>:
                                                Create in{" "}
                                                <Code className="bg-slate-400/50">
                                                    resources/js/Sections/
                                                </Code>
                                            </li>
                                            <li>
                                                <strong>-p</strong> or{" "}
                                                <strong>--pages</strong>: Create
                                                in{" "}
                                                <Code className="bg-slate-400/50">
                                                    resources/js/Pages/
                                                </Code>
                                            </li>
                                        </ul>

                                        <h1 className="text-lg md:text-xl font-medium mt-4">
                                            ✅ Example usage with flags:
                                        </h1>
                                        <Snippet
                                            size="sm"
                                            className="p-4 w-full mt-2 bg-slate-400/50"
                                            symbol={false}
                                            onCopy={() =>
                                                addToast({ title: "Copied!" })
                                            }
                                        >
                                            <div className="w-48 md:w-full text-wrap">
                                                php artisan make:inertia
                                                Dashboard -p
                                            </div>
                                        </Snippet>

                                        <p className="mt-2">Creates:</p>
                                        <Snippet
                                            size="sm"
                                            className="p-4 w-full mt-2 bg-slate-400/50"
                                            symbol={false}
                                        >
                                            resources/js/Pages/Dashboard.jsx
                                        </Snippet>

                                        <p className="mt-2">
                                            You can also create nested folders:
                                        </p>
                                        <Snippet
                                            size="sm"
                                            className="p-4 w-full mt-2 bg-slate-400/50"
                                            symbol={false}
                                            onCopy={() =>
                                                addToast({ title: "Copied!" })
                                            }
                                        >
                                            <div className="w-48 md:w-full text-wrap">
                                                php artisan make:inertia
                                                Components/Auth/Login
                                            </div>
                                        </Snippet>

                                        <p className="mt-2">Creates:</p>
                                        <Snippet
                                            size="sm"
                                            className="p-4 w-full mt-2 bg-slate-400/50"
                                            symbol={false}
                                        >
                                            <div className="w-48 md:w-full text-wrap">
                                                resources/js/Components/Auth/Login.jsx
                                            </div>
                                        </Snippet>

                                        <h1 className="text-lg md:text-xl font-medium mt-4">
                                            🚀 Smart Behavior
                                        </h1>
                                        <ul className="list-disc ml-6 mt-2">
                                            <li>
                                                Automatically prevents duplicate
                                                folder nesting.
                                            </li>
                                            <li>
                                                Opens the newly created file in
                                                your default editor.
                                            </li>
                                            <li>
                                                Ensures correct folder placement
                                                whether using flags or
                                                specifying the path.
                                            </li>
                                        </ul>
                                    </section>

                                    {/* Create Orion Controllers */}
                                    <section className="mb-20 mt-10">
                                        <h2 className="text-lg md:text-xl font-medium">
                                            🏗️ Create Orion Controllers
                                        </h2>

                                        <Snippet
                                            size="sm"
                                            className="p-4 w-full mt-2 bg-slate-400/50"
                                            symbol={false}
                                            onCopy={handleCopy}
                                        >
                                            <div className="w-48 md:w-full text-wrap">
                                                php artisan make:orion
                                                PostController
                                            </div>
                                        </Snippet>

                                        <p className="mt-2">Creates:</p>
                                        <ul className="space-y-2">
                                            {[
                                                "app/Http/Controllers/Orion/PostController.php",
                                                "app/Models/Post.php",
                                                "database/migrations/0001_01_01_000000_create_posts_table.php",
                                                "routes/api.php",
                                            ].map((path) => (
                                                <li
                                                    key={path}
                                                    className="overflow-x-auto"
                                                >
                                                    <Code className="bg-slate-400/50">
                                                        {path}
                                                    </Code>
                                                </li>
                                            ))}
                                        </ul>

                                        <h2 className="text-lg md:text-xl font-medium mt-4">
                                            ✨ Example Generated Controller
                                        </h2>
                                        <Code
                                            size="sm"
                                            className="p-4 w-full mt-2 bg-slate-400/50 whitespace-pre-wrap"
                                            symbol={false}
                                        >
                                            {`<?php

namespace App\\Http\\Controllers\\Orion;

use Orion\\Http\\Controllers\\Controller;
use App\\Models\\Post;

class PostController extends Controller
{
    protected $model = Post::class;
}`}
                                        </Code>

                                        <h2 className="text-lg md:text-xl font-medium mt-4">
                                            ✨ Example Generated Model
                                        </h2>
                                        <Code
                                            size="sm"
                                            className="p-4 w-full mt-2 bg-slate-400/50 whitespace-pre-wrap"
                                            symbol={false}
                                        >
                                            {`<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;

class Post extends Model
{
    use HasFactory;

    protected $guarded = [];
}`}
                                        </Code>

                                        <h2 className="text-lg md:text-xl font-medium mt-4">
                                            🔥 Auto-Generated Migration
                                        </h2>
                                        <Code
                                            size="sm"
                                            className="p-4 w-full mt-2 bg-slate-400/50 overflow-x-auto"
                                            symbol={false}
                                            onCopy={handleCopy}
                                        >
                                            {`database/migrations/0001_01_01_000000_create_posts_table.php`}
                                        </Code>

                                        <h2 className="text-lg md:text-xl font-medium mt-4">
                                            🔗 Auto-Registered Route
                                        </h2>
                                        <Code
                                            size="sm"
                                            className="p-4 w-full mt-2 bg-slate-400/50 overflow-x-auto"
                                            symbol={false}
                                            onCopy={handleCopy}
                                        >
                                            {`Orion::resource('posts', \\App\\Http\\Controllers\\Orion\\PostController::class)->middleware(['auth', 'web']);`}
                                        </Code>

                                        <p className="mt-2">
                                            This command ensures correct
                                            controller placement, generates
                                            missing models, and automatically
                                            registers routes.
                                        </p>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default Usage;
