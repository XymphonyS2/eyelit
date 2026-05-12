<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EkspedisiSeeder extends Seeder
{
    public function run(): void
    {
        // truncate auto-reset auto-increment (delete tidak cukup)
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('ekspedisi')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $ekspedisi = [
            ['nama_ekspedisi' => 'JNE (REG)',     'logo_ekspedisi' => 'jne.png',           'status_ekspedisi' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_ekspedisi' => 'J&T Express',    'logo_ekspedisi' => 'jnt.png',           'status_ekspedisi' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_ekspedisi' => 'SiCepat (BEST)', 'logo_ekspedisi' => 'sicepat.png',       'status_ekspedisi' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_ekspedisi' => 'AnterAja',       'logo_ekspedisi' => 'anteraja.png',      'status_ekspedisi' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nama_ekspedisi' => 'Pos Indonesia',  'logo_ekspedisi' => 'posindonesia.png',  'status_ekspedisi' => true, 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('ekspedisi')->insert($ekspedisi);
    }
}
