<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class NotifikasiSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('notifikasi')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $rakha = DB::table('users')->where('username', 'Rakha')->first();
        $hafiz = DB::table('users')->where('username', 'Hafiz')->first();
        $dhini = DB::table('users')->where('username', 'Dhini')->first();

        $produk = DB::table('produk')->where('nama_produk', 'Hugo F HU 1388 003 55')->first();

        $pesananRakha = DB::table('pesanan')->where('no_pesanan', 'ORD-20260514-001')->first();
        $pesananHafiz = DB::table('pesanan')->where('no_pesanan', 'ORD-20260515-001')->first();
        $pesananDhini = DB::table('pesanan')->where('no_pesanan', 'ORD-20260516-001')->first();

        $detailRakha = DB::table('detail_pesanan')->where('pesanan_id', $pesananRakha->id)->first();
        $detailHafiz = DB::table('detail_pesanan')->where('pesanan_id', $pesananHafiz->id)->first();
        $detailDhini = DB::table('detail_pesanan')->where('pesanan_id', $pesananDhini->id)->first();

        $tglRakha = Carbon::parse('2026-05-14 10:00:00');
        $tglHafiz = Carbon::parse('2026-05-15 10:00:00');
        $tglDhini = Carbon::parse('2026-05-16 10:00:00');

        $notifikasiData = [
            // ── Rakha ──
            [
                'pengguna_id' => $rakha->id,
                'judul_notifikasi' => 'Pesanan #' . $pesananRakha->no_pesanan . ' telah tiba di tujuan',
                'isi_notifikasi' => $produk->nama_produk . ' (1 produk)',
                'jenis_notifikasi' => 'Pesanan Tiba',
                'pesanan_id' => $pesananRakha->id,
                'produk_id' => $detailRakha->produk_id,
                'dibaca' => false,
                'tanggal_notifikasi' => $tglRakha->copy()->addDays(4),
                'created_at' => $tglRakha->copy()->addDays(4),
                'updated_at' => $tglRakha->copy()->addDays(4),
            ],
            [
                'pengguna_id' => $rakha->id,
                'judul_notifikasi' => 'Pesanan #' . $pesananRakha->no_pesanan . ' sedang dikirim via JNE (REG)',
                'isi_notifikasi' => $produk->nama_produk . ' (1 produk)',
                'jenis_notifikasi' => 'Pesanan Dikirim',
                'pesanan_id' => $pesananRakha->id,
                'produk_id' => $detailRakha->produk_id,
                'dibaca' => true,
                'tanggal_notifikasi' => $tglRakha->copy()->addDays(2),
                'created_at' => $tglRakha->copy()->addDays(2),
                'updated_at' => $tglRakha->copy()->addDays(2),
            ],
            [
                'pengguna_id' => $rakha->id,
                'judul_notifikasi' => 'Pesanan #' . $pesananRakha->no_pesanan . ' sedang dikemas',
                'isi_notifikasi' => $produk->nama_produk . ' (1 produk)',
                'jenis_notifikasi' => 'Pesanan Baru',
                'pesanan_id' => $pesananRakha->id,
                'produk_id' => $detailRakha->produk_id,
                'dibaca' => true,
                'tanggal_notifikasi' => $tglRakha->copy()->addDay(),
                'created_at' => $tglRakha->copy()->addDay(),
                'updated_at' => $tglRakha->copy()->addDay(),
            ],
            [
                'pengguna_id' => $rakha->id,
                'judul_notifikasi' => 'Pesanan #' . $pesananRakha->no_pesanan . ' — Bayar Sekarang!',
                'isi_notifikasi' => 'Segera selesaikan pembayaran sebelum batas waktu berakhir.',
                'jenis_notifikasi' => 'Pesanan Baru',
                'pesanan_id' => $pesananRakha->id,
                'produk_id' => $detailRakha->produk_id,
                'dibaca' => true,
                'tanggal_notifikasi' => $tglRakha,
                'created_at' => $tglRakha,
                'updated_at' => $tglRakha,
            ],

            // ── Hafiz ──
            [
                'pengguna_id' => $hafiz->id,
                'judul_notifikasi' => 'Pesanan #' . $pesananHafiz->no_pesanan . ' telah tiba di tujuan',
                'isi_notifikasi' => $produk->nama_produk . ' (1 produk)',
                'jenis_notifikasi' => 'Pesanan Tiba',
                'pesanan_id' => $pesananHafiz->id,
                'produk_id' => $detailHafiz->produk_id,
                'dibaca' => false,
                'tanggal_notifikasi' => $tglHafiz->copy()->addDays(4),
                'created_at' => $tglHafiz->copy()->addDays(4),
                'updated_at' => $tglHafiz->copy()->addDays(4),
            ],
            [
                'pengguna_id' => $hafiz->id,
                'judul_notifikasi' => 'Pesanan #' . $pesananHafiz->no_pesanan . ' sedang dikirim via JNE (REG)',
                'isi_notifikasi' => $produk->nama_produk . ' (1 produk)',
                'jenis_notifikasi' => 'Pesanan Dikirim',
                'pesanan_id' => $pesananHafiz->id,
                'produk_id' => $detailHafiz->produk_id,
                'dibaca' => true,
                'tanggal_notifikasi' => $tglHafiz->copy()->addDays(2),
                'created_at' => $tglHafiz->copy()->addDays(2),
                'updated_at' => $tglHafiz->copy()->addDays(2),
            ],
            [
                'pengguna_id' => $hafiz->id,
                'judul_notifikasi' => 'Pesanan #' . $pesananHafiz->no_pesanan . ' sedang dikemas',
                'isi_notifikasi' => $produk->nama_produk . ' (1 produk)',
                'jenis_notifikasi' => 'Pesanan Baru',
                'pesanan_id' => $pesananHafiz->id,
                'produk_id' => $detailHafiz->produk_id,
                'dibaca' => true,
                'tanggal_notifikasi' => $tglHafiz->copy()->addDay(),
                'created_at' => $tglHafiz->copy()->addDay(),
                'updated_at' => $tglHafiz->copy()->addDay(),
            ],
            [
                'pengguna_id' => $hafiz->id,
                'judul_notifikasi' => 'Pesanan #' . $pesananHafiz->no_pesanan . ' — Bayar Sekarang!',
                'isi_notifikasi' => 'Segera selesaikan pembayaran sebelum batas waktu berakhir.',
                'jenis_notifikasi' => 'Pesanan Baru',
                'pesanan_id' => $pesananHafiz->id,
                'produk_id' => $detailHafiz->produk_id,
                'dibaca' => true,
                'tanggal_notifikasi' => $tglHafiz,
                'created_at' => $tglHafiz,
                'updated_at' => $tglHafiz,
            ],

            // ── Dhini ──
            [
                'pengguna_id' => $dhini->id,
                'judul_notifikasi' => 'Pesanan #' . $pesananDhini->no_pesanan . ' telah tiba di tujuan',
                'isi_notifikasi' => $produk->nama_produk . ' (1 produk)',
                'jenis_notifikasi' => 'Pesanan Tiba',
                'pesanan_id' => $pesananDhini->id,
                'produk_id' => $detailDhini->produk_id,
                'dibaca' => false,
                'tanggal_notifikasi' => $tglDhini->copy()->addDays(4),
                'created_at' => $tglDhini->copy()->addDays(4),
                'updated_at' => $tglDhini->copy()->addDays(4),
            ],
            [
                'pengguna_id' => $dhini->id,
                'judul_notifikasi' => 'Pesanan #' . $pesananDhini->no_pesanan . ' sedang dikirim via JNE (REG)',
                'isi_notifikasi' => $produk->nama_produk . ' (1 produk)',
                'jenis_notifikasi' => 'Pesanan Dikirim',
                'pesanan_id' => $pesananDhini->id,
                'produk_id' => $detailDhini->produk_id,
                'dibaca' => true,
                'tanggal_notifikasi' => $tglDhini->copy()->addDays(2),
                'created_at' => $tglDhini->copy()->addDays(2),
                'updated_at' => $tglDhini->copy()->addDays(2),
            ],
            [
                'pengguna_id' => $dhini->id,
                'judul_notifikasi' => 'Pesanan #' . $pesananDhini->no_pesanan . ' sedang dikemas',
                'isi_notifikasi' => $produk->nama_produk . ' (1 produk)',
                'jenis_notifikasi' => 'Pesanan Baru',
                'pesanan_id' => $pesananDhini->id,
                'produk_id' => $detailDhini->produk_id,
                'dibaca' => true,
                'tanggal_notifikasi' => $tglDhini->copy()->addDay(),
                'created_at' => $tglDhini->copy()->addDay(),
                'updated_at' => $tglDhini->copy()->addDay(),
            ],
            [
                'pengguna_id' => $dhini->id,
                'judul_notifikasi' => 'Pesanan #' . $pesananDhini->no_pesanan . ' — Bayar Sekarang!',
                'isi_notifikasi' => 'Segera selesaikan pembayaran sebelum batas waktu berakhir.',
                'jenis_notifikasi' => 'Pesanan Baru',
                'pesanan_id' => $pesananDhini->id,
                'produk_id' => $detailDhini->produk_id,
                'dibaca' => true,
                'tanggal_notifikasi' => $tglDhini,
                'created_at' => $tglDhini,
                'updated_at' => $tglDhini,
            ],
        ];

        DB::table('notifikasi')->insert($notifikasiData);
    }
}
