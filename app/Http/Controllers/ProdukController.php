<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use App\Models\Lensa;
use Inertia\Inertia;

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

        return Inertia::render('produk-detail', [
            'produk' => $produk,
            'lensa' => $lensa,
        ]);
    }
}