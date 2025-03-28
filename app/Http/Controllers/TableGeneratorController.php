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

            // return response()->json([
            //     'message' => $message,
            // ]);

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
            $constraint = $column['constraint'];

            if (str_contains($type, ':')) {
                [$baseType, $params] = explode(':', $type, 2);
                $schema .= "\$table->$baseType('$name', $params)";
            } else {
                $schema .= "\$table->$type('$name')";
            }

            // ✅ Apply nullable or not nullable constraint
            if ($constraint === 'nullable') {
                $schema .= "->nullable()";
            }

            $schema .= ";\n";
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
        try {
            // Ensure model name is capitalized (e.g., User instead of user)
            $modelPath = app_path("Models/Orion/{$modelName}.php");

            // ✅ Check if the model file exists
            if (!File::exists($modelPath)) {
                return [
                    'error' => "Model file not found: {$modelPath}"
                ];
            }

            // Extract column names for fillable
            $fillable = collect($columns)->pluck('name')->map(fn($col) => "'$col'")->implode(', ');

            // ✅ Read model content
            $modelContent = file_get_contents($modelPath);

            if ($modelContent === false) {
                return [
                    'error' => "Failed to read model file: {$modelPath}"
                ];
            }

            // ✅ Check if $fillable already exists
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
                    '/use HasFactory, SoftDeletes;\n/',
                    "use HasFactory, SoftDeletes;\n\n    protected \$fillable = [{$fillable}];\n",
                    $modelContent
                );
            }

            // ✅ Write the updated model content back
            $result = file_put_contents($modelPath, $modelContent);

            if ($result === false) {
                return [
                    'error' => "Failed to write to model file: {$modelPath}"
                ];
            }

            return [
                'message' => "Model updated successfully!",
                'model' => $modelName,
                'path' => $modelPath,
                'fillable' => $fillable,
            ];
        } catch (\Exception $e) {
            return [
                'error' => 'Exception occurred while updating model',
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ];
        }
    }
}
