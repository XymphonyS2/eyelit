<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function __invoke()
    {
        $produk = Produk::where('status_produk', 'Aktif')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('welcome', [
            'produk' => $produk,
        ]);
    }
}
