<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            ProvinsiSeeder::class,
            EkspedisiSeeder::class,
            OngkirSeeder::class,
            LensaSeeder::class,
            UserSeeder::class,
            ProdukSeeder::class,
            CarouselSeeder::class,
            AlamatSeeder::class,
            PesananSeeder::class,
            UlasanSeeder::class,
            NotifikasiSeeder::class,
        ]);
    }
}
