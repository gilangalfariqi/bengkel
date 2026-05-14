<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ProductService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ApiResponse;

    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * List products.
     */
    public function index(Request $request): JsonResponse
    {
        $products = $this->productService->listProducts($request->all());
        return $this->successResponse($products);
    }

    /**
     * Product detail.
     */
    public function show(string $slug): JsonResponse
    {
        $product = $this->productService->getProductBySlug($slug);
        $related = $this->productService->getRelatedProducts($product);

        return $this->successResponse([
            'product' => $product,
            'related' => $related,
        ]);
    }
}
