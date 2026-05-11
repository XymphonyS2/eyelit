<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carousel', function (Blueprint $table) {
            $table->id();
            $table->string('judul_carousel', 100)->nullable();
            $table->text('deskripsi')->nullable();
            $table->string('url_gambar');
            $table->tinyInteger('urutan')->default(1);
            $table->boolean('status_carousel')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carousel');
    }
};
