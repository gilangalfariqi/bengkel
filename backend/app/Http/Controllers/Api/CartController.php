<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CartService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    use ApiResponse;

    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Get cart items.
     */
    public function index(Request $request): JsonResponse
    {
        $cart = $this->cartService->getCart($request->user());
        return $this->successResponse($cart->load('items.product.primaryImage'));
    }

    /**
     * Add to cart.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
        ]);

        $item = $this->cartService->addToCart(
            $request->user(),
            $request->product_id,
            $request->quantity
        );

        return $this->successResponse($item, 'Product added to cart.');
    }

    /**
     * Update quantity.
     */
    public function update(Request $request, int $productId): JsonResponse
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $item = $this->cartService->updateQuantity(
            $request->user(),
            $productId,
            $request->quantity
        );

        return $this->successResponse($item, 'Cart updated.');
    }

    /**
     * Remove item.
     */
    public function destroy(Request $request, int $productId): JsonResponse
    {
        $this->cartService->removeItem($request->user(), $productId);
        return $this->successResponse(null, 'Item removed from cart.');
    }

    /**
     * Clear cart.
     */
    public function clear(Request $request): JsonResponse
    {
        $this->cartService->clearCart($request->user());
        return $this->successResponse(null, 'Cart cleared.');
    }
}
