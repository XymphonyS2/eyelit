<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use Inertia\Inertia;

class DaftarProdukController extends Controller
{
    public function index()
    {
        $produk = Produk::where('status_produk', 'Aktif')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('daftar-produk', [
            'produk' => $produk,
        ]);
    }
}