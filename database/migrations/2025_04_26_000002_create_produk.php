<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produk', function (Blueprint $table) {
            $table->id();
            $table->string('nama_produk');
            $table->enum('merek', ['Hugo', 'Giordano', 'Qina', 'Chopard', 'Illustro', 'Gucci', 'Guy Laroche', 'Beneton', 'Nike', 'Ted Baker', 'Hindar', 'Virtus', 'Puma', 'Bolon']);
            $table->string('tipe_produk');
            $table->decimal('harga_produk', 12, 0);
            $table->integer('stok');
            $table->enum('jenis_kelamin', ['Pria', 'Wanita', 'Unisex']);
            $table->enum('warna', ['Hitam', 'Putih', 'Transparan', 'Rose Gold', 'Hijau', 'Biru', 'Merah', 'Ungu', 'Tortoise', 'Gold', 'Pink', 'Kuning', 'Black']);
            $table->enum('material', ['Metal', 'Plastic', 'Titanium', 'Rubber', 'Wood']);
            $table->enum('bentuk', ['Aviator', 'Browline', 'Oval', 'Square', 'Round', 'Flat Top', 'Geometric', 'Cat Eye', 'Rectangle']);
            $table->string('bridge', 50)->nullable();
            $table->string('diagonal', 50)->nullable();
            $table->string('ukuran', 50)->nullable();
            $table->enum('status_produk', ['Aktif', 'Nonaktif'])->default('Aktif');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produk');
    }
};
