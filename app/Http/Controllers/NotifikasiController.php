<?php

namespace App\Http\Controllers;

use App\Models\Notifikasi;
use Inertia\Inertia;

class NotifikasiController extends Controller
{
    public function index()
    {
        $notifikasi = Notifikasi::where('pengguna_id', auth()->id())
            ->with('produk')
            ->orderByDesc('tanggal_notifikasi')
            ->get();

        return Inertia::render('notifikasi', [
            'notifikasi' => $notifikasi,
        ]);
    }

    public function markAsRead($id)
    {
        $notifikasi = Notifikasi::where('pengguna_id', auth()->id())
            ->where('id', $id)
            ->first();

        if ($notifikasi) {
            $notifikasi->update(['dibaca' => true]);
        }

        return back();
    }

    public function markAllAsRead()
    {
        Notifikasi::where('pengguna_id', auth()->id())
            ->where('dibaca', false)
            ->update(['dibaca' => true]);

        return back();
    }
}