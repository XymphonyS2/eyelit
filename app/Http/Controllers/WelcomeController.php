<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function __invoke()
    {
        $produk = Produk::orderBy('created_at', 'desc')->get();

        return Inertia::render('welcome', [
            'produk' => $produk,
        ]);
    }
}
