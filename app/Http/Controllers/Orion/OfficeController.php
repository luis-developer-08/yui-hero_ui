<?php

namespace App\Http\Controllers\Orion;

use Orion\Http\Controllers\Controller;
use Orion\Concerns\DisableAuthorization;
use Orion\Concerns\DisablePagination;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use App\Models\Orion\Office;
use Illuminate\Support\Facades\DB;

class OfficeController extends Controller
{
    use DisableAuthorization, DisablePagination;

    protected $model = Office::class;

    protected function buildIndexFetchQuery(Request $request, array $requestedRelations): Builder
    {
        return Office::query()->with($requestedRelations);
    }

    public function index(Request $request)
    {
        $query = $this->buildIndexFetchQuery($request, []);

        $perPage = $request->get('per_page', 10);
        // Select only id, name, and email (exclude sensitive data)
        $items = $query->paginate($perPage);

        // Get fillable columns
        $fillable = (new Office())->getFillable();

        // ✅ Add `id` at the beginning
        $fillable = array_merge(['id'], $fillable);

        // Get column types from information schema
        $table = (new Office())->getTable();
        $columns = $this->getColumnTypes($table, $fillable);

        $response = [
            'columns' => $columns,
            'data' => $items->map(fn($cols) => $cols->only($fillable)),
            'pagination' => [                         // ✅ Pagination metadata
                'total' => $items->total(),
                'per_page' => $items->perPage(),
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'from' => $items->firstItem(),
                'to' => $items->lastItem(),
            ]
        ];

        return response()->json($response);
    }

    private function getColumnTypes(string $table, array $fillable): array
    {
        $connection = config('database.default');

        if ($connection === 'mysql') {
            $database = config('database.connections.mysql.database');

            $columns = DB::select("
                SELECT COLUMN_NAME AS name, DATA_TYPE AS type
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
            ", [$database, $table]);
        } elseif ($connection === 'sqlite') {
            $columns = DB::select("
                PRAGMA table_info($table)
            ");

            $columns = collect($columns)->map(fn($col) => (object)[
                'name' => $col->name,
                'type' => $col->type
            ])->toArray();
        } else {
            throw new \Exception("Unsupported database connection: $connection");
        }

        return collect($columns)
            ->filter(fn($col) => in_array($col->name, $fillable))
            ->map(function ($col) {
                return [
                    'name' => $col->name,
                    'type' => $this->mapSchemaTypeToJsonType($col->type)
                ];
            })->values()->toArray();
    }

    private function mapSchemaTypeToJsonType(string $type): string
    {
        return match ($type) {
            'int', 'smallint', 'mediumint', 'bigint', 'integer' => 'integer',
            'decimal', 'float', 'double', 'real' => 'float',
            'boolean', 'tinyint' => 'boolean',
            'datetime', 'timestamp', 'date' => 'datetime',
            default => 'string',
        };
    }
}