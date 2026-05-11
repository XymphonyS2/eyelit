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
        Schema::create('ekspedisi_master', function (Blueprint $table) {
            $table->id();
            $table->string('nama_ekspedisi', 100);
            $table->string('kode', 50)->unique();
            $table->boolean('status_ekspedisi')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ekspedisi_master');
    }
};
