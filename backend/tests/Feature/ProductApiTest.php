<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_products()
    {
        Category::factory()->has(Product::factory()->count(5))->create();

        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data',
                ],
            ]);
    }

    public function test_can_get_product_detail()
    {
        $product = Product::factory()->create(['is_active' => true]);

        $response = $this->getJson("/api/products/{$product->slug}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data'    => [
                    'product' => [
                        'slug' => $product->slug,
                    ],
                ],
            ]);
    }
}
