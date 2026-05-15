import { Head, Link, router, usePage } from '@inertiajs/react';
import { Bell, BookOpen, LogOut, MapPin, Package, Settings, ShoppingBag, ShoppingCart, Truck, User, X } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';

// 🔥 safe helper — aman untuk nilai null/undefined
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

const ALASAN_PEMBATALAN = [
    'Salah mengisi detail produk',
    'Salah mengisi alamat',
    'Ingin mengganti produk',
    'Berubah pikiran',
];

export default function PesananDetail() {
    const { auth, pesanan, subtotal_produk, grand_total } = usePage().props as any;
    const keranjangCount: number = auth.keranjang_count || 0;

    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [countdown, setCountdown] = useState<string | null>(null);
    const [showBatalOverlay, setShowBatalOverlay] = useState(false);
    const [showSelesaiOverlay, setShowSelesaiOverlay] = useState(false);
    const userDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notifDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notifications: any[] = Array.isArray(auth?.notifications) ? auth.notifications : [];

    // safe helper — aman untuk nilai null/undefined
    if (!pesanan) {
        return (
            <div className="min-h-screen flex items-center justify-center text-[#5f6368]">
                <p>Data pesanan tidak ditemukan.</p>
            </div>
        );
    }

    const statusPesanan = safe(pesanan.status_pesanan);

    // Countdown timer 24 jam
    useEffect(() => {
        if (statusPesanan !== 'Menunggu Konfirmasi Pembayaran' || !pesanan.batas_waktu_pembayaran) {
            setCountdown(null);
            return;
        }
        const update = () => {
            const deadlineMs = new Date(pesanan.batas_waktu_pembayaran + 'Z').getTime();
            const left = deadlineMs - Date.now();
            if (left <= 0) {
                setCountdown('00:00:00');
                return;
            }
            const h = Math.floor(left / 3600000);
            const m = Math.floor((left % 3600000) / 60000);
            const s = Math.floor((left % 60000) / 1000);
            setCountdown(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, [pesanan.batas_waktu_pembayaran, statusPesanan]);

    const currentStep = STATUS_STEPS.findIndex(s => s.label === statusPesanan);

    function formatTanggal(val: string | null) {
        if (!val) return '-';
        const d = new Date(val);
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    return (
        <>
            <Head title={`Pesanan ${safe(pesanan.no_pesanan)} - EyeLit`} />
            <div className="min-h-screen bg-white">
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
                                            <div className="dropdown-menu show" style={{ top: '64px', right: '90px' }}>
                                                <div className="dropdown-header">
                                                    <span className="text-sm font-semibold text-[#202124]">Notifikasi</span>
                                                </div>
                                                {notifications.length === 0 ? (
                                                    <div className="dropdown-notif-empty">
                                                        <Bell className="size-10" />
                                                        <p>Tidak ada notifikasi</p>
                                                    </div>
                                                ) : (
                                                    <div className="max-h-80 overflow-y-auto">
                                                        {notifications.map((notif: any, index: number) => (
                                                            <div key={index} className="dropdown-notif-item">
                                                                <div className="dropdown-notif-icon">
                                                                    <Bell className="size-5" />
                                                                </div>
                                                                <div className="dropdown-notif-content">
                                                                    <p className="dropdown-notif-title">{notif.title || 'Notifikasi'}</p>
                                                                    <p className="dropdown-notif-message">{notif.message}</p>
                                                                    <p className="dropdown-notif-time">
                                                                        {notif.created_at ? new Date(notif.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Baru saja'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {notifications.length > 0 && (
                                                    <div className="dropdown-notif-footer">
                                                        <Link href="/notifikasi">Lihat Notifikasi</Link>
                                                    </div>
                                                )}
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

                {/* Konten */}
                <main className="mx-auto max-w-7xl px-4 pb-16">
                    {/* Header Pesanan */}
                    <div className="bg-white rounded-xl border border-[#19140035] p-5 mb-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-xs text-[#5f6368]">No. Pesanan</p>
                                <p className="text-lg font-bold text-[#1b1b18]">{safe(pesanan.no_pesanan) || '-'}</p>
                                <p className="text-xs text-[#5f6368]">{formatTanggal(pesanan.tanggal_pemesanan)}</p>
                            </div>
                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${STATUS_COLOR[statusPesanan] ?? 'bg-gray-100 text-gray-600'}`}>
                                {statusPesanan || '-'}
                            </span>
                        </div>

                        {/* Progress Bar Status */}
                        {statusPesanan !== 'Dibatalkan' && (
                            <div className="mt-6 overflow-x-auto pb-1">
                                <div className="flex items-center progress-bar-wrap">
                                    {STATUS_STEPS.map((step, i) => {
                                        const isCompleted = i < currentStep;
                                        const isCurrent = i === currentStep;
                                        return (
                                            <div key={step.label} className="flex items-center flex-1 min-w-0 last:flex-none">
                                                <div className="flex flex-col items-center px-0.5">
                                                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold border-2 transition-colors ${
                                                        isCompleted
                                                            ? 'bg-[#2264c0] border-[#2264c0] text-white'
                                                            : isCurrent
                                                                ? 'bg-yellow-400 border-yellow-400 text-white animate-pulse'
                                                                : 'bg-white border-gray-300 text-gray-400'
                                                    }`}>
                                                        {isCompleted ? '✓' : i + 1}
                                                    </div>
                                                    <p className={`text-[8px] sm:text-[10px] mt-1 text-center max-w-[60px] sm:max-w-[70px] leading-tight ${isCompleted || isCurrent ? 'text-[#2264c0] font-medium' : 'text-gray-400'}`}>
                                                        <span className="hidden lg:inline">
                                                            {step.label === 'Menunggu Konfirmasi Pembayaran' && pesanan.tanggal_konfirmasi_pembayaran ? 'Pembayaran' : step.label}
                                                        </span>
                                                        <span className="hidden sm:inline lg:hidden">
                                                            {step.label === 'Menunggu Konfirmasi Pembayaran' && pesanan.tanggal_konfirmasi_pembayaran ? 'Bayar' : step.short}
                                                        </span>
                                                        <span className="sm:hidden">
                                                            {step.label === 'Menunggu Konfirmasi Pembayaran' && pesanan.tanggal_konfirmasi_pembayaran ? 'Bayar' : step.short}
                                                        </span>
                                                        {(isCompleted || isCurrent) && step.label === 'Menunggu Konfirmasi Pembayaran' && pesanan.tanggal_konfirmasi_pembayaran ? (
                                                            <span className="block text-[7px] sm:text-[9px] mt-0.5 text-[#5f6368]">
                                                                {new Date(pesanan.tanggal_konfirmasi_pembayaran).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        ) : (isCompleted || isCurrent) && step.label === 'Dikemas' && pesanan.tanggal_konfirmasi_pembayaran ? (
                                                            <span className="block text-[7px] sm:text-[9px] mt-0.5 text-[#5f6368]">
                                                                {new Date(pesanan.tanggal_konfirmasi_pembayaran).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        ) : (isCompleted || isCurrent) && step.label === 'Dikirim' && pesanan.tanggal_pengiriman ? (
                                                            <span className="block text-[7px] sm:text-[9px] mt-0.5 text-[#5f6368]">
                                                                {new Date(pesanan.tanggal_pengiriman).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        ) : (isCompleted || isCurrent) && step.label === 'Pesanan Tiba di Tujuan' && pesanan.tanggal_tiba ? (
                                                            <span className="block text-[7px] sm:text-[9px] mt-0.5 text-[#5f6368]">
                                                                {new Date(pesanan.tanggal_tiba).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        ) : (isCompleted || isCurrent) && step.label === 'Selesai' && pesanan.tanggal_selesai ? (
                                                            <span className="block text-[7px] sm:text-[9px] mt-0.5 text-[#5f6368]">
                                                                {new Date(pesanan.tanggal_selesai).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        ) : null}
                                                    </p>
                                                </div>
                                                {i < STATUS_STEPS.length - 1 && (
                                                    <div className={`h-0.5 mx-0.5 mb-4 sm:mb-5 flex-1 min-w-[4px] ${isCompleted ? 'bg-[#2264c0]' : 'bg-gray-200'}`} />
                                                )}
                                            </div>
                                        );
                                    })}
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
                                        <div key={d.id} className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5">
                                            <img
                                                src={d.produk?.gambar ? `/images/produk/${d.produk.gambar}` : '/images/placeholder.png'}
                                                alt={safe(d.produk?.nama_produk)}
                                                className="w-full sm:w-20 h-32 sm:h-20 object-contain rounded-lg bg-gray-50 flex-shrink-0"
                                                onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
                                            />
                                            <div className="flex-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                                <div className="flex-1">
                                                    <p className="text-xs text-[#2264c0] font-medium">{safe(d.produk?.merek)}</p>
                                                    <p className="text-sm font-semibold text-[#1b1b18]">{safe(d.produk?.nama_produk)}</p>
                                                    <p className="text-xs text-[#5f6368] mt-0.5">{safe(d.tipe_pembelian)} · ×{d.jumlah ?? 0}</p>
                                                    {safe(d.tipe_pembelian) === 'Frame + Lensa' && (
                                                        <div className="text-xs text-[#5f6368] mt-1 space-y-0.5">
                                                            {d.jenis_lensa_od ? <p>OD: {safe(d.jenis_lensa_od)} {safe(d.nilai_lensa_od)}{d.silinder_od ? ` / Sil ${safe(d.silinder_od)}` : ''}</p> : null}
                                                            {d.jenis_lensa_os ? <p>OS: {safe(d.jenis_lensa_os)} {safe(d.nilai_lensa_os)}{d.silinder_os ? ` / Sil ${safe(d.silinder_os)}` : ''}</p> : null}
                                                            {d.anti_radiasi ? <p>+ Anti Radiasi</p> : null}
                                                            {d.photochromic ? <p>+ Photochromic</p> : null}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-right sm:flex-shrink-0">
                                                    <p className="text-sm font-bold text-[#2264c0]">Rp {Number(d.subtotal ?? 0).toLocaleString('id-ID')}</p>
                                                    <p className="text-xs text-[#5f6368] mt-0.5">Rp {Number(d.harga_frame ?? 0).toLocaleString('id-ID')} / pcs</p>
                                                </div>
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
                                            <p className="font-medium text-[#1b1b18]">{safe(pesanan.ekspedisi?.nama_ekspedisi) || '-'}</p>
                                            {pesanan.no_resi && <p className="text-xs text-[#5f6368]">No. Resi: {safe(pesanan.no_resi)}</p>}
                                        </div>
                                    </div>
                                    {pesanan.alamat && (
                                        <div className="flex gap-2">
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
                                        <span className="font-medium text-[#1b1b18]">{safe(pesanan.metode_pembayaran) || '-'}</span>
                                    </div>
                                    {countdown && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#5f6368]">Sisa Waktu</span>
                                            <span className="font-bold text-red-500 font-mono text-base">{countdown}</span>
                                        </div>
                                    )}
                                </div>

                                {statusPesanan === 'Menunggu Konfirmasi Pembayaran' ? (
                                    <>
                                        <Link
                                            href={`/pembayaran/${pesanan.id}`}
                                            className="mt-5 block w-full py-3 bg-[#2264c0] text-white rounded-full font-semibold text-sm hover:bg-[#1a4f9a] transition-colors text-center"
                                        >
                                            Bayar
                                        </Link>
                                        <button
                                            onClick={() => setShowBatalOverlay(true)}
                                            className="mt-3 block w-full py-3 bg-red-50 text-red-500 border border-red-200 rounded-full font-semibold text-sm hover:bg-red-100 transition-colors text-center"
                                        >
                                            Batalkan Pesanan
                                        </button>
                                    </>
                                ) : statusPesanan === 'Pesanan Tiba di Tujuan' ? (
                                    <button
                                        onClick={() => setShowSelesaiOverlay(true)}
                                        className="mt-5 block w-full py-3 bg-[#2264c0] text-white rounded-full font-semibold text-sm hover:bg-[#1a4f9a] transition-colors text-center"
                                    >
                                        Pesanan Diterima
                                    </button>
                                ) : statusPesanan !== 'Dikemas' && statusPesanan !== 'Dikirim' ? (
                                    <Link
                                        href="/katalog"
                                        className="mt-5 block w-full py-3 bg-[#2264c0] text-white rounded-full font-semibold text-sm hover:bg-[#1a4f9a] transition-colors text-center"
                                    >
                                        Lanjut Belanja
                                    </Link>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Overlay Batalkan Pesanan */}
                {showBatalOverlay && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowBatalOverlay(false)}
                        />
                        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-[#19140035]">
                                <h2 className="text-lg font-bold text-[#1b1b18]">Batalkan Pesanan</h2>
                                <button
                                    onClick={() => setShowBatalOverlay(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X className="size-5 text-[#5f6368]" />
                                </button>
                            </div>
                            <div className="px-6 py-5">
                                <p className="text-sm text-[#5f6368] mb-4">Pilih alasan pembatalan pesanan:</p>
                                <div className="space-y-2">
                                    {ALASAN_PEMBATALAN.map((alasan) => (
                                        <button
                                            key={alasan}
                                            onClick={() => {
                                                router.post(`/pesanan/${pesanan.id}/batal?_method=DELETE`, {
                                                    alasan_pembatalan: alasan,
                                                }, {
                                                    onSuccess: () => {
                                                        setShowBatalOverlay(false);
                                                        toast.success('Pesanan berhasil dibatalkan');
                                                    },
                                                    onError: () => {
                                                        toast.error('Gagal membatalkan pesanan');
                                                    },
                                                });
                                            }}
                                            className="w-full text-left px-4 py-3 rounded-xl border border-[#19140035] text-sm font-medium text-[#1b1b18] hover:bg-gray-50 hover:border-[#2264c0] transition-colors"
                                        >
                                            {alasan}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Overlay Pesanan Diterima */}
                {showSelesaiOverlay && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowSelesaiOverlay(false)}
                        />
                        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-[#19140035]">
                                <h2 className="text-lg font-bold text-[#1b1b18]">Pesanan Diterima</h2>
                                <button
                                    onClick={() => setShowSelesaiOverlay(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X className="size-5 text-[#5f6368]" />
                                </button>
                            </div>
                            <div className="px-6 py-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-green-100 rounded-full p-3">
                                        <Package className="size-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#1b1b18]">Konfirmasi Pesanan</p>
                                        <p className="text-xs text-[#5f6368]">#{safe(pesanan.no_pesanan)}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-[#5f6368] mb-5">
                                    Dengan menekan <span className="font-semibold text-[#1b1b18]">"Ya, Pesanan Diterima"</span>, kamu mengkonfirmasi bahwa barang pesanan telah diterima dengan baik dan sesuai.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowSelesaiOverlay(false)}
                                        className="flex-1 px-4 py-2.5 text-sm font-medium text-[#5f6368] bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={() => {
                                            router.post(`/pesanan/${pesanan.id}/selesai`, {}, {
                                                onSuccess: () => {
                                                    setShowSelesaiOverlay(false);
                                                    toast.success('Pesanan berhasil dikonfirmasi selesai');
                                                },
                                                onError: () => {
                                                    toast.error('Gagal mengkonfirmasi pesanan');
                                                },
                                            });
                                        }}
                                        className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#2264c0] rounded-full hover:bg-[#1a4f9a] transition-colors"
                                    >
                                        Ya, Pesanan Diterima
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
