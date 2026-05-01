import { Head, Link, usePage } from '@inertiajs/react';
import { Bell, BookOpen, LogOut, Search, Settings, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useState, useRef } from 'react';

export default function Welcome() {
    const { auth, produk } = usePage().props as any;
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showCartDropdown, setShowCartDropdown] = useState(false);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);

    // Refs for dropdown timers
    const userDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cartDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notifDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Mock cart items - replace with actual data from backend
    const cartItems: any[] = auth.user?.cartItems || [];
    // Mock notifications - replace with actual data from backend
    const notifications: any[] = auth.user?.notifications || [];

    return (
        <>
            <Head title="EyeLit" />
            <div className="min-h-screen bg-[#FDFDFC]">
                {/* Navbar */}
                <nav className="relative z-50 border-b border-[#19140035] bg-white">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 gap-4">
                        {/* Logo & Text */}
                        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                            <img src="/images/logo/AuthMobile.svg" alt="EyeLit Logo" className="h-10 w-auto" />
                            <span className="text-2xl font-bold text-[#2264c0]">EyeLit</span>
                        </Link>

                        {/* Search Bar - Center */}
                        <div className="flex-1 max-w-lg ml-[90px]">
                            <div className="relative">
                                <input
                                    type="text"
                                    autoComplete="off"
                                    spellCheck={false}
                                    placeholder="Cari produk kacamata..."
                                    className="w-full h-9 pl-4 pr-12 rounded-full border border-[#19140035] bg-white text-sm placeholder:text-[#9CA3AF] disabled:bg-transparent appearance-none focus:outline-none outline-none focus:border-[#2264c0] focus:border-[3px] focus:ring-2 focus:ring-[#2264c0] focus:ring-offset-0 [&:focus-visible]:outline-none [&::-webkit-search-decoration]:hidden [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden outline-none [&:focus-visible]:outline-none [&:focus-visible]:ring-0 [&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:![-webkit-box-shadow:0_0_0_100px_white_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#1b1b18]"
                                />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#706f6c]" />
                            </div>
                        </div>

                        {/* Right Icons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button className="icon-btn icon-catalog p-2 rounded-full hover:bg-gray-100">
                                <BookOpen className="size-5 text-[#1b1b18]" />
                            </button>

                            {/* Notification Dropdown */}
                            <div className="relative h-full flex items-center">
                                <div
                                    onMouseEnter={() => {
                                        if (notifDropdownTimer.current) clearTimeout(notifDropdownTimer.current);
                                        setShowNotifDropdown(true);
                                    }}
                                    onMouseLeave={() => {
                                        notifDropdownTimer.current = setTimeout(() => setShowNotifDropdown(false), 100);
                                    }}
                                >
                                    <button className="icon-btn icon-bell p-2 rounded-full hover:bg-gray-100 relative">
                                        <Bell className="size-5 text-[#1b1b18]" />
                                        {notifications.length > 0 && (
                                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                        )}
                                    </button>
                                    {showNotifDropdown && (
                                        <div
                                            className="dropdown-menu show"
                                            style={{ top: '64px', right: '130px' }}
                                            onMouseEnter={() => {
                                                if (notifDropdownTimer.current) clearTimeout(notifDropdownTimer.current);
                                            }}
                                            onMouseLeave={() => {
                                                notifDropdownTimer.current = setTimeout(() => setShowNotifDropdown(false), 100);
                                            }}
                                        >
                                            <div className="dropdown-header">
                                                <span className="text-sm font-semibold text-[#202124]">Notifikasi</span>
                                            </div>
                                            {notifications.length === 0 ? (
                                                <div className="dropdown-notif-empty">
                                                    <Bell className="size-10" />
                                                    <p> Tidak ada notifikasi </p>
                                                </div>
                                            ) : (
                                                <div className="max-h-80 overflow-y-auto">
                                                    {notifications.map((notif: any, index: number) => (
                                                        <Link key={index} href={notif.link || '#'} className="dropdown-notif-item">
                                                            <div className="dropdown-notif-icon">
                                                                <Bell className="size-5" />
                                                            </div>
                                                            <div className="dropdown-notif-content">
                                                                <p className="dropdown-notif-title">{notif.title}</p>
                                                                <p className="dropdown-notif-message">{notif.message}</p>
                                                                <p className="dropdown-notif-time">{notif.time || 'Baru saja'}</p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                            {notifications.length > 0 && (
                                                <div className="dropdown-notif-footer">
                                                    <Link href="/notifications">Lihat Semua</Link>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Cart Dropdown */}
                            <div className="relative h-full flex items-center">
                                <div
                                    onMouseEnter={() => {
                                        if (cartDropdownTimer.current) clearTimeout(cartDropdownTimer.current);
                                        setShowCartDropdown(true);
                                    }}
                                    onMouseLeave={() => {
                                        cartDropdownTimer.current = setTimeout(() => setShowCartDropdown(false), 100);
                                    }}
                                >
                                    <button className="icon-btn icon-cart p-2 rounded-full hover:bg-gray-100 relative">
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
                                            style={{ top: '64px', right: '90px' }}
                                            onMouseEnter={() => {
                                                if (cartDropdownTimer.current) clearTimeout(cartDropdownTimer.current);
                                            }}
                                            onMouseLeave={() => {
                                                cartDropdownTimer.current = setTimeout(() => setShowCartDropdown(false), 100);
                                            }}
                                        >
                                            <div className="dropdown-header">
                                                <span className="text-sm font-semibold text-[#202124]">Keranjang Belanja</span>
                                            </div>
                                            {cartItems.length === 0 ? (
                                                <div className="dropdown-cart-empty">
                                                    <ShoppingCart className="size-10" />
                                                    <p> Kamu belum memasukkan barang ke keranjang </p>
                                                </div>
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
                                                                <p className="dropdown-cart-qty">Jumlah: {item.jumlah}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {cartItems.length > 0 && (
                                                <div className="dropdown-cart-footer">
                                                    <Link href="/cart">Lihat Keranjang</Link>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* User Dropdown */}
                            {auth.user && (
                                <div className="relative h-full flex items-center">
                                    <div
                                        onMouseEnter={() => {
                                            if (userDropdownTimer.current) clearTimeout(userDropdownTimer.current);
                                            setShowUserDropdown(true);
                                        }}
                                        onMouseLeave={() => {
                                            userDropdownTimer.current = setTimeout(() => setShowUserDropdown(false), 100);
                                        }}
                                    >
                                        <button className="icon-btn icon-user p-2 rounded-full hover:bg-gray-100">
                                            <User className="size-5 text-[#1b1b18]" />
                                        </button>
                                        {showUserDropdown && (
                                            <div
                                                className="dropdown-menu show"
                                                style={{ top: '64px', right: '24px' }}
                                                onMouseEnter={() => {
                                                    if (userDropdownTimer.current) clearTimeout(userDropdownTimer.current);
                                                }}
                                                onMouseLeave={() => {
                                                    userDropdownTimer.current = setTimeout(() => setShowUserDropdown(false), 100);
                                                }}
                                            >
                                                <div className="dropdown-header">
                                                    <div className="dropdown-avatar">
                                                        {auth.user?.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="dropdown-user-info">
                                                        <span className="dropdown-user-name">{auth.user?.username}</span>
                                                        <span className="dropdown-user-email">{auth.user?.email}</span>
                                                    </div>
                                                </div>
                                                <div className="dropdown-body">
                                                    <Link href="#" className="dropdown-item">
                                                        <ShoppingBag className="size-5" />
                                                        Pembelian
                                                    </Link>
                                                    <Link href="/user/profile" className="dropdown-item">
                                                        <Settings className="size-5" />
                                                        Pengaturan
                                                    </Link>
                                                    <form method="POST" action="/logout">
                                                        <input type="hidden" name="_token" value={auth.csrf} />
                                                        <button type="submit" className="dropdown-item logout w-full text-left">
                                                            <LogOut className="size-5" />
                                                            Keluar Akun
                                                        </button>
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

                {/* Grid Box Section */}
                <section className="overflow-hidden">
                    {/* Row 1: Produk 1-5, shift to 2-5 */}
                    <div className="flex w-full overflow-hidden">
                        {[0,1,2,3,4,1,2,3].map((idx: number) => (
                            <div key={`r1-${idx}`} className="w-1/4 shrink-0">
                                <Link href={`/produk/${produk?.[idx]?.id}`} className="grid-box block animate-row">
                                    <div className="grid-box-content">
                                        <img className="grid-box-image" src={`/images/produk/${produk?.[idx]?.gambar}`} alt={produk?.[idx]?.nama_produk} onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }} />
                                        <div className="grid-box-overlay">
                                            <div className="grid-box-overlay-bottom">
                                                <div className="grid-box-left">
                                                    <div className="grid-box-merek">{produk?.[idx]?.merek}</div>
                                                    <div className="grid-box-tipe">{produk?.[idx]?.tipe_produk}</div>
                                                </div>
                                                <span className="grid-box-harga">Rp {(Number(produk?.[idx]?.harga_produk) || 0).toLocaleString('id-ID')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                    {/* Row 2: Produk 6-10, shift to 7-10 */}
                    <div className="flex w-full overflow-hidden">
                        {[6,7,8,9,7,8,9,10].map((idx: number) => (
                            <div key={`r2-${idx}`} className="w-1/4 shrink-0">
                                <Link href={`/produk/${produk?.[idx]?.id}`} className="grid-box block animate-row-delay-2" style={{animationName: 'slide-left-row'}}>
                                    <div className="grid-box-content">
                                        <img className="grid-box-image" src={`/images/produk/${produk?.[idx]?.gambar}`} alt={produk?.[idx]?.nama_produk} onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }} />
                                        <div className="grid-box-overlay">
                                            <div className="grid-box-overlay-bottom">
                                                <div className="grid-box-left">
                                                    <div className="grid-box-merek">{produk?.[idx]?.merek}</div>
                                                    <div className="grid-box-tipe">{produk?.[idx]?.tipe_produk}</div>
                                                </div>
                                                <span className="grid-box-harga">Rp {(Number(produk?.[idx]?.harga_produk) || 0).toLocaleString('id-ID')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                    {/* Row 3: Produk 11-15, shift to 12-15 */}
                    <div className="flex w-full overflow-hidden">
                        {[10,11,12,13,14,11,12,13].map((idx: number) => (
                            <div key={`r3-${idx}`} className="w-1/4 shrink-0">
                                <Link href={`/produk/${produk?.[idx]?.id}`} className="grid-box block animate-row-delay-4">
                                    <div className="grid-box-content">
                                        <img className="grid-box-image" src={`/images/produk/${produk?.[idx]?.gambar}`} alt={produk?.[idx]?.nama_produk} onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }} />
                                        <div className="grid-box-overlay">
                                            <div className="grid-box-overlay-bottom">
                                                <div className="grid-box-left">
                                                    <div className="grid-box-merek">{produk?.[idx]?.merek}</div>
                                                    <div className="grid-box-tipe">{produk?.[idx]?.tipe_produk}</div>
                                                </div>
                                                <span className="grid-box-harga">Rp {(Number(produk?.[idx]?.harga_produk) || 0).toLocaleString('id-ID')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
