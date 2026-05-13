<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use App\Models\Lensa;
use App\Models\Ulasan;
use App\Models\DetailPesanan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ProdukController extends Controller
{
    public function index()
    {
        $produk = Produk::where('status_produk', 'Aktif')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('katalog', [
            'produk' => $produk,
        ]);
    }

    public function show($id)
    {
        $produk = Produk::findOrFail($id);
        $lensa = Lensa::where('status_lensa', true)->get();
        $allProduk = Produk::orderBy('created_at', 'desc')->get();

        // Ambil rating rata-rata dan total ulasan untuk produk ini
        $ratingData = Ulasan::where('produk_id', $id)
            ->select(DB::raw('AVG(rating) as avg_rating, COUNT(*) as total_reviews'))
            ->first();

        // Ambil total terjual (detail_pesanan yang pesanan.status_pesanan = 'Selesai')
        $totalTerjual = DetailPesanan::join('pesanan', 'detail_pesanan.pesanan_id', '=', 'pesanan.id')
            ->where('detail_pesanan.produk_id', $id)
            ->where('pesanan.status_pesanan', 'Selesai')
            ->sum('detail_pesanan.jumlah');

        // Ambil daftar ulasan untuk produk ini
        $ulasans = Ulasan::where('produk_id', $id)
            ->with('user')
            ->orderBy('tanggal_ulasan', 'desc')
            ->get()
            ->map(function ($ulasan) {
                return [
                    'id' => $ulasan->id,
                    'username' => $ulasan->user->username ?? 'Pengguna',
                    'rating' => $ulasan->rating,
                    'komentar' => $ulasan->komentar,
                    'tanggal_ulasan' => $ulasan->tanggal_ulasan,
                ];
            });

        return Inertia::render('produk-detail', [
            'produk' => $produk,
            'lensa' => $lensa,
            'allProduk' => $allProduk,
            'ratingData' => [
                'avg_rating' => round($ratingData->avg_rating ?? 0, 1),
                'total_reviews' => $ratingData->total_reviews ?? 0,
            ],
            'totalTerjual' => $totalTerjual,
            'ulasans' => $ulasans,
        ]);
    }
}