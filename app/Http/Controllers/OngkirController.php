<?php

namespace App\Http\Controllers;

use App\Models\Alamat;
use App\Models\Ongkir;
use App\Models\Ekspedisi;
use Illuminate\Http\Request;

class OngkirController extends Controller
{
    public function hitung(Request $request)
    {
        $request->validate([
            'alamat_id'    => 'required|exists:alamat,id',
            'ekspedisi_id' => 'required|exists:ekspedisi,id',
        ]);

        $alamat = Alamat::findOrFail($request->alamat_id);

        // Gunakan tabel ongkir asli dengan provinsi_id + ekspedisi_id
        $ongkir = \DB::table('ongkir')
            ->where('provinsi_id', $alamat->provinsi_id)
            ->where('ekspedisi_id', $request->ekspedisi_id)
            ->first();

        if ($ongkir) {
            return response()->json([
                'harga'             => (int) $ongkir->harga,
                'estimasi_hari_min' => (string) $ongkir->estimasi_hari_min,
                'estimasi_hari_max' => (string) $ongkir->estimasi_hari_max,
            ]);
        }

        return response()->json([
            'harga'             => 0,
            'estimasi_hari_min' => '1',
            'estimasi_hari_max' => '3',
        ]);
    }
}