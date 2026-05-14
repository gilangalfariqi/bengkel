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
        Schema::create('shipping_addresses', function (Blueprint $col) {
            $col->id();
            $col->foreignId('user_id')->constrained()->onDelete('cascade');
            $col->string('recipient_name');
            $col->string('phone');
            $col->unsignedBigInteger('province_id');
            $col->string('province_name');
            $col->unsignedBigInteger('city_id');
            $col->string('city_name');
            $col->string('district');
            $col->text('full_address');
            $col->string('postal_code');
            $col->boolean('is_default')->default(false);
            $col->timestamps();

            $col->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_addresses');
    }
};
