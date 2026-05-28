<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use App\Models\BannerPromotion;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User (idempotent)
        User::firstOrCreate([
            'email' => 'admin@bengkel.com'
        ], [
            'name'     => 'Admin Bengkel',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        // Customer User (idempotent)
        User::firstOrCreate([
            'email' => 'john@example.com'
        ], [
            'name'     => 'John Doe',
            'password' => Hash::make('password'),
            'role'     => 'customer',
        ]);

        // Seed categories and products (including images)
        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
        ]);

        // Banners
        BannerPromotion::firstOrCreate([
            'title' => 'Diskon Servis Musim'
        ],[
            'title' => 'Diskon Servis Musim',
            'image' => '/images/mock/banner-1.jpg',
            'link'  => '/promo',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        BannerPromotion::firstOrCreate([
            'title' => 'Oli Diskon 20%'
        ],[
            'title' => 'Oli Diskon 20%',
            'image' => '/images/mock/banner-2.jpg',
            'link'  => '/products?category=1',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        // Coupons / promotions
        Coupon::firstOrCreate([
            'code' => 'PROMO20'
        ],[
            'code' => 'PROMO20',
            'type' => 'percent',
            'value' => 20,
            'min_order_amount' => 0,
            'start_date' => now()->subDays(10),
            'end_date' => now()->addWeeks(4),
            'usage_limit' => 1000,
            'used_count' => 0,
            'is_active' => true,
        ]);

        Coupon::firstOrCreate([
            'code' => 'FREESHIP'
        ],[
            'code' => 'FREESHIP',
            'type' => 'fixed',
            'value' => 0,
            'min_order_amount' => 200000,
            'start_date' => now()->subDays(5),
            'end_date' => now()->addWeeks(8),
            'usage_limit' => 500,
            'used_count' => 0,
            'is_active' => true,
        ]);

        // Sample orders for customer
        $customer = User::where('email', 'john@example.com')->first();
        if ($customer) {
            // only create a sample order if the customer has no orders yet
            if (! Order::where('user_id', $customer->id)->exists()) {
                $sampleProducts = Product::inRandomOrder()->take(3)->get();
                if ($sampleProducts->count()) {
                    $order = Order::create([
                        'user_id' => $customer->id,
                        'order_number' => 'ORD-' . now()->format('Ymd') . '-' . rand(1000, 9999),
                        'total_amount' => $sampleProducts->sum('price'),
                        'status' => 'delivered',
                        'shipping_cost' => 20000,
                        'shipping_courier' => 'JNE',
                        'shipping_service' => 'REG',
                        'recipient_name' => $customer->name,
                        'recipient_phone' => '081234567890',
                        'province' => 'DKI Jakarta',
                        'city' => 'Jakarta Selatan',
                        'district' => 'Kebayoran Baru',
                        'postal_code' => '12120',
                        'address_detail' => 'Jl. Contoh No. 12',
                        'notes' => 'Test order from seeder',
                    ]);

                    foreach ($sampleProducts as $p) {
                        OrderItem::create([
                            'order_id' => $order->id,
                            'product_id' => $p->id,
                            'quantity' => 1,
                            'price' => $p->price,
                        ]);
                    }
                }
            }
        }
    }
}
