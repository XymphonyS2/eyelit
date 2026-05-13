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
                'username' => 'admin_eyelit',
                'email' => 'admin@eyelit.com',
                'password' => Hash::make('Admin123'),
                'no_hp' => '081234567890',
                'peran' => 'Admin',
                'status_akun' => 'Aktif',
                'tanggal_daftar' => now(),
                'email_verified_at' => now(),
            ],
            [
                'username' => 'Rakha',
                'email' => 'rakha@eyelit.com',
                'password' => Hash::make('Rakha123'),
                'no_hp' => '081234567891',
                'peran' => 'Pengguna',
                'status_akun' => 'Aktif',
                'tanggal_daftar' => '2026-05-14 00:00:00',
                'email_verified_at' => '2026-05-14 00:00:00',
            ],
            [
                'username' => 'Hafiz',
                'email' => 'hafiz@eyelit.com',
                'password' => Hash::make('Hafiz123'),
                'no_hp' => '081234567892',
                'peran' => 'Pengguna',
                'status_akun' => 'Aktif',
                'tanggal_daftar' => '2026-05-14 00:00:00',
                'email_verified_at' => '2026-05-14 00:00:00',
            ],
            [
                'username' => 'Dhini',
                'email' => 'dhini@eyelit.com',
                'password' => Hash::make('Dhini123'),
                'no_hp' => '081234567893',
                'peran' => 'Pengguna',
                'status_akun' => 'Aktif',
                'tanggal_daftar' => '2026-05-14 00:00:00',
                'email_verified_at' => '2026-05-14 00:00:00',
            ],
        ];

        DB::table('users')->insert($users);
    }
}