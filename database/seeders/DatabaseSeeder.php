<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            ProvinsiSeeder::class,
            OngkirSeeder::class,
            EkspedisiSeeder::class,
            LensaSeeder::class,
            UserSeeder::class,
        ]);
    }
}
