<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

class TableGeneratorController extends Controller
{
    /**
     * Generate migration, model, and run migrate
     */
    public function generate(Request $request)
    {
        $tableName = $request->input('table_name');
        $columns = $request->input('columns'); // ['name' => 'string', 'price' => 'decimal:10,2']

        if (empty($tableName) || empty($columns)) {
            return response()->json(['error' => 'Table name and columns are required.'], 400);
        }

        // Generate migration
        Artisan::call("make:migration create_{$tableName}_table --create={$tableName}");

        // Generate model
        Artisan::call("make:model " . ucfirst($tableName));

        // Modify the migration file
        $this->updateMigrationFile($tableName, $columns);

        // Run the migration
        Artisan::call('migrate');

        return response()->json([
            'message' => "Table '{$tableName}' created successfully!",
            'output' => Artisan::output(),
        ]);
    }

    /**
     * Update the migration file with columns
     */
    private function updateMigrationFile($tableName, $columns)
    {
        $migrationPath = database_path('migrations');
        $migrationFiles = scandir($migrationPath);

        // Find the latest migration file
        $latestMigration = collect($migrationFiles)
            ->filter(fn($file) => str_contains($file, "create_{$tableName}_table"))
            ->sortDesc()
            ->first();

        if (!$latestMigration) {
            return;
        }

        $filePath = "$migrationPath/$latestMigration";
        $migrationContent = file_get_contents($filePath);

        // Generate column schema
        $schema = '';
        foreach ($columns as $name => $type) {
            if (str_contains($type, ':')) {
                [$type, $size] = explode(':', $type);
                $schema .= "\$table->$type('$name', $size);\n\t\t\t";
            } else {
                $schema .= "\$table->$type('$name');\n\t\t\t";
            }
        }

        // Inject columns into the migration
        $migrationContent = preg_replace(
            '/\$table->id\(\);\n/',
            "\$table->id();\n\t\t\t" . $schema,
            $migrationContent
        );

        file_put_contents($filePath, $migrationContent);
    }
}
