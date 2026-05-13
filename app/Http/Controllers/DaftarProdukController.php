<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DaftarProdukController extends Controller
{
    public function index()
    {
        $produk = Produk::orderBy('created_at', 'desc')->get();

        return Inertia::render('daftar-produk', [
            'produk' => $produk,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_produk' => 'nullable|string|max:255',
            'merek' => 'required|in:Adidas,Adidas Originals,AllSaints,Amor,Andrea,Ania,Anna Sui,Azzaro,Bally,Benetton,Bolon,Boss,Carolina Herrera,Carrera,Cartier,Charriol,Chloe,Chopard,Cole Haan,Columbia,Converse,Cyrano,David Beckham,Dior,DKNY,Doraemon,Dunhill,Escada,Etro,Fendi,Ferragamo,Fossil,Giordano,Givenchy,Gucci,Guess,Guy Laroche,Hang Ten,Helen Keller,Hindar Reading,Hugo,Illustro,Jimmy Choo,Kate Spade,Lacoste,Lanvin,Laura Ashley,Leonardo,Levi\'s,Lindberg,Love Moschino,Maje,Mango,Marc Jacobs,Marni,Maui Jim,Max&Co.,Max Mara,MCM,MCQ,Moleskine,Molison,Montblanc,Moschino,Nautica,Nike,Nine West,Paul Smith,Polar,Polaroid,Pomona,Porsche Design,Prairie,Prive Revaux,Pull & Bear,Puma,Qina,Rodenstock,Saint Laurent,Sandy,Silhouette,Skechers,Swarovski,Ted Baker,Timberland,Tommy Hilfiger,Under Armour,Valentino,Vertis,Victoria Beckham,Vintage,Vivienne Westwood,Virtus,Zegna',
            'tipe_produk' => 'required|string|max:255',
            'harga_produk' => 'required|numeric|min:0',
            'stok' => 'required|integer|min:0',
            'jenis_kelamin' => 'required|in:Pria,Wanita,Unisex',
            'warna' => 'required|in:Hitam,Biru,Bronze,Coklat,Transparan,Gold,Hijau,Abu-Abu,Orange,Pink,Ungu,Merah,Rose Gold,Silver,Tortoise,Putih,Kuning',
            'material' => 'required|in:Metal,Plastic,Titanium,Rubber,Wood',
            'bentuk' => 'required|in:Aviator,Browline,Oval,Square,Round,Flat Top,Geometric,Cat Eye,Rectangle',
            'bridge' => 'nullable|string|max:50',
            'diagonal' => 'nullable|string|max:50',
            'ukuran' => 'nullable|string|max:50',
            'status_produk' => 'required|in:Aktif,Nonaktif',
        ]);

        // Combine merek + tipe_produk untuk nama_produk
        $validated['nama_produk'] = $validated['merek'] . ' ' . $validated['tipe_produk'];

        // Create produk dulu agar dapat ID
        $produk = Produk::create($validated);
        $produkId = $produk->id;

        // Nama dasar: "Hugo-Square-5"
        $namaBersih = Str::slug($produk->nama_produk . '-' . $produkId);

        // Handle image uploads - 5 slots (gambar, gambar_2 - gambar_5)
        $imageData = [];

        for ($i = 0; $i < 5; $i++) {
            // index 0 → kolom 'gambar', index 1 → 'gambar_2', dst.
            $key = $i === 0 ? 'gambar' : "gambar_" . ($i + 1);
            $fileKey = "gambar_$i";

            if ($request->hasFile($fileKey)) {
                $file = $request->file($fileKey);
                $extension = $file->getClientOriginalExtension();
                // Pattern: "Hugo-Square-5-1.png"
                $filename = $namaBersih . '-' . ($i + 1) . '.' . $extension;
                $file->move(public_path('images/produk'), $filename);
                $imageData[$key] = $filename;
            }
        }

        // Update produk dengan data gambar
        $produk->update($imageData);

        return redirect()->back()->with('success', 'Produk berhasil disimpan!');
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status_produk' => 'required|in:Aktif,Nonaktif',
        ]);

        $produk = Produk::findOrFail($id);
        $produk->update(['status_produk' => $validated['status_produk']]);

        return redirect()->back()->with('success', 'Status produk berhasil diperbarui!');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'merek' => 'required|in:Adidas,Adidas Originals,AllSaints,Amor,Andrea,Ania,Anna Sui,Azzaro,Bally,Benetton,Bolon,Boss,Carolina Herrera,Carrera,Cartier,Charriol,Chloe,Chopard,Cole Haan,Columbia,Converse,Cyrano,David Beckham,Dior,DKNY,Doraemon,Dunhill,Escada,Etro,Fendi,Ferragamo,Fossil,Giordano,Givenchy,Gucci,Guess,Guy Laroche,Hang Ten,Helen Keller,Hindar Reading,Hugo,Illustro,Jimmy Choo,Kate Spade,Lacoste,Lanvin,Laura Ashley,Leonardo,Levi\'s,Lindberg,Love Moschino,Maje,Mango,Marc Jacobs,Marni,Maui Jim,Max&Co.,Max Mara,MCM,MCQ,Moleskine,Molison,Montblanc,Moschino,Nautica,Nike,Nine West,Paul Smith,Polar,Polaroid,Pomona,Porsche Design,Prairie,Prive Revaux,Pull & Bear,Puma,Qina,Rodenstock,Saint Laurent,Sandy,Silhouette,Skechers,Swarovski,Ted Baker,Timberland,Tommy Hilfiger,Under Armour,Valentino,Vertis,Victoria Beckham,Vintage,Vivienne Westwood,Virtus,Zegna',
            'tipe_produk' => 'required|string|max:255',
            'harga_produk' => 'required|numeric|min:0',
            'stok' => 'required|integer|min:0',
            'jenis_kelamin' => 'required|in:Pria,Wanita,Unisex',
            'warna' => 'required|in:Hitam,Biru,Bronze,Coklat,Transparan,Gold,Hijau,Abu-Abu,Orange,Pink,Ungu,Merah,Rose Gold,Silver,Tortoise,Putih,Kuning',
            'material' => 'required|in:Metal,Plastic,Titanium,Rubber,Wood',
            'bentuk' => 'required|in:Aviator,Browline,Oval,Square,Round,Flat Top,Geometric,Cat Eye,Rectangle',
            'bridge' => 'nullable|string|max:50',
            'diagonal' => 'nullable|string|max:50',
            'ukuran' => 'nullable|string|max:50',
            'status_produk' => 'required|in:Aktif,Nonaktif',
        ]);

        // Combine merek + tipe_produk untuk nama_produk
        $validated['nama_produk'] = $validated['merek'] . ' ' . $validated['tipe_produk'];

        $produk = Produk::findOrFail($id);

        // Nama dasar: "Hugo-Square-5"
        $namaBersih = Str::slug($validated['nama_produk'] . '-' . $produk->id);

        // Handle image uploads - all 5 slots
        for ($i = 0; $i < 5; $i++) {
            // index 0 → kolom 'gambar', index 1 → 'gambar_2', dst.
            $key = $i === 0 ? 'gambar' : "gambar_" . ($i + 1);
            $fileKey = "gambar_$i";

            if ($request->hasFile($fileKey)) {
                // Delete old image if exists
                if ($produk->$key && file_exists(public_path('images/produk/' . $produk->$key))) {
                    unlink(public_path('images/produk/' . $produk->$key));
                }
                $file = $request->file($fileKey);
                $extension = $file->getClientOriginalExtension();
                // Pattern: "Hugo-Square-5-1.png"
                $filename = $namaBersih . '-' . ($i + 1) . '.' . $extension;
                $file->move(public_path('images/produk'), $filename);
                $validated[$key] = $filename;
            }
        }

        $produk->update($validated);

        return redirect()->back()->with('success', 'Produk berhasil diperbarui!');
    }
}