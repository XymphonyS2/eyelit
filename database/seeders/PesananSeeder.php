<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PesananSeeder extends Seeder
{
    public function run(): void
    {
        // Hapus data lama sebelum insert baru
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('pembayaran')->truncate();
        DB::table('detail_pesanan')->truncate();
        DB::table('pesanan')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // Ambil user_id berdasarkan username
        $rakha = DB::table('users')->where('username', 'Rakha')->first();
        $hafiz = DB::table('users')->where('username', 'Hafiz')->first();
        $dhini = DB::table('users')->where('username', 'Dhini')->first();

        // Ambil alamat_id masing-masing user (alamat_utama)
        $alamatRakha = DB::table('alamat')->where('pengguna_id', $rakha->id)->where('alamat_utama', true)->first();
        $alamatHafiz = DB::table('alamat')->where('pengguna_id', $hafiz->id)->where('alamat_utama', true)->first();
        $alamatDhini = DB::table('alamat')->where('pengguna_id', $dhini->id)->where('alamat_utama', true)->first();

        // Ambil produk 'Hugo F HU 1388 003 55'
        $produk = DB::table('produk')->where('nama_produk', 'Hugo F HU 1388 003 55')->first();

        // Ambil ekspedisi JNE (REG) - fallback ke ekspedisi pertama jika null
        $ekspedisi = DB::table('ekspedisi')->where('nama_ekspedisi', 'JNE (REG)')->first();
        if (!$ekspedisi) {
            $ekspedisi = DB::table('ekspedisi')->first();
        }

        // Ambil ongkir berdasarkan provinsi masing-masing user
        $ongkirRakha = DB::table('ongkir')
            ->where('provinsi_id', $alamatRakha ? $alamatRakha->provinsi_id : null)
            ->where('ekspedisi_id', $ekspedisi ? $ekspedisi->id : null)
            ->first();

        $ongkirHafiz = DB::table('ongkir')
            ->where('provinsi_id', $alamatHafiz ? $alamatHafiz->provinsi_id : null)
            ->where('ekspedisi_id', $ekspedisi ? $ekspedisi->id : null)
            ->first();

        $ongkirDhini = DB::table('ongkir')
            ->where('provinsi_id', $alamatDhini ? $alamatDhini->provinsi_id : null)
            ->where('ekspedisi_id', $ekspedisi ? $ekspedisi->id : null)
            ->first();

        // Tanggal pesanan: 14, 15, 16 Mei 2026
        $tglRakha = Carbon::parse('2026-05-14 10:00:00');
        $tglHafiz = Carbon::parse('2026-05-15 10:00:00');
        $tglDhini = Carbon::parse('2026-05-16 10:00:00');

        // Tanggal selesai = tanggal pesanan + estimasi_hari_max (fallback 5 hari jika ongkir null)
        $tglSelesaiRakha = $tglRakha->copy()->addDays((int) ($ongkirRakha ? $ongkirRakha->estimasi_hari_max : 5));
        $tglSelesaiHafiz = $tglHafiz->copy()->addDays((int) ($ongkirHafiz ? $ongkirHafiz->estimasi_hari_max : 5));
        $tglSelesaiDhini = $tglDhini->copy()->addDays((int) ($ongkirDhini ? $ongkirDhini->estimasi_hari_max : 5));

        $pesananData = [
            // Pesanan Rakha
            [
                'no_pesanan' => 'ORD-20260514-001',
                'pengguna_id' => $rakha->id,
                'alamat_id' => $alamatRakha ? $alamatRakha->id : null,
                'ekspedisi_id' => $ekspedisi ? $ekspedisi->id : null,
                'no_resi' => 'JNE1234567890',
                'status_pesanan' => 'Selesai',
                'metode_pembayaran' => 'QRIS',
                'ongkos_kirim' => $ongkirRakha ? $ongkirRakha->harga : 15000,
                'total_harga' => $produk->harga_produk + ($ongkirRakha ? $ongkirRakha->harga : 15000),
                'tanggal_pemesanan' => $tglRakha,
                'tanggal_selesai' => $tglSelesaiRakha,
                'created_at' => $tglRakha,
                'updated_at' => $tglSelesaiRakha,
            ],
            // Pesanan Hafiz
            [
                'no_pesanan' => 'ORD-20260515-001',
                'pengguna_id' => $hafiz->id,
                'alamat_id' => $alamatHafiz ? $alamatHafiz->id : null,
                'ekspedisi_id' => $ekspedisi ? $ekspedisi->id : null,
                'no_resi' => 'JNE0987654321',
                'status_pesanan' => 'Selesai',
                'metode_pembayaran' => 'BCA',
                'ongkos_kirim' => $ongkirHafiz ? $ongkirHafiz->harga : 15000,
                'total_harga' => $produk->harga_produk + ($ongkirHafiz ? $ongkirHafiz->harga : 15000),
                'tanggal_pemesanan' => $tglHafiz,
                'tanggal_selesai' => $tglSelesaiHafiz,
                'created_at' => $tglHafiz,
                'updated_at' => $tglSelesaiHafiz,
            ],
            // Pesanan Dhini
            [
                'no_pesanan' => 'ORD-20260516-001',
                'pengguna_id' => $dhini->id,
                'alamat_id' => $alamatDhini ? $alamatDhini->id : null,
                'ekspedisi_id' => $ekspedisi ? $ekspedisi->id : null,
                'no_resi' => 'JNE5678901234',
                'status_pesanan' => 'Selesai',
                'metode_pembayaran' => 'BNI',
                'ongkos_kirim' => $ongkirDhini ? $ongkirDhini->harga : 15000,
                'total_harga' => $produk->harga_produk + ($ongkirDhini ? $ongkirDhini->harga : 15000),
                'tanggal_pemesanan' => $tglDhini,
                'tanggal_selesai' => $tglSelesaiDhini,
                'created_at' => $tglDhini,
                'updated_at' => $tglSelesaiDhini,
            ],
        ];

        // Insert pesanan
        DB::table('pesanan')->insert($pesananData);

        // Ambil pesanan yang baru diinsert
        $pesananRakha = DB::table('pesanan')->where('no_pesanan', 'ORD-20260514-001')->first();
        $pesananHafiz = DB::table('pesanan')->where('no_pesanan', 'ORD-20260515-001')->first();
        $pesananDhini = DB::table('pesanan')->where('no_pesanan', 'ORD-20260516-001')->first();

        // Detail Pesanan
        $detailData = [
            // Detail Rakha
            [
                'pesanan_id' => $pesananRakha->id,
                'produk_id' => $produk->id,
                'jumlah' => 1,
                'harga_frame' => $produk->harga_produk,
                'tipe_pembelian' => 'Frame Saja',
                'subtotal' => $produk->harga_produk,
                'created_at' => $tglRakha,
                'updated_at' => $tglRakha,
            ],
            // Detail Hafiz
            [
                'pesanan_id' => $pesananHafiz->id,
                'produk_id' => $produk->id,
                'jumlah' => 1,
                'harga_frame' => $produk->harga_produk,
                'tipe_pembelian' => 'Frame Saja',
                'subtotal' => $produk->harga_produk,
                'created_at' => $tglHafiz,
                'updated_at' => $tglHafiz,
            ],
            // Detail Dhini
            [
                'pesanan_id' => $pesananDhini->id,
                'produk_id' => $produk->id,
                'jumlah' => 1,
                'harga_frame' => $produk->harga_produk,
                'tipe_pembelian' => 'Frame Saja',
                'subtotal' => $produk->harga_produk,
                'created_at' => $tglDhini,
                'updated_at' => $tglDhini,
            ],
        ];

        DB::table('detail_pesanan')->insert($detailData);

        // Pembayaran
        $pembayaranData = [
            // Pembayaran Rakha (QRIS)
            [
                'pesanan_id' => $pesananRakha->id,
                'metode_pembayaran' => 'QRIS',
                'jumlah_dibayar' => $pesananRakha->total_harga,
                'kode_qris' => 'QRIS-' . uniqid(),
                'no_va_bca' => null,
                'status_pembayaran' => 'Lunas',
                'tanggal_pembayaran' => $tglRakha,
                'created_at' => $tglRakha,
                'updated_at' => $tglRakha,
            ],
            // Pembayaran Hafiz (BCA)
            [
                'pesanan_id' => $pesananHafiz->id,
                'metode_pembayaran' => 'BCA',
                'jumlah_dibayar' => $pesananHafiz->total_harga,
                'kode_qris' => null,
                'no_va_bca' => '1234567890',
                'status_pembayaran' => 'Lunas',
                'tanggal_pembayaran' => $tglHafiz,
                'created_at' => $tglHafiz,
                'updated_at' => $tglHafiz,
            ],
            // Pembayaran Dhini (BNI)
            [
                'pesanan_id' => $pesananDhini->id,
                'metode_pembayaran' => 'BNI',
                'jumlah_dibayar' => $pesananDhini->total_harga,
                'kode_qris' => null,
                'no_va_bca' => '0987654321',
                'status_pembayaran' => 'Lunas',
                'tanggal_pembayaran' => $tglDhini,
                'created_at' => $tglDhini,
                'updated_at' => $tglDhini,
            ],
        ];

        DB::table('pembayaran')->insert($pembayaranData);
    }
}
