<?php

namespace App\Services;

use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\CoreApi as MidtransCoreApi;

class MidtransService
{
    private bool $isProduction;

    public function __construct()
    {
        $this->isProduction = env('MIDTRANS_IS_PRODUCTION', false);

        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$clientKey = env('MIDTRANS_CLIENT_KEY');
        Config::$isProduction = $this->isProduction;
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    /**
     * Create a Snap transaction token for QRIS / other methods
     */
    public function createSnapToken(array $params): string
    {
        $transactionDetails = [
            'order_id'     => $params['order_id'],
            'gross_amount' => (int) $params['gross_amount'],
        ];

        $itemDetails = $params['item_details'] ?? [];

        $customerDetails = [
            'first_name' => $params['customer_first_name'] ?? '',
            'last_name'  => $params['customer_last_name'] ?? '',
            'email'      => $params['customer_email'] ?? '',
            'phone'      => $params['customer_phone'] ?? '',
        ];

        $transaction = [
            'transaction_details' => $transactionDetails,
            'item_details'       => $itemDetails,
            'customer_details'   => $customerDetails,
        ];

        // Include enabled payment types
        if (!empty($params['enabled_payments'])) {
            $transaction['enabled_payments'] = $params['enabled_payments'];
        }

        $snap = Snap::createTransaction($transaction);

        return $snap->token ?? '';
    }

    /**
     * Create a BCA Virtual Account transaction
     */
    public function createBcaVa(string $orderId, int $grossAmount, string $customerName, string $email): array
    {
        $params = [
            'transaction_details' => [
                'order_id'     => $orderId,
                'gross_amount' => $grossAmount,
            ],
            'item_details' => [
                [
                    'id'       => $orderId,
                    'price'    => $grossAmount,
                    'quantity' => 1,
                    'name'     => 'EyeLit Order ' . $orderId,
                ],
            ],
            'customer_details' => [
                'first_name' => $customerName,
                'last_name'  => '',
                'email'      => $email,
            ],
            'payment_type' => 'bank_transfer',
            'bank_transfer' => [
                'bank' => 'bca',
            ],
        ];

        $response = MidtransCoreApi::charge($params);

        return [
            'va_number'  => $response->va_numbers[0]->va_number ?? '',
            'status'    => $response->transaction_status ?? '',
            'order_id'  => $response->order_id ?? '',
        ];
    }

    /**
     * Create a BNI Virtual Account transaction
     */
    public function createBniVa(string $orderId, int $grossAmount, string $customerName, string $email): array
    {
        $params = [
            'transaction_details' => [
                'order_id'     => $orderId,
                'gross_amount' => $grossAmount,
            ],
            'item_details' => [
                [
                    'id'       => $orderId,
                    'price'    => $grossAmount,
                    'quantity' => 1,
                    'name'     => 'EyeLit Order ' . $orderId,
                ],
            ],
            'customer_details' => [
                'first_name' => $customerName,
                'last_name'  => '',
                'email'      => $email,
            ],
            'payment_type' => 'bank_transfer',
            'bank_transfer' => [
                'bank' => 'bni',
            ],
        ];

        $response = MidtransCoreApi::charge($params);

        return [
            'va_number'  => $response->va_numbers[0]->va_number ?? '',
            'status'    => $response->transaction_status ?? '',
            'order_id'  => $response->order_id ?? '',
        ];
    }

    /**
     * Create a QRIS transaction via Snap (Gopay QR)
     */
    public function createQris(string $orderId, int $grossAmount, string $customerName, string $email): array
    {
        $params = [
            'transaction_details' => [
                'order_id'     => $orderId,
                'gross_amount' => $grossAmount,
            ],
            'item_details' => [
                [
                    'id'       => $orderId,
                    'price'    => $grossAmount,
                    'quantity' => 1,
                    'name'     => 'EyeLit Order ' . $orderId,
                ],
            ],
            'customer_details' => [
                'first_name' => $customerName,
                'last_name'  => '',
                'email'      => $email,
            ],
            'payment_type' => 'gopay',
            'gopay' => [
                'enable_callback' => true,
            ],
        ];

        $response = MidtransCoreApi::charge($params);

        return [
            'qr_url'    => $response->actions[0]->url ?? '',
            'status'    => $response->transaction_status ?? '',
            'order_id'  => $response->order_id ?? '',
        ];
    }

    public function isProduction(): bool
    {
        return $this->isProduction;
    }
}