<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Mesin', 'slug' => 'mesin'],
            ['name' => 'Body Part', 'slug' => 'body-part'],
            ['name' => 'Kelistrikan', 'slug' => 'kelistrikan'],
            ['name' => 'Ban & Velg', 'slug' => 'ban-velg'],
            ['name' => 'Aksesoris', 'slug' => 'aksesoris'],
            ['name' => 'Oli & Cairan', 'slug' => 'oli-cairan'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}
