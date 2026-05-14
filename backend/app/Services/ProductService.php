<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductService
{
    /**
     * List products with filters.
     */
    public function listProducts(array $filters): LengthAwarePaginator
    {
        $query = Product::query()->with(['category', 'primaryImage'])->where('is_active', true);

        if (isset($filters['category_slug'])) {
            $query->whereHas('category', function ($q) use ($filters) {
                $q->where('slug', $filters['category_slug']);
            });
        }

        if (isset($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%');
        }

        if (isset($filters['brand'])) {
            $query->where('brand', $filters['brand']);
        }

        // Sorting
        $sortField = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortField, $sortOrder);

        return $query->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Get product detail by slug.
     */
    public function getProductBySlug(string $slug): Product
    {
        return Product::with(['category', 'images', 'reviews.user'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();
    }

    /**
     * Get related products.
     */
    public function getRelatedProducts(Product $product, int $limit = 4)
    {
        return Product::with(['category', 'primaryImage'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->limit($limit)
            ->get();
    }
}
