<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use App\Models\DetailPesanan;
use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PesananController extends Controller
{
    public function index()
    {
        $pesanan = Pesanan::with([
            'detailPesanan.produk',
            'ekspedisi',
        ])
            ->where('pengguna_id', auth()->id())
            ->orderByDesc('tanggal_pemesanan')
            ->get()
            ->map(function ($p) {
                // Hitung total_harga dari detail jika belum tersimpan
                if (!$p->total_harga) {
                    $p->total_harga = $p->detailPesanan->sum('subtotal') + $p->ongkos_kirim;
                }
                return $p;
            });

        return Inertia::render('pesanan', [
            'pesanan' => $pesanan,
        ]);
    }

    public function show($id)
    {
        $pesanan = Pesanan::with([
            'detailPesanan.produk',
            'alamat.provinsi',
            'ekspedisi',
        ])
            ->where('pengguna_id', auth()->id())
            ->findOrFail($id);

        $subtotalProduk = $pesanan->detailPesanan->sum('subtotal');
        $grandTotal     = $subtotalProduk + $pesanan->ongkos_kirim;

        return Inertia::render('pesanan-detail', [
            'pesanan'         => $pesanan,
            'subtotal_produk' => $subtotalProduk,
            'grand_total'     => $grandTotal,
        ]);
    }

    public function batal(Request $request, $id)
    {
        $validated = $request->validate([
            'alasan_pembatalan' => 'required|string|in:Salah mengisi detail produk,Salah mengisi alamat,Ingin mengganti produk,Berubah pikiran',
        ]);

        $pesanan = Pesanan::with('detailPesanan')
            ->where('pengguna_id', auth()->id())
            ->where('status_pesanan', 'Menunggu Konfirmasi Pembayaran')
            ->findOrFail($id);

        DB::transaction(function () use ($pesanan, $validated) {
            // Kembalikan stok produk
            foreach ($pesanan->detailPesanan as $detail) {
                Produk::where('id', $detail->produk_id)
                    ->increment('stok', $detail->jumlah);
            }

            // Update status pesanan menjadi Dibatalkan
            $pesanan->update([
                'status_pesanan' => 'Dibatalkan',
                'alasan_pembatalan' => $validated['alasan_pembatalan'],
                'tanggal_pembatalan' => now(),
            ]);
        });

        return redirect()->route('pesanan.show', $id)
            ->with('success', 'Pesanan berhasil dibatalkan dan stok telah dikembalikan.');
    }
}
