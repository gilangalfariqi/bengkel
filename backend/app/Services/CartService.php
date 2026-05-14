<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CartService
{
    /**
     * Get or create cart for user.
     */
    public function getCart(User $user): Cart
    {
        return Cart::firstOrCreate(['user_id' => $user->id]);
    }

    /**
     * Add item to cart.
     */
    public function addToCart(User $user, int $productId, int $quantity = 1): CartItem
    {
        $cart = $this->getCart($user);
        $product = Product::findOrFail($productId);

        $cartItem = $cart->items()->where('product_id', $productId)->first();

        if ($cartItem) {
            $cartItem->quantity += $quantity;
            $cartItem->save();
        } else {
            $cartItem = $cart->items()->create([
                'product_id' => $productId,
                'quantity'   => $quantity,
            ]);
        }

        return $cartItem;
    }

    /**
     * Update item quantity.
     */
    public function updateQuantity(User $user, int $productId, int $quantity): CartItem
    {
        $cart = $this->getCart($user);
        $cartItem = $cart->items()->where('product_id', $productId)->firstOrFail();

        $cartItem->update(['quantity' => $quantity]);

        return $cartItem;
    }

    /**
     * Remove item from cart.
     */
    public function removeItem(User $user, int $productId): void
    {
        $cart = $this->getCart($user);
        $cart->items()->where('product_id', $productId)->delete();
    }

    /**
     * Clear cart.
     */
    public function clearCart(User $user): void
    {
        $cart = $this->getCart($user);
        $cart->items()->delete();
    }

    /**
     * Get cart total.
     */
    public function getCartTotal(User $user): float
    {
        $cart = $this->getCart($user);
        return $cart->items->sum(function ($item) {
            $price = $item->product->discount_price ?? $item->product->price;
            return $price * $item->quantity;
        });
    }
}
