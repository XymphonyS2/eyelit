import { Head, Link, usePage } from '@inertiajs/react';
import { Bell, BookOpen, ChevronDown, LogOut, Package, Settings, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useRef, useState } from 'react';

const safe = (v: any) => (v ?? "").toString().trim();

interface DetailPesanan {
    id: number;
    produk?: { nama_produk: string; gambar: string; merek: string };
    jumlah: number;
    subtotal: number;
}

interface Pesanan {
    id: number;
    no_pesanan: string;
    status_pesanan: string;
    metode_pembayaran: string;
    tanggal_pemesanan: string;
    total_harga: number;
    ongkos_kirim: number;
    ekspedisi?: { nama_ekspedisi: string };
    detail_pesanan: DetailPesanan[];
}

const STATUS_COLOR: Record<string, string> = {
    'Menunggu Konfirmasi Pembayaran': 'bg-yellow-100 text-yellow-700',
    'Dikemas':                        'bg-blue-100 text-blue-700',
    'Dikirim':                        'bg-indigo-100 text-indigo-700',
    'Pesanan Tiba di Tujuan':         'bg-purple-100 text-purple-700',
    'Selesai':                        'bg-green-100 text-green-700',
    'Dibatalkan':                     'bg-red-100 text-red-600',
};

const STATUS_TABS: { label: string; short: string }[] = [
    { label: 'Semua',                       short: 'Semua' },
    { label: 'Menunggu Konfirmasi Pembayaran', short: 'Menunggu' },
    { label: 'Dikemas',                     short: 'Dikemas' },
    { label: 'Dikirim',                     short: 'Dikirim' },
    { label: 'Selesai',                     short: 'Selesai' },
    { label: 'Dibatalkan',                  short: 'Batal' },
];

export default function Pesanan() {
    const { auth, pesanan } = usePage().props as any;

    const items: Pesanan[] = Array.isArray(pesanan) ? pesanan : [];
    const keranjangCount: number = auth.keranjang_count || 0;

    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [showTabDropdown, setShowTabDropdown] = useState(false);
    const [activeTab, setActiveTab] = useState('Semua');
    const userDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notifDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notifications: any[] = auth.user?.notifications || [];

    const filtered = activeTab === 'Semua'
        ? items
        : items.filter(p => {
            const match = STATUS_TABS.find(t => t.label === activeTab);
            return match ? safe(p.status_pesanan) === activeTab : false;
        });

    function formatTanggal(val: string | null | undefined) {
        if (!val) return '-';
        const d = new Date(val);
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    return (
        <>
            <Head title="Pesanan Saya - EyeLit" />
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
                        <span className="text-[#1b1b18] font-medium">Pesanan Saya</span>
                    </div>
                </div>

                {/* Konten */}
                <main className="mx-auto max-w-7xl px-4 pb-16">
                    <h1 className="text-2xl font-bold text-[#1b1b18] mb-6">Pesanan Saya</h1>

                    {/* Tabs - Desktop */}
                    <div className="hidden sm:flex gap-1 overflow-x-auto mb-6 bg-white rounded-xl border border-[#19140035] p-1">
                        {STATUS_TABS.map((tab) => (
                            <button
                                key={tab.label}
                                onClick={() => setActiveTab(tab.label)}
                                className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                                    activeTab === tab.label
                                        ? 'bg-[#2264c0] text-white'
                                        : 'text-[#5f6368] hover:bg-gray-100'
                                }`}
                            >
                                {tab.label}
                                {tab.label !== 'Semua' && (
                                    <span className="ml-1.5 opacity-70">
                                        ({items.filter(p => safe(p.status_pesanan) === tab.label).length})
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tabs - Mobile Dropdown */}
                    <div className="sm:hidden mb-4">
                        <div className="relative">
                            <button
                                onClick={() => setShowTabDropdown(!showTabDropdown)}
                                className="w-full flex items-center justify-between bg-white rounded-xl border border-[#19140035] px-4 py-2.5 text-sm font-medium text-[#1b1b18]"
                            >
                                <span>
                                    {STATUS_TABS.find(t => t.label === activeTab)?.label ?? activeTab}
                                    <span className="ml-2 text-xs text-[#5f6368] font-normal">
                                        ({filtered.length} pesanan)
                                    </span>
                                </span>
                                <ChevronDown className={`size-4 transition-transform ${showTabDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            {showTabDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-[#19140035] shadow-lg z-20 overflow-hidden">
                                    {STATUS_TABS.map((tab) => (
                                        <button
                                            key={tab.label}
                                            onClick={() => { setActiveTab(tab.label); setShowTabDropdown(false); }}
                                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                                                activeTab === tab.label
                                                    ? 'bg-[#2264c0] text-white'
                                                    : 'text-[#1b1b18] hover:bg-gray-50'
                                            }`}
                                        >
                                            <span>{tab.label}</span>
                                            {tab.label !== 'Semua' && (
                                                <span className="text-xs opacity-70">
                                                    ({items.filter(p => safe(p.status_pesanan) === tab.label).length})
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* List Pesanan */}
                    {filtered.length === 0 ? (
                        <div className="bg-white rounded-xl border border-[#19140035] py-12 sm:py-16 flex flex-col items-center gap-3 text-[#5f6368]">
                            <Package className="size-10 sm:size-12 text-gray-300" />
                            <p className="text-sm font-medium">Belum ada pesanan</p>
                            <Link href="/katalog" className="mt-2 px-5 py-2.5 bg-[#2264c0] text-white text-sm font-semibold rounded-full hover:bg-[#1a4f9a] transition-colors">
                                Mulai Belanja
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 sm:gap-4">
                            {items.map((p: any) => {
                                const firstItem = p.detail_pesanan?.[0];
                                const extraCount = (p.detail_pesanan?.length ?? 0) - 1;
                                const gambarSrc = firstItem?.produk?.gambar
                                    ? `/images/produk/${firstItem.produk.gambar}`
                                    : '/images/placeholder.png';
                                return (
                                    <Link
                                        key={p.id}
                                        href={`/pesanan/${p.id}`}
                                        className="bg-white rounded-xl border border-[#19140035] p-4 sm:p-5 hover:border-[#2264c0] hover:shadow-sm transition-all block"
                                    >
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
                                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap flex-1 min-w-0">
                                                <span className="text-xs font-mono font-semibold text-[#1b1b18] truncate">
                                                    {safe(p.no_pesanan)}
                                                </span>
                                                <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-semibold flex-shrink-0 ${STATUS_COLOR[safe(p.status_pesanan)] ?? 'bg-gray-100 text-gray-600'}`}>
                                                    {safe(p.status_pesanan) || '-'}
                                                </span>
                                            </div>
                                            <span className="text-xs text-[#5f6368] flex-shrink-0">{formatTanggal(p.tanggal_pemesanan)}</span>
                                        </div>

                                        {/* Produk preview */}
                                        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                                            {firstItem && (
                                                <img
                                                    src={gambarSrc}
                                                    alt={safe(firstItem.produk?.nama_produk)}
                                                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-lg bg-gray-50 flex-shrink-0"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-[#2264c0] font-medium truncate">{safe(firstItem?.produk?.merek)}</p>
                                                <p className="text-sm font-semibold text-[#1b1b18] truncate">{safe(firstItem?.produk?.nama_produk)}</p>
                                                <p className="text-xs text-[#5f6368]">×{firstItem?.jumlah}</p>
                                                {extraCount > 0 && (
                                                    <p className="text-xs text-[#5f6368] mt-0.5">+{extraCount} produk lainnya</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-[#19140035]">
                                            <div className="text-xs text-[#5f6368] hidden sm:block">
                                                <span className="font-medium text-[#1b1b18]">{safe(p.ekspedisi?.nama_ekspedisi) || '-'}</span>
                                                <span className="mx-1.5">·</span>
                                                <span>{safe(p.metode_pembayaran) || '-'}</span>
                                            </div>
                                            <div className="text-right flex-1 sm:flex-none">
                                                <p className="text-xs text-[#5f6368]">Total</p>
                                                <p className="text-sm font-bold text-[#2264c0]">
                                                    Rp {Number(p.total_harga ?? (p.detail_pesanan?.reduce((s: number, d: any) => s + d.subtotal, 0) ?? 0) + (p.ongkos_kirim ?? 0)).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
