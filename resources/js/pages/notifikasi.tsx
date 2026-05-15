import { Head, Link, router, usePage } from '@inertiajs/react';
import { Bell, BookOpen, Check, CheckCheck, LogOut, Settings, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface NotifikasiItem {
    id: number;
    pengguna_id: number;
    judul_notifikasi: string;
    isi_notifikasi: string;
    jenis_notifikasi: string;
    pesanan_id: number | null;
    dibaca: boolean;
    tanggal_notifikasi: string;
}

export default function Notifikasi() {
    const { auth, notifikasi } = usePage().props as any;
    const items: NotifikasiItem[] = Array.isArray(notifikasi) ? notifikasi : [];

    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [showCartDropdown, setShowCartDropdown] = useState(false);
    const [notifications, setNotifications] = useState(items);

    const userDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notifDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cartDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const notificationsDropdown: any[] = Array.isArray(auth?.notifications) ? auth.notifications : [];
    const cartItems: any[] = auth.cartItems || [];

    useEffect(() => {
        setNotifications(items);
    }, [items]);

    const unreadCount = notifications.filter(n => !n.dibaca).length;

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleMarkAsRead = (id: number) => {
        router.post(`/notifikasi/${id}/baca`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setNotifications(prev =>
                    prev.map(n => n.id === id ? { ...n, dibaca: true } : n)
                );
            },
        });
    };

    const handleMarkAllAsRead = () => {
        router.post('/notifikasi/baca-semua', {}, {
            preserveScroll: true,
            onSuccess: () => {
                setNotifications(prev =>
                    prev.map(n => ({ ...n, dibaca: true }))
                );
            },
        });
    };

    return (
        <>
            <Head title="Notifikasi - EyeLit" />
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
                                            {notificationsDropdown.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
                                        </button>
                                        {showNotifDropdown && (
                                            <div className="dropdown-menu show" style={{ top: '64px', right: '24px' }}>
                                                <div className="dropdown-header"><span className="text-sm font-semibold text-[#202124]">Notifikasi</span></div>
                                                {notificationsDropdown.length === 0 ? (
                                                    <div className="dropdown-notif-empty"><Bell className="size-10" /><p>Tidak ada notifikasi</p></div>
                                                ) : (
                                                    <div className="max-h-80 overflow-y-auto">
                                                        {notificationsDropdown.map((notif: any, index: number) => (
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
                                                {notificationsDropdown.length > 0 && (
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
                                                        <p>Kamu belum memasukkan barang ke keranjang</p>
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
                                                    <Link href="/notifikasi" className="dropdown-item"><Bell className="size-5" />Notifikasi</Link>
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
                        <span className="text-[#1b1b18] font-medium">Notifikasi</span>
                    </div>
                </div>

                {/* Konten */}
                <main className="mx-auto max-w-7xl px-4 pb-16">
                    <h1 className="text-2xl font-bold text-[#1b1b18] mb-6">Notifikasi</h1>

                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 text-[#5f6368]">
                            <Bell className="size-16 text-gray-300" />
                            <p className="text-lg font-medium">Belum Ada Notifikasi</p>
                            <Link href="/katalog" className="px-6 py-2 bg-[#2264c0] text-white rounded-full text-sm font-semibold hover:bg-[#1a4f9a] transition-colors">
                                Mulai Belanja
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {/* Header */}
                            {unreadCount > 0 && (
                                <div className="bg-white rounded-xl border border-[#19140035] p-4 flex items-center justify-between">
                                    <span className="text-sm font-medium text-[#1b1b18]">{unreadCount} notifikasi belum dibaca</span>
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#2264c0] text-white text-sm font-medium rounded-full hover:bg-[#1a4f9a] transition-colors"
                                    >
                                        <CheckCheck className="size-4" />
                                        Tandai Semua Dibaca
                                    </button>
                                </div>
                            )}

                            {/* Notification Cards */}
                            {notifications.map((notif: NotifikasiItem) => (
                                <div
                                    key={notif.id}
                                    className={`bg-white rounded-xl border-2 p-4 flex flex-col sm:flex-row gap-4 transition-all ${
                                        !notif.dibaca
                                            ? 'border-[#2264c0] shadow-md'
                                            : 'border-[#19140035]'
                                    }`}
                                >
                                    {/* Gambar Produk */}
                                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg flex-shrink-0 overflow-hidden bg-gray-50">
                                        {notif.produk?.gambar ? (
                                            <img
                                                alt={notif.produk?.gambar}
                                                className="w-full h-full object-contain"
                                                src={`/images/produk/${notif.produk?.gambar}`}
                                                onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Bell className="size-8 text-gray-300" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs sm:text-sm font-semibold text-[#1b1b18]">{notif.judul_notifikasi}</p>
                                                <p className="text-xs sm:text-sm text-[#5f6368] mt-1">{notif.isi_notifikasi}</p>
                                                <p className="text-xs text-[#9CA3AF] mt-2">
                                                    {formatDate(notif.tanggal_notifikasi)}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {!notif.dibaca && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notif.id)}
                                                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#19140035] flex items-center justify-center hover:bg-gray-100 transition-colors"
                                                        title="Tandai sudah dibaca"
                                                    >
                                                        <Check className="size-4 text-[#2264c0]" />
                                                    </button>
                                                )}
                                                {notif.pesanan_id && (
                                                    <Link
                                                        href={`/pesanan/${notif.pesanan_id}`}
                                                        className="px-3 py-1.5 text-xs sm:text-sm font-medium text-[#2264c0] border border-[#2264c0] rounded-full hover:bg-blue-50 transition-colors"
                                                    >
                                                        Lihat Pesanan
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}