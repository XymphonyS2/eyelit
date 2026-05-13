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
            $table->enum('merek', ['Adidas', 'Adidas Originals', 'AllSaints', 'Amor', 'Andrea', 'Ania', 'Anna Sui', 'Azzaro', 'Bally', 'Benetton', 'Bolon', 'Boss', 'Carolina Herrera', 'Carrera', 'Cartier', 'Charriol', 'Chloe', 'Chopard', 'Cole Haan', 'Columbia', 'Converse', 'Cyrano', 'David Beckham', 'Dior', 'DKNY', 'Doraemon', 'Dunhill', 'Escada', 'Etro', 'Fendi', 'Ferragamo', 'Fossil', 'Giordano', 'Givenchy', 'Gucci', 'Guess', 'Guy Laroche', 'Hang Ten', 'Helen Keller', 'Hindar Reading', 'Hugo', 'Illustro', 'Jimmy Choo', 'Kate Spade', 'Lacoste', 'Lanvin', 'Laura Ashley', 'Leonardo', "Levi\'s", 'Lindberg', 'Love Moschino', 'Maje', 'Mango', 'Marc Jacobs', 'Marni', 'Maui Jim', 'Max&Co.', 'Max Mara', 'MCM', 'MCQ', 'Moleskine', 'Molison', 'Montblanc', 'Moschino', 'Nautica', 'Nike', 'Nine West', 'Paul Smith', 'Polar', 'Polaroid', 'Pomona', 'Porsche Design', 'Prairie', 'Prive Revaux', 'Pull & Bear', 'Puma', 'Qina', 'Rodenstock', 'Saint Laurent', 'Sandy', 'Silhouette', 'Skechers', 'Swarovski', 'Ted Baker', 'Timberland', 'Tommy Hilfiger', 'Under Armour', 'Valentino', 'Vertis', 'Victoria Beckham', 'Vintage', 'Vivienne Westwood', 'Virtus', 'Zegna']);
            $table->string('tipe_produk');
            $table->decimal('harga_produk', 12, 0);
            $table->integer('stok');
            $table->enum('jenis_kelamin', ['Pria', 'Wanita', 'Unisex']);
            $table->enum('warna', ['Hitam', 'Biru', 'Bronze', 'Coklat', 'Transparan', 'Gold', 'Hijau', 'Abu-Abu', 'Orange', 'Pink', 'Ungu', 'Merah', 'Rose Gold', 'Silver', 'Tortoise', 'Putih', 'Kuning']);
            $table->enum('material', ['Metal', 'Plastic', 'Titanium', 'Rubber', 'Wood']);
            $table->enum('bentuk', ['Aviator', 'Browline', 'Oval', 'Square', 'Round', 'Flat Top', 'Geometric', 'Cat Eye', 'Rectangle']);
            $table->string('bridge', 50)->nullable();
            $table->string('diagonal', 50)->nullable();
            $table->string('ukuran', 50)->nullable();
            $table->string('gambar')->nullable();
            $table->string('gambar_2')->nullable();
            $table->string('gambar_3')->nullable();
            $table->string('gambar_4')->nullable();
            $table->string('gambar_5')->nullable();
            $table->enum('status_produk', ['Aktif', 'Nonaktif'])->default('Aktif');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produk');
    }
};
