<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OngkirSeeder extends Seeder
{
    public function run(): void
    {
        if (!DB::table('ekspedisi')->exists()) return;

        $ekspedisis = DB::table('ekspedisi')->get()->keyBy('id');
        if ($ekspedisis->isEmpty()) return;

        // truncate auto-reset auto-increment (delete tidak cukup)
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('ongkir')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // Nama provinsi HARUS persis sama dengan tabel provinsi (38 provinsi)
        $data = [
            'DKI Jakarta'          => [7000,  6000,  6000,  5000,  8000,  1, 1],
            'Jawa Barat'           => [9000,  8000,  8000,  7000,  9000,  1, 2],
            'Banten'              => [11000, 10000, 10000, 9000,  11000, 2, 3],
            'Jawa Tengah'          => [9000,  8000,  8000,  7000,  9000,  1, 2],
            'DI Yogyakarta'       => [10000, 9000,  9000,  8000,  10000, 1, 2],
            'Jawa Timur'           => [10000, 9000,  9000,  8000,  10000, 1, 2],
            'Lampung'              => [18000, 17000, 17000, 16000, 18000, 3, 4],
            'Bengkulu'             => [16000, 15000, 15000, 14000, 16000, 3, 4],
            'Sumatera Selatan'      => [16000, 15000, 15000, 14000, 16000, 3, 4],
            'Bangka Belitung'       => [18000, 17000, 17000, 16000, 18000, 3, 5],
            'Jambi'                => [15000, 14000, 14000, 13000, 15000, 2, 3],
            'Sumatera Barat'        => [14000, 13000, 13000, 12000, 14000, 2, 3],
            'Riau'                 => [15000, 14000, 14000, 13000, 15000, 2, 3],
            'Kepulauan Riau'        => [22000, 20000, 20000, 19000, 22000, 4, 6],
            'Sumatera Utara'       => [16000, 15000, 15000, 14000, 16000, 3, 4],
            'Aceh'                 => [12000, 11000, 11000, 10000, 12000, 2, 3],
            'Kalimantan Barat'      => [20000, 19000, 19000, 18000, 20000, 3, 4],
            'Kalimantan Tengah'     => [22000, 21000, 21000, 20000, 22000, 3, 5],
            'Kalimantan Selatan'    => [22000, 21000, 21000, 20000, 22000, 3, 5],
            'Kalimantan Timur'     => [24000, 23000, 23000, 22000, 24000, 4, 6],
            'Kalimantan Utara'     => [27000, 25000, 25000, 24000, 28000, 5, 7],
            'Bali'                 => [14000, 13000, 13000, 12000, 14000, 2, 3],
            'Nusa Tenggara Barat'  => [18000, 17000, 17000, 16000, 19000, 3, 4],
            'Nusa Tenggara Timur'  => [22000, 21000, 21000, 20000, 24000, 4, 6],
            'Sulawesi Selatan'       => [26000, 25000, 25000, 24000, 27000, 5, 7],
            'Sulawesi Tenggara'    => [27000, 26000, 26000, 25000, 28000, 5, 7],
            'Sulawesi Tengah'       => [26000, 25000, 25000, 24000, 27000, 5, 7],
            'Sulawesi Barat'        => [28000, 27000, 27000, 26000, 29000, 5, 7],
            'Sulawesi Utara'        => [23000, 22000, 22000, 21000, 23000, 4, 6],
            'Gorontalo'             => [27000, 26000, 26000, 25000, 28000, 5, 7],
            'Maluku'                => [32000, 30000, 30000, 29000, 35000, 6, 8],
            'Maluku Utara'          => [33000, 31000, 31000, 30000, 36000, 6, 8],
            'Papua Barat'           => [38000, 36000, 36000, 35000, 42000, 7, 10],
            'Papua Barat Daya'     => [44000, 42000, 42000, 41000, 49000, 8, 12],
            'Papua Tengah'          => [44000, 42000, 42000, 41000, 49000, 8, 12],
            'Papua Pegunungan'     => [45000, 43000, 43000, 42000, 50000, 8, 12],
            'Papua Selatan'          => [44000, 42000, 42000, 41000, 49000, 8, 12],
            'Papua'                => [38000, 36000, 36000, 35000, 42000, 7, 10],
        ];

        $provinsiMap = [];
        DB::table('provinsi')->get()->each(function ($p) use (&$provinsiMap) {
            $provinsiMap[$p->nama_provinsi] = $p->id;
        });

        $rows = [];
        $now = now();
        foreach ($data as $namaProvinsi => $vals) {
            if (!isset($provinsiMap[$namaProvinsi])) continue;
            $provinsiId = $provinsiMap[$namaProvinsi];
            foreach ($ekspedisis as $eks) {
                $idx = $eks->id - 1; // id 1=JNE, id 2=J&T, dst.
                $rows[] = [
                    'provinsi_id'       => $provinsiId,
                    'ekspedisi_id'      => $eks->id,
                    'harga'             => $vals[$idx] ?? $vals[0],
                    'estimasi_hari_min' => $vals[5],
                    'estimasi_hari_max' => $vals[6],
                    'created_at'        => $now,
                    'updated_at'        => $now,
                ];
            }
        }

        if (!empty($rows)) {
            DB::table('ongkir')->insert($rows);
        }
    }
}
