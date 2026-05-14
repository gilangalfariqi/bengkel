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
        $request->validate([
            'shipping_cost'   => 'required|numeric',
            'courier'         => 'required|string',
            'service'         => 'required|string',
            'recipient_name'  => 'required|string',
            'recipient_phone' => 'required|string',
            'province'        => 'required|string',
            'city'            => 'required|string',
            'postal_code'     => 'required|string',
            'address_detail'  => 'required|string',
            'notes'           => 'nullable|string',
        ]);

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
