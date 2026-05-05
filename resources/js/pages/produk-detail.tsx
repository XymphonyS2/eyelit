import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Bell, BookOpen, LogOut, Settings, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useRef, useState } from 'react';

export default function ProdukDetail() {
    const { auth, produk } = usePage().props as any;
    console.log('PRODUK DATA:', produk);
    const keranjangCount: number = auth.keranjang_count || 0;
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);

    const userDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notifDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const notifications: any[] = auth.user?.notifications || [];

    function tambahKeKeranjang() {
        if (!auth.user) {
            router.visit('/login');
            return;
        }
        router.post('/keranjang/tambah', {
            produk_id: produk.id,
            jumlah: 1,
            tipe_pembelian: 'Frame Saja',
        }, { preserveScroll: true });
    }

    const details = [
        { label: 'Merek', value: produk.merek },
        { label: 'Tipe Produk', value: produk.tipe_produk },
        { label: 'Jenis Kelamin', value: produk.jenis_kelamin },
        { label: 'Warna', value: produk.warna },
        { label: 'Material', value: produk.material },
        { label: 'Bentuk', value: produk.bentuk },
        { label: 'Bridge', value: produk.bridge },
        { label: 'Diagonal', value: produk.diagonal },
        { label: 'Ukuran', value: produk.ukuran },
        { label: 'Stok', value: produk.stok > 0 ? `${produk.stok} unit` : 'Habis' },
    ].filter((d) => d.value);

    return (
        <>
            <Head title={`${produk.nama_produk ?? 'Produk'} - EyeLit`} />
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
                                            <div
                                                className="dropdown-menu show"
                                                style={{ top: '64px', right: '24px' }}
                                                onMouseEnter={() => { if (notifDropdownTimer.current) clearTimeout(notifDropdownTimer.current); }}
                                                onMouseLeave={() => { notifDropdownTimer.current = setTimeout(() => setShowNotifDropdown(false), 100); }}
                                            >
                                                <div className="dropdown-header"><span className="text-sm font-semibold text-[#202124]">Notifikasi</span></div>
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
                                        <button className="p-2 rounded-full hover:bg-gray-100">
                                            <User className="size-5 text-[#1b1b18]" />
                                        </button>
                                        {showUserDropdown && (
                                            <div
                                                className="dropdown-menu show"
                                                style={{ top: '64px', right: '24px' }}
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
                                                    <Link href="/pesanan" className="dropdown-item"><ShoppingBag className="size-5" />Pembelian</Link>
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

                            {!auth.user && (
                                <div className="flex items-center gap-2">
                                    <Link href="/login" className="px-4 py-2 text-sm font-medium text-[#1b1b18] hover:text-[#2264c0] transition-colors">Masuk</Link>
                                    <Link href="/register" className="px-4 py-2 text-sm font-medium bg-[#2264c0] text-white rounded-full hover:bg-[#1a4f9a] transition-colors">Daftar</Link>
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
                        <Link href="/katalog" className="hover:text-[#2264c0] transition-colors">Katalog</Link>
                        <span>/</span>
                        <span className="text-[#1b1b18] font-medium truncate max-w-xs">{produk.nama_produk ?? 'Produk'}</span>
                    </div>
                </div>

                {/* Detail Produk */}
                <main className="mx-auto max-w-7xl px-4 pb-16">
                    <Link href="/katalog" className="inline-flex items-center gap-2 text-sm text-[#5f6368] hover:text-[#2264c0] transition-colors mb-6">
                        <ArrowLeft className="size-4" />
                        Kembali ke Katalog
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Gambar Produk */}
                        <div className="flex items-center justify-center bg-white rounded-2xl border border-[#19140035] p-8">
                            {/* ✅ DIPERBAIKI: Fallback gambar jika produk.gambar null/undefined */}
                            <img
                                src={produk.gambar ? `/images/produk/${encodeURIComponent(produk.gambar)}` : '/images/placeholder.png'}
                                alt={produk.nama_produk ?? 'Produk'}
                                className="max-h-80 w-full object-contain"
                                onError={(e) => { (e.currentTarget.src = '/images/placeholder.png'); }}
                            />
                        </div>

                        {/* Info Produk */}
                        <div className="flex flex-col gap-5">
                            <div>
                                <p className="text-sm font-medium text-[#2264c0] uppercase tracking-wide">{produk.merek ?? '-'}</p>
                                <h1 className="text-2xl font-bold text-[#1b1b18] mt-1">{produk.nama_produk ?? 'Nama tidak tersedia'}</h1>
                                <p className="text-3xl font-bold text-[#2264c0] mt-3">
                                    Rp {(Number(produk.harga_produk ?? 0) || 0).toLocaleString('id-ID')}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${produk.stok > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                    {produk.stok > 0 ? 'Tersedia' : 'Stok Habis'}
                                </span>
                                {produk.stok > 0 && (
                                    <span className="text-sm text-[#5f6368]">{produk.stok} unit tersisa</span>
                                )}
                            </div>

                            {/* Spesifikasi */}
                            <div className="bg-white rounded-xl border border-[#19140035] overflow-hidden">
                                <div className="px-4 py-3 border-b border-[#19140035] bg-gray-50">
                                    <h2 className="text-sm font-semibold text-[#1b1b18]">Spesifikasi Produk</h2>
                                </div>
                                <div className="divide-y divide-[#19140035]">
                                    {details.map((d) => (
                                        <div key={d.label} className="flex px-4 py-3 text-sm">
                                            <span className="w-36 text-[#5f6368] flex-shrink-0">{d.label}</span>
                                            <span className="text-[#1b1b18] font-medium">{d.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex gap-3 mt-2">
                                <button
                                    disabled={produk.stok === 0}
                                    className="flex-1 py-3 rounded-full bg-[#2264c0] text-white font-semibold text-sm hover:bg-[#1a4f9a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Beli Sekarang
                                </button>
                                <button
                                    disabled={produk.stok === 0}
                                    onClick={tambahKeKeranjang}
                                    className="flex-1 py-3 rounded-full border border-[#2264c0] text-[#2264c0] font-semibold text-sm hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    + Keranjang
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
