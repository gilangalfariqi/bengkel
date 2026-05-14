<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Revenue', 'IDR ' . number_format(Order::where('status', 'completed')->sum('total_amount'), 0, ',', '.')),
            Stat::make('Total Orders', Order::count()),
            Stat::make('Total Products', Product::count()),
            Stat::make('Total Users', User::count()),
        ];
    }
}
