<?php

namespace App\Console\Commands;

use App\Models\Pesanan;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ExpiredPaymentScheduler extends Command
{
    protected $signature = 'pesanan:expire';

    protected $description = 'Kadaluarsa pesanan yang belum dibayar dalam 24 jam';

    public function handle(): int
    {
        $expired = Pesanan::where('status_pesanan', 'Menunggu Konfirmasi Pembayaran')
            ->where('batas_waktu_pembayaran', '<', Carbon::now())
            ->get();

        foreach ($expired as $pesanan) {
            $pesanan->update([
                'status_pesanan' => 'Dibatalkan',
                'tanggal_pembatalan' => Carbon::now(),
                'alasan_pembatalan' => 'Melebihi batas waktu pembayaran (24 jam)',
            ]);
        }

        $this->info("{$expired->count()} pesanan dibatalkan.");
        return 0;
    }
}