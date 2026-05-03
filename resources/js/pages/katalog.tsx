import { Head, Link, usePage } from '@inertiajs/react';
import { Bell, BookOpen, LogOut, Mail, MapPin, Phone, Search, Settings, ShoppingBag, ShoppingCart, User, X } from 'lucide-react';
import { useRef, useState, useMemo } from 'react';

export default function Katalog() {
    const { auth, produk } = usePage().props as any;
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showCartDropdown, setShowCartDropdown] = useState(false);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [filterClosing, setFilterClosing] = useState(false);
    const [backdropClosing, setBackdropClosing] = useState(false);
    const [searchMerek, setSearchMerek] = useState('');

    // Filter states
    const [selectedMerek, setSelectedMerek] = useState<string[]>([]);
    const [selectedJenisKelamin, setSelectedJenisKelamin] = useState<string[]>([]);
    const [selectedWarna, setSelectedWarna] = useState<string[]>([]);
    const [selectedMaterial, setSelectedMaterial] = useState<string[]>([]);
    const [selectedBentuk, setSelectedBentuk] = useState<string[]>([]);
    const [minHarga, setMinHarga] = useState<string>('');
    const [maxHarga, setMaxHarga] = useState<string>('');
    const [displayMinHarga, setDisplayMinHarga] = useState<string>('');
    const [displayMaxHarga, setDisplayMaxHarga] = useState<string>('');
    const [hargaError, setHargaError] = useState<string>('');

    const userDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cartDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notifDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cartItems: any[] = auth.user?.cartItems || [];
    const notifications: any[] = auth.user?.notifications || [];

    // Filter options from actual produk data (unique values)
    const mereks = useMemo(() => [...new Set(produk?.map((p: any) => p.merek) || [])].sort(), [produk]);
    const jenisKelamins = useMemo(() => [...new Set(produk?.map((p: any) => p.jenis_kelamin) || [])].sort(), [produk]);
    const warnas = useMemo(() => [...new Set(produk?.map((p: any) => p.warna) || [])].sort(), [produk]);
    const materials = useMemo(() => [...new Set(produk?.map((p: any) => p.material) || [])].sort(), [produk]);
    const bentuks = useMemo(() => [...new Set(produk?.map((p: any) => p.bentuk) || [])].sort(), [produk]);

    // Filtered mereks based on search
    const filteredMereks = useMemo(() => {
        if (!searchMerek) return mereks;
        return mereks.filter(m => m.toLowerCase().includes(searchMerek.toLowerCase()));
    }, [mereks, searchMerek]);

    // Toggle helper
    const toggleFilter = (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
        if (arr.includes(value)) {
            setArr(arr.filter(v => v !== value));
        } else {
            setArr([...arr, value]);
        }
    };

    // Check if any filter is active
    const hasActiveFilters = selectedMerek.length > 0 || selectedJenisKelamin.length > 0 || selectedWarna.length > 0 || selectedMaterial.length > 0 || selectedBentuk.length > 0 || minHarga !== '' || maxHarga !== '';

    // Clear all filters
    const clearFilters = () => {
        setSelectedMerek([]);
        setSelectedJenisKelamin([]);
        setSelectedWarna([]);
        setSelectedMaterial([]);
        setSelectedBentuk([]);
        setSearchMerek('');
        setMinHarga('');
        setMaxHarga('');
        setDisplayMinHarga('');
        setDisplayMaxHarga('');
        setHargaError('');
    };

    // Format number with thousand separator
    const formatNumber = (value: string) => {
        const num = value.replace(/\D/g, '');
        if (num === '') return '';
        return Number(num).toLocaleString('id-ID');
    };

    // Parse formatted number back to raw number
    const parseFormattedNumber = (formatted: string) => {
        return formatted.replace(/\D/g, '');
    };

    // Filtered products
    const filteredProduk = useMemo(() => {
        if (!hasActiveFilters) return produk;
        return produk.filter((item: any) => {
            if (selectedMerek.length > 0 && !selectedMerek.includes(item.merek)) return false;
            if (selectedJenisKelamin.length > 0 && !selectedJenisKelamin.includes(item.jenis_kelamin)) return false;
            if (selectedWarna.length > 0 && !selectedWarna.includes(item.warna)) return false;
            if (selectedMaterial.length > 0 && !selectedMaterial.includes(item.material)) return false;
            if (selectedBentuk.length > 0 && !selectedBentuk.includes(item.bentuk)) return false;
            const harga = Number(item.harga_produk);
            if (minHarga !== '' && harga < Number(minHarga)) return false;
            if (maxHarga !== '' && harga > Number(maxHarga)) return false;
            return true;
        });
    }, [produk, selectedMerek, selectedJenisKelamin, selectedWarna, selectedMaterial, selectedBentuk, minHarga, maxHarga, hasActiveFilters]);

    return (
        <>
            <Head title="Katalog - EyeLit" />
            <div className="min-h-screen bg-[#FDFDFC]">
                {/* Navbar */}
                <nav className="relative z-50 border-b border-[#19140035] bg-white">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 gap-4">
                        {/* Logo & Text */}
                        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                            <img src="/images/logo/AuthMobile.svg" alt="EyeLit Logo" className="h-10 w-auto" />
                            <span className="text-2xl font-bold text-[#2264c0]">EyeLit</span>
                        </Link>

                        {/* Right Icons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Link href="/katalog" className="icon-btn icon-catalog p-2 rounded-full hover:bg-gray-100">
                                <BookOpen className="size-5 text-[#2264c0]" />
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

                {/* Search Section */}
                <section className="bg-white border-b border-[#19140035]">
                    <div className="mx-auto max-w-7xl px-4 py-6">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-2xl font-bold text-[#1b1b18] text-center">Temukan Kacamata Impianmu</h2>
                            <p className="text-center text-[#5f6368] text-sm">Jelajahi berbagai koleksi kacamata terbaru dari berbagai merek ternama</p>
                            {/* Main Search Bar */}
                            <div className="w-full max-w-2xl mx-auto">
                                <div className="relative">
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        spellCheck={false}
                                        placeholder="Cari nama produk, merek, atau tipe kacamata..."
                                        className="w-full h-9 pl-4 pr-12 rounded-full border border-[#19140035] bg-white text-sm placeholder:text-[#9CA3AF] disabled:bg-transparent appearance-none focus:outline-none focus:border-[#2264c0] focus:border-[3px] focus:ring-2 focus:ring-[#2264c0] focus:ring-offset-0"
                                    />
                                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#706f6c]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Product Info & Filter Section */}
                <section className="bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-[#1b1b18]"><span>{filteredProduk?.length || 0}</span> produk ditemukan</p>
                            <button
                                onClick={() => setShowFilter(true)}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors ${hasActiveFilters ? 'bg-[#2264c0] text-white hover:bg-[#1a4f9a]' : 'bg-white text-[#1b1b18] border border-[#19140035] hover:bg-gray-50'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="4" x2="20" y1="6" y2="6"/>
                                    <line x1="8" x2="16" y1="12" y2="12"/>
                                    <line x1="11" x2="13" y1="18" y2="18"/>
                                </svg>
                                Filter
                            </button>
                        </div>
                    </div>
                </section>

                {/* Filter Overlay */}
                {(showFilter || filterClosing) && (
                    <>
                        {/* Backdrop */}
                        <div
                            className={`fixed inset-0 bg-black/40 z-50 ${showFilter && !backdropClosing ? 'backdrop-enter' : ''} ${backdropClosing ? 'backdrop-exit' : ''}`}
                            onClick={() => {
                                setBackdropClosing(true);
                                setFilterClosing(true);
                                setTimeout(() => {
                                    setShowFilter(false);
                                    setFilterClosing(false);
                                    setBackdropClosing(false);
                                }, 300);
                            }}
                        />

                        {/* Filter Panel */}
                        <div className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-xl overflow-y-auto ${showFilter && !filterClosing ? 'filter-panel-enter' : ''} ${filterClosing ? 'filter-panel-exit' : ''}`}>
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-[#19140035]">
                                <h3 className="text-lg font-semibold text-[#1b1b18]">Filter</h3>
                                <button
                                    onClick={() => {
                                        setBackdropClosing(true);
                                        setFilterClosing(true);
                                        setTimeout(() => {
                                            setShowFilter(false);
                                            setFilterClosing(false);
                                            setBackdropClosing(false);
                                        }, 300);
                                    }}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X className="size-5 text-[#5f6368]" />
                                </button>
                            </div>

                            {/* Filter Content */}
                            <div className="p-4 space-y-6">
                                {/* Merek with search */}
                                <div>
                                    <h4 className="text-sm font-semibold text-[#1b1b18] mb-3">Merek</h4>
                                    <div className="relative mb-3">
                                        <input
                                            type="text"
                                            placeholder="Cari merek..."
                                            value={searchMerek}
                                            onChange={(e) => setSearchMerek(e.target.value)}
                                            className="w-full h-9 pl-3 pr-8 rounded-lg border border-[#19140035] text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2264c0]"
                                        />
                                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#706f6c]" />
                                    </div>
                                    <div className="space-y-2">
                                        {filteredMereks.map((merek) => (
                                            <label key={merek} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMerek.includes(merek)}
                                                    onChange={() => toggleFilter(selectedMerek, setSelectedMerek, merek)}
                                                    className="w-4 h-4 rounded border-[#19140035] text-[#2264c0] focus:ring-[#2264c0] cursor-pointer"
                                                />
                                                <span className="text-sm text-[#1b1b18] group-hover:text-[#2264c0] transition-colors">{merek}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Jenis Kelamin */}
                                <div>
                                    <h4 className="text-sm font-semibold text-[#1b1b18] mb-3">Jenis Kelamin</h4>
                                    <div className="space-y-2">
                                        {jenisKelamins.map((jk) => (
                                            <label key={jk} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedJenisKelamin.includes(jk)}
                                                    onChange={() => toggleFilter(selectedJenisKelamin, setSelectedJenisKelamin, jk)}
                                                    className="w-4 h-4 rounded border-[#19140035] text-[#2264c0] focus:ring-[#2264c0] cursor-pointer"
                                                />
                                                <span className="text-sm text-[#1b1b18] group-hover:text-[#2264c0] transition-colors">{jk}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Warna */}
                                <div>
                                    <h4 className="text-sm font-semibold text-[#1b1b18] mb-3">Warna</h4>
                                    <div className="space-y-2">
                                        {warnas.map((warna) => (
                                            <label key={warna} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedWarna.includes(warna)}
                                                    onChange={() => toggleFilter(selectedWarna, setSelectedWarna, warna)}
                                                    className="w-4 h-4 rounded border-[#19140035] text-[#2264c0] focus:ring-[#2264c0] cursor-pointer"
                                                />
                                                <span className="text-sm text-[#1b1b18] group-hover:text-[#2264c0] transition-colors">{warna}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Material */}
                                <div>
                                    <h4 className="text-sm font-semibold text-[#1b1b18] mb-3">Material</h4>
                                    <div className="space-y-2">
                                        {materials.map((material) => (
                                            <label key={material} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMaterial.includes(material)}
                                                    onChange={() => toggleFilter(selectedMaterial, setSelectedMaterial, material)}
                                                    className="w-4 h-4 rounded border-[#19140035] text-[#2264c0] focus:ring-[#2264c0] cursor-pointer"
                                                />
                                                <span className="text-sm text-[#1b1b18] group-hover:text-[#2264c0] transition-colors">{material}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Bentuk */}
                                <div>
                                    <h4 className="text-sm font-semibold text-[#1b1b18] mb-3">Bentuk</h4>
                                    <div className="space-y-2">
                                        {bentuks.map((bentuk) => (
                                            <label key={bentuk} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedBentuk.includes(bentuk)}
                                                    onChange={() => toggleFilter(selectedBentuk, setSelectedBentuk, bentuk)}
                                                    className="w-4 h-4 rounded border-[#19140035] text-[#2264c0] focus:ring-[#2264c0] cursor-pointer"
                                                />
                                                <span className="text-sm text-[#1b1b18] group-hover:text-[#2264c0] transition-colors">{bentuk}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Harga */}
                                <div>
                                    <h4 className="text-sm font-semibold text-[#1b1b18] mb-3">Harga</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Min"
                                                value={displayMinHarga}
                                                onChange={(e) => {
                                                    const raw = parseFormattedNumber(e.target.value);
                                                    setMinHarga(raw);
                                                    setDisplayMinHarga(formatNumber(raw));
                                                    if (maxHarga && raw && Number(raw) > Number(maxHarga)) {
                                                        setHargaError('Harga minimum tidak boleh lebih besar dari harga maksimum');
                                                    } else {
                                                        setHargaError('');
                                                    }
                                                }}
                                                className={`w-full h-9 px-3 rounded-lg border text-sm placeholder:text-[#9CA3AF] focus:outline-none ${hargaError ? 'border-red-500 focus:border-red-500' : 'border-[#19140035] focus:border-[#2264c0]'}`}
                                            />
                                        </div>
                                        <span className="text-sm text-[#5f6368]">-</span>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Max"
                                                value={displayMaxHarga}
                                                onChange={(e) => {
                                                    const raw = parseFormattedNumber(e.target.value);
                                                    setMaxHarga(raw);
                                                    setDisplayMaxHarga(formatNumber(raw));
                                                    if (minHarga && raw && Number(raw) < Number(minHarga)) {
                                                        setHargaError('Harga maksimum tidak boleh lebih kecil dari harga minimum');
                                                    } else {
                                                        setHargaError('');
                                                    }
                                                }}
                                                className={`w-full h-9 px-3 rounded-lg border text-sm placeholder:text-[#9CA3AF] focus:outline-none ${hargaError ? 'border-red-500 focus:border-red-500' : 'border-[#19140035] focus:border-[#2264c0]'}`}
                                            />
                                        </div>
                                    </div>
                                    {hargaError && (
                                        <p className="text-xs text-red-500 mt-2">{hargaError}</p>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="sticky bottom-0 bg-white border-t border-[#19140035] p-4 flex gap-3">
                                <button
                                    onClick={clearFilters}
                                    className="flex-1 py-2 text-sm font-medium text-[#1b1b18] border border-[#19140035] rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Hapus Filter
                                </button>
                                <button
                                    onClick={() => {
                                        setBackdropClosing(true);
                                        setFilterClosing(true);
                                        setTimeout(() => {
                                            setShowFilter(false);
                                            setFilterClosing(false);
                                            setBackdropClosing(false);
                                        }, 300);
                                    }}
                                    className="flex-1 py-2 text-sm font-medium bg-[#2264c0] text-white rounded-lg hover:bg-[#1a4f9a] transition-colors"
                                >
                                    Tampilkan {filteredProduk?.length || 0}
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* Product Grid Section */}
                <section>
                    <div className="flex flex-wrap">
                        {filteredProduk?.map((item: any, index: number) => (
                            <div key={index} className="w-1/4 shrink-0 grid-row-item">
                                <div className="grid-box">
                                    <div className="grid-box-content">
                                        <img
                                            className="grid-box-image"
                                            src={`/images/produk/${item.gambar}`}
                                            alt={item.nama_produk}
                                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
                                        />
                                        <div className="grid-box-overlay">
                                            <div className="grid-box-overlay-bottom">
                                                <div className="grid-box-left">
                                                    <div className="grid-box-merek">{item.merek}</div>
                                                    <div className="grid-box-tipe">{item.tipe_produk}</div>
                                                </div>
                                                <span className="grid-box-harga">Rp {(Number(item.harga_produk) || 0).toLocaleString('id-ID')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
