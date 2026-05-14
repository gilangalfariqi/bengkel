<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition()
    {
        $category = Category::factory()->create();

        return [
            'category_id' => $category->id,
            'name' => $this->faker->word(),
            'slug' => $this->faker->slug(),
            'description' => $this->faker->sentence(),
            'price' => $this->faker->numberBetween(10000, 100000),
            'discount_price' => null,
            'stock' => $this->faker->numberBetween(1, 100),
            'weight' => $this->faker->numberBetween(100, 1000),
            'brand' => $this->faker->company(),
            'specifications' => null,
            'is_active' => true,
        ];
    }
}
