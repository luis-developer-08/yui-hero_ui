<?php

namespace App\Http\Controllers\Orion;

use Orion\Http\Controllers\Controller;
use App\Models\Orion\User;
use Orion\Concerns\DisableAuthorization;
use Orion\Concerns\DisablePagination;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;
// use Orion\Http\Requests\Request;

class UserController extends Controller
{
    use DisableAuthorization, DisablePagination;

    protected $model = User::class;

    public function store(Request $request)
    {
        $data = $request->all();

        // Hash the password if it exists in the request
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        // Create the user with the modified data
        $user = User::create($data);

        return response()->json([
            'message' => 'User created successfully!',
            'user' => $user
        ], 201);
    }

    public function update(Request $request, ...$args)
    {
        $data = $request->all();

        // ✅ Extract the user model from $args
        $user = User::find($args[0]);

        if (!$user) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        // ✅ Hash the password if included
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        // ✅ Update the user model
        $user->update($data);

        return response()->json([
            'message' => 'User updated successfully!',
            'user' => $user
        ], 200);
    }

    protected function buildIndexFetchQuery(Request $request, array $requestedRelations): Builder
    {
        return User::query()->with($requestedRelations);
    }

    public function index(Request $request)
    {
        // ✅ Extract search query from the nested payload
        $searchQuery = $request->input('search.value', '');
        $perPage = $request->get('per_page', 10);

        // ✅ Build the base query
        $query = $this->buildIndexFetchQuery($request, []);

        // ✅ Apply search filtering if search.value exists
        if (!empty($searchQuery)) {
            $query->where(function ($q) use ($searchQuery) {
                $q->where('name', 'LIKE', "%{$searchQuery}%")
                    ->orWhere('email', 'LIKE', "%{$searchQuery}%")
                    ->orWhere('id', 'LIKE', "%{$searchQuery}%");
            });
        }

        // ✅ Select the desired columns and paginate
        $items = $query->select(['id', 'name', 'email'])->paginate($perPage);

        // ✅ Define the table columns
        $columns = [
            ['name' => 'id', 'type' => 'integer'],
            ['name' => 'name', 'type' => 'string'],
            ['name' => 'email', 'type' => 'string']
        ];

        // ✅ Prepare the response with pagination and search results
        $response = [
            'columns' => $columns,
            'data' => $items->items(),                // ✅ Paginated search results
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

    private function getColumnTypeFromSchema(string $table, string $column): string
    {
        $type = Schema::getColumnType($table, $column);

        return match ($type) {
            'integer', 'bigint', 'smallint' => 'integer',
            'decimal', 'float', 'double' => 'float',
            'datetime', 'timestamp', 'date' => 'datetime',
            'boolean' => 'boolean',
            default => 'string',
        };
    }

    public function searchableBy(): array
    {
        return ['name', 'email'];
    }
}
