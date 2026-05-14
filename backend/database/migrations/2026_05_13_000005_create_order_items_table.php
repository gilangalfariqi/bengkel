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
        Schema::create('order_items', function (Blueprint $col) {
            $col->id();
            $col->foreignId('order_id')->constrained()->onDelete('cascade');
            $col->foreignId('product_id')->constrained()->onDelete('cascade');
            $col->integer('quantity');
            $col->decimal('price', 15, 2);
            $col->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
