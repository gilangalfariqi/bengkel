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
        Schema::create('inventory_logs', function (Blueprint $col) {
            $col->id();
            $col->foreignId('product_id')->constrained()->onDelete('cascade');
            $col->integer('quantity'); // positive for increase, negative for decrease
            $col->string('type'); // purchase, sale, adjustment, return
            $col->text('description')->nullable();
            $col->foreignId('user_id')->nullable()->constrained()->onDelete('set null'); // Who performed the adjustment
            $col->timestamps();

            $col->index('product_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_logs');
    }
};
