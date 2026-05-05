<?php

namespace App\Http\Controllers;

use App\Models\Keranjang;
use App\Models\Lensa;
use App\Models\Produk;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KeranjangController extends Controller
{
    public function index()
    {
        $keranjang = Keranjang::with('produk')
            ->where('pengguna_id', auth()->id())
            ->get()
            ->map(function ($item) {
                $hargaLensa = $this->hitungHargaLensa($item);
                $subtotal = ($item->produk->harga_produk + $hargaLensa) * $item->jumlah;

                return [
                    'id' => $item->id,
                    'produk_id' => $item->produk_id,
                    'nama_produk' => $item->produk->nama_produk,
                    'merek' => $item->produk->merek,
                    'gambar' => $item->produk->gambar,
                    'harga_produk' => $item->produk->harga_produk,
                    'stok' => $item->produk->stok,
                    'jumlah' => $item->jumlah,
                    'tipe_pembelian' => $item->tipe_pembelian,
                    'jenis_lensa_od' => $item->jenis_lensa_od,
                    'nilai_lensa_od' => $item->nilai_lensa_od,
                    'silinder_od' => $item->silinder_od,
                    'jenis_lensa_os' => $item->jenis_lensa_os,
                    'nilai_lensa_os' => $item->nilai_lensa_os,
                    'silinder_os' => $item->silinder_os,
                    'anti_radiasi' => $item->anti_radiasi,
                    'photochromic' => $item->photochromic,
                    'harga_lensa' => $hargaLensa,
                    'subtotal' => $subtotal,
                ];
            });

        $total = $keranjang->sum('subtotal');

        return Inertia::render('keranjang', [
            'keranjang' => $keranjang,
            'total' => $total,
        ]);
    }

    public function tambah(Request $request)
    {
        $validated = $request->validate([
            'produk_id' => 'required|exists:produk,id',
            'jumlah' => 'required|integer|min:1',
            'tipe_pembelian' => 'required|in:Frame Saja,Frame + Lensa',
        ]);

        $produk = Produk::findOrFail($validated['produk_id']);

        if ($produk->stok < $validated['jumlah']) {
            return redirect()->back()->with('error', 'Stok tidak mencukupi.');
        }

        $existing = Keranjang::where('pengguna_id', auth()->id())
            ->where('produk_id', $validated['produk_id'])
            ->where('tipe_pembelian', $validated['tipe_pembelian'])
            ->first();

        if ($existing && $validated['tipe_pembelian'] === 'Frame Saja') {
            $existing->increment('jumlah', $validated['jumlah']);
        } else {
            Keranjang::create([
                'pengguna_id' => auth()->id(),
                'produk_id' => $validated['produk_id'],
                'jumlah' => $validated['jumlah'],
                'tipe_pembelian' => $validated['tipe_pembelian'],
                'jenis_lensa_od' => $validated['jenis_lensa_od'] ?? null,
                'nilai_lensa_od' => $validated['nilai_lensa_od'] ?? null,
                'silinder_od' => $validated['silinder_od'] ?? null,
                'jenis_lensa_os' => $validated['jenis_lensa_os'] ?? null,
                'nilai_lensa_os' => $validated['nilai_lensa_os'] ?? null,
                'silinder_os' => $validated['silinder_os'] ?? null,
                'anti_radiasi' => $request->boolean('anti_radiasi'),
                'photochromic' => $request->boolean('photochromic'),
            ]);
        }

        return redirect()->back()->with('success', 'Produk berhasil ditambahkan ke keranjang.');
    }

    public function update(Request $request, $id)
    {
        $request->validate(['jumlah' => 'required|integer|min:1']);

        $item = Keranjang::where('id', $id)
            ->where('pengguna_id', auth()->id())
            ->firstOrFail();

        if ($item->produk->stok < $request->jumlah) {
            return back()->withErrors(['jumlah' => 'Stok tidak mencukupi.']);
        }

        $item->update(['jumlah' => $request->jumlah]);

        return back();
    }

    public function hapus($id)
    {
        Keranjang::where('id', $id)
            ->where('pengguna_id', auth()->id())
            ->delete();

        return back()->with('success', 'Item berhasil dihapus dari keranjang.');
    }

    private function hitungHargaLensa(Keranjang $item): int
    {
        if ($item->tipe_pembelian !== 'Frame + Lensa') {
            return 0;
        }

        $total = 0;
        $lensaData = Lensa::where('status_lensa', true)->get();

        foreach (['od', 'os'] as $mata) {
            $jenis = $item->{"jenis_lensa_{$mata}"};
            $nilai = $item->{"nilai_lensa_{$mata}"};
            $silinder = $item->{"silinder_{$mata}"};

            if ($jenis && $nilai !== null) {
                $lensa = $lensaData->where('jenis_lensa', $jenis)
                    ->filter(fn($l) => $nilai >= $l->minus_plus_batas_bawah && $nilai <= $l->minus_plus_batas_atas)
                    ->first();
                if ($lensa) {
                    $total += $lensa->harga_per_mata;
                }
            }

            if ($silinder !== null && $silinder > 0) {
                $lensaSilinder = $lensaData->where('jenis_lensa', 'Silinder')
                    ->filter(fn($l) => $silinder >= $l->minus_plus_batas_bawah && $silinder <= $l->minus_plus_batas_atas)
                    ->first();
                if ($lensaSilinder) {
                    $total += $lensaSilinder->harga_per_mata;
                }
            }
        }

        if ($item->anti_radiasi) {
            $lensa = $lensaData->first();
            $total += $lensa?->harga_anti_radiasi ?? 0;
        }

        if ($item->photochromic) {
            $lensa = $lensaData->first();
            $total += $lensa?->harga_photochromic ?? 0;
        }

        return (int) $total;
    }
}
