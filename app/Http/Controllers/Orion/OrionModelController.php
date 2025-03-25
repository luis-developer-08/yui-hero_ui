<?php

namespace App\Http\Controllers\Orion;

use Orion\Http\Controllers\Controller;
use App\Models\Orion\OrionModel;
use Orion\Concerns\DisableAuthorization;
use Orion\Concerns\DisablePagination;

class OrionModelController extends Controller
{
    use DisableAuthorization, DisablePagination;

    protected $model = OrionModel::class;
}
