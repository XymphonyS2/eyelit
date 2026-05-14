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
        Schema::create('notifikasi', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pengguna_id');
            $table->string('judul_notifikasi', 100);
            $table->text('isi_notifikasi');
            $table->enum('jenis_notifikasi', ['Pesanan Baru', 'Pembayaran Dikonfirmasi', 'Pesanan Dikirim', 'Pesanan Tiba', 'Pembatalan']);
            $table->unsignedBigInteger('pesanan_id')->nullable();
            $table->boolean('dibaca')->default(false);
            $table->timestamp('tanggal_notifikasi')->nullable();
            $table->timestamps();

            $table->foreign('pengguna_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('pesanan_id')->references('id')->on('pesanan')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifikasi');
    }
};
