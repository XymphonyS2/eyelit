import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Bell, BookOpen, LogOut, Mail, MapPin, Phone, Search, Settings, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useRef, useState } from 'react';

export default function ProdukDetail() {
    const { auth, produk } = usePage().props as any;
    const keranjangCount: number = auth.keranjang_count || 0;
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showCartDropdown, setShowCartDropdown] = useState(false);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);

    const userDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cartDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notifDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cartItems: any[] = auth.user?.cartItems || [];
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
    ].filter((d) => d.value);

    return (
        <>
            <Head title={`${produk.nama_produk} - EyeLit`} />
            <div className="min-h-screen bg-white">
                {/* Navbar */}
                <nav className="relative z-50 border-b border-[#19140035] bg-white">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 gap-4">
                        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                            <img src="/images/logo/AuthMobile.svg" alt="EyeLit Logo" className="h-10 w-auto" />
                            <span className="text-2xl font-bold text-[#2264c0]">EyeLit</span>
                        </Link>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-lg ml-[90px] max-[439px]:hidden">
                            <div className="relative">
                                <input
                                    type="text"
                                    autoComplete="off"
                                    spellCheck={false}
                                    placeholder="Cari produk kacamata..."
                                    className="w-full h-9 pl-4 pr-12 rounded-full border border-[#19140035] bg-white text-sm placeholder:text-[#9CA3AF] disabled:bg-transparent appearance-none focus:outline-none outline-none focus:border-[#2264c0] focus:border-[3px] focus:ring-2 focus:ring-[#2264c0] focus:ring-offset-0"
                                />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#706f6c]" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Link href="/katalog" className="p-2 rounded-full hover:bg-gray-100">
                                <BookOpen className="size-5 text-[#1b1b18]" />
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
                                <div className="relative h-full flex items-center">
                                    <div
                                        onMouseEnter={() => { if (cartDropdownTimer.current) clearTimeout(cartDropdownTimer.current); setShowCartDropdown(true); }}
                                        onMouseLeave={() => { cartDropdownTimer.current = setTimeout(() => setShowCartDropdown(false), 100); }}
                                    >
                                        <button className="p-2 rounded-full hover:bg-gray-100 relative">
                                            <ShoppingCart className="size-5 text-[#1b1b18]" />
                                            {cartItems.length > 0 && (
                                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#2264c0] text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                    {cartItems.length}
                                                </span>
                                            )}
                                        </button>
                                        {showCartDropdown && (
                                            <div
                                                className="dropdown-menu show"
                                                style={{ top: '64px', right: '24px' }}
                                                onMouseEnter={() => { if (cartDropdownTimer.current) clearTimeout(cartDropdownTimer.current); }}
                                                onMouseLeave={() => { cartDropdownTimer.current = setTimeout(() => setShowCartDropdown(false), 100); }}
                                            >
                                                <div className="dropdown-header"><span className="text-sm font-semibold text-[#202124]">Keranjang Belanja</span></div>
                                                {cartItems.length === 0 ? (
                                                    <div className="dropdown-cart-empty"><ShoppingCart className="size-10" /><p>Kamu belum memasukkan barang ke keranjang</p></div>
                                                ) : (
                                                    <div className="max-h-80 overflow-y-auto">
                                                        {cartItems.map((item: any, index: number) => (
                                                            <div key={index} className="dropdown-cart-item">
                                                                <div className="dropdown-cart-image">
                                                                    <img src={item.gambar || '/images/placeholder.png'} alt={item.nama} />
                                                                </div>
                                                                <div className="dropdown-cart-info">
                                                                    <p className="dropdown-cart-name">{item.nama}</p>
                                                                    <p className="dropdown-cart-price">Rp {item.harga?.toLocaleString('id-ID')}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {cartItems.length > 0 && (
                                                    <div className="dropdown-cart-footer"><Link href="/keranjang">Lihat Keranjang</Link></div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
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
                        <span className="text-[#1b1b18] font-medium">{produk.nama_produk}</span>
                    </div>
                </div>

                {/* Detail Produk */}
                <main className="mx-auto max-w-7xl px-4 pb-16">
                    <Link href="/katalog" className="inline-flex items-center gap-2 text-sm text-[#5f6368] hover:text-[#2264c0] transition-colors mb-6">
                        <ArrowLeft className="size-4" />
                        Kembali ke Katalog
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                        {/* Gambar Produk */}
                        <div className="bg-white rounded-2xl border border-[#19140035] p-6 flex items-center justify-center sticky top-6">
                            <img
                                src={`/images/produk/${produk.gambar}`}
                                alt={produk.nama_produk}
                                className="max-h-[420px] w-full object-contain"
                                onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
                            />
                        </div>

                        {/* Info Produk */}
                        <div className="flex flex-col gap-6">
                            {/* Header Info */}
                            <div className="bg-white rounded-2xl border border-[#19140035] p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#2264c0]/10 text-[#2264c0]">
                                        {produk.merek}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${produk.stok > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                        {produk.stok > 0 ? 'Tersedia' : 'Stok Habis'}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-[#1b1b18] mb-3">{produk.nama_produk}</h1>
                                <p className="text-4xl font-bold text-[#2264c0]">
                                    Rp {(Number(produk.harga_produk) || 0).toLocaleString('id-ID')}
                                </p>
                                {produk.stok > 0 && (
                                    <p className="text-base text-[#5f6368] mt-2">{produk.stok} unit tersedia</p>
                                )}
                            </div>

                            {/* Spesifikasi */}
                            <div className="bg-white rounded-2xl border border-[#19140035] overflow-hidden">
                                <div className="px-5 py-4 border-b border-[#19140035] bg-white">
                                    <h2 className="text-base font-semibold text-[#1b1b18]">Spesifikasi Produk</h2>
                                </div>
                                <div className="divide-y divide-[#19140035]">
                                    {details.map((d) => (
                                        <div key={d.label} className="flex px-5 py-3.5 text-sm">
                                            <span className="w-40 text-[#5f6368] flex-shrink-0">{d.label}</span>
                                            <span className="text-[#1b1b18] font-medium">{d.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex gap-4">
                                <button
                                    disabled={produk.stok === 0}
                                    className="flex-1 py-4 rounded-full bg-[#2264c0] text-white font-semibold text-base hover:bg-[#1a4f9a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#2264c0]/20"
                                >
                                    Beli Sekarang
                                </button>
                                <button
                                    disabled={produk.stok === 0}
                                    onClick={tambahKeKeranjang}
                                    className="flex-1 py-4 rounded-full border-2 border-[#2264c0] text-[#2264c0] font-semibold text-base hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    + Keranjang
                                </button>
                            </div>

                            {/* Info Tambahan */}
                            <div className="bg-[#2264c0]/5 rounded-2xl p-5 border border-[#2264c0]/20">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#2264c0] flex items-center justify-center flex-shrink-0">
                                        <Phone className="size-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#1b1b18]">Butuh bantuan?</p>
                                        <p className="text-sm text-[#5f6368]">Hubungi kami di +62 21 1234 5678</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-[#1b1b18] text-white">
                    <div className="mx-auto max-w-7xl px-4 py-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                            {/* Brand */}
                            <div className="lg:col-span-1">
                                <Link href="/" className="flex items-center gap-2 mb-5">
                                    <img src="/images/logo/Auth.svg" alt="EyeLit Logo" className="h-10 w-auto" />
                                    <span className="text-2xl font-bold text-white">EyeLit</span>
                                </Link>
                                <p className="text-sm text-white/60 leading-relaxed mb-6">
                                    Toko kacamata online terpercaya untuk gaya hidup yang lebih tajam.
                                </p>
                                <div className="flex gap-3">
                                    <a href="https://www.tiktok.com/@eyelit" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#2264c0] transition-colors">
                                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.1 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.89a4.85 4.85 0 0 1-1.01-.2z"/>
                                        </svg>
                                    </a>
                                    <a href="https://www.instagram.com/eyelit" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#2264c0] transition-colors">
                                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Navigasi</h3>
                                <ul className="space-y-3">
                                    <li><Link href="/" className="text-sm text-white/60 hover:text-white transition-colors">Beranda</Link></li>
                                    <li><Link href="/katalog" className="text-sm text-white/60 hover:text-white transition-colors">Katalog</Link></li>
                                    <li><Link href="/tentang" className="text-sm text-white/60 hover:text-white transition-colors">Tentang Kami</Link></li>
                                    <li><Link href="/kontak" className="text-sm text-white/60 hover:text-white transition-colors">Hubungi Kami</Link></li>
                                </ul>
                            </div>

                            {/* Support */}
                            <div>
                                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Bantuan</h3>
                                <ul className="space-y-3">
                                    <li><Link href="/faq" className="text-sm text-white/60 hover:text-white transition-colors">FAQ</Link></li>
                                    <li><Link href="/pengiriman" className="text-sm text-white/60 hover:text-white transition-colors">Pengiriman</Link></li>
                                    <li><Link href="/pengembalian" className="text-sm text-white/60 hover:text-white transition-colors">Pengembalian</Link></li>
                                    <li><Link href="/kebijakan-privasi" className="text-sm text-white/60 hover:text-white transition-colors">Kebijakan Privasi</Link></li>
                                </ul>
                            </div>

                            {/* Contact */}
                            <div>
                                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Kontak</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <MapPin className="size-4 text-white mt-0.5 shrink-0" />
                                        <span className="text-sm text-white/60">Jl. Sudirman No. 123, Jakarta Pusat 10220, Indonesia</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Phone className="size-4 text-white shrink-0" />
                                        <span className="text-sm text-white/60">+62 21 1234 5678</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Mail className="size-4 text-white shrink-0" />
                                        <span className="text-sm text-white/60">info@eyelit.com</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="mt-12 pt-8 border-t border-white/10">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <p className="text-sm text-white/40">&copy; 2026 EyeLit. Hak cipta dilindungi.</p>
                                <div className="flex gap-8">
                                    <Link href="/kebijakan-privasi" className="text-sm text-white/40 hover:text-white transition-colors">Kebijakan Privasi</Link>
                                    <Link href="/syarat-ketentuan" className="text-sm text-white/40 hover:text-white transition-colors">Syarat &amp; Ketentuan</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
