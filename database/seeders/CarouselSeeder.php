<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CarouselSeeder extends Seeder
{
    public function run(): void
    {
        $carousel = [
            [
                'id' => 1,
                'judul_carousel' => 'Lensa Berkualitas Tinggi untuk Penglihatan Optimal',
                'deskripsi' => 'Setiap kacamata EyeLit dilengkapi dengan lensa premium yang telah teruji ketajaman optiknya. Dirancang untuk kenyamanan seharian dengan coating anti-refleksi dan anti-gores.',
                'url_gambar' => 'images/carousel/slide-1.png',
                'urutan' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'judul_carousel' => 'Gratis Pengiriman ke Seluruh Indonesia',
                'deskripsi' => 'Nikmati bebas biaya pengiriman untuk setiap pemesanan. Kami mengirim ke lebih dari 100 kota di Indonesia dengan jaminan keamanan paket hingga tujuan.',
                'url_gambar' => 'images/carousel/slide-2.png',
                'urutan' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('carousel')->insert($carousel);
    }
}