<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ekspedisi extends Model
{
    protected $table = 'ekspedisi';

    protected $fillable = ['nama_ekspedisi', 'kode', 'logo_ekspedisi', 'status_ekspedisi'];

    protected $casts = [
        'status_ekspedisi' => 'boolean',
    ];

    public function ongkir()
    {
        return $this->hasMany(Ongkir::class, 'ekspedisi_id');
    }
}