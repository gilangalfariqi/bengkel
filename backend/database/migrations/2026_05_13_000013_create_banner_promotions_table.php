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
        Schema::create('banner_promotions', function (Blueprint $col) {
            $col->id();
            $col->string('title');
            $col->string('image');
            $col->string('link')->nullable();
            $col->boolean('is_active')->default(true);
            $col->integer('sort_order')->default(0);
            $col->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banner_promotions');
    }
};
