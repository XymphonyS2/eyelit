<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use App\Models\Produk;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $produk = Produk::where('status_produk', 'Aktif')
            ->orderBy('created_at', 'desc')
            ->get();

        $totalPengguna = User::where('status_akun', 'aktif')->count();
        $totalPesanan = Pesanan::count();

        $jumlahPesananBulanIni = Pesanan::whereMonth('tanggal_pemesanan', Carbon::now()->month)
            ->whereYear('tanggal_pemesanan', Carbon::now()->year)
            ->where('status_pesanan', 'Selesai')
            ->count();

        $totalPenghasilanBulanIni = Pesanan::whereMonth('tanggal_pemesanan', Carbon::now()->month)
            ->whereYear('tanggal_pemesanan', Carbon::now()->year)
            ->whereIn('status_pesanan', ['Selesai', 'Pesanan Tiba di Tujuan'])
            ->sum('total_harga');

        $recentOrders = Pesanan::with('user')
            ->where('status_pesanan', 'Selesai')
            ->orderByDesc('id')
            ->limit(8)
            ->get();

        return Inertia::render('dashboard', [
            'produk' => $produk,
            'totalPengguna' => $totalPengguna,
            'totalPesanan' => $totalPesanan,
            'jumlahPesananBulanIni' => $jumlahPesananBulanIni,
            'totalPenghasilanBulanIni' => $totalPenghasilanBulanIni,
            'recentOrders' => $recentOrders,
        ]);
    }
}
