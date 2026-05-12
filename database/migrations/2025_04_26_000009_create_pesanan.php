<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pesanan', function (Blueprint $table) {
            $table->id();
            $table->string('no_pesanan', 50)->unique();
            $table->foreignId('pengguna_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('alamat_id')->nullable()->constrained('alamat')->nullOnDelete();
            $table->foreignId('ekspedisi_id')->nullable()->constrained('ekspedisi')->nullOnDelete();
            $table->string('no_resi', 100)->nullable();
            $table->enum('status_pesanan', [
                'Menunggu Konfirmasi Pembayaran',
                'Dikemas',
                'Dikirim',
                'Pesanan Tiba di Tujuan',
                'Selesai',
                'Dibatalkan'
            ])->default('Menunggu Konfirmasi Pembayaran');
            $table->enum('metode_pembayaran', ['QRIS', 'BCA', 'BNI'])->nullable();
            $table->decimal('ongkos_kirim', 12, 0)->default(0);
            $table->decimal('total_harga', 12, 0)->default(0);
            $table->timestamp('batas_waktu_pembayaran')->nullable();
            $table->timestamp('tanggal_pemesanan')->nullable();
            $table->timestamp('tanggal_konfirmasi_pembayaran')->nullable();
            $table->timestamp('tanggal_pengiriman')->nullable();
            $table->timestamp('tanggal_tiba')->nullable();
            $table->timestamp('tanggal_selesai')->nullable();
            $table->timestamp('tanggal_pembatalan')->nullable();
            $table->timestamp('tanggal_konfirmasi_penerimaan')->nullable();
            $table->enum('alasan_pembatalan', [
                'Salah mengisi detail produk',
                'Salah mengisi alamat',
                'Ingin mengganti produk',
                'Berubah pikiran'
            ])->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pesanan');
    }
};
