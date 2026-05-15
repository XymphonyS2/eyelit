<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use App\Notifications\PesananDikemas;
use App\Notifications\PesananDikirim;
use App\Notifications\PesananTiba;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DemoController extends Controller
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

        return Inertia::render('demo', [
            'pesanan' => $pesanan,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'status_pesanan' => 'required|string',
            'no_resi' => 'nullable|string',
            'tanggal_konfirmasi_pembayaran' => 'nullable|string',
            'tanggal_pengiriman' => 'nullable|string',
            'tanggal_tiba' => 'nullable|string',
            'tanggal_selesai' => 'nullable|string',
        ]);

        $pesanan = Pesanan::with(['user', 'ekspedisi', 'detailPesanan.produk'])->findOrFail($id);
        $oldStatus = $pesanan->status_pesanan;
        $newStatus = $validated['status_pesanan'];

        $pesanan->update($validated);

        // Kirim notifikasi berdasarkan perubahan status
        $user = $pesanan->user;

        if ($newStatus === 'Dikemas' && $oldStatus !== 'Dikemas') {
            (new \App\Notifications\PesananDikemas($pesanan))->saveNotification($user);
        }

        if ($newStatus === 'Dikirim' && $oldStatus !== 'Dikirim') {
            (new \App\Notifications\PesananDikirim($pesanan))->saveNotification($user);
        }

        if ($newStatus === 'Pesanan Tiba di Tujuan' && $oldStatus !== 'Pesanan Tiba di Tujuan') {
            (new \App\Notifications\PesananTiba($pesanan))->saveNotification($user);
        }

        return Inertia::render('demo', [
            'pesanan' => Pesanan::with(['user', 'detailPesanan.produk', 'ekspedisi'])
                ->orderByDesc('tanggal_pemesanan')
                ->get()
                ->map(function ($p) {
                    if (!$p->total_harga) {
                        $p->total_harga = $p->detailPesanan->sum('subtotal') + $p->ongkos_kirim;
                    }
                    return $p;
                }),
        ]);
    }
}