<?php

namespace App\Notifications;

use App\Models\Notifikasi;
use App\Models\Pesanan;
use Illuminate\Bus\Queueable;

class PesananDikemas
{
    use Queueable;

    protected Pesanan $pesanan;

    public function __construct(Pesanan $pesanan)
    {
        $this->pesanan = $pesanan;
    }

    public function via(object $notifiable): array
    {
        return [];
    }

    public function toDatabase(object $notifiable): array
    {
        return [];
    }

    public function toArray(object $notifiable): array
    {
        return [];
    }

    public function saveNotification(object $notifiable): void
    {
        $detailPesanan = $this->pesanan->detailPesanan->first();
        $produk = $detailPesanan?->produk;

        Notifikasi::create([
            'pengguna_id' => $notifiable->id,
            'judul_notifikasi' => 'Pesanan #' . $this->pesanan->no_pesanan . ' sedang dikemas',
            'isi_notifikasi' => $produk
                ? ($produk->nama_produk . ' (' . $this->pesanan->detailPesanan->count() . ' produk)')
                : 'Pesanan sedang dikemas. No. Resi: ' . ($this->pesanan->no_resi ?? '-'),
            'jenis_notifikasi' => 'Pesanan Baru',
            'pesanan_id' => $this->pesanan->id,
            'produk_id' => $detailPesanan?->produk_id,
            'dibaca' => false,
            'tanggal_notifikasi' => now(),
        ]);
    }
}