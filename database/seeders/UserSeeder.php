<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin EyeLit',
                'email' => 'admin@eyelit.com',
                'password' => Hash::make('admin123'),
                'no_hp' => '081234567890',
                'peran' => 'Admin',
                'status_akun' => 'Aktif',
                'tanggal_daftar' => now(),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Pengguna Demo',
                'email' => 'pengguna@eyelit.com',
                'password' => Hash::make('pengguna123'),
                'no_hp' => '089876543210',
                'peran' => 'Pengguna',
                'status_akun' => 'Aktif',
                'tanggal_daftar' => now(),
                'email_verified_at' => now(),
            ],
        ];

        DB::table('users')->insert($users);
    }
}
