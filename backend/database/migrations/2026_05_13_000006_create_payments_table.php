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
        Schema::create('payments', function (Blueprint $col) {
            $col->id();
            $col->foreignId('order_id')->constrained()->onDelete('cascade');
            $col->string('transaction_id')->unique()->nullable();
            $col->string('payment_type')->nullable();
            $col->string('status')->default('pending'); // pending, success, failed, expired, cancelled
            $col->decimal('amount', 15, 2);
            $col->json('payload')->nullable();
            $col->string('snap_token')->nullable();
            $col->timestamps();

            $col->index('order_id');
            $col->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
