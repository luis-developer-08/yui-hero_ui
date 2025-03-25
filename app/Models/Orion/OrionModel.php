<?php

namespace App\Models\Orion;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrionModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'name'
    ];

    protected $guarded = [];
}
