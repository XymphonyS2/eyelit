<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifikasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pengguna_id')->constrained('users')->cascadeOnDelete();
            $table->string('judul_notifikasi', 100);
            $table->text('isi_notifikasi');
            $table->enum('jenis_notifikasi', [
                'Pesanan Baru',
                'Pembayaran Dikonfirmasi',
                'Pesanan Dikirim',
                'Pesanan Tiba',
                'Pembatalan'
            ]);
            $table->foreignId('pesanan_id')->nullable()->constrained('pesanan')->nullOnDelete();
            $table->foreignId('produk_id')->nullable()->constrained('produk')->nullOnDelete();
            $table->boolean('dibaca')->default(false);
            $table->timestamp('tanggal_notifikasi')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifikasi');
    }
};
