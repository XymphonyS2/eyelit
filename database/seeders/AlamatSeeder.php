<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AlamatSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil user_id berdasarkan username
        $rakha = DB::table('users')->where('username', 'Rakha')->first();
        $hafiz = DB::table('users')->where('username', 'Hafiz')->first();
        $dhini = DB::table('users')->where('username', 'Dhini')->first();

        // Ambil provinsi_id masing-masing
        $provJabar = DB::table('provinsi')->where('nama_provinsi', 'Jawa Barat')->first();
        $provJateng = DB::table('provinsi')->where('nama_provinsi', 'Jawa Tengah')->first();
        $provLampung = DB::table('provinsi')->where('nama_provinsi', 'Lampung')->first();

        $alamat = [
            // Rakha - Jawa Barat, Bandung
            [
                'pengguna_id' => $rakha->id,
                'nama_penerima' => 'Rakha',
                'no_hp_penerima' => '081234567891',
                'provinsi_id' => $provJabar->id,
                'kota_kabupaten' => 'Kota Bandung',
                'kecamatan' => 'Coblong',
                'kode_pos' => '40131',
                'alamat_lengkap' => 'Jl. Dipatiukur No. 123, RT 002/RW 007',
                'alamat_utama' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Hafiz - Jawa Tengah, Ambarawa
            [
                'pengguna_id' => $hafiz->id,
                'nama_penerima' => 'Hafiz',
                'no_hp_penerima' => '081234567892',
                'provinsi_id' => $provJateng->id,
                'kota_kabupaten' => 'Kabupaten Semarang',
                'kecamatan' => 'Ambarawa',
                'kode_pos' => '50611',
                'alamat_lengkap' => 'Jl. Jendral Sudirman No. 45, RT 001/RW 003',
                'alamat_utama' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Dhini - Lampung, Bandar Lampung
            [
                'pengguna_id' => $dhini->id,
                'nama_penerima' => 'Dhini',
                'no_hp_penerima' => '081234567893',
                'provinsi_id' => $provLampung->id,
                'kota_kabupaten' => 'Kota Bandar Lampung',
                'kecamatan' => 'Tanjung Karang Timur',
                'kode_pos' => '35124',
                'alamat_lengkap' => 'Jl. Zainal Abidin Pagaralam No. 78, RT 005/RW 002',
                'alamat_utama' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('alamat')->insert($alamat);
    }
}