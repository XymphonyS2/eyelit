<?php

namespace App\Http\Controllers;

use App\Services\RajaOngkirService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OngkirController extends Controller
{
    protected $rajaOngkir;

    public function __construct(RajaOngkirService $rajaOngkir)
    {
        $this->rajaOngkir = $rajaOngkir;
    }

    public function hitung(Request $request)
    {
        try {
            $request->validate([
                'kode_kota' => 'required|integer',
            ]);

            $kodeKota = (int) $request->kode_kota;

            $result = $this->rajaOngkir->hitungSemuaEkspedisi($kodeKota);

            Log::info('ONGKIR RESULT:', $result);

            $harga = 0;

            if (isset($result['rajaongkir']['results'])) {
                $allCosts = [];

                foreach ($result['rajaongkir']['results'] as $ekspedisi) {
                    foreach ($ekspedisi['costs'] as $layanan) {
                        if (isset($layanan['cost'][0]['value'])) {
                            $allCosts[] = $layanan['cost'][0]['value'];
                        }
                    }
                }

                if (!empty($allCosts)) {
                    $harga = min($allCosts);
                }
            }

            return response()->json([
                'success' => true,
                'harga'   => $harga,
                'data'    => $result,
            ]);

        } catch (\Throwable $e) {
            Log::error('ONGKIR ERROR: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'harga'   => 0,
                'error'   => 'Gagal mengambil ongkir',
            ], 500);
        }
    }

    // 🔥 TAMBAHKAN DI SINI
    public function getKota($provinsiId)
    {
        return response()->json([
            ['id' => 1, 'nama' => 'Bandar Lampung'],
            ['id' => 2, 'nama' => 'Jakarta'],
            ['id' => 3, 'nama' => 'Bandung'],
        ]);
    }
}