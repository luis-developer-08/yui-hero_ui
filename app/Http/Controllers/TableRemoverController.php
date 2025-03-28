<?php

namespace App\Http\Controllers;

use App\Models\Orion\OrionModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class TableRemoverController extends Controller
{
    public function removeTable(Request $request)
    {
        $tableName = $request->input('table_name');

        if (!$tableName) {
            return response()->json(['error' => 'Table name is required.'], 400);
        }

        try {
            // ✅ Locate the migration file
            $migrationPath = database_path('migrations');
            $migrationFiles = File::files($migrationPath);

            $migrationFile = collect($migrationFiles)
                ->first(fn($file) => Str::contains($file->getFilename(), "create_{$tableName}_table"));

            if (!$migrationFile) {
                return response()->json(['error' => "Migration file for table '{$tableName}' not found."], 404);
            }

            // ✅ Use relative path for rollback
            $relativePath = 'database/migrations/' . $migrationFile->getFilename();

            // ✅ Rollback the specific migration
            Artisan::call("migrate:rollback --path={$relativePath}");

            // ✅ Delete the migration file
            File::delete($migrationFile->getPathname());

            // ✅ Remove model, controller, and route
            $modelPath = app_path("Models/Orion/" . ucfirst(Str::singular($tableName)) . ".php");
            $controllerPath = app_path("Http/Controllers/Orion/" . ucfirst(Str::singular($tableName)) . "Controller.php");
            $routePath = base_path('routes/orion-api.php');

            if (File::exists($modelPath)) {
                File::delete($modelPath);
            }

            if (File::exists($controllerPath)) {
                File::delete($controllerPath);
            }

            // ✅ Remove the route from orion-api.php
            $routeLines = file($routePath);
            $filteredLines = array_filter($routeLines, function ($line) use ($tableName) {
                return !Str::contains($line, Str::plural(Str::kebab($tableName)));
            });

            file_put_contents($routePath, implode('', $filteredLines));

            // ✅ Remove the record from OrionModel
            $orionRecord = OrionModel::where('name', $tableName)->first();

            if ($orionRecord) {
                $orionRecord->delete();
            }

            // ✅ Clear cache
            Artisan::call('optimize');


            return response()->json(['message' => "Table '{$tableName}' removed successfully!"]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to remove table',
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    }
}
