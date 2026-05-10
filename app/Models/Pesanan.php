<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pesanan extends Model
{
    protected $table = 'pesanan';

    protected $fillable = [
        'no_pesanan',
        'pengguna_id',
        'alamat_id',
        'ekspedisi_id',
        'no_resi',
        'status_pesanan',
        'metode_pembayaran',
        'ongkos_kirim',
        'total_harga',
        'batas_waktu_pembayaran',
        'tanggal_pemesanan',
        'tanggal_konfirmasi_pembayaran',
        'tanggal_pengiriman',
        'tanggal_tiba',
        'tanggal_selesai',
        'tanggal_pembatalan',
        'tanggal_konfirmasi_penerimaan',
        'alasan_pembatalan',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'pengguna_id');
    }

    public function detailPesanan()
    {
        return $this->hasMany(DetailPesanan::class, 'pesanan_id');
    }

    public function alamat()
    {
        return $this->belongsTo(Alamat::class, 'alamat_id');
    }

    public function ekspedisi()
    {
        return $this->belongsTo(Ekspedisi::class, 'ekspedisi_id');
    }
}
