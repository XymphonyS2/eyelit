<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use App\Models\Pembayaran;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PembayaranController extends Controller
{
    public function __construct(private MidtransService $midtrans) {}

    public function show(string $pesananId)
    {
        $pesanan = Pesanan::with(['detailPesanan.produk', 'alamat.provinsi', 'ekspedisi', 'user'])
            ->where('id', $pesananId)
            ->where('pengguna_id', auth()->id())
            ->firstOrFail();

        if ($pesanan->status_pesanan !== 'Menunggu Konfirmasi Pembayaran') {
            return redirect()->route('pesanan.show', $pesanan->id)
                ->with('error', 'Pesanan ini tidak dapat dibayar.');
        }

        // Ambil data pembayaran yang sudah ada (jika user sudah pernah klik Bayar)
        $pembayaran = Pembayaran::where('pesanan_id', $pesanan->id)->first();

        // Hitung total
        $subtotalProduk = $pesanan->detailPesanan->sum('subtotal');
        $grandTotal = $subtotalProduk + ($pesanan->ongkos_kirim ?? 0);

        return Inertia::render('pembayaran', [
            'pesanan'         => $pesanan,
            'pembayaran'      => $pembayaran,
            'subtotal_produk' => $subtotalProduk,
            'grand_total'     => $grandTotal,
        ]);
    }

    /**
     * Buat transaction di Midtrans & return data yang dibutuhkan frontend
     * Called via fetch() saat user klik "Bayar Sekarang"
     */
    public function createTransaction(string $pesananId, Request $request)
    {
        $pesanan = Pesanan::with(['detailPesanan.produk', 'user'])
            ->where('id', $pesananId)
            ->where('pengguna_id', auth()->id())
            ->firstOrFail();

        if ($pesanan->status_pesanan !== 'Menunggu Konfirmasi Pembayaran') {
            return response()->json(['ok' => false, 'message' => 'Pesanan tidak dapat dibayar.'], 400);
        }

        $metode = $pesanan->metode_pembayaran;
        $total = $pesanan->detailPesanan->sum('subtotal') + ($pesanan->ongkos_kirim ?? 0);
        $orderId = 'EYL-' . $pesanan->id . '-' . time(); // unique per attempt
        $customerName = $pesanan->user->username ?? 'Customer';
        $customerEmail = $pesanan->user->email ?? 'customer@eyelit.com';

        $result = ['order_id' => $orderId, 'metode' => $metode];

        try {
            if ($metode === 'BCA') {
                $response = $this->midtrans->createBcaVa($orderId, (int) $total, $customerName, $customerEmail);
                $result['va_number'] = $response['va_number'];
            } elseif ($metode === 'BNI') {
                $response = $this->midtrans->createBniVa($orderId, (int) $total, $customerName, $customerEmail);
                $result['va_number'] = $response['va_number'];
            } elseif ($metode === 'QRIS') {
                $response = $this->midtrans->createQris($orderId, (int) $total, $customerName, $customerEmail);
                $result['qr_url'] = $response['qr_url'];
            }

            // Simpan / update record pembayaran
            Pembayaran::updateOrCreate(
                ['pesanan_id' => $pesanan->id],
                [
                    'metode_pembayaran' => $metode,
                    'jumlah_dibayar'    => $total,
                    'status_pembayaran' => 'Menunggu',
                    'no_va_bca'         => $result['va_number'] ?? null,
                    'kode_qris'         => $result['qr_url'] ?? null,
                    'order_id'          => $orderId,
                ]
            );

            return response()->json(['ok' => true, ...$result]);

        } catch (\Exception $e) {
            return response()->json([
                'ok' => false,
                'message' => 'Gagal membuat transaksi: ' . $e->getMessage(),
            ], 500);
        }
    }
}