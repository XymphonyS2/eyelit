<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $produk = Produk::where('status_produk', 'Aktif')
            ->orderBy('created_at', 'desc')
            ->get();

        $totalPengguna = User::where('status_akun', 'aktif')->count();

        return Inertia::render('dashboard', [
            'produk' => $produk,
            'totalPengguna' => $totalPengguna,
        ]);
    }
}
