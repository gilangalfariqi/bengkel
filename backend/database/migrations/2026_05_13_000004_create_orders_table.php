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
        Schema::create('orders', function (Blueprint $col) {
            $col->id();
            $col->foreignId('user_id')->constrained()->onDelete('cascade');
            $col->string('order_number')->unique();
            $col->decimal('total_amount', 15, 2);
            $col->string('status')->default('pending'); // pending, processing, shipped, completed, cancelled
            $col->decimal('shipping_cost', 15, 2)->default(0);
            $col->string('shipping_courier')->nullable();
            $col->string('shipping_service')->nullable();
            $col->string('tracking_number')->nullable();
            
            // Shipping Address Snapshot
            $col->string('recipient_name')->nullable();
            $col->string('recipient_phone')->nullable();
            $col->string('province')->nullable();
            $col->string('city')->nullable();
            $col->string('district')->nullable();
            $col->string('postal_code')->nullable();
            $col->text('address_detail')->nullable();

            $col->text('notes')->nullable();
            $col->timestamps();
            $col->softDeletes();

            $col->index('user_id');
            $col->index('order_number');
            $col->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
