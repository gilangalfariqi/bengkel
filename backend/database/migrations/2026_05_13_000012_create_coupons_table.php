<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('coupons', function (Blueprint $col) {
            $col->id();
            $col->string('code')->unique();
            $col->string('type'); // fixed, percentage
            $col->decimal('value', 15, 2);
            $col->decimal('min_order_amount', 15, 2)->default(0);
            $col->timestamp('start_date')->nullable();
            $col->timestamp('end_date')->nullable();
            $col->integer('usage_limit')->nullable();
            $col->integer('used_count')->default(0);
            $col->boolean('is_active')->default(true);
            $col->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
