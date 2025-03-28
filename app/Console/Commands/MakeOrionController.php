<?php

namespace App\Console\Commands;

use App\Models\Orion\OrionModel;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Symfony\Component\Process\Process;

class MakeOrionController extends Command
{
    protected $signature = 'make:orion {name} {--a|--api : Create in GUI}';

    protected $description = 'Generate a new Orion controller, model, and migration with stubs';

    public function handle()
    {
        $name = str_replace('\\', '/', $this->argument('name')); // Normalize path
        $path = app_path("Http/Controllers/Orion/{$name}.php");

        $directory = dirname($path);
        $className = basename($name);
        $modelName = Str::singular(str_replace('Controller', '', class_basename($className)));

        // Ensure controller directory exists
        if (!File::isDirectory($directory)) {
            File::makeDirectory($directory, 0755, true, true);
        }

        $namespace = "App\\Http\\Controllers\\Orion";

        // Generate Controller
        $controllerStub = File::get(resource_path("stubs/controller.stub"));
        $controllerContent = $this->replacePlaceholders($controllerStub, [
            '{{ namespace }}' => $namespace,
            '{{ className }}' => $className,
            '{{ modelName }}' => $modelName,
        ]);

        if (!File::exists($path)) {
            File::put($path, $controllerContent);
            $this->info("✅ Orion controller created: app/Http/Controllers/Orion/{$name}.php");
        } else {
            $this->error("⚠️ Controller already exists!");
        }

        // Generate Model
        $modelDir = app_path("Models/Orion");
        $modelPath = "{$modelDir}/{$modelName}.php";

        if (!File::isDirectory($modelDir)) {
            File::makeDirectory($modelDir, 0755, true, true);
        }

        if (!File::exists($modelPath)) {
            $modelStub = File::get(resource_path("stubs/model.stub"));
            $modelContent = $this->replacePlaceholders($modelStub, [
                '{{ modelName }}' => $modelName,
            ]);

            File::put($modelPath, $modelContent);
            $this->info("✅ Model created: app/Models/Orion/{$modelName}.php");
        } else {
            $this->info("✅ Model already exists: app/Models/Orion/{$modelName}.php");
        }

        // Generate Migration
        $tableName = Str::plural(Str::snake($modelName));
        $migrationName = "create_{$tableName}_table";

        OrionModel::create(['name' => $tableName]);

        $migrationPath = database_path('migrations');
        $existingMigrations = collect(File::files($migrationPath))
            ->filter(fn($file) => Str::contains($file->getFilename(), $migrationName))
            ->count();

        if ($existingMigrations === 0) {
            $timestamp = now()->format('Y_m_d_His');
            $fullMigrationPath = "{$migrationPath}/{$timestamp}_{$migrationName}.php";

            $migrationStub = File::get(resource_path("stubs/migration.stub"));
            $migrationContent = $this->replacePlaceholders($migrationStub, [
                '{{ tableName }}' => $tableName,
            ]);

            File::put($fullMigrationPath, $migrationContent);
            $this->info("✅ Migration created: database/migrations/{$timestamp}_{$migrationName}.php");
        } else {
            $this->info("✅ Migration already exists.");
        }

        // Add Route
        $routePath = base_path('routes/orion-api.php');
        $routeName = Str::plural(Str::kebab($modelName));

        $routeStub = File::get(resource_path("stubs/route.stub"));
        $routeContent = $this->replacePlaceholders($routeStub, [
            '{{ routeName }}' => $routeName,
            '{{ namespace }}' => $namespace,
            '{{ className }}' => $className,
        ]);

        if (!File::exists($routePath)) {
            File::put($routePath, "<?php\n\nuse Illuminate\\Support\\Facades\\Route;\nuse Orion\\Facades\\Orion;\n\n" . $routeContent);
        } else {
            File::append($routePath, "\n" . $routeContent);
        }

        $this->info("✅ Route added to orion-api.php.");
    }

    // Helper function to replace placeholders
    private function replacePlaceholders(string $content, array $replacements): string
    {
        return str_replace(array_keys($replacements), array_values($replacements), $content);
    }
}
