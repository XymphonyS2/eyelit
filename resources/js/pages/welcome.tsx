import { Head, Link, usePage } from '@inertiajs/react';
import { Bell, BookOpen, LogOut, Mail, MapPin, Phone, Search, Settings, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

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

    // Carousel data - add new information slides here
    const [currentSlide, setCurrentSlide] = useState(0);
    const [imageAnimClass, setImageAnimClass] = useState('');
    const [textAnimClass, setTextAnimClass] = useState('');
    const [buttonAnimClass, setButtonAnimClass] = useState('');

    const slides = [
        {
            image: '/images/carousel/informasi-1.png',
            title: 'Gratis Pengiriman ke Seluruh Indonesia',
            description: 'Nikmati bebas biaya pengiriman untuk setiap pemesanan. Kami mengirim ke lebih dari 100 kota di Indonesia dengan jaminan keamanan paket hingga tujuan.',
        },
        {
            image: '/images/carousel/informasi-2.png',
            title: 'Lensa Berkualitas Tinggi untuk Penglihatan Optimal',
            description: 'Setiap kacamata EyeLit dilengkapi dengan lensa premium yang telah teruji ketajaman optiknya. Dirancang untuk kenyamanan seharian dengan coating anti-refleksi dan anti-gores.',
        },
    ];

    const handlePrev = () => {
        setImageAnimClass('carousel-image-out');
        setTextAnimClass('carousel-text-out');
        setButtonAnimClass('carousel-button-click');

        setTimeout(() => {
            setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
            setImageAnimClass('carousel-image-in');
            setTextAnimClass('carousel-text-in');
            setButtonAnimClass('');
            setTimeout(() => {
                setImageAnimClass('');
                setTextAnimClass('');
            }, 250);
        }, 400);
    };

    const handleNext = () => {
        setImageAnimClass('carousel-image-out');
        setTextAnimClass('carousel-text-out');
        setButtonAnimClass('carousel-button-click');

        setTimeout(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
            setImageAnimClass('carousel-image-in');
            setTextAnimClass('carousel-text-in');
            setButtonAnimClass('');
            setTimeout(() => {
                setImageAnimClass('');
                setTextAnimClass('');
            }, 250);
        }, 400);
    };

    // Auto-play carousel every 6 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setImageAnimClass('carousel-image-out');
            setTextAnimClass('carousel-text-out');
            setTimeout(() => {
                setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
                setImageAnimClass('carousel-image-in');
                setTextAnimClass('carousel-text-in');
                setTimeout(() => {
                    setImageAnimClass('');
                    setTextAnimClass('');
                }, 250);
            }, 400);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

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

                        {/* Search Bar - Center (hide on mobile <440px) */}
                        <div className="flex-1 max-w-lg ml-[90px] max-[439px]:hidden">
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
                            <Link href="/katalog" className="icon-btn icon-catalog p-2 rounded-full hover:bg-gray-100">
                                <BookOpen className="size-5 text-[#1b1b18]" />
                            </Link>

                            {/* Notification Dropdown */}
                            {auth.user && (
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
                                            className="dropdown-menu show max-[439px]:left-4 max-[439px]:right-4 max-[439px]:translate-x-0"
                                            style={{ top: '64px', right: '24px' }}
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
                            )}

                            {/* Cart Dropdown */}
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
                                            className="dropdown-menu show max-[439px]:left-4 max-[439px]:right-4 max-[439px]:translate-x-0"
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
                            )}

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
                                                className="dropdown-menu show max-[439px]:left-4 max-[439px]:right-4 max-[439px]:translate-x-0"
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

                            {/* Login/Register - hanya jika belum login */}
                            {!auth.user && (
                                <div className="flex items-center gap-2">
                                    <Link href="/login" className="px-4 py-2 text-sm font-medium text-[#1b1b18] hover:text-[#2264c0] transition-colors">
                                        Masuk
                                    </Link>
                                    <Link href="/register" className="px-4 py-2 text-sm font-medium bg-[#2264c0] text-white rounded-full hover:bg-[#1a4f9a] transition-colors">
                                        Daftar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Carousel Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                            {/* Left: Image */}
                            <div className="w-full lg:w-1/2">
                                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                                    <img
                                        src={slides[currentSlide].image}
                                        alt={slides[currentSlide].title}
                                        className={`w-full h-auto transition-opacity duration-300 ${imageAnimClass}`}
                                    />
                                </div>
                            </div>
                            {/* Right: Text Content */}
                            <div className="w-full lg:w-1/2 text-center lg:text-left">
                                <h2 className={`text-3xl lg:text-4xl font-bold text-[#1b1b18] mb-4 leading-tight ${textAnimClass}`}>
                                    {slides[currentSlide].title}
                                </h2>
                                <p className={`text-[#5f6368] text-base lg:text-lg leading-relaxed mb-8 ${textAnimClass}`}>
                                    {slides[currentSlide].description}
                                </p>
                                <div className="flex items-center gap-4 justify-center lg:justify-start">
                                    <button
                                        onClick={handlePrev}
                                        className="w-12 h-12 bg-[#2264c0] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6 text-white">
                                            <path d="m15 18-6-6 6-6"/>
                                        </svg>
                                    </button>
                                    <div className="flex gap-2">
                                        {slides.map((_, index) => (
                                            <span
                                                key={index}
                                                className={`w-3 h-3 rounded-full transition-colors ${
                                                    index === currentSlide
                                                        ? 'bg-[#2264c0] carousel-dot-active'
                                                        : 'bg-[#2264c0]/30'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleNext}
                                        className="w-12 h-12 bg-[#2264c0] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6 text-white">
                                            <path d="m9 18 6-6-6-6"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Grid Box Section */}
                <section className="overflow-hidden">
                    {/* Row 1: Produk 1-5, shift to 2-5 */}
                    <div className="flex w-full overflow-hidden">
                        {[0,1,2,3,4,1,2,3].map((idx: number) => (
                            <div key={`r1-${idx}`} className="w-1/4 shrink-0 grid-row-item">
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
                </section>

                {/* Row 2: Produk 6-10, shift to 7-10 */}
                <section className="overflow-hidden">
                    <div className="flex w-full overflow-hidden">
                        {[6,7,8,9,7,8,9,10].map((idx: number) => (
                            <div key={`r2-${idx}`} className="w-1/4 shrink-0 grid-row-item">
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
                </section>

                {/* Row 3: Produk 11-15, shift to 12-15 */}
                <section className="overflow-hidden">
                    <div className="flex w-full overflow-hidden">
                        {[10,11,12,13,14,11,12,13].map((idx: number) => (
                            <div key={`r3-${idx}`} className="w-1/4 shrink-0 grid-row-item">
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

                {/* CTA Section */}
                <section className="bg-[#2264c0] py-16 overflow-hidden relative group cursor-pointer">
                    <div className="mx-auto max-w-7xl px-4 flex items-center justify-between gap-8 relative z-10">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Cari Lebih Banyak Gayamu</h2>
                            <p className="text-white/80">Temukan kacamata yang sempurna untuk gaya hidupmu.</p>
                        </div>
                    </div>
                    {/* White Block - slides to left 100% on hover */}
                    <div className="absolute top-0 right-0 w-0 h-full bg-white overflow-hidden group-hover:w-full transition-all duration-500 ease-out flex items-center justify-center z-20">
                        <div className="text-center">
                            <span className="cta-text block text-3xl md:text-5xl font-black text-[#2264c0]">
                                Koleksi Terlengkap<br/>untuk Gaya Hidupmu
                            </span>
                        </div>
                    </div>
                </section>

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
