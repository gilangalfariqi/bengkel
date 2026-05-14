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
        Schema::create('products', function (Blueprint $col) {
            $col->id();
            $col->foreignId('category_id')->constrained()->onDelete('cascade');
            $col->string('name');
            $col->string('slug')->unique();
            $col->text('description')->nullable();
            $col->decimal('price', 15, 2);
            $col->decimal('discount_price', 15, 2)->nullable();
            $col->integer('stock')->default(0);
            $col->integer('weight')->default(0); // in grams
            $col->string('brand')->nullable();
            $col->json('specifications')->nullable();
            $col->boolean('is_active')->default(true);
            $col->timestamps();
            $col->softDeletes();

            $col->index(['slug', 'is_active']);
            $col->index('category_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
