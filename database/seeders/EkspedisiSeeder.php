<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EkspedisiSeeder extends Seeder
{
    public function run(): void
    {
        // Hapus data lama agar tidak duplikat saat re-seed
        DB::table('ekspedisi')->delete();

        $ekspedisi = [
            ['nama_ekspedisi' => 'JNE (REG)',     'logo_ekspedisi' => null, 'status_ekspedisi' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_ekspedisi' => 'J&T Express',    'logo_ekspedisi' => null, 'status_ekspedisi' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_ekspedisi' => 'SiCepat (BEST)', 'logo_ekspedisi' => null, 'status_ekspedisi' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_ekspedisi' => 'AnterAja',       'logo_ekspedisi' => null, 'status_ekspedisi' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_ekspedisi' => 'Pos Indonesia',  'logo_ekspedisi' => null, 'status_ekspedisi' => true, 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('ekspedisi')->insert($ekspedisi);
    }
}
