<?php

namespace App\Services;

use App\Contracts\MidtransClientInterface;
use Midtrans\Config;
use Midtrans\Snap;

class MidtransClient implements MidtransClientInterface
{
    public function __construct()
    {
        $this->configure();
    }

    protected function configure(): void
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production', false);
        Config::$isSanitized = config('midtrans.is_sanitized', true);
        Config::$is3ds = config('midtrans.is_3ds', true);
    }

    /**
     * Wrapper for Snap::getSnapToken to allow easier testing.
     *
     * @param array $params
     * @return string
     */
    public function getSnapToken(array $params): string
    {
        return Snap::getSnapToken($params);
    }
}
