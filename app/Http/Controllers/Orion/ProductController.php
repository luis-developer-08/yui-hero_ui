<?php

namespace App\Http\Controllers\Orion;

use Orion\Http\Controllers\Controller;
use Orion\Concerns\DisableAuthorization;
use Orion\Concerns\DisablePagination;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use App\Models\Orion\Product;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    use DisableAuthorization, DisablePagination;

    protected $model = Product::class;

    protected function buildIndexFetchQuery(Request $request, array $requestedRelations): Builder
    {
        return Product::query()->with($requestedRelations);
    }

    public function index(Request $request)
    {
        $query = $this->buildIndexFetchQuery($request, []);
        $items = $query->get();

        // Get fillable columns
        $fillable = (new Product())->getFillable();

        // ✅ Add `id` at the beginning
        $fillable = array_merge(['id'], $fillable);

        // Get column types from information schema
        $table = (new Product())->getTable();
        $columns = $this->getColumnTypes($table, $fillable);

        $response = [
            'columns' => $columns,
            'data' => $items->map(fn($cols) => $cols->only($fillable))
        ];

        return response()->json($response);
    }

    private function getColumnTypes(string $table, array $fillable): array
    {
        $database = config('database.connections.mysql.database');

        $columns = DB::select("
            SELECT COLUMN_NAME, DATA_TYPE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
        ", [$database, $table]);

        return collect($columns)
            ->filter(fn($col) => in_array($col->COLUMN_NAME, $fillable))
            ->map(function ($col) {
                return [
                    'name' => $col->COLUMN_NAME,
                    'type' => $this->mapSchemaTypeToJsonType($col->DATA_TYPE)
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
