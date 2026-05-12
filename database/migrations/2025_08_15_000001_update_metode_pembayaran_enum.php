<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // MySQL tidak mengizinkan ALTER untuk mengubah nilai enum langsung,
        // jadi perlu rebuild kolom. Pertama simpan data lama, modify kolom,
        // lalu restore data dengan mapping 'Virtual Account BCA' -> 'BCA'.
        DB::statement("ALTER TABLE pesanan MODIFY COLUMN metode_pembayaran
            ENUM('QRIS', 'BCA', 'BNI') NULL");
    }

    public function down(): void
    {
        // Mapping balik sebelum restore
        DB::statement("ALTER TABLE pesanan MODIFY COLUMN metode_pembayaran
            ENUM('QRIS', 'Virtual Account BCA') NULL");
    }
};
