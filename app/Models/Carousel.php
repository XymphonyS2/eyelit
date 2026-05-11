<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carousel extends Model
{
    protected $table = 'carousel';

    protected $fillable = [
        'judul_carousel',
        'deskripsi',
        'url_gambar',
        'urutan',
        'status_carousel',
    ];

    protected $casts = [
        'status_carousel' => 'boolean',
    ];
}