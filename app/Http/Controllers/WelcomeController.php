<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use App\Models\Carousel;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function __invoke()
    {
        $produk = Produk::orderBy('created_at', 'desc')->get();
        $carousels = Carousel::where('status_carousel', true)->orderBy('urutan', 'asc')->get();

        return Inertia::render('welcome', [
            'produk' => $produk,
            'carousels' => $carousels,
        ]);
    }
}
