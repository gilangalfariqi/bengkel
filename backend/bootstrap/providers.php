<?php

use App\Providers\AppServiceProvider;
use App\Providers\MidtransServiceProvider;

return [
    AppServiceProvider::class,
    MidtransServiceProvider::class,
    App\Providers\Filament\AdminPanelProvider::class,
];
