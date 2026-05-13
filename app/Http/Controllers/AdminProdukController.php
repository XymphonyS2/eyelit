<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminProdukController extends Controller
{
    public function index()
    {
        $produk = Produk::where('status_produk', 'Aktif')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/produk/index', [
            'produk' => $produk,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/produk/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_produk' => 'required|string|max:255',
            'merek' => 'required|string|max:255',
            'tipe_produk' => 'required|string|max:255',
            'harga_produk' => 'required|numeric|min:0',
            'stok' => 'required|integer|min:0',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan,Unisex',
            'warna' => 'required|string|max:255',
            'material' => 'required|string|max:255',
            'bentuk' => 'required|string|max:255',
            'bridge' => 'nullable|string|max:50',
            'diagonal' => 'nullable|string|max:50',
            'ukuran' => 'nullable|string|max:50',
            'status_produk' => 'required|in:Aktif,Nonaktif',
            'gambar' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'gambar_2' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'gambar_3' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'gambar_4' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'gambar_5' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $data = $request->except(['gambar', 'gambar_2', 'gambar_3', 'gambar_4', 'gambar_5']);

        // Buat produk dulu untuk dapat ID
        $produk = Produk::create($data);
        $produkId = $produk->id;

        // Nama dasar: "kacamata-rayban-5" (slug dari nama + ID produk)
        $namaBersih = Str::slug($data['nama_produk'] . '-' . $produkId);

        // Upload gambar utama (gambar_1)
        if ($request->hasFile('gambar')) {
            $extension = $request->file('gambar')->getClientOriginalExtension();
            $filename = $namaBersih . '-1.' . $extension;
            $request->file('gambar')->move(public_path('images/produk'), $filename);
            $produk->update(['gambar' => $filename]);
        }

        // Upload gambar tambahan (gambar_2 - gambar_5)
        $gambarFields = ['gambar_2', 'gambar_3', 'gambar_4', 'gambar_5'];
        foreach ($gambarFields as $index => $field) {
            if ($request->hasFile($field)) {
                $extension = $request->file($field)->getClientOriginalExtension();
                $filename = $namaBersih . '-' . ($index + 2) . '.' . $extension;
                $request->file($field)->move(public_path('images/produk'), $filename);
                $produk->update([$field => $filename]);
            }
        }

        return redirect()->route('admin.produk.index')->with('success', 'Produk berhasil ditambahkan');
    }
}
