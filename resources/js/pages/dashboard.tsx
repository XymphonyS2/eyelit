import { Head, Link, usePage } from '@inertiajs/react';
import { Bell, BookOpen, LogOut, Search, Settings, ShoppingBag, ShoppingCart, User, LayoutGrid, Package, Users } from 'lucide-react';
import { useState, useRef } from 'react';

export default function Dashboard() {
    const { auth } = usePage().props as any;
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
            <Head title="Dashboard" />

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
                                placeholder="Cari produk kacamata..."
                                className="w-full h-9 pl-4 pr-12 rounded-full border border-[#19140035] bg-white text-sm appearance-none focus:outline-none outline-none focus:border-[#2264c0] focus:border-[3px] focus:ring-2 focus:ring-[#2264c0] focus:ring-offset-0 [&::-webkit-search-decoration]:hidden [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden outline-none [&:focus-visible]:outline-none [&:focus-visible]:ring-0 [&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:![-webkit-box-shadow:0_0_0_100px_white_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#1b1b18]"
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
                                    <div className="dropdown-menu show" style={{ top: '64px', right: '130px' }}>
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
                                onMouseEnter={() => setShowCartDropdown(true)}
                                onMouseLeave={() => setShowCartDropdown(false)}
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
                                    <div className="dropdown-menu show" style={{ top: '64px', right: '90px' }}>
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
                        <div className="relative h-full flex items-center">
                            <div
                                onMouseEnter={() => setShowUserDropdown(true)}
                                onMouseLeave={() => setShowUserDropdown(false)}
                            >
                                <button className="icon-btn icon-user p-2 rounded-full hover:bg-gray-100">
                                    <User className="size-5 text-[#1b1b18]" />
                                </button>
                                {showUserDropdown && (
                                    <div className="dropdown-menu show" style={{ top: '64px', right: '24px' }}>
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
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="border-t border-[#19140035]/50">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="flex items-center gap-6 py-2 overflow-x-auto">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 text-sm font-medium text-[#2264c0] whitespace-nowrap"
                            >
                                <LayoutGrid className="size-4" />
                                Dashboard
                            </Link>
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-sm font-medium text-[#706f6c] hover:text-[#1b1b18] transition-colors whitespace-nowrap"
                            >
                                Beranda
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-2 text-sm font-medium text-[#706f6c] hover:text-[#1b1b18] transition-colors whitespace-nowrap"
                            >
                                <Package className="size-4" />
                                Produk
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-2 text-sm font-medium text-[#706f6c] hover:text-[#1b1b18] transition-colors whitespace-nowrap"
                            >
                                <ShoppingBag className="size-4" />
                                Pesanan
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-2 text-sm font-medium text-[#706f6c] hover:text-[#1b1b18] transition-colors whitespace-nowrap"
                            >
                                <Users className="size-4" />
                                Pengguna
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Dashboard Content */}
            <main className="mx-auto max-w-7xl px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#1b1b18]">Dashboard</h1>
                    <p className="text-[#706f6c] mt-2">Selamat datang, {auth.user?.username}!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="rounded-xl border border-[#19140035] bg-white p-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-[#2264c0]/10 p-3">
                                <Package className="size-6 text-[#2264c0]" />
                            </div>
                            <div>
                                <p className="text-sm text-[#706f6c]">Total Produk</p>
                                <p className="text-2xl font-bold text-[#1b1b18]">0</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-[#19140035] bg-white p-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-[#2264c0]/10 p-3">
                                <ShoppingBag className="size-6 text-[#2264c0]" />
                            </div>
                            <div>
                                <p className="text-sm text-[#706f6c]">Total Pesanan</p>
                                <p className="text-2xl font-bold text-[#1b1b18]">0</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-[#19140035] bg-white p-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-[#2264c0]/10 p-3">
                                <Users className="size-6 text-[#2264c0]" />
                            </div>
                            <div>
                                <p className="text-sm text-[#706f6c]">Pengguna</p>
                                <p className="text-2xl font-bold text-[#1b1b18]">0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [],
};
