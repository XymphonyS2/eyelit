<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Create ekspedisi_master table first if not exists
        if (!Schema::hasTable('ekspedisi_master')) {
            Schema::create('ekspedisi_master', function (Blueprint $table) {
                $table->id();
                $table->string('nama_ekspedisi', 100);
                $table->string('kode', 50)->unique();
                $table->boolean('status_ekspedisi')->default(true);
                $table->timestamps();
            });
        }

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
            // Get actual province IDs from database (mapping by name)
            $provinsiMap = [];
            $provinsis = DB::table('provinsi')->get();
            foreach ($provinsis as $p) {
                $provinsiMap[$p->nama_provinsi] = $p->id;
            }

            // Get ekspedisi IDs
            $ekspedisis = DB::table('ekspedisi_master')->get()->keyBy('kode');

            $data = [
                // nama_provinsi => [jne, jnt, sicepat, anteraja, pos, estimasi_min, estimasi_max]
                'DKI Jakarta'          => [7000,  6000,  6000,  5000,  8000,  1, 1],
                'Jawa Barat'           => [9000,  8000,  8000,  7000,  9000,  1, 2],
                'Jawa Tengah'          => [9000,  8000,  8000,  7000,  9000,  1, 2],
                'DI Yogyakarta'        => [10000, 9000,  9000,  8000,  10000, 1, 2],
                'Jawa Timur'           => [10000, 9000,  9000,  8000,  10000, 1, 2],
                'Banten'              => [11000, 10000, 10000, 9000,  11000, 2, 3],
                'Aceh'                => [12000, 11000, 11000, 10000, 12000, 2, 3],
                'Sumatera Utara'      => [16000, 15000, 15000, 14000, 16000, 3, 4],
                'Sumatera Barat'       => [14000, 13000, 13000, 12000, 14000, 2, 3],
                'Riau'                => [15000, 14000, 14000, 13000, 15000, 2, 3],
                'Jambi'               => [15000, 14000, 14000, 13000, 15000, 2, 3],
                'Sumatera Selatan'    => [16000, 15000, 15000, 14000, 16000, 3, 4],
                'Bengkulu'            => [16000, 15000, 15000, 14000, 16000, 3, 4],
                'Lampung'             => [18000, 17000, 17000, 16000, 18000, 3, 4],
                'Kepulauan Bangka Belitung' => [18000, 17000, 17000, 16000, 18000, 3, 5],
                'Kepulauan Riau'       => [22000, 20000, 20000, 19000, 22000, 4, 6],
                'Kalimantan Barat'     => [20000, 19000, 19000, 18000, 20000, 3, 4],
                'Kalimantan Tengah'    => [22000, 21000, 21000, 20000, 22000, 3, 5],
                'Kalimantan Selatan'   => [22000, 21000, 21000, 20000, 22000, 3, 5],
                'Kalimantan Timur'    => [24000, 23000, 23000, 22000, 24000, 4, 6],
                'Kalimantan Utara'    => [27000, 25000, 25000, 24000, 28000, 5, 7],
                'Sulawesi Utara'      => [23000, 22000, 22000, 21000, 23000, 4, 6],
                'Sulawesi Tengah'     => [26000, 25000, 25000, 24000, 27000, 5, 7],
                'Sulawesi Selatan'    => [26000, 25000, 25000, 24000, 27000, 5, 7],
                'Sulawesi Tenggara'   => [27000, 26000, 26000, 25000, 28000, 5, 7],
                'Gorontalo'           => [27000, 26000, 26000, 25000, 28000, 5, 7],
                'Sulawesi Barat'       => [28000, 27000, 27000, 26000, 29000, 5, 7],
                'Bali'                => [14000, 13000, 13000, 12000, 14000, 2, 3],
                'Nusa Tenggara Barat'  => [18000, 17000, 17000, 16000, 19000, 3, 4],
                'Nusa Tenggara Timur' => [22000, 21000, 21000, 20000, 24000, 4, 6],
                'Maluku'              => [32000, 30000, 30000, 29000, 35000, 6, 8],
                'Maluku Utara'        => [33000, 31000, 31000, 30000, 36000, 6, 8],
                'Papua'               => [38000, 36000, 36000, 35000, 42000, 7, 10],
                'Papua Barat'         => [38000, 36000, 36000, 35000, 42000, 7, 10],
                'Papua Tengah'        => [44000, 42000, 42000, 41000, 49000, 8, 12],
                'Papua Pegunungan'   => [45000, 43000, 43000, 42000, 50000, 8, 12],
                'Papua Barat Daya'    => [44000, 42000, 42000, 41000, 49000, 8, 12],
            ];

            $rows = [];
            $now = now();
            foreach ($data as $namaProvinsi => $vals) {
                if (!isset($provinsiMap[$namaProvinsi])) continue;
                $provinsiId = $provinsiMap[$namaProvinsi];
                foreach ($ekspedisis as $eks) {
                    $rows[] = [
                        'provinsi_id'       => $provinsiId,
                        'ekspedisi_id'      => $eks->id,
                        'harga'             => $vals[array_key_first(array_filter($ekspedisis->toArray(), fn($e) => $e->id == $eks->id))] ?? $vals[0],
                        'estimasi_hari_min' => $vals[5],
                        'estimasi_hari_max' => $vals[6],
                        'created_at'        => $now,
                        'updated_at'        => $now,
                    ];
                }
            }

            // Use ekspedisi index (1-5) for price array
            $rows = [];
            $ekspedisiIds = [];
            foreach ($ekspedisis as $eks) {
                $ekspedisiIds[] = $eks->id;
            }
            foreach ($data as $namaProvinsi => $vals) {
                if (!isset($provinsiMap[$namaProvinsi])) continue;
                $provinsiId = $provinsiMap[$namaProvinsi];
                for ($i = 0; $i < count($ekspedisiIds); $i++) {
                    $rows[] = [
                        'provinsi_id'       => $provinsiId,
                        'ekspedisi_id'      => $ekspedisiIds[$i],
                        'harga'             => $vals[$i],
                        'estimasi_hari_min' => $vals[5],
                        'estimasi_hari_max' => $vals[6],
                        'created_at'        => $now,
                        'updated_at'        => $now,
                    ];
                }
            }
            if (count($rows) > 0) {
                DB::table('ongkir_master')->insert($rows);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('ongkir_master');
    }
};