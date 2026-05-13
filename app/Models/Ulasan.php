<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ulasan extends Model
{
    protected $table = 'ulasan';

    protected $fillable = [
        'pesanan_id',
        'pengguna_id',
        'produk_id',
        'detail_pesanan_id',
        'rating',
        'komentar',
        'foto_ulasan',
        'tanggal_ulasan',
    ];

    public function produk()
    {
        return $this->belongsTo(Produk::class, 'produk_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'pengguna_id');
    }

    public function pesanan()
    {
        return $this->belongsTo(Pesanan::class, 'pesanan_id');
    }

    public function detailPesanan()
    {
        return $this->belongsTo(DetailPesanan::class, 'detail_pesanan_id');
    }
}