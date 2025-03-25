<?php

namespace Database\Seeders;

use App\Models\Orion\OrionModel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrionModelsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        OrionModel::create([
            'name' => 'users',
        ]);

        $this->command->info("✅ Orion Model seeded successfully!");
    }
}
