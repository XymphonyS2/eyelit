<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use Inertia\Inertia;

class ProdukController extends Controller
{
    public function index()
    {
        $produk = Produk::all();

        return Inertia::render('katalog', [
            'produk' => $produk,
        ]);
    }

    // ✅ DIPERBAIKI: pakai $id manual, bukan route model binding
    public function show($id)
    {
        $produk = Produk::findOrFail($id);

        return Inertia::render('produk-detail', [
            'produk' => $produk,
        ]);
    }
}
