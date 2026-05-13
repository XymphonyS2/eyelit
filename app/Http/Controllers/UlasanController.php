<?php

namespace App\Http\Controllers;

use App\Models\Ulasan;
use App\Models\Pesanan;
use App\Models\DetailPesanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UlasanController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'produk_id' => 'required|exists:produk,id',
            'rating' => 'required|integer|min:1|max:5',
            'komentar' => 'nullable|string|max:1000',
        ]);

        $userId = Auth::id();
        $produkId = $request->produk_id;

        // Cek apakah user sudah membeli produk ini dan pesanan sudah selesai
        $pesanan = Pesanan::where('pengguna_id', $userId)
            ->where('status_pesanan', 'Selesai')
            ->whereHas('detailPesanan', function ($query) use ($produkId) {
                $query->where('produk_id', $produkId);
            })
            ->first();

        if (!$pesanan) {
            return redirect()->back()->with('error', 'Anda belum dapat memberikan ulasan. Produk ini harus dibeli terlebih dahulu dan pesanan sudah selesai.');
        }

        // Ambil detail_pesanan
        $detailPesanan = DetailPesanan::where('pesanan_id', $pesanan->id)
            ->where('produk_id', $produkId)
            ->first();

        // Cek apakah sudah ada ulasan untuk produk ini dari pesanan ini
        $existingUlasan = Ulasan::where('pesanan_id', $pesanan->id)
            ->where('produk_id', $produkId)
            ->where('detail_pesanan_id', $detailPesanan->id)
            ->first();

        if ($existingUlasan) {
            return redirect()->back()->with('error', 'Anda sudah memberikan ulasan untuk produk ini.');
        }

        // Buat ulasan baru
        Ulasan::create([
            'pesanan_id' => $pesanan->id,
            'pengguna_id' => $userId,
            'produk_id' => $produkId,
            'detail_pesanan_id' => $detailPesanan->id,
            'rating' => $request->rating,
            'komentar' => $request->komentar,
            'tanggal_ulasan' => now(),
        ]);

        return redirect()->back()->with('success', 'Ulasan berhasil ditambahkan');
    }
}