<?php

namespace App\Services;

use App\Models\Ongkir;
use App\Models\Alamat;
use Illuminate\Support\Facades\Http;

class RajaOngkirService
{
    private string $apiKey;
    private string $baseUrl = 'https://rajaongkir.komerce.id/api/v1/calculate';
    private int $originKota = 152; // Jakarta Pusat

    private array $courierMap = [
        1 => 'jne',
        2 => 'jnt',
        3 => 'sicepat',
    ];

    private array $servicePreference = [
        'jne'     => 'REG',
        'jnt'     => 'EZ',
        'sicepat' => 'BEST',
    ];

    public function __construct()
    {
        $this->apiKey = config('services.rajaongkir.key') ?? '';
    }

    public function hitungSemuaEkspedisi(int $destinasiKota, int $beratGram = 1000): array
    {
        $couriers = implode(':', array_values($this->courierMap));

        $response = Http::withHeaders(['key' => $this->apiKey])
            ->asForm()
            ->post("{$this->baseUrl}/domestic-cost", [
                'origin'      => $this->originKota,
                'destination' => $destinasiKota,
                'weight'      => $beratGram,
                'courier'     => $couriers,
            ]);

        if (!$response->successful()) return [];

        $data   = $response->json('data', []);
        $result = [];

        foreach ($this->courierMap as $ekspedisiId => $courierCode) {
            $services  = collect($data)->where('code', $courierCode)->values();
            $preferred = $this->servicePreference[$courierCode] ?? null;
            $service   = $services->firstWhere('service', $preferred) ?? $services->first();

            if ($service) {
                $result[$ekspedisiId] = [
                    'harga'     => $service['cost'],
                    'estimasi'  => $service['etd'] ?: '-',
                    'layanan'   => $service['service'],
                    'deskripsi' => $service['description'],
                ];
            }
        }

        return $result;
    }

    public function hitungSatuEkspedisi(int $destinasiKota, int $ekspedisiId, int $beratGram = 1000): array
    {
        $courier = $this->courierMap[$ekspedisiId] ?? null;

        // Coba API RajaOngkir dulu (hanya jika kode_kota valid dan API key tersedia)
        if ($courier && $destinasiKota > 0 && !empty($this->apiKey)) {
            try {
                $response = Http::timeout(8)
                    ->withHeaders(['key' => $this->apiKey])
                    ->asForm()
                    ->post("{$this->baseUrl}/domestic-cost", [
                        'origin'      => $this->originKota,
                        'destination' => $destinasiKota,
                        'weight'      => $beratGram,
                        'courier'     => $courier,
                    ]);

                if ($response->successful()) {
                    $data      = $response->json('data', []);
                    $preferred = $this->servicePreference[$courier] ?? null;
                    $service   = collect($data)->firstWhere('service', $preferred) ?? ($data[0] ?? null);

                    if ($service && isset($service['cost']) && $service['cost'] > 0) {
                        $etd = $service['etd'] ?: '1-3';
                        preg_match('/(\d+)(?:-(\d+))?.*/', trim($etd), $matches);
                        $min = (int) ($matches[1] ?? 1);
                        $max = (int) ($matches[2] ?? $min);

                        return [
                            'harga'             => (int) $service['cost'],
                            'estimasi_hari_min' => (string) $min,
                            'estimasi_hari_max' => (string) $max,
                        ];
                    }
                }
            } catch (\Exception $e) {
                \Log::warning('RajaOngkir API exception, fallback to local', ['error' => $e->getMessage()]);
            }
        }

        // Fallback: ambil dari tabel ongkir lokal berdasarkan provinsi alamat
        // Kita lookup alamat yang punya kode_kota ini untuk dapat provinsi_id-nya
        $alamat = Alamat::where('kode_kota', (string) $destinasiKota)->first();
        if ($alamat) {
            $ongkirLokal = Ongkir::where('provinsi_id', $alamat->provinsi_id)
                ->where('ekspedisi_id', $ekspedisiId)
                ->first();

            if ($ongkirLokal) {
                return [
                    'harga'             => (int) $ongkirLokal->harga,
                    'estimasi_hari_min' => (string) $ongkirLokal->estimasi_hari_min,
                    'estimasi_hari_max' => (string) $ongkirLokal->estimasi_hari_max,
                ];
            }
        }

        // Fallback terakhir: cari langsung dari tabel ongkir tanpa kode_kota
        // (untuk alamat lama yang belum punya kode_kota)
        return [
            'harga'             => 0,
            'estimasi_hari_min' => '1',
            'estimasi_hari_max' => '3',
        ];
    }

    /**
     * Hitung ongkir menggunakan provinsi_id (fallback utama tanpa API)
     */
    public function hitungDariProvinsi(int $provinsiId, int $ekspedisiId): array
    {
        $ongkirLokal = Ongkir::where('provinsi_id', $provinsiId)
            ->where('ekspedisi_id', $ekspedisiId)
            ->first();

        if ($ongkirLokal) {
            return [
                'harga'             => (int) $ongkirLokal->harga,
                'estimasi_hari_min' => (string) $ongkirLokal->estimasi_hari_min,
                'estimasi_hari_max' => (string) $ongkirLokal->estimasi_hari_max,
            ];
        }

        return [
            'harga'             => 0,
            'estimasi_hari_min' => '1',
            'estimasi_hari_max' => '3',
        ];
    }
}
