import { Head, Link, router, usePage } from '@inertiajs/react';
import { Bell, BookOpen, LogOut, MapPin, Package, Settings, ShoppingBag, ShoppingCart, Truck, User, X } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

// safe helper — aman untuk nilai null/undefined
const safe = (v: any) => (v ?? "").toString().trim();

const STATUS_STEPS = [
    { label: 'Menunggu Konfirmasi Pembayaran', short: 'Menunggu' },
    { label: 'Dikemas',                        short: 'Dikemas' },
    { label: 'Dikirim',                        short: 'Dikirim' },
    { label: 'Pesanan Tiba di Tujuan',         short: 'Tiba' },
    { label: 'Selesai',                        short: 'Selesai' },
];

const STATUS_COLOR: Record<string, string> = {
    'Menunggu Konfirmasi Pembayaran': 'bg-yellow-100 text-yellow-700',
    'Dikemas':                        'bg-blue-100 text-blue-700',
    'Dikirim':                        'bg-indigo-100 text-indigo-700',
    'Pesanan Tiba di Tujuan':         'bg-purple-100 text-purple-700',
    'Selesai':                        'bg-green-100 text-green-700',
    'Dibatalkan':                     'bg-red-100 text-red-600',
};

const STATUS_LABEL: Record<string, string> = {
    'Menunggu Konfirmasi Pembayaran': 'Menunggu Konfirmasi Pembayaran',
    'Dikemas':                        'Sedang Dikemas',
    'Dikirim':                        'Sedang Dikirim',
    'Pesanan Tiba di Tujuan':         'Pesanan Tiba di Tujuan',
    'Selesai':                        'Selesai',
    'Dibatalkan':                     'Dibatalkan',
};

export default function DetailPengiriman() {
    const { auth, pesanan } = usePage().props as any;
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const userDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notifDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notifications: any[] = Array.isArray(auth?.notifications) ? auth.notifications : [];

    if (!pesanan) {
        return (
            <div className="min-h-screen flex items-center justify-center text-[#5f6368]">
                <p>Data pesanan tidak ditemukan.</p>
            </div>
        );
    }

    const statusPesanan = safe(pesanan.status_pesanan);

    // Timeline steps berdasarkan status
    const currentIndex = STATUS_STEPS.findIndex((s) => s.label === statusPesanan);
    const timelineSteps = STATUS_STEPS.map((step, index) => ({
        ...step,
        isActive: index <= currentIndex,
        isCurrent: index === currentIndex,
    }));

    const formatTanggal = (tanggal: string | null) => {
        if (!tanggal) return null;
        return new Date(tanggal).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatWaktu = (tanggal: string | null) => {
        if (!tanggal) return null;
        return new Date(tanggal).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getTanggalStatus = (status: string) => {
        switch (status) {
            case 'Menunggu Konfirmasi Pembayaran':
                return pesanan.tanggal_pemesanan;
            case 'Dikemas':
                return pesanan.tanggal_konfirmasi_pembayaran;
            case 'Dikirim':
                return pesanan.tanggal_pengiriman || pesanan.no_resi ? pesanan.tanggal_konfirmasi_pembayaran : null;
            case 'Pesanan Tiba di Tujuan':
                return pesanan.tanggal_tiba;
            case 'Selesai':
                return pesanan.tanggal_selesai;
            default:
                return null;
        }
    };

    // Cleanup dropdown timers
    useEffect(() => {
        return () => {
            if (userDropdownTimer) clearTimeout(userDropdownTimer);
            if (notifDropdownTimer) clearTimeout(notifDropdownTimer);
        };
    }, []);

    return (
        <>
            <Head title={`Detail Pengiriman - #${pesanan.id}`} />

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white border-b border-[#19140035]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="bg-[#2264c0] rounded-full p-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                </div>
                                <span className="text-lg font-bold text-[#1b1b18]">EyeLit</span>
                            </Link>
                            <div className="hidden md:flex items-center gap-6">
                                <Link href="/katalog" className="text-sm text-[#5f6368] hover:text-[#1b1b18] transition-colors">Katalog</Link>
                                <Link href="/pesanan" className="text-sm font-medium text-[#2264c0]">Pesanan Saya</Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Notifikasi */}
                            <div className="relative">
                                <button
                                    onMouseEnter={() => { if (notifDropdownTimer) clearTimeout(notifDropdownTimer); setShowNotifDropdown(true); }}
                                    className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <Bell className="size-5 text-[#5f6368]" />
                                    {notifications.filter((n: any) => !n.read_at).length > 0 && (
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                    )}
                                </button>
                                {showNotifDropdown && (
                                    <div
                                        className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-[#19140035] shadow-lg z-50"
                                        onMouseLeave={() => { setShowNotifDropdown(false); }}
                                    >
                                        <div className="p-4 border-b border-[#19140035]">
                                            <p className="text-sm font-semibold text-[#1b1b18]">Notifikasi</p>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <p className="p-4 text-sm text-[#5f6368] text-center">Tidak ada notifikasi</p>
                                            ) : (
                                                notifications.slice(0, 5).map((n: any) => (
                                                    <div key={n.id} className={`p-4 border-b border-[#19140035]/50 ${!n.read_at ? 'bg-blue-50' : ''}`}>
                                                        <p className="text-sm text-[#1b1b18]">{n.data?.message || n.message}</p>
                                                        <p className="text-xs text-[#5f6368] mt-1">{new Date(n.created_at).toLocaleDateString('id-ID')}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <Link href="/notifikasi" className="block p-3 text-center text-sm text-[#2264c0] hover:bg-gray-50 transition-colors">
                                            Lihat Semua
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onMouseEnter={() => { if (userDropdownTimer) clearTimeout(userDropdownTimer); setShowUserDropdown(true); }}
                                    className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <User className="size-5 text-[#5f6368]" />
                                </button>
                                {showUserDropdown && (
                                    <div
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-[#19140035] shadow-lg z-50"
                                        onMouseLeave={() => { setShowUserDropdown(false); }}
                                    >
                                        <div className="p-4 border-b border-[#19140035]">
                                            <p className="text-sm font-semibold text-[#1b1b18]">{safe(auth.user?.username)}</p>
                                            <p className="text-xs text-[#5f6368]">{safe(auth.user?.email)}</p>
                                        </div>
                                        <div className="p-2">
                                            <Link href="/pesanan" className="flex items-center gap-3 px-3 py-2 text-sm text-[#1b1b18] hover:bg-gray-50 rounded-lg transition-colors">
                                                <ShoppingBag className="size-4 text-[#5f6368]" /> Pesanan Saya
                                            </Link>
                                            <Link href="/keranjang" className="flex items-center gap-3 px-3 py-2 text-sm text-[#1b1b18] hover:bg-gray-50 rounded-lg transition-colors">
                                                <ShoppingCart className="size-4 text-[#5f6368]" /> Keranjang
                                            </Link>
                                            <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-sm text-[#1b1b18] hover:bg-gray-50 rounded-lg transition-colors">
                                                <Settings className="size-4 text-[#5f6368]" /> Pengaturan
                                            </Link>
                                            <div className="border-t border-[#19140035]/50 my-2"></div>
                                            <Link href="/logout" method="post" as="button" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                <LogOut className="size-4" /> Keluar
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="min-h-screen bg-[#fafaf8]">
                <div className="max-w-3xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <Link href={`/pesanan/${pesanan.id}`} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <X className="size-5 text-[#5f6368]" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-[#1b1b18]">Detail Pengiriman</h1>
                            <p className="text-sm text-[#5f6368]">#{pesanan.id} · {safe(pesanan.ekspedisi?.nama_ekspedisi)}</p>
                        </div>
                    </div>

                    {/* Status Card */}
                    <div className="bg-white rounded-xl border border-[#19140035] overflow-hidden mb-6">
                        <div className="px-5 py-4 border-b border-[#19140035]">
                            <p className="text-sm text-[#5f6368]">Status Pesanan</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLOR[statusPesanan] || 'bg-gray-100 text-gray-700'}`}>
                                    {STATUS_LABEL[statusPesanan] || statusPesanan}
                                </span>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="p-5">
                            <div className="flex items-start justify-between relative">
                                {/* Garis penghubung */}
                                <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200 -z-0" style={{ left: '24px', right: '24px' }}></div>

                                {timelineSteps.map((step, index) => {
                                    const tanggal = getTanggalStatus(step.label);
                                    return (
                                        <div key={step.label} className="flex flex-col items-center relative z-10" style={{ minWidth: '80px' }}>
                                            {/* Bulatan */}
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step.isActive ? 'bg-[#2264c0]' : 'bg-gray-200'}`}>
                                                {step.isActive && (
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                )}
                                            </div>
                                            {/* Label */}
                                            <p className={`text-xs mt-2 text-center leading-tight ${step.isCurrent ? 'font-semibold text-[#2264c0]' : step.isActive ? 'text-[#1b1b18]' : 'text-[#9CA3AF]'}`}>
                                                {step.short}
                                            </p>
                                            {/* Tanggal */}
                                            {tanggal ? (
                                                <p className={`text-xs mt-1 text-center ${step.isActive ? 'text-[#5f6368]' : 'text-[#9CA3AF]'}`}>
                                                    {formatTanggal(tanggal)}
                                                </p>
                                            ) : (
                                                <p className="text-xs mt-1 text-[#9CA3AF]">-</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Detail Info */}
                    <div className="bg-white rounded-xl border border-[#19140035] overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-[#19140035]">
                            <MapPin className="size-4 text-[#2264c0]" />
                            <h2 className="text-sm font-semibold text-[#1b1b18]">Info Pengiriman</h2>
                        </div>
                        <div className="p-5 flex flex-col gap-4 text-sm">
                            {/* Ekspedisi & Resi */}
                            <div className="flex gap-3">
                                <Truck className="size-4 text-[#5f6368] flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-[#1b1b18]">{safe(pesanan.ekspedisi?.nama_ekspedisi) || '-'}</p>
                                    {pesanan.no_resi && (
                                        <p className="text-xs text-[#5f6368] font-mono">No. Resi: {safe(pesanan.no_resi)}</p>
                                    )}
                                </div>
                            </div>

                            {/* Alamat */}
                            {pesanan.alamat && (
                                <div className="flex gap-3">
                                    <MapPin className="size-4 text-[#5f6368] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-[#1b1b18]">{safe(pesanan.alamat.nama_penerima)} · {safe(pesanan.alamat.no_hp_penerima)}</p>
                                        <p className="text-[#5f6368] text-xs mt-0.5">
                                            {safe(pesanan.alamat.alamat_lengkap)}, {safe(pesanan.alamat.kecamatan)}, {safe(pesanan.alamat.kota_kabupaten)}, {safe(pesanan.alamat.provinsi?.nama_provinsi)}, {safe(pesanan.alamat.kode_pos)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    {statusPesanan === 'Dikemas' && pesanan.no_resi && (
                        <a
                            href={`https://cekresi.com/?resi=${pesanan.no_resi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-5 block w-full py-3 bg-[#2264c0] text-white rounded-full font-semibold text-sm text-center hover:bg-[#1a4f9a] transition-colors"
                        >
                            Lihat Pengiriman
                        </a>
                    )}

                    {/* Back Link */}
                    <Link href={`/pesanan/${pesanan.id}`} className="mt-6 block text-center text-sm text-[#2264c0] hover:underline">
                        ← Kembali ke Detail Pesanan
                    </Link>
                </div>
            </main>
        </>
    );
}