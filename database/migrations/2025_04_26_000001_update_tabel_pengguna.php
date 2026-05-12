<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('foto_profil')->nullable()->after('no_hp');
            $table->enum('peran', ['Admin', 'Pengguna'])->default('Pengguna')->after('foto_profil');
            $table->enum('status_akun', ['Aktif', 'Nonaktif'])->default('Aktif')->after('peran');
            $table->timestamp('tanggal_daftar')->nullable()->after('status_akun');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['foto_profil', 'peran', 'status_akun', 'tanggal_daftar']);
        });
    }
};