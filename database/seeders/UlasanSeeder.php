<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UlasanSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil user
        $rakha = DB::table('users')->where('username', 'Rakha')->first();
        $dhini = DB::table('users')->where('username', 'Dhini')->first();

        // Ambil produk 'Hugo F HU 1388 003 55'
        $produk = DB::table('produk')->where('nama_produk', 'Hugo F HU 1388 003 55')->first();

        // Ambil pesanan masing-masing user
        $pesananRakha = DB::table('pesanan')
            ->where('pengguna_id', $rakha->id)
            ->where('status_pesanan', 'Selesai')
            ->first();

        $pesananDhini = DB::table('pesanan')
            ->where('pengguna_id', $dhini->id)
            ->where('status_pesanan', 'Selesai')
            ->first();

        // Ambil detail_pesanan masing-masing
        $detailRakha = DB::table('detail_pesanan')
            ->where('pesanan_id', $pesananRakha->id)
            ->where('produk_id', $produk->id)
            ->first();

        $detailDhini = DB::table('detail_pesanan')
            ->where('pesanan_id', $pesananDhini->id)
            ->where('produk_id', $produk->id)
            ->first();

        $ulasanData = [];

        // Ulasan Rakha - hanya rating (bintang)
        if ($pesananRakha && $detailRakha) {
            $ulasanData[] = [
                'pesanan_id' => $pesananRakha->id,
                'pengguna_id' => $rakha->id,
                'produk_id' => $produk->id,
                'detail_pesanan_id' => $detailRakha->id,
                'rating' => 5,
                'komentar' => null,
                'foto_ulasan' => null,
                'tanggal_ulasan' => $pesananRakha->tanggal_selesai,
                'created_at' => $pesananRakha->tanggal_selesai,
                'updated_at' => $pesananRakha->tanggal_selesai,
            ];
        }

        // Ulasan Dhini - hanya komentar
        if ($pesananDhini && $detailDhini) {
            $ulasanData[] = [
                'pesanan_id' => $pesananDhini->id,
                'pengguna_id' => $dhini->id,
                'produk_id' => $produk->id,
                'detail_pesanan_id' => $detailDhini->id,
                'rating' => 4,
                'komentar' => 'Kacamata sesuai deskripsi, pengiriman cepat dan packaging aman. Recommended seller!',
                'foto_ulasan' => null,
                'tanggal_ulasan' => $pesananDhini->tanggal_selesai,
                'created_at' => $pesananDhini->tanggal_selesai,
                'updated_at' => $pesananDhini->tanggal_selesai,
            ];
        }

        if (!empty($ulasanData)) {
            DB::table('ulasan')->insert($ulasanData);
        }
    }
}