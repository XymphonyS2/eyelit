<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notifikasi extends Model
{
    protected $table = 'notifikasi';

    protected $fillable = [
        'pengguna_id',
        'judul_notifikasi',
        'isi_notifikasi',
        'jenis_notifikasi',
        'pesanan_id',
        'dibaca',
        'tanggal_notifikasi',
    ];

    protected $casts = [
        'dibaca' => 'boolean',
        'tanggal_notifikasi' => 'datetime',
    ];

    public function pengguna()
    {
        return $this->belongsTo(User::class, 'pengguna_id');
    }

    public function pesanan()
    {
        return $this->belongsTo(Pesanan::class, 'pesanan_id');
    }
}