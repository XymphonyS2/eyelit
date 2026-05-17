<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaporanController extends Controller
{
    public function index(Request $request)
    {
        // Get selected month and year, default to current month/year
        $selectedMonth = $request->input('month', Carbon::now()->month);
        $selectedYear = $request->input('year', Carbon::now()->year);

        // Total penghasilan bulan ini (status Selesai)
        $totalPenghasilanBulanIni = Pesanan::whereMonth('tanggal_pemesanan', $selectedMonth)
            ->whereYear('tanggal_pemesanan', $selectedYear)
            ->where('status_pesanan', 'Selesai')
            ->sum('total_harga');

        // Jumlah pesanan selesai bulan ini
        $jumlahPesananSelesai = Pesanan::whereMonth('tanggal_pemesanan', $selectedMonth)
            ->whereYear('tanggal_pemesanan', $selectedYear)
            ->where('status_pesanan', 'Selesai')
            ->count();

        // Semua pesanan selesai untuk tabel (dengan filter bulan)
        $pesananSelesai = Pesanan::where('status_pesanan', 'Selesai')
            ->whereMonth('tanggal_pemesanan', $selectedMonth)
            ->whereYear('tanggal_pemesanan', $selectedYear)
            ->orderByDesc('id')
            ->get();

        return Inertia::render('laporan', [
            'totalPenghasilanBulanIni' => $totalPenghasilanBulanIni,
            'jumlahPesananSelesai' => $jumlahPesananSelesai,
            'pesananSelesai' => $pesananSelesai,
            'selectedMonth' => (int) $selectedMonth,
            'selectedYear' => (int) $selectedYear,
        ]);
    }
}