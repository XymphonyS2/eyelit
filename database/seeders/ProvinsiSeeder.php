<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProvinsiSeeder extends Seeder
{
    public function run(): void
    {
        $provinsi = [
            // Pulau Jawa
            ['nama_provinsi' => 'DKI Jakarta', 'pulau' => 'Pulau Jawa'],
            ['nama_provinsi' => 'Jawa Barat', 'pulau' => 'Pulau Jawa'],
            ['nama_provinsi' => 'Banten', 'pulau' => 'Pulau Jawa'],
            ['nama_provinsi' => 'Jawa Tengah', 'pulau' => 'Pulau Jawa'],
            ['nama_provinsi' => 'DI Yogyakarta', 'pulau' => 'Pulau Jawa'],
            ['nama_provinsi' => 'Jawa Timur', 'pulau' => 'Pulau Jawa'],
            // Pulau Sumatera
            ['nama_provinsi' => 'Lampung', 'pulau' => 'Pulau Sumatera'],
            ['nama_provinsi' => 'Bengkulu', 'pulau' => 'Pulau Sumatera'],
            ['nama_provinsi' => 'Sumatera Selatan', 'pulau' => 'Pulau Sumatera'],
            ['nama_provinsi' => 'Bangka Belitung', 'pulau' => 'Pulau Sumatera'],
            ['nama_provinsi' => 'Jambi', 'pulau' => 'Pulau Sumatera'],
            ['nama_provinsi' => 'Sumatera Barat', 'pulau' => 'Pulau Sumatera'],
            ['nama_provinsi' => 'Riau', 'pulau' => 'Pulau Sumatera'],
            ['nama_provinsi' => 'Kepulauan Riau', 'pulau' => 'Pulau Sumatera'],
            ['nama_provinsi' => 'Sumatera Utara', 'pulau' => 'Pulau Sumatera'],
            ['nama_provinsi' => 'Aceh', 'pulau' => 'Pulau Sumatera'],
            // Pulau Kalimantan
            ['nama_provinsi' => 'Kalimantan Barat', 'pulau' => 'Pulau Kalimantan'],
            ['nama_provinsi' => 'Kalimantan Tengah', 'pulau' => 'Pulau Kalimantan'],
            ['nama_provinsi' => 'Kalimantan Selatan', 'pulau' => 'Pulau Kalimantan'],
            ['nama_provinsi' => 'Kalimantan Timur', 'pulau' => 'Pulau Kalimantan'],
            ['nama_provinsi' => 'Kalimantan Utara', 'pulau' => 'Pulau Kalimantan'],
            // Pulau Bali & Nusa Tenggara
            ['nama_provinsi' => 'Bali', 'pulau' => 'Pulau Bali & Nusa Tenggara'],
            ['nama_provinsi' => 'Nusa Tenggara Barat', 'pulau' => 'Pulau Bali & Nusa Tenggara'],
            ['nama_provinsi' => 'Nusa Tenggara Timur', 'pulau' => 'Pulau Bali & Nusa Tenggara'],
            // Pulau Sulawesi
            ['nama_provinsi' => 'Sulawesi Selatan', 'pulau' => 'Pulau Sulawesi'],
            ['nama_provinsi' => 'Sulawesi Tenggara', 'pulau' => 'Pulau Sulawesi'],
            ['nama_provinsi' => 'Sulawesi Tengah', 'pulau' => 'Pulau Sulawesi'],
            ['nama_provinsi' => 'Sulawesi Barat', 'pulau' => 'Pulau Sulawesi'],
            ['nama_provinsi' => 'Sulawesi Utara', 'pulau' => 'Pulau Sulawesi'],
            ['nama_provinsi' => 'Gorontalo', 'pulau' => 'Pulau Sulawesi'],
            // Maluku & Papua
            ['nama_provinsi' => 'Maluku', 'pulau' => 'Maluku & Papua'],
            ['nama_provinsi' => 'Maluku Utara', 'pulau' => 'Maluku & Papua'],
            ['nama_provinsi' => 'Papua Barat', 'pulau' => 'Maluku & Papua'],
            ['nama_provinsi' => 'Papua Barat Daya', 'pulau' => 'Maluku & Papua'],
            ['nama_provinsi' => 'Papua Tengah', 'pulau' => 'Maluku & Papua'],
            ['nama_provinsi' => 'Papua Pegunungan', 'pulau' => 'Maluku & Papua'],
            ['nama_provinsi' => 'Papua Selatan', 'pulau' => 'Maluku & Papua'],
            ['nama_provinsi' => 'Papua', 'pulau' => 'Maluku & Papua'],
        ];

        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('provinsi')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        DB::table('provinsi')->insert($provinsi);
    }
}
