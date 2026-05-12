<?php

namespace App\Http\Middleware;

use App\Models\Keranjang;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $cartItems = [];
        $keranjangCount = 0;

        if ($request->user()) {
            $keranjang = Keranjang::with('produk')
                ->where('pengguna_id', $request->user()->id)
                ->get();

            $keranjangCount = $keranjang->count();

            $cartItems = $keranjang->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama' => $item->produk?->nama_produk ?? 'Produk',
                    'gambar' => $item->produk?->gambar ?? null,
                    'harga' => $item->produk?->harga_produk ?? 0,
                    'jumlah' => $item->jumlah,
                ];
            })->toArray();
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
                'cartItems' => $cartItems,
                'keranjang_count' => $keranjangCount,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'midtrans' => [
                'client_key' => env('MIDTRANS_CLIENT_KEY'),
                'is_production' => env('MIDTRANS_IS_PRODUCTION', false),
            ],
        ];
    }
}
