import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Bell, BookOpen, LogOut, MapPin, Package, Settings, ShoppingBag, ShoppingCart, Truck, User } from 'lucide-react';
import { useRef, useState } from 'react';

// 🔥 safe helper — aman untuk nilai null/undefined
const safe = (v: any) => (v ?? "").toString().trim();

const STATUS_STEPS = [
    'Menunggu Konfirmasi Pembayaran',
    'Dikemas',
    'Dikirim',
    'Pesanan Tiba di Tujuan',
    'Selesai',
];

const STATUS_COLOR: Record<string, string> = {
    'Menunggu Konfirmasi Pembayaran': 'bg-yellow-100 text-yellow-700',
    'Dikemas':                        'bg-blue-100 text-blue-700',
    'Dikirim':                        'bg-indigo-100 text-indigo-700',
    'Pesanan Tiba di Tujuan':         'bg-purple-100 text-purple-700',
    'Selesai':                        'bg-green-100 text-green-700',
    'Dibatalkan':                     'bg-red-100 text-red-600',
};

export default function PesananDetail() {
    const { auth, pesanan, subtotal_produk, grand_total } = usePage().props as any;
    const keranjangCount: number = auth.keranjang_count || 0;

    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const userDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notifDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notifications: any[] = auth.user?.notifications || [];

    // 🔥 PERBAIKAN UTAMA: guard pesanan undefined + safe status
    if (!pesanan) {
        return (
            <div className="min-h-screen flex items-center justify-center text-[#5f6368]">
                <p>Data pesanan tidak ditemukan.</p>
            </div>
        );
    }

    // 🔥 PERBAIKAN: gunakan safe() agar tidak crash saat status_pesanan undefined
    const statusPesanan = safe(pesanan.status_pesanan);
    const currentStep = STATUS_STEPS.indexOf(statusPesanan);

    function formatTanggal(val: string | null) {
        if (!val) return '-';
        const d = new Date(val);
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    return (
        <>
            <Head title={`Pesanan ${safe(pesanan.no_pesanan)} - EyeLit`} />
            <div className="min-h-screen bg-[#FDFDFC]">
                {/* Navbar */}
                <nav className="relative z-50 border-b border-[#19140035] bg-white">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 gap-4">
                        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                            <img src="/images/logo/AuthMobile.svg" alt="EyeLit Logo" className="h-10 w-auto" />
                            <span className="text-2xl font-bold text-[#2264c0]">EyeLit</span>
                        </Link>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Link href="/katalog" className="p-2 rounded-full hover:bg-gray-100">
                                <BookOpen className="size-5 text-[#2264c0]" />
                            </Link>
                            {auth.user && (
                                <div className="relative h-full flex items-center">
                                    <div
                                        onMouseEnter={() => { if (notifDropdownTimer.current) clearTimeout(notifDropdownTimer.current); setShowNotifDropdown(true); }}
                                        onMouseLeave={() => { notifDropdownTimer.current = setTimeout(() => setShowNotifDropdown(false), 100); }}
                                    >
                                        <button className="p-2 rounded-full hover:bg-gray-100 relative">
                                            <Bell className="size-5 text-[#1b1b18]" />
                                            {notifications.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
                                        </button>
                                        {showNotifDropdown && (
                                            <div className="dropdown-menu show" style={{ top: '64px', right: '24px' }}
                                                onMouseEnter={() => { if (notifDropdownTimer.current) clearTimeout(notifDropdownTimer.current); }}
                                                onMouseLeave={() => { notifDropdownTimer.current = setTimeout(() => setShowNotifDropdown(false), 100); }}
                                            >
                                                <div className="dropdown-header"><span className="text-sm font-semibold">Notifikasi</span></div>
                                                <div className="dropdown-notif-empty"><Bell className="size-10" /><p>Tidak ada notifikasi</p></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {auth.user && (
                                <Link href="/keranjang" className="p-2 rounded-full hover:bg-gray-100 relative">
                                    <ShoppingCart className="size-5 text-[#1b1b18]" />
                                    {keranjangCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#2264c0] text-white text-xs font-bold rounded-full flex items-center justify-center">
                                            {keranjangCount}
                                        </span>
                                    )}
                                </Link>
                            )}
                            {auth.user && (
                                <div className="relative h-full flex items-center">
                                    <div
                                        onMouseEnter={() => { if (userDropdownTimer.current) clearTimeout(userDropdownTimer.current); setShowUserDropdown(true); }}
                                        onMouseLeave={() => { userDropdownTimer.current = setTimeout(() => setShowUserDropdown(false), 100); }}
                                    >
                                        <button className="p-2 rounded-full hover:bg-gray-100"><User className="size-5 text-[#1b1b18]" /></button>
                                        {showUserDropdown && (
                                            <div className="dropdown-menu show" style={{ top: '64px', right: '24px' }}
                                                onMouseEnter={() => { if (userDropdownTimer.current) clearTimeout(userDropdownTimer.current); }}
                                                onMouseLeave={() => { userDropdownTimer.current = setTimeout(() => setShowUserDropdown(false), 100); }}
                                            >
                                                <div className="dropdown-header">
                                                    <div className="dropdown-avatar">{auth.user?.username?.charAt(0).toUpperCase()}</div>
                                                    <div className="dropdown-user-info">
                                                        <span className="dropdown-user-name">{auth.user?.username}</span>
                                                        <span className="dropdown-user-email">{auth.user?.email}</span>
                                                    </div>
                                                </div>
                                                <div className="dropdown-body">
                                                    <Link href="/pesanan" className="dropdown-item"><ShoppingBag className="size-5" />Pesanan</Link>
                                                    <Link href="/user/profile" className="dropdown-item"><Settings className="size-5" />Pengaturan</Link>
                                                    <form method="POST" action="/logout">
                                                        <input type="hidden" name="_token" value={auth.csrf} />
                                                        <button type="submit" className="dropdown-item logout w-full text-left"><LogOut className="size-5" />Keluar Akun</button>
                                                    </form>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Breadcrumb */}
                <div className="mx-auto max-w-7xl px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#5f6368]">
                        <Link href="/" className="hover:text-[#2264c0] transition-colors">Beranda</Link>
                        <span>/</span>
                        <Link href="/pesanan" className="hover:text-[#2264c0] transition-colors">Pesanan Saya</Link>
                        <span>/</span>
                        <span className="text-[#1b1b18] font-medium">Detail Pesanan</span>
                    </div>
                </div>

                <main className="mx-auto max-w-7xl px-4 pb-16">
                    <Link href="/pesanan" className="inline-flex items-center gap-2 text-sm text-[#5f6368] hover:text-[#2264c0] transition-colors mb-6">
                        <ArrowLeft className="size-4" />
                        Kembali ke Pesanan
                    </Link>

                    {/* Header Pesanan */}
                    <div className="bg-white rounded-xl border border-[#19140035] p-5 mb-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-xs text-[#5f6368]">No. Pesanan</p>
                                {/* 🔥 PERBAIKAN: safe() untuk no_pesanan & tanggal */}
                                <p className="text-lg font-bold text-[#1b1b18]">{safe(pesanan.no_pesanan) || '-'}</p>
                                <p className="text-xs text-[#5f6368] mt-1">Dipesan pada {formatTanggal(pesanan.tanggal_pemesanan)}</p>
                            </div>
                            {/* 🔥 PERBAIKAN: gunakan statusPesanan (sudah di-safe) */}
                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${STATUS_COLOR[statusPesanan] ?? 'bg-gray-100 text-gray-600'}`}>
                                {statusPesanan || '-'}
                            </span>
                        </div>

                        {/* Progress Bar Status */}
                        {statusPesanan !== 'Dibatalkan' && (
                            <div className="mt-6">
                                <div className="flex items-center">
                                    {STATUS_STEPS.map((step, i) => (
                                        <div key={step} className="flex items-center flex-1 last:flex-none">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                                                    i <= currentStep
                                                        ? 'bg-[#2264c0] border-[#2264c0] text-white'
                                                        : 'bg-white border-gray-300 text-gray-400'
                                                }`}>
                                                    {i < currentStep ? '✓' : i + 1}
                                                </div>
                                                <p className={`text-[10px] mt-1 text-center max-w-[70px] leading-tight ${i <= currentStep ? 'text-[#2264c0] font-medium' : 'text-gray-400'}`}>
                                                    {step}
                                                </p>
                                            </div>
                                            {i < STATUS_STEPS.length - 1 && (
                                                <div className={`flex-1 h-0.5 mx-1 mb-5 ${i < currentStep ? 'bg-[#2264c0]' : 'bg-gray-200'}`} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {/* Kiri */}
                        <div className="lg:col-span-2 flex flex-col gap-5">

                            {/* Produk */}
                            <div className="bg-white rounded-xl border border-[#19140035] overflow-hidden">
                                <div className="flex items-center gap-2 px-5 py-4 border-b border-[#19140035]">
                                    <Package className="size-4 text-[#2264c0]" />
                                    <h2 className="text-sm font-semibold text-[#1b1b18]">Produk Dipesan</h2>
                                </div>
                                <div className="divide-y divide-[#19140035]">
                                    {/* 🔥 PERBAIKAN: guard detail_pesanan dengan ?? [] */}
                                    {(pesanan.detail_pesanan ?? []).map((d: any) => (
                                        <div key={d.id} className="flex gap-4 p-5">
                                            {/* 🔥 PERBAIKAN: fallback gambar */}
                                            <img
                                                src={d.produk?.gambar ? `/images/produk/${d.produk.gambar}` : '/images/placeholder.png'}
                                                alt={safe(d.produk?.nama_produk)}
                                                className="w-20 h-20 object-contain rounded-lg bg-gray-50 flex-shrink-0"
                                                onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
                                            />
                                            <div className="flex-1">
                                                {/* 🔥 PERBAIKAN: safe() untuk merek, nama_produk, tipe_pembelian */}
                                                <p className="text-xs text-[#2264c0] font-medium">{safe(d.produk?.merek)}</p>
                                                <p className="text-sm font-semibold text-[#1b1b18]">{safe(d.produk?.nama_produk)}</p>
                                                <p className="text-xs text-[#5f6368] mt-0.5">{safe(d.tipe_pembelian)} · ×{d.jumlah ?? 0}</p>
                                                {safe(d.tipe_pembelian) === 'Frame + Lensa' && (
                                                    <div className="text-xs text-[#5f6368] mt-1 space-y-0.5">
                                                        {d.jenis_lensa_od && <p>OD: {safe(d.jenis_lensa_od)} {safe(d.nilai_lensa_od)}{d.silinder_od ? ` / Sil ${safe(d.silinder_od)}` : ''}</p>}
                                                        {d.jenis_lensa_os && <p>OS: {safe(d.jenis_lensa_os)} {safe(d.nilai_lensa_os)}{d.silinder_os ? ` / Sil ${safe(d.silinder_os)}` : ''}</p>}
                                                        {d.anti_radiasi ? <p>+ Anti Radiasi</p> : null}
                                                        {d.photochromic ? <p>+ Photochromic</p> : null}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-sm font-bold text-[#2264c0]">Rp {Number(d.subtotal ?? 0).toLocaleString('id-ID')}</p>
                                                <p className="text-xs text-[#5f6368] mt-0.5">Rp {Number(d.harga_frame ?? 0).toLocaleString('id-ID')} / pcs</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Alamat & Ekspedisi */}
                            <div className="bg-white rounded-xl border border-[#19140035] overflow-hidden">
                                <div className="flex items-center gap-2 px-5 py-4 border-b border-[#19140035]">
                                    <MapPin className="size-4 text-[#2264c0]" />
                                    <h2 className="text-sm font-semibold text-[#1b1b18]">Pengiriman</h2>
                                </div>
                                <div className="p-5 flex flex-col gap-3 text-sm">
                                    <div className="flex gap-2">
                                        <Truck className="size-4 text-[#5f6368] flex-shrink-0 mt-0.5" />
                                        <div>
                                            {/* 🔥 PERBAIKAN: safe() untuk nama_ekspedisi & no_resi */}
                                            <p className="font-medium text-[#1b1b18]">{safe(pesanan.ekspedisi?.nama_ekspedisi) || '-'}</p>
                                            {pesanan.no_resi && <p className="text-xs text-[#5f6368]">No. Resi: {safe(pesanan.no_resi)}</p>}
                                        </div>
                                    </div>
                                    {pesanan.alamat && (
                                        <div className="flex gap-2">
                                            <MapPin className="size-4 text-[#5f6368] flex-shrink-0 mt-0.5" />
                                            <div>
                                                {/* 🔥 PERBAIKAN: safe() untuk semua field alamat */}
                                                <p className="font-medium text-[#1b1b18]">{safe(pesanan.alamat.nama_penerima)} · {safe(pesanan.alamat.no_hp_penerima)}</p>
                                                <p className="text-[#5f6368] text-xs mt-0.5">
                                                    {safe(pesanan.alamat.alamat_lengkap)}, {safe(pesanan.alamat.kecamatan)}, {safe(pesanan.alamat.kota_kabupaten)}, {safe(pesanan.alamat.provinsi?.nama_provinsi)}, {safe(pesanan.alamat.kode_pos)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Kanan: Ringkasan Pembayaran */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl border border-[#19140035] p-5 sticky top-6">
                                <h2 className="text-base font-semibold text-[#1b1b18] mb-4">Ringkasan Pembayaran</h2>
                                <div className="flex flex-col gap-2 text-sm">
                                    <div className="flex justify-between text-[#5f6368]">
                                        <span>Subtotal Produk</span>
                                        <span>Rp {Number(subtotal_produk ?? 0).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-[#5f6368]">
                                        <span>Ongkos Kirim</span>
                                        <span>Rp {Number(pesanan.ongkos_kirim ?? 0).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-[#1b1b18] pt-2 border-t border-[#19140035]">
                                        <span>Total</span>
                                        <span className="text-[#2264c0]">Rp {Number(grand_total ?? 0).toLocaleString('id-ID')}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-[#19140035] flex flex-col gap-2 text-sm">
                                    <div className="flex justify-between text-[#5f6368]">
                                        <span>Metode Pembayaran</span>
                                        {/* 🔥 PERBAIKAN: safe() untuk metode_pembayaran */}
                                        <span className="font-medium text-[#1b1b18]">{safe(pesanan.metode_pembayaran) || '-'}</span>
                                    </div>
                                    {pesanan.batas_waktu_pembayaran && statusPesanan === 'Menunggu Konfirmasi Pembayaran' && (
                                        <div className="flex justify-between text-[#5f6368]">
                                            <span>Batas Bayar</span>
                                            <span className="font-medium text-red-500">{formatTanggal(pesanan.batas_waktu_pembayaran)}</span>
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href="/katalog"
                                    className="mt-5 block w-full py-3 bg-[#2264c0] text-white rounded-full font-semibold text-sm hover:bg-[#1a4f9a] transition-colors text-center"
                                >
                                    Lanjut Belanja
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
