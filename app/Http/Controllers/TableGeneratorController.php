<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

class TableGeneratorController extends Controller
{
    /**
     * Generate migration, model, and run migrate
     */
    public function generate(Request $request)
    {
        $tableName = $request->input('table_name');
        $columns = $request->input('columns');

        if (empty($tableName) || empty($columns)) {
            return response()->json(['error' => 'Table name and columns are required.'], 400);
        }

        $capitalizeTableName = ucfirst($tableName);

        // Generate migration and model
        Artisan::call("make:orion " . $capitalizeTableName . "Controller -a");

        // Modify the migration file
        if ($this->updateMigrationFile(Str::plural(Str::snake($tableName)), $columns)) {
            $this->updateModelFile($capitalizeTableName, $columns);

            // Run the migration
            Artisan::call('migrate');
            Artisan::call('route:clear');

            return response()->json([
                'message' => "{$capitalizeTableName} Model created successfully!",
                'output' => Artisan::output(),
            ]);
        } else {
            return response()->json(['error' => 'Failed to update migration file.'], 500);
        }
    }

    /**
     * Update the migration file with columns
     */
    private function updateMigrationFile($tableName, $columns)
    {
        $migrationPath = database_path('migrations');
        $migrationFiles = scandir($migrationPath);

        // Find the latest migration file for the table
        $latestMigration = collect($migrationFiles)
            ->filter(fn($file) => str_contains($file, "create_{$tableName}_table"))
            ->sortDesc()
            ->first();

        if (!$latestMigration) {
            return false;
        }

        $filePath = "$migrationPath/$latestMigration";
        $migrationContent = file_get_contents($filePath);

        // Generate schema for columns
        $schema = '';
        foreach ($columns as $column) {
            $name = $column['name'];
            $type = $column['type'];

            if (str_contains($type, ':')) {
                [$baseType, $params] = explode(':', $type, 2);
                $schema .= "\$table->$baseType('$name', $params);\n";
            } else {
                $schema .= "\$table->$type('$name');\n";
            }
        }

        // Inject the columns into the migration file
        $migrationContent = preg_replace(
            '/\$table->id\(\);\n/',
            "\$table->id();\n\t\t\t" . $schema,
            $migrationContent
        );

        file_put_contents($filePath, $migrationContent);

        return true;
    }

    private function updateModelFile($modelName, $columns)
    {
        // Ensure model name is capitalized (e.g., User instead of user)
        $modelPath = app_path("Models/Orion/{$modelName}.php");

        if (!File::exists($modelPath)) {
            return false;
        }

        // Extract column names for fillable
        $fillable = collect($columns)->pluck('name')->map(fn($col) => "'$col'")->implode(', ');

        // Read model content
        $modelContent = file_get_contents($modelPath);

        // Check if $fillable already exists
        if (str_contains($modelContent, 'protected $fillable')) {
            // Replace the existing fillable line
            $modelContent = preg_replace(
                '/protected \$fillable = \[.*?\];/s',
                "protected \$fillable = [{$fillable}];",
                $modelContent
            );
        } else {
            // Add fillable property after `use HasFactory;`
            $modelContent = preg_replace(
                '/use HasFactory;\n/',
                "use HasFactory;\n\n    protected \$fillable = [{$fillable}];\n",
                $modelContent
            );
        }

        // Write the updated model content back
        file_put_contents($modelPath, $modelContent);

        return true;
    }
}
