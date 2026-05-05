<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ongkir extends Model
{
    protected $table = 'ongkir_master';

    protected $fillable = ['provinsi_id', 'ekspedisi_id', 'harga', 'estimasi_hari_min', 'estimasi_hari_max'];

    protected $casts = [
        'harga'             => 'integer',
        'estimasi_hari_min' => 'integer',
        'estimasi_hari_max' => 'integer',
    ];

    public function provinsi()
    {
        return $this->belongsTo(Provinsi::class, 'provinsi_id');
    }

    public function ekspedisi()
    {
        return $this->belongsTo(Ekspedisi::class, 'ekspedisi_id');
    }
}