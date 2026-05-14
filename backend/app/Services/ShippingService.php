<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ShippingService
{
    protected $apiKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.rajaongkir.api_key');
        $this->baseUrl = config('services.rajaongkir.base_url');
    }

    /**
     * Get all provinces.
     */
    public function getProvinces()
    {
        $response = Http::withHeaders([
            'key' => $this->apiKey
        ])->get($this->baseUrl . '/province');

        return $response->json()['rajaongkir']['results'] ?? [];
    }

    /**
     * Get cities by province.
     */
    public function getCities(int $provinceId)
    {
        $response = Http::withHeaders([
            'key' => $this->apiKey
        ])->get($this->baseUrl . '/city', [
            'province' => $provinceId
        ]);

        return $response->json()['rajaongkir']['results'] ?? [];
    }

    /**
     * Calculate shipping cost.
     */
    public function calculateCost(int $origin, int $destination, int $weight, string $courier)
    {
        $response = Http::withHeaders([
            'key' => $this->apiKey
        ])->post($this->baseUrl . '/cost', [
            'origin'      => $origin,
            'destination' => $destination,
            'weight'      => $weight,
            'courier'     => $courier
        ]);

        return $response->json()['rajaongkir']['results'] ?? [];
    }
}
