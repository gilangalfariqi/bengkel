<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DemoContentSeeder extends Seeder
{
    public function run(): void
    {
        // MVP: Saat ini database hanya memiliki tabel users/cache/jobs.
        // Konten marketplace (products, categories, dll) belum ada di skema DB.
        // Jadi seeder ini disiapkan untuk fase berikutnya ketika model/tables ditambahkan.

        // Untuk kebutuhan testing flow, data dummy akan disediakan langsung dari stub API
        // (shipping/payment/order) dan dari frontend (cart/wishlist store).
    }
}

