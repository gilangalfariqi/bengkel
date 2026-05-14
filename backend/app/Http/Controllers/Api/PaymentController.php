<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PaymentService;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Handle Midtrans notification.
     */
    public function notification(Request $request)
    {
        try {
            $this->paymentService->handleNotification($request->all());
            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            Log::error('Payment Notification Error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
    public function create(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
        ]);

        try {
            $user = $request->user();

            // Lock and verify order ownership and status to avoid races
            $result = DB::transaction(function () use ($request, $user) {
                $order = Order::lockForUpdate()->findOrFail($request->order_id);

                if ($order->user_id !== $user->id) {
                    return response()->json(['success' => false, 'message' => 'Order does not belong to you.'], 403);
                }

                if ($order->status !== 'pending') {
                    return response()->json(['success' => false, 'message' => 'Order status not valid for payment.'], 422);
                }

                // If payment exists and already successful, prevent duplicate
                if ($order->payment && $order->payment->status === 'success') {
                    return response()->json(['success' => false, 'message' => 'Order already paid.'], 409);
                }

                // If existing pending payment exists, return existing snap token
                if ($order->payment && in_array($order->payment->status, ['pending', 'challenge'])) {
                    return response()->json([
                        'success' => true,
                        'data' => [
                            'snap_token' => $order->payment->snap_token,
                            'client_key' => config('midtrans.client_key'),
                        ]
                    ]);
                }

                // Create new payment via service (will create Payment record)
                $payment = $this->paymentService->initiatePayment($order);

                return response()->json([
                    'success' => true,
                    'data' => [
                        'snap_token' => $payment->snap_token,
                        'client_key' => config('midtrans.client_key'),
                    ]
                ]);
            });

            return $result;
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Payment Create Validation: ' . $e->getMessage());
            throw $e;
        } catch (\Exception $e) {
            Log::error('Payment Create Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to create payment.'], 500);
        }
    }
}
