<?php

namespace App\Http\Controllers;

use App\Models\Alamat;
use App\Models\DetailPesanan;
use App\Models\Ekspedisi;
use App\Models\Keranjang;
use App\Models\Lensa;
use App\Models\Pesanan;
use App\Models\Provinsi;
use App\Services\RajaOngkirService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function __construct(private RajaOngkirService $rajaOngkir) {}

    public function index(Request $request)
    {
        $selectedIds = $request->query('items');

        $query = Keranjang::with('produk')
            ->where('pengguna_id', auth()->id());

        if ($selectedIds) {
            $ids = array_filter(array_map('intval', explode(',', $selectedIds)));
            $query->whereIn('id', $ids);
        }

        $keranjang = $query->get();

        if ($keranjang->isEmpty()) {
            return redirect()->route('keranjang')->with('error', 'Pilih produk yang ingin checkout.');
        }

        $lensaData = Lensa::where('status_lensa', true)->get();

        $items = $keranjang->map(function ($item) use ($lensaData) {
            $produk = $item->produk;
            $hargaLensa = $this->hitungHargaLensa($item, $lensaData);

            return [
                'id'             => $item->id,
                'produk_id'      => $item->produk_id,
                'nama_produk'    => $produk?->nama_produk ?? 'Produk tidak ditemukan',
                'merek'          => $produk?->merek ?? 'N/A',
                'gambar'         => $produk?->gambar ?? 'placeholder.png',
                'harga_produk'   => $produk?->harga_produk ?? 0,
                'jumlah'         => $item->jumlah,
                'tipe_pembelian' => $item->tipe_pembelian,
                'harga_lensa'    => $hargaLensa,
                'subtotal'       => ((int) ($produk?->harga_produk ?? 0) + $hargaLensa) * $item->jumlah,
            ];
        });

        $alamat    = Alamat::with('provinsi')->where('pengguna_id', auth()->id())->get();
        $provinsi  = Provinsi::orderBy('nama_provinsi')->get();
        $ekspedisi = Ekspedisi::where('status_ekspedisi', true)->get();

        return Inertia::render('checkout', [
            'items'      => $items,
            'total'      => $items->sum('subtotal'),
            'alamat'     => $alamat,
            'provinsi'   => $provinsi,
            'ekspedisi'  => $ekspedisi,
        ]);
    }

    public function ongkir(Request $request)
    {
        $request->validate([
            'alamat_id'    => 'required|exists:alamat,id',
            'ekspedisi_id' => 'required|exists:ekspedisi,id',
        ]);

        $alamat      = Alamat::findOrFail($request->alamat_id);
        $ekspedisiId = (int) $request->ekspedisi_id;

        $keranjang  = Keranjang::where('pengguna_id', auth()->id())->get();
        $beratTotal = max(250, $keranjang->sum(function ($item) {
            return $item->jumlah * 200;
        }));

        Log::info('Ongkir request', [
            'alamat_id'    => $request->alamat_id,
            'kode_kota'    => $alamat->kode_kota,
            'provinsi_id'  => $alamat->provinsi_id,
            'ekspedisi_id' => $ekspedisiId,
            'beratTotal'   => $beratTotal,
        ]);

        // Jika kode_kota tersedia, coba via API (dengan fallback lokal di service)
        if (!empty($alamat->kode_kota)) {
            $ongkirData = $this->rajaOngkir->hitungSatuEkspedisi(
                (int) $alamat->kode_kota,
                $ekspedisiId,
                $beratTotal
            );
        } else {
            // Tidak ada kode_kota → langsung pakai data lokal berdasarkan provinsi
            $ongkirData = $this->rajaOngkir->hitungDariProvinsi(
                (int) $alamat->provinsi_id,
                $ekspedisiId
            );
        }

        Log::info('Ongkir result', $ongkirData);

        return response()->json($ongkirData);
    }

    public function proses(Request $request)
    {
        $pesanan = null;

        DB::transaction(function () use ($request, &$pesanan) {
            $validated = $request->validate([
                'alamat_id'         => 'required|exists:alamat,id',
                'ekspedisi_id'      => 'required|exists:ekspedisi_master,id',
                'metode_pembayaran' => 'required|in:QRIS',
            ]);

            $itemIds = $request->validate([
                'items' => 'nullable|string',
            ])['items'] ?? '';

            $ids = $itemIds ? array_filter(array_map('intval', explode(',', $itemIds))) : [];

            $query = Keranjang::with('produk')
                ->where('pengguna_id', auth()->id());

            if (!empty($ids)) {
                $query->whereIn('id', $ids);
            }

            $keranjang = $query->get();

            if ($keranjang->isEmpty()) {
                throw new \Exception('Keranjang kosong.');
            }

            $alamat     = Alamat::findOrFail($request->alamat_id);
            $beratTotal = max(250, $keranjang->sum(fn($item) => $item->jumlah * 200));

            // Simpan item IDs yang di-checkout untuk dihapus nanti
            $checkoutItemIds = $keranjang->pluck('id')->toArray();

            // Hitung ongkir: pakai kode_kota jika ada, fallback ke provinsi
            if (!empty($alamat->kode_kota)) {
                $ongkirData = $this->rajaOngkir->hitungSatuEkspedisi(
                    (int) $alamat->kode_kota,
                    (int) $request->ekspedisi_id,
                    $beratTotal
                );
            } else {
                $ongkirData = $this->rajaOngkir->hitungDariProvinsi(
                    (int) $alamat->provinsi_id,
                    (int) $request->ekspedisi_id
                );
            }
            $ongkosKirim = $ongkirData['harga'] ?? 0;

            $lensaData   = Lensa::where('status_lensa', true)->get();
            $totalProduk = 0;

            $pesanan = Pesanan::create([
                'no_pesanan'             => 'EYL-' . strtoupper(Str::random(8)),
                'pengguna_id'            => auth()->id(),
                'alamat_id'              => $request->alamat_id,
                'ekspedisi_id'           => $request->ekspedisi_id,
                'metode_pembayaran'      => $request->metode_pembayaran,
                'ongkos_kirim'           => $ongkosKirim,
                'status_pesanan'         => 'Menunggu Konfirmasi Pembayaran',
                'tanggal_pemesanan'      => now(),
                'batas_waktu_pembayaran' => now()->addHours(24),
            ]);

            foreach ($keranjang as $item) {
                $hargaLensa  = $this->hitungHargaLensa($item, $lensaData);
                $subtotal    = ($item->produk->harga_produk + $hargaLensa) * $item->jumlah;
                $totalProduk += $subtotal;

                DetailPesanan::create([
                    'pesanan_id'     => $pesanan->id,
                    'produk_id'      => $item->produk_id,
                    'jumlah'         => $item->jumlah,
                    'harga_frame'    => $item->produk->harga_produk,
                    'tipe_pembelian' => $item->tipe_pembelian,
                    'jenis_lensa_od' => $item->jenis_lensa_od,
                    'nilai_lensa_od' => $item->nilai_lensa_od,
                    'silinder_od'    => $item->silinder_od,
                    'jenis_lensa_os' => $item->jenis_lensa_os,
                    'nilai_lensa_os' => $item->nilai_lensa_os,
                    'silinder_os'    => $item->silinder_os,
                    'anti_radiasi'   => $item->anti_radiasi,
                    'photochromic'   => $item->photochromic,
                    'subtotal_lensa' => $hargaLensa * $item->jumlah,
                    'subtotal'       => $subtotal,
                ]);
            }

            $pesanan->update(['total_harga' => $totalProduk + $ongkosKirim]);

            Keranjang::whereIn('id', $checkoutItemIds)->delete();
        });

        return redirect()->route('pesanan.show', $pesanan->id)
            ->with('success', 'Pesanan berhasil dibuat!');
    }

    public function tambahAlamat(Request $request)
    {
        $validated = $request->validate([
            'nama_penerima'   => 'required|string|max:100',
            'no_hp_penerima'  => 'required|string|max:20',
            'provinsi_id'     => 'required|exists:provinsi,id',
            'kode_kota'       => 'nullable|integer',
            'nama_kota'       => 'nullable|string|max:100',
            'kota_kabupaten'  => 'required|string|max:100',
            'kecamatan'       => 'required|string|max:100',
            'kode_pos'        => 'required|string|max:10',
            'alamat_lengkap'  => 'required|string',
        ]);

        $isFirst = !Alamat::where('pengguna_id', auth()->id())->exists();

        Alamat::create([
            'pengguna_id'    => auth()->id(),
            'nama_penerima'  => $validated['nama_penerima'],
            'no_hp_penerima' => $validated['no_hp_penerima'],
            'provinsi_id'    => $validated['provinsi_id'],
            'kode_kota'      => $validated['kode_kota'] ?? null,
            'nama_kota'      => $validated['nama_kota'] ?? null,
            'kota_kabupaten' => $validated['kota_kabupaten'],
            'kecamatan'      => $validated['kecamatan'],
            'kode_pos'       => $validated['kode_pos'],
            'alamat_lengkap'  => $validated['alamat_lengkap'],
            'alamat_utama'  => $isFirst,
        ]);

        return back()->with('success', 'Alamat berhasil disimpan.');
    }

    private function hitungHargaLensa($item, $lensaData = null): int
    {
        if ($item->tipe_pembelian !== 'Frame + Lensa') return 0;

        $lensaData ??= Lensa::where('status_lensa', true)->get();
        $total = 0;

        foreach (['od', 'os'] as $mata) {
            $jenis   = $item->{'jenis_lensa_'.$mata};
            $nilai   = $item->{'nilai_lensa_'.$mata};
            $silinder = $item->{'silinder_'.$mata};

            if ($jenis && $nilai !== null) {
                $lensa = $lensaData->where('jenis_lensa', $jenis)
                    ->filter(fn($l) => $nilai >= $l->minus_plus_batas_bawah && $nilai <= $l->minus_plus_batas_atas)
                    ->first();
                if ($lensa) $total += $lensa->harga_per_mata;
            }

            if ($silinder > 0) {
                $ls = $lensaData->where('jenis_lensa', 'Silinder')
                    ->filter(fn($l) => $silinder >= $l->minus_plus_batas_bawah && $silinder <= $l->minus_plus_batas_atas)
                    ->first();
                if ($ls) $total += $ls->harga_per_mata;
            }
        }

        if ($item->anti_radiasi) $total += $lensaData->first()?->harga_anti_radiasi ?? 0;
        if ($item->photochromic) $total += $lensaData->first()?->harga_photochromic ?? 0;

        return (int) $total;
    }
}

