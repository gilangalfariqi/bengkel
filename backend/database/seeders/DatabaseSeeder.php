<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User
        User::create([
            'name'     => 'Admin Bengkel',
            'email'    => 'admin@bengkel.com',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        // Customer User
        User::create([
            'name'     => 'John Doe',
            'email'    => 'john@example.com',
            'password' => Hash::make('password'),
            'role'     => 'customer',
        ]);

        // Categories
        $categories = [
            ['name' => 'Mesin', 'slug' => 'mesin'],
            ['name' => 'Body Part', 'slug' => 'body-part'],
            ['name' => 'Kelistrikan', 'slug' => 'kelistrikan'],
            ['name' => 'Ban & Velg', 'slug' => 'ban-velg'],
            ['name' => 'Aksesoris', 'slug' => 'aksesoris'],
        ];

        foreach ($categories as $cat) {
            $category = Category::create($cat);

            // Products for each category
            for ($i = 1; $i <= 3; $i++) {
                Product::create([
                    'category_id' => $category->id,
                    'name'        => $category->name . ' Product ' . $i,
                    'slug'        => Str::slug($category->name . ' Product ' . $i),
                    'description' => 'Description for ' . $category->name . ' product ' . $i,
                    'price'       => rand(50000, 500000),
                    'stock'       => rand(10, 100),
                    'weight'      => rand(500, 2000),
                    'brand'       => 'Generic',
                    'is_active'   => true,
                ]);
            }
        }
    }
}
