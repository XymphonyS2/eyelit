<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pembayaran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pesanan_id')->constrained('pesanan')->cascadeOnDelete();
            $table->string('order_id', 100)->nullable();
            $table->enum('metode_pembayaran', ['QRIS', 'BCA', 'BNI']);
            $table->decimal('jumlah_dibayar', 12, 0);
            $table->string('kode_qris', 255)->nullable();
            $table->string('no_va_bca', 50)->nullable();
            $table->enum('status_pembayaran', ['Menunggu', 'Lunas', 'Dibatalkan'])->default('Menunggu');
            $table->timestamp('tanggal_pembayaran')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pembayaran');
    }
};