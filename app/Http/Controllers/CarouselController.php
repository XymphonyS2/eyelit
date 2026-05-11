<?php

namespace App\Http\Controllers;

use App\Models\Carousel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CarouselController extends Controller
{
    public function index()
    {
        $carousels = Carousel::orderBy('urutan', 'asc')->get();

        return Inertia::render('carousel', [
            'carousels' => $carousels,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'judul_carousel' => 'nullable|string|max:100',
                'deskripsi' => 'nullable|string',
                'url_gambar' => 'required|image|mimes:jpg,jpeg,png,webp,gif|max:2048',
                'urutan' => 'required|integer|min:1',
                'status_carousel' => 'nullable|string',
            ]);

            $statusCarousel = in_array($validated['status_carousel'] ?? '1', ['true', '1', 1, true], true);

            // Simpan ke public/images/carousel
            $file = $request->file('url_gambar');
            $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('images/carousel');

            // Buat folder jika belum ada
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $file->move($destinationPath, $fileName);
            $imagePath = 'images/carousel/' . $fileName;

            Carousel::create([
                'judul_carousel' => $validated['judul_carousel'],
                'deskripsi' => $validated['deskripsi'],
                'url_gambar' => $imagePath,
                'urutan' => $validated['urutan'],
                'status_carousel' => $statusCarousel,
            ]);

            return response()->json(['success' => true, 'message' => 'Slide berhasil ditambahkan'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $carousel = Carousel::findOrFail($id);

            $rules = [
                'judul_carousel' => 'nullable|string|max:100',
                'deskripsi' => 'nullable|string',
                'urutan' => 'required|integer|min:1',
                'status_carousel' => 'required|string',
            ];

            if ($request->hasFile('url_gambar')) {
                $rules['url_gambar'] = 'required|image|mimes:jpg,jpeg,png,webp,gif|max:2048';
            }

            $validated = $request->validate($rules);

            $statusCarousel = in_array($validated['status_carousel'], ['true', '1']);

            if ($request->hasFile('url_gambar')) {
                // Hapus gambar lama dari public/images/carousel
                if ($carousel->url_gambar && file_exists(public_path($carousel->url_gambar))) {
                    unlink(public_path($carousel->url_gambar));
                }
                // Simpan gambar baru ke public/images/carousel
                $file = $request->file('url_gambar');
                $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $destinationPath = public_path('images/carousel');

                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }

                $file->move($destinationPath, $fileName);
                $validated['url_gambar'] = 'images/carousel/' . $fileName;
            }

            $carousel->update([
                'judul_carousel' => $validated['judul_carousel'],
                'deskripsi' => $validated['deskripsi'],
                'urutan' => $validated['urutan'],
                'status_carousel' => $statusCarousel,
                'url_gambar' => $validated['url_gambar'] ?? $carousel->url_gambar,
            ]);

            return response()->json(['success' => true, 'message' => 'Slide berhasil diperbarui'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function updateStatus($id)
    {
        $carousel = Carousel::findOrFail($id);
        $carousel->update(['status_carousel' => !$carousel->status_carousel]);

        return Inertia::render('carousel', [
            'carousels' => Carousel::orderBy('urutan', 'asc')->get(),
        ]);
    }

    public function destroy($id)
    {
        $carousel = Carousel::findOrFail($id);

        if ($carousel->url_gambar && file_exists(public_path($carousel->url_gambar))) {
            unlink(public_path($carousel->url_gambar));
        }

        $carousel->delete();

        return Inertia::render('carousel', [
            'carousels' => Carousel::orderBy('urutan', 'asc')->get(),
            'flash' => ['success' => 'Slide berhasil dihapus'],
        ]);
    }
}