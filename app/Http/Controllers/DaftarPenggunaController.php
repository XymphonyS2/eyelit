<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class DaftarPenggunaController extends Controller
{
    public function index()
    {
        $pengguna = User::where('status_akun', 'aktif')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('daftar-pengguna', [
            'pengguna' => $pengguna,
        ]);
    }
}