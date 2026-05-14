<?php

namespace App\Http\Middleware;

use App\Models\Keranjang;
use App\Models\Notifikasi;
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
        $notifications = [];

        if ($request->user()) {
            $userId = $request->user()->id;

            $keranjang = Keranjang::with('produk')
                ->where('pengguna_id', $userId)
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

            $notifications = Notifikasi::where('pengguna_id', $userId)
                ->orderByDesc('tanggal_notifikasi')
                ->take(10)
                ->get()
                ->map(function ($notif) {
                    return [
                        'id' => $notif->id,
                        'title' => $notif->judul_notifikasi,
                        'message' => $notif->isi_notifikasi,
                        'type' => $notif->jenis_notifikasi,
                        'pesanan_id' => $notif->pesanan_id,
                        'created_at' => $notif->tanggal_notifikasi?->toIso8601String(),
                        'read_at' => $notif->dibaca ? $notif->tanggal_notifikasi?->toIso8601String() : null,
                    ];
                })->toArray();
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user() ? $request->user()->only(['id', 'username', 'email', 'peran', 'no_hp', 'status_akun']) : null,
                'cartItems' => $cartItems,
                'keranjang_count' => $keranjangCount,
                'notifications' => $notifications,
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
