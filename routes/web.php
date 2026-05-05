<?php

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\EmailCheckController;
use App\Http\Controllers\KeranjangController;
use App\Http\Controllers\OngkirController;
use App\Http\Controllers\PesananController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\UsernameCheckController;
use App\Http\Controllers\WelcomeController;
use App\Models\Produk;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::get('/', WelcomeController::class)->name('home');

Route::get('/katalog', [ProdukController::class, 'index'])->name('katalog');

Route::get('/produk/{id}', [ProdukController::class, 'show'])->name('produk.show');


Route::get('/username-check', UsernameCheckController::class)->name('username.check');
Route::get('/email-check', EmailCheckController::class)->name('email.check');

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/keranjang', [KeranjangController::class, 'index'])->name('keranjang');
    Route::post('/keranjang/tambah', [KeranjangController::class, 'tambah'])->name('keranjang.tambah');
    Route::patch('/keranjang/{id}', [KeranjangController::class, 'update'])->name('keranjang.update');
    Route::delete('/keranjang/{id}', [KeranjangController::class, 'hapus'])->name('keranjang.hapus');
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
    Route::post('/checkout', [CheckoutController::class, 'proses'])->name('checkout.proses');
    Route::post('/checkout/alamat', [CheckoutController::class, 'tambahAlamat'])->name('checkout.alamat');
    Route::post('/checkout/ongkir', [OngkirController::class, 'hitung'])->name('checkout.ongkir');
    Route::get('/pesanan', [PesananController::class, 'index'])->name('pesanan');
    Route::get('/pesanan/{id}', [PesananController::class, 'show'])->name('pesanan.show');
    Route::inertia('dashboard', 'dashboard')->name('dashboard')->middleware('admin');
});

require __DIR__.'/settings.php';