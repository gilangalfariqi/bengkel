<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\InventoryLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    protected $cartService;
    protected $paymentService;

    public function __construct(CartService $cartService, PaymentService $paymentService)
    {
        $this->cartService = $cartService;
        $this->paymentService = $paymentService;
    }

    /**
     * Create a new order from cart.
     */
    public function createOrder(User $user, array $shippingData): Order
    {
        return DB::transaction(function () use ($user, $shippingData) {
            $cart = $this->cartService->getCart($user);
            
            if ($cart->items->isEmpty()) {
                throw new \Exception('Cart is empty.');
            }

            $totalAmount = $this->cartService->getCartTotal($user);
            $shippingCost = $shippingData['shipping_cost'] ?? 0;
            $finalAmount = $totalAmount + $shippingCost;

            $order = Order::create([
                'user_id'          => $user->id,
                'order_number'     => 'ORD-' . strtoupper(Str::random(10)),
                'total_amount'     => $finalAmount,
                'status'           => 'pending',
                'shipping_cost'    => $shippingCost,
                'shipping_courier' => $shippingData['courier'] ?? null,
                'shipping_service' => $shippingData['service'] ?? null,
                'recipient_name'   => $shippingData['recipient_name'] ?? null,
                'recipient_phone'  => $shippingData['recipient_phone'] ?? null,
                'province'         => $shippingData['province'] ?? null,
                'city'             => $shippingData['city'] ?? null,
                'district'         => $shippingData['district'] ?? null,
                'postal_code'      => $shippingData['postal_code'] ?? null,
                'address_detail'   => $shippingData['address_detail'] ?? null,
                'notes'            => $shippingData['notes'] ?? null,
            ]);

            foreach ($cart->items as $item) {
                // Lock the product row to prevent race conditions
                $product = Product::where('id', $item->product_id)->lockForUpdate()->first();

                if (! $product) {
                    throw new \Exception("Product not found: {$item->product_id}");
                }

                // Check stock
                if ($product->stock < $item->quantity) {
                    throw new \Exception("Product {$product->name} is out of stock.");
                }

                // Create order item
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'quantity'   => $item->quantity,
                    'price'      => $product->discount_price ?? $product->price,
                ]);

                // Reduce stock safely
                $product->decrement('stock', $item->quantity);

                // Log inventory
                InventoryLog::create([
                    'product_id'  => $item->product_id,
                    'quantity'    => -$item->quantity,
                    'type'        => 'sale',
                    'description' => "Order #{$order->order_number}",
                ]);
            }

            // Initialize payment (Midtrans)
            $this->paymentService->initiatePayment($order);

            // Clear cart
            $this->cartService->clearCart($user);

            return $order;
        });
    }

    /**
     * Get order details.
     */
    public function getOrderDetails(int $id, User $user): Order
    {
        return Order::with(['items.product', 'payment'])
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();
    }

    /**
     * Get order history for user.
     */
    public function getOrderHistory(User $user)
    {
        return Order::with(['items.product'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);
    }
}
