<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ShippingService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShippingController extends Controller
{
    use ApiResponse;

    protected $shippingService;

    public function __construct(ShippingService $shippingService)
    {
        $this->shippingService = $shippingService;
    }

    /**
     * Get provinces.
     */
    public function provinces(): JsonResponse
    {
        return $this->successResponse($this->shippingService->getProvinces());
    }

    /**
     * Get cities.
     */
    public function cities(int $provinceId): JsonResponse
    {
        return $this->successResponse($this->shippingService->getCities($provinceId));
    }

    /**
     * Calculate cost.
     */
    public function cost(Request $request): JsonResponse
    {
        $request->validate([
            'origin'      => 'required|integer',
            'destination' => 'required|integer',
            'weight'      => 'required|integer',
            'courier'     => 'required|string',
        ]);

        $costs = $this->shippingService->calculateCost(
            $request->origin,
            $request->destination,
            $request->weight,
            $request->courier
        );

        return $this->successResponse($costs);
    }
}
