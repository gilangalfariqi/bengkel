<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\OrderService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    use ApiResponse;

    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    /**
     * Create order (Checkout).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'shipping_cost'   => 'required|numeric|min:0',
            'courier'         => 'required|string|max:50',
            'service'         => 'required|string|max:50',
            'recipient_name'  => 'required|string|max:120',
            'recipient_phone' => 'required|string|max:30',
            'province'        => 'nullable|string|max:120',
            'city'            => 'nullable|string|max:120',
            'postal_code'     => 'nullable|string|max:20',
            'address_detail'  => 'nullable|string|max:500',
            'notes'           => 'nullable|string|max:1000',
        ]);

        if (($validated['courier'] ?? '') !== 'pickup') {
            $request->validate([
                'province'       => 'required|string|max:120',
                'city'           => 'required|string|max:120',
                'postal_code'    => 'required|string|max:20',
                'address_detail' => 'required|string|max:500',
            ]);
        }

        try {
            $order = $this->orderService->createOrder($request->user(), $request->all());
            return $this->successResponse($order->load('payment'), 'Order created successfully.', 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * Order history.
     */
    public function index(Request $request): JsonResponse
    {
        $orders = $this->orderService->getOrderHistory($request->user());
        return $this->successResponse($orders);
    }

    /**
     * Order detail.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $order = $this->orderService->getOrderDetails($id, $request->user());
        return $this->successResponse($order);
    }
}
