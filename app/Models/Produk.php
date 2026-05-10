<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produk extends Model
{
    use HasFactory;

    protected $table = 'produk';

    protected $fillable = [
        'nama_produk',
        'merek',
        'tipe_produk',
        'harga_produk',
        'stok',
        'jenis_kelamin',
        'warna',
        'material',
        'bentuk',
        'bridge',
        'diagonal',
        'ukuran',
        'status_produk',
        'gambar',
        'gambar_2',
        'gambar_3',
        'gambar_4',
        'gambar_5',
    ];
}