<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use App\Contracts\MidtransClientInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Mockery;

class PaymentCreateTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_payment_returns_snap_token()
    {
        // Create user and order
        $user = User::factory()->create();

        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'ORD-TEST-123',
            'total_amount' => 100000,
            'status' => 'pending',
        ]);

        // Act as user (sanctum)
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/payments/create', ['order_id' => $order->id]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['success', 'data' => ['snap_token', 'client_key']]);
        $this->assertNull($response->json('data.snap_token'));
    }
}
