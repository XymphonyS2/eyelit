<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use Inertia\Inertia;

class DaftarPesananController extends Controller
{
    public function index()
    {
        $pesanan = Pesanan::with([
            'user',
            'detailPesanan.produk',
            'ekspedisi',
        ])
            ->orderByDesc('tanggal_pemesanan')
            ->get()
            ->map(function ($p) {
                if (!$p->total_harga) {
                    $p->total_harga = $p->detailPesanan->sum('subtotal') + $p->ongkos_kirim;
                }
                return $p;
            });

        return Inertia::render('daftar-pesanan', [
            'pesanan' => $pesanan,
        ]);
    }
}