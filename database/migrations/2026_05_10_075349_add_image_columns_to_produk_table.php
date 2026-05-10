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
        Schema::table('produk', function (Blueprint $table) {
            $table->string('gambar_2')->nullable()->after('gambar');
            $table->string('gambar_3')->nullable()->after('gambar_2');
            $table->string('gambar_4')->nullable()->after('gambar_3');
            $table->string('gambar_5')->nullable()->after('gambar_4');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produk', function (Blueprint $table) {
            $table->dropColumn(['gambar_2', 'gambar_3', 'gambar_4', 'gambar_5']);
        });
    }
};
