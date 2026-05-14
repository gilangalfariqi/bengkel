<?php

namespace App\Services;

use App\Contracts\MidtransClientInterface;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use App\Models\InventoryLog;

class PaymentService
{
    protected MidtransClientInterface $midtrans;

    public function __construct(MidtransClientInterface $midtrans)
    {
        $this->midtrans = $midtrans;
    }

    /**
     * Initiate payment via Midtrans Snap.
     */
    public function initiatePayment(Order $order): Payment
    {
        $params = [
            'transaction_details' => [
                'order_id'     => $order->order_number,
                'gross_amount' => (int) $order->total_amount,
            ],
            'customer_details' => [
                'first_name' => $order->user->name,
                'email'      => $order->user->email,
            ],
        ];

        try {
            $snapToken = $this->midtrans->getSnapToken($params);

            return Payment::create([
                'order_id'   => $order->id,
                'status'     => 'pending',
                'amount'     => $order->total_amount,
                'snap_token' => $snapToken,
            ]);
        } catch (\Exception $e) {
            \Log::error('Midtrans Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Handle Midtrans Notification Webhook.
     */
    public function handleNotification(array $payload): void
    {
        $orderNumber = $payload['order_id'];
        $transactionStatus = $payload['transaction_status'] ?? null;
        $paymentType = $payload['payment_type'] ?? null;
        $fraudStatus = $payload['fraud_status'] ?? null;

        DB::transaction(function () use ($payload, $orderNumber, $transactionStatus, $paymentType, $fraudStatus) {
            $order = Order::where('order_number', $orderNumber)->firstOrFail();

            $payment = $order->payment()->lockForUpdate()->first();
            if (! $payment) {
                // Create a payment record if missing
                $payment = Payment::create([
                    'order_id' => $order->id,
                    'status' => 'pending',
                    'amount' => $order->total_amount,
                ]);
            }

            // Determine new status
            $newStatus = $payment->status;
            if ($transactionStatus == 'capture') {
                if ($fraudStatus == 'challenge') {
                    $newStatus = 'challenge';
                } else if ($fraudStatus == 'accept') {
                    $newStatus = 'success';
                }
            } else if ($transactionStatus == 'settlement') {
                $newStatus = 'success';
            } else if (in_array($transactionStatus, ['cancel', 'deny', 'expire'])) {
                $newStatus = 'failed';
            } else if ($transactionStatus == 'pending') {
                $newStatus = 'pending';
            }

            // Idempotency: if already processed with same transaction_id and status, just update payload
            if ($payment->transaction_id === ($payload['transaction_id'] ?? null) && $payment->status === $newStatus) {
                $payment->update(['payload' => $payload]);
                return;
            }

            // Handle transitions
            $previousStatus = $payment->status;

            if ($newStatus === 'success' && $previousStatus !== 'success') {
                $payment->update(['status' => 'success']);
                $order->update(['status' => 'processing']);
            } else if ($newStatus === 'failed' && $previousStatus !== 'failed') {
                $payment->update(['status' => 'failed']);
                $order->update(['status' => 'cancelled']);

                // Restore stock only once and log inventory restoration
                foreach ($order->items as $item) {
                    $product = $item->product()->lockForUpdate()->first();
                    if ($product) {
                        $product->increment('stock', $item->quantity);
                        InventoryLog::create([
                            'product_id'  => $item->product_id,
                            'quantity'    => $item->quantity,
                            'type'        => 'restock',
                            'description' => "Restored stock for Order #{$order->order_number}",
                        ]);
                    }
                }
            } else if ($newStatus === 'challenge') {
                $payment->update(['status' => 'challenge']);
            } else if ($newStatus === 'pending') {
                $payment->update(['status' => 'pending']);
            }

            $payment->update([
                'transaction_id' => $payload['transaction_id'] ?? null,
                'payment_type'   => $paymentType,
                'payload'        => $payload,
            ]);
        });
    }
}
