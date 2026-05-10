<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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

        // Handle image uploads
        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('produk', 'public');
        }
        if ($request->hasFile('gambar_2')) {
            $data['gambar_2'] = $request->file('gambar_2')->store('produk', 'public');
        }
        if ($request->hasFile('gambar_3')) {
            $data['gambar_3'] = $request->file('gambar_3')->store('produk', 'public');
        }
        if ($request->hasFile('gambar_4')) {
            $data['gambar_4'] = $request->file('gambar_4')->store('produk', 'public');
        }
        if ($request->hasFile('gambar_5')) {
            $data['gambar_5'] = $request->file('gambar_5')->store('produk', 'public');
        }

        Produk::create($data);

        return redirect()->route('admin.produk.index')->with('success', 'Produk berhasil ditambahkan');
    }
}
