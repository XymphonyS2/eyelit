<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('ongkir_master')) {
            Schema::create('ongkir_master', function (Blueprint $table) {
                $table->id();
                $table->foreignId('provinsi_id')->constrained('provinsi')->cascadeOnDelete();
                $table->foreignId('ekspedisi_id')->constrained('ekspedisi_master')->cascadeOnDelete();
                $table->integer('harga');
                $table->integer('estimasi_hari_min');
                $table->integer('estimasi_hari_max');
                $table->timestamps();
                $table->unique(['provinsi_id', 'ekspedisi_id']);
            });
        }

        if (DB::table('ekspedisi_master')->count() == 0) {
            DB::table('ekspedisi_master')->insert([
                ['nama_ekspedisi' => 'JNE (REG)',     'kode' => 'jne',     'status_ekspedisi' => true, 'created_at' => now(), 'updated_at' => now()],
                ['nama_ekspedisi' => 'J&T Express',    'kode' => 'jnt',     'status_ekspedisi' => true, 'created_at' => now(), 'updated_at' => now()],
                ['nama_ekspedisi' => 'SiCepat (BEST)', 'kode' => 'sicepat', 'status_ekspedisi' => true, 'created_at' => now(), 'updated_at' => now()],
                ['nama_ekspedisi' => 'AnterAja',       'kode' => 'anteraja','status_ekspedisi' => true, 'created_at' => now(), 'updated_at' => now()],
                ['nama_ekspedisi' => 'Pos Indonesia',  'kode' => 'pos',     'status_ekspedisi' => true, 'created_at' => now(), 'updated_at' => now()],
            ]);
        }

        if (DB::table('ongkir_master')->count() == 0) {
            $data = [
                // id => [jne, jnt, sicepat, anteraja, pos, estimasi_min, estimasi_max]
                // Pulau Jawa
                1  => [7000,  6000,  6000,  5000,  8000,  1, 1],
                2  => [9000,  8000,  8000,  7000,  9000,  1, 2],
                3  => [9000,  8000,  8000,  7000,  9000,  1, 2],
                4  => [10000, 9000,  9000,  8000,  10000, 1, 2],
                5  => [10000, 9000,  9000,  8000,  10000, 1, 2],
                6  => [11000, 10000, 10000, 9000,  11000, 2, 3],
                // Pulau Sumatera
                7  => [12000, 11000, 11000, 10000, 12000, 2, 3],
                8  => [16000, 15000, 15000, 14000, 16000, 3, 4],
                9  => [14000, 13000, 13000, 12000, 14000, 2, 3],
                10 => [15000, 14000, 14000, 13000, 15000, 2, 3],
                11 => [15000, 14000, 14000, 13000, 15000, 2, 3],
                12 => [16000, 15000, 15000, 14000, 16000, 3, 4],
                13 => [16000, 15000, 15000, 14000, 16000, 3, 4],
                14 => [18000, 17000, 17000, 16000, 18000, 3, 4],
                15 => [18000, 17000, 17000, 16000, 18000, 3, 5],
                16 => [22000, 20000, 20000, 19000, 22000, 4, 6],
                // Pulau Kalimantan
                17 => [20000, 19000, 19000, 18000, 20000, 3, 4],
                18 => [22000, 21000, 21000, 20000, 22000, 3, 5],
                19 => [22000, 21000, 21000, 20000, 22000, 3, 5],
                20 => [24000, 23000, 23000, 22000, 24000, 4, 6],
                21 => [27000, 25000, 25000, 24000, 28000, 5, 7],
                // Pulau Sulawesi
                22 => [23000, 22000, 22000, 21000, 23000, 4, 6],
                23 => [26000, 25000, 25000, 24000, 27000, 5, 7],
                24 => [26000, 25000, 25000, 24000, 27000, 5, 7],
                25 => [27000, 26000, 26000, 25000, 28000, 5, 7],
                26 => [27000, 26000, 26000, 25000, 28000, 5, 7],
                27 => [28000, 27000, 27000, 26000, 29000, 5, 7],
                // Pulau Bali & Nusa Tenggara
                28 => [14000, 13000, 13000, 12000, 14000, 2, 3],
                29 => [18000, 17000, 17000, 16000, 19000, 3, 4],
                30 => [22000, 21000, 21000, 20000, 24000, 4, 6],
                // Maluku & Papua
                31 => [32000, 30000, 30000, 29000, 35000, 6, 8],
                32 => [33000, 31000, 31000, 30000, 36000, 6, 8],
                33 => [38000, 36000, 36000, 35000, 42000, 7, 10],
                34 => [38000, 36000, 36000, 35000, 42000, 7, 10],
                35 => [44000, 42000, 42000, 41000, 49000, 8, 12],
                36 => [45000, 43000, 43000, 42000, 50000, 8, 12],
                37 => [44000, 42000, 42000, 41000, 49000, 8, 12],
                38 => [40000, 38000, 38000, 37000, 45000, 7, 10],
            ];

            $rows = [];
            $now = now();
            foreach ($data as $provinsiId => $vals) {
                for ($eksId = 1; $eksId <= 5; $eksId++) {
                    $rows[] = [
                        'provinsi_id'       => $provinsiId,
                        'ekspedisi_id'      => $eksId,
                        'harga'             => $vals[$eksId - 1],
                        'estimasi_hari_min' => $vals[5],
                        'estimasi_hari_max' => $vals[6],
                        'created_at'        => $now,
                        'updated_at'        => $now,
                    ];
                }
            }
            DB::table('ongkir_master')->insert($rows);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('ongkir_master');
    }
};