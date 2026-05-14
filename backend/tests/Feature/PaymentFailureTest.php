<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentFailureTest extends TestCase
{
    use RefreshDatabase;

    public function test_failed_payment_restores_stock_once()
    {
        $user = \App\Models\User::factory()->create();

        $product = Product::factory()->create([
            'stock' => 10,
        ]);

        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'ORD-FAIL-1',
            'total_amount' => 20000,
            'status' => 'pending',
        ]);

        // Create order item and simulate stock deduction (product stock decreased)
        $item = OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'price' => 10000,
        ]);

        $product->update(['stock' => 8]);

        $payment = Payment::create([
            'order_id' => $order->id,
            'status' => 'pending',
            'amount' => $order->total_amount,
            'snap_token' => 'snap-fail',
        ]);

        $payload = [
            'order_id' => $order->order_number,
            'transaction_status' => 'expire',
            'transaction_id' => 'tran-expire',
            'payment_type' => 'bank_transfer',
            'fraud_status' => 'accept',
        ];

        // First notification: should restore stock
        $this->postJson('/api/payments/notification', $payload)->assertStatus(200);

        $this->assertDatabaseHas('payments', [
            'order_id' => $order->id,
            'status' => 'failed',
        ]);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'cancelled',
        ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock' => 10,
        ]);

        // Second duplicate notification: should be idempotent and not double-restore
        $this->postJson('/api/payments/notification', $payload)->assertStatus(200);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock' => 10,
        ]);
    }
}
