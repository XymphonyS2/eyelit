import { Head, Link, usePage } from '@inertiajs/react';
import { Bell, BookOpen, Calendar, LayoutGrid, LogOut, Mail, Package, Phone, Search, Settings, ShoppingBag, ShoppingCart, User, Users } from 'lucide-react';
import { useRef, useState } from 'react';

export default function DaftarPengguna() {
    const { auth, pengguna } = usePage().props as any;
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showCartDropdown, setShowCartDropdown] = useState(false);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const userDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cartDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notifDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cartItems: any[] = auth.cartItems || [];
    const notifications: any[] = auth.user?.notifications || [];

    const getRoleBadgeColor = (role: string) => {
        const colors: Record<string, string> = {
            'admin': 'bg-purple-100 text-purple-800',
            'pengguna': 'bg-blue-100 text-blue-800',
        };
        return colors[role?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    const formatRole = (peran: string) => {
        if (!peran) return '-';
        return peran.charAt(0).toUpperCase() + peran.slice(1).toLowerCase();
    };

    const getStatusBadgeColor = (status: string) => {
        const colors: Record<string, string> = {
            'aktif': 'bg-green-100 text-green-800',
            'nonaktif': 'bg-red-100 text-red-800',
            'terblokir': 'bg-gray-100 text-gray-800',
        };
        return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    return (
        <>
            <Head title="Daftar Pengguna - EyeLit" />

            {/* Navbar */}
            <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
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
                                placeholder="Cari username..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-9 pl-4 pr-12 rounded-full border border-[#19140035] bg-white text-sm text-[#1b1b18] appearance-none focus:outline-none outline-none focus:border-[#2264c0] focus:border-[3px] focus:ring-2 focus:ring-[#2264c0] focus:ring-offset-0 [&::-webkit-search-decoration]:hidden [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden outline-none [&:focus-visible]:outline-none [&:focus-visible]:ring-0 [&:-webkit-autofill]:!bg-white [&:-webkit-autofill]:![-webkit-box-shadow:0_0_0_100px_white_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#1b1b18]"
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
                                                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f3f4f6', flexShrink: 0 }}>
                                                            <img
                                                                src={`/images/produk/${item.gambar}`}
                                                                alt={item.nama}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
                                                            />
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
                                                <Link href="/keranjang">Lihat Keranjang</Link>
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
                                            <Link href="/pesanan" className="dropdown-item">
                                                <ShoppingBag className="size-5" />
                                                Pesanan
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
                        <div className="flex items-center justify-center gap-6 overflow-x-auto">
                            <Link
                                href="/dashboard"
                                className="py-2 text-sm font-medium text-[#706f6c] hover:text-[#2264c0] transition-colors whitespace-nowrap"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/produk"
                                className="py-2 text-sm font-medium text-[#706f6c] hover:text-[#2264c0] transition-colors whitespace-nowrap"
                            >
                                Produk
                            </Link>
                            <Link
                                href="/daftar-pesanan"
                                className="py-2 text-sm font-medium text-[#706f6c] hover:text-[#2264c0] transition-colors whitespace-nowrap"
                            >
                                Pesanan
                            </Link>
                            <Link
                                href="/pengguna"
                                className="py-2 text-sm font-medium text-[#2264c0] whitespace-nowrap"
                            >
                                Pengguna
                            </Link>
                            <Link
                                href="/carousel"
                                className="py-2 text-sm font-medium text-[#706f6c] hover:text-[#2264c0] transition-colors whitespace-nowrap"
                            >
                                Carousel
                            </Link>
                            <Link
                                href="/"
                                className="py-2 text-sm font-medium text-[#706f6c] hover:text-[#2264c0] transition-colors whitespace-nowrap"
                            >
                                Beranda
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <main className="min-h-screen bg-[#ffffff]">
                {/* Header with Blue Background - Full Width */}
                <div className="bg-[#2264c0] w-full py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-white mb-2">Daftar Pengguna</h1>
                        <p className="text-white/80">Kelola semua pengguna EyeLit</p>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            {/* Total Pengguna */}
                            <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-300"></div>
                                <div className="relative flex items-center gap-4">
                                    <div className="flex-shrink-0 rounded-xl bg-white/20 p-4 group-hover:bg-white/30 transition-colors duration-300">
                                        <Users className="size-8 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white mb-1">Total Pengguna</p>
                                        <p className="text-3xl font-bold text-white truncate">{pengguna?.length || 0}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Admin */}
                            <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-300"></div>
                                <div className="relative flex items-center gap-4">
                                    <div className="flex-shrink-0 rounded-xl bg-white/20 p-4 group-hover:bg-white/30 transition-colors duration-300">
                                        <User className="size-8 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white mb-1">Admin</p>
                                        <p className="text-3xl font-bold text-white truncate">{pengguna?.filter((p: any) => p.peran === 'admin').length || 0}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Pengguna Biasa */}
                            <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-300"></div>
                                <div className="relative flex items-center gap-4">
                                    <div className="flex-shrink-0 rounded-xl bg-white/20 p-4 group-hover:bg-white/30 transition-colors duration-300">
                                        <Package className="size-8 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white mb-1">Pengguna Biasa</p>
                                        <p className="text-3xl font-bold text-white truncate">{pengguna?.filter((p: any) => p.peran === 'pengguna').length || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Users Table */}
                    {pengguna && pengguna.length > 0 ? (
                        <div className="bg-white rounded-xl border border-[#19140035] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-[#19140035]">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">No</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Profil</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Nama Pengguna</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Tanggal Daftar</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#19140035]/20">
                                        {pengguna
                                            .filter((item: any) =>
                                                searchQuery === '' ||
                                                item.username?.toLowerCase().includes(searchQuery.toLowerCase())
                                            )
                                            .map((item: any, index: number) => (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-[#1b1b18]">{index + 1}</td>
                                                <td className="px-6 py-4">
                                                    <div className="w-12 h-12 rounded-full bg-[#2264c0] flex items-center justify-center text-white font-bold text-lg">
                                                        {item.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-[#1b1b18]">{item.username}</td>
                                                <td className="px-6 py-4 text-sm text-[#706f6c]">
                                                    <div className="flex items-center gap-1">
                                                        <Mail className="size-4" />
                                                        {item.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(item.peran)}`}>
                                                        {formatRole(item.peran)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-[#706f6c]">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="size-4" />
                                                        {item.tanggal_daftar
                                                            ? new Date(item.tanggal_daftar).toLocaleDateString('id-ID', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })
                                                            : item.created_at
                                                                ? new Date(item.created_at).toLocaleDateString('id-ID', {
                                                                    day: '2-digit',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                })
                                                                : '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(item.status_akun)}`}>
                                                        {item.status_akun}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-[#19140035]">
                            <Users className="size-16 text-[#706f6c] mx-auto mb-4" />
                            <p className="text-[#706f6c]">Belum ada pengguna aktif</p>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}