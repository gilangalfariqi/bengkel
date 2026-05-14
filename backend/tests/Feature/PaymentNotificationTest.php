<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_notification_endpoint_updates_payment_and_order()
    {
        $user = \App\Models\User::factory()->create();

        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'ORD-NOTIF-1',
            'total_amount' => 50000,
            'status' => 'pending',
        ]);

        $payment = Payment::create([
            'order_id' => $order->id,
            'status' => 'pending',
            'amount' => $order->total_amount,
            'snap_token' => 'snap-old',
        ]);

        $payload = [
            'order_id' => $order->order_number,
            'transaction_status' => 'settlement',
            'transaction_id' => 'tran-123',
            'payment_type' => 'credit_card',
            'fraud_status' => 'accept',
        ];

        $response = $this->postJson('/api/payments/notification', $payload);

        $response->assertStatus(200);

        $this->assertDatabaseHas('payments', [
            'order_id' => $order->id,
            'status' => 'success',
            'transaction_id' => 'tran-123',
        ]);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'processing',
        ]);
    }
}
