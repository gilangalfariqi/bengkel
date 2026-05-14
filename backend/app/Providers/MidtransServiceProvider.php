<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Contracts\MidtransClientInterface;
use App\Services\MidtransClient;

class MidtransServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(MidtransClientInterface::class, MidtransClient::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // nothing for now
    }
}
