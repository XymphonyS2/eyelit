import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Bell, BookOpen, Check, Glasses, LogOut, Mail, MapPin, Minus as MinusIcon, Phone, Plus, Search, Settings, ShoppingBag, ShoppingCart, User, X } from 'lucide-react';
import { useEffect, useRef, useState, useMemo } from 'react';
import { toast } from 'sonner';

export default function ProdukDetail() {
    const { auth, produk, lensa } = usePage().props as any;
    const keranjangCount: number = auth.keranjang_count || 0;
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showCartDropdown, setShowCartDropdown] = useState(false);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    // Get all products for search suggestions
    const allProduk: any[] = (usePage().props as any).allProduk || [];
    const [tipePembelian, setTipePembelian] = useState<'Frame Saja' | 'Dengan Lensa'>('Frame Saja');
    const [actionType, setActionType] = useState<'beli' | 'keranjang'>('keranjang');

    // Image gallery state
    const [selectedImage, setSelectedImage] = useState(0);
    const allImages = [
        produk.gambar,
        produk.gambar_2,
        produk.gambar_3,
        produk.gambar_4,
        produk.gambar_5,
    ].filter(Boolean);

    // Lensa states
    const [jenisLensa, setJenisLensa] = useState<'Minus' | 'Plus' | 'Silinder'>('Minus');
    const [nilaiOd, setNilaiOd] = useState('');
    const [nilaiOs, setNilaiOs] = useState('');
    const [silinderOd, setSilinderOd] = useState('');
    const [silinderOs, setSilinderOs] = useState('');
    const [antiRadiasi, setAntiRadiasi] = useState(false);
    const [photochromic, setPhotochromic] = useState(false);

    const userDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cartDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notifDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cartItems: any[] = auth.cartItems || [];
    const notifications: any[] = auth.user?.notifications || [];

    // Detect previous page for back navigation
    const previousPage = typeof window !== 'undefined'
        ? sessionStorage.getItem('previousPage') || '/katalog'
        : '/katalog';
    const backLabel = previousPage === '/keranjang' ? 'Keranjang' : 'Katalog';
    const backHref = previousPage;

    // Search suggestions
    const searchSuggestions = searchQuery.trim()
        ? allProduk.filter((p: any) => p.nama_produk?.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
        : [];

    // Flash notification handler
    const page = usePage();
    const flash = (page.props as any).flash;
    const prevFlash = useRef<string | null>(null);
    useEffect(() => {
        const msg = flash?.success || flash?.error;
        if (msg && msg !== prevFlash.current) {
            prevFlash.current = msg;
            if (flash.success) {
                toast.success(flash.success);
            } else if (flash.error) {
                toast.error(flash.error);
            }
        }
    }, [flash]);

    // Calculate lens price
    const calculateLensPrice = (nilai: string, silinder: string, isSilinder: boolean) => {
        if (!nilai) return { base: 0, silinderBase: 0 };

        const numNilai = parseFloat(nilai);
        const numSilinder = parseFloat(silinder) || 0;

        const matchingLensa = lensa?.find((l: any) =>
            l.jenis_lensa === (isSilinder ? 'Silinder' : jenisLensa) &&
            numNilai >= l.minus_plus_batas_bawah &&
            numNilai <= l.minus_plus_batas_atas
        );

        const silinderLensa = isSilinder ? null : lensa?.find((l: any) =>
            l.jenis_lensa === 'Silinder' &&
            numSilinder >= l.minus_plus_batas_bawah &&
            numSilinder <= l.minus_plus_batas_atas
        );

        return {
            base: matchingLensa?.harga_per_mata || 0,
            silinderBase: silinderLensa?.harga_per_mata || 0,
        };
    };

    const hargaFrame = Number(produk.harga_produk) || 0;
    const odPrice = calculateLensPrice(nilaiOd, silinderOd, jenisLensa === 'Silinder');
    const osPrice = calculateLensPrice(nilaiOs, silinderOs, jenisLensa === 'Silinder');

    const hargaAntiRadiasi = antiRadiasi ? (lensa?.[0]?.harga_anti_radiasi ?? 150000) : 0;
    const hargaPhotochromic = photochromic ? (lensa?.[0]?.harga_photochromic ?? 200000) : 0;

    const totalHarga = useMemo(() => {
        if (tipePembelian === 'Frame Saja') {
            return hargaFrame;
        }
        const lensOd = odPrice.base + odPrice.silinderBase;
        const lensOs = osPrice.base + osPrice.silinderBase;
        return hargaFrame + lensOd + lensOs + hargaAntiRadiasi + hargaPhotochromic;
    }, [tipePembelian, hargaFrame, odPrice, osPrice, hargaAntiRadiasi, hargaPhotochromic]);

    function openOverlay(type: 'beli' | 'keranjang') {
        if (!auth.user) {
            router.visit('/login');
            return;
        }
        setActionType(type);
        setTipePembelian('Frame Saja');
        setNilaiOd('');
        setNilaiOs('');
        setSilinderOd('');
        setSilinderOs('');
        setAntiRadiasi(false);
        setPhotochromic(false);
        setShowOverlay(true);
    }

    function konfirmasi() {
        if (tipePembelian === 'Dengan Lensa' && (!nilaiOd || !nilaiOs)) {
            toast.error('Mohon isi nilai lensa untuk mata kanan (OD) dan mata kiri (OS)');
            return;
        }

        setShowOverlay(false);

        const payload: any = {
            produk_id: produk.id,
            jumlah: 1,
            tipe_pembelian: tipePembelian === 'Frame Saja' ? 'Frame Saja' : 'Frame + Lensa',
        };

        if (tipePembelian === 'Dengan Lensa') {
            payload.jenis_lensa_od = jenisLensa;
            payload.nilai_lensa_od = nilaiOd;
            payload.silinder_od = silinderOd;
            payload.jenis_lensa_os = jenisLensa;
            payload.nilai_lensa_os = nilaiOs;
            payload.silinder_os = silinderOs;
            payload.anti_radiasi = antiRadiasi;
            payload.photochromic = photochromic;
        }

        console.log('Payload sent:', payload);

        if (actionType === 'keranjang') {
            router.post('/keranjang/tambah', payload, {
                preserveScroll: true,
            });
        } else {
            // Beli sekarang - langsung ke checkout
            router.post('/checkout/langsung', payload, {
                preserveScroll: true,
            });
        }
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
                {/* Overlay Modal */}
                {showOverlay && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowOverlay(false)}
                        />

                        {/* Modal */}
                        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-[#19140035] sticky top-0 bg-white z-10">
                                <h2 className="text-lg font-bold text-[#1b1b18]">Pilih Tipe Pembelian</h2>
                                <button
                                    onClick={() => setShowOverlay(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X className="size-5 text-[#5f6368]" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-5">
                                <p className="text-sm text-[#5f6368] mb-4">Pilih tipe pembelian untuk {produk.nama_produk}:</p>

                                {/* Option: Frame Saja */}
                                <button
                                    onClick={() => setTipePembelian('Frame Saja')}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 mb-3 transition-all ${
                                        tipePembelian === 'Frame Saja'
                                            ? 'border-[#2264c0] bg-[#2264c0]/5'
                                            : 'border-[#19140035] hover:border-[#2264c0]/50'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        tipePembelian === 'Frame Saja' ? 'bg-[#2264c0]' : 'bg-gray-100'
                                    }`}>
                                        <Glasses className={`size-5 ${tipePembelian === 'Frame Saja' ? 'text-white' : 'text-[#5f6368]'}`} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-semibold text-[#1b1b18]">Frame Saja</p>
                                        <p className="text-xs text-[#5f6368]">Hanya membeli frame kacamata</p>
                                    </div>
                                    {tipePembelian === 'Frame Saja' && (
                                        <div className="w-6 h-6 rounded-full bg-[#2264c0] flex items-center justify-center">
                                            <Check className="size-4 text-white" />
                                        </div>
                                    )}
                                </button>

                                {/* Option: Dengan Lensa */}
                                <button
                                    onClick={() => setTipePembelian('Dengan Lensa')}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 mb-3 transition-all ${
                                        tipePembelian === 'Dengan Lensa'
                                            ? 'border-[#2264c0] bg-[#2264c0]/5'
                                            : 'border-[#19140035] hover:border-[#2264c0]/50'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        tipePembelian === 'Dengan Lensa' ? 'bg-[#2264c0]' : 'bg-gray-100'
                                    }`}>
                                        <Glasses className={`size-5 ${tipePembelian === 'Dengan Lensa' ? 'text-white' : 'text-[#5f6368]'}`} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-semibold text-[#1b1b18]">Dengan Lensa</p>
                                        <p className="text-xs text-[#5f6368]">Frame + lensa dengan resep dokter (opsional)</p>
                                    </div>
                                    {tipePembelian === 'Dengan Lensa' && (
                                        <div className="w-6 h-6 rounded-full bg-[#2264c0] flex items-center justify-center">
                                            <Check className="size-4 text-white" />
                                        </div>
                                    )}
                                </button>

                                {/* Lensa Options - shown when "Dengan Lensa" selected */}
                                {tipePembelian === 'Dengan Lensa' && (
                                    <div className="mt-4 space-y-4">
                                        {/* Jenis Lensa */}
                                        <div>
                                            <p className="text-sm font-semibold text-[#1b1b18] mb-2">Jenis Lensa</p>
                                            <div className="flex gap-2">
                                                {(['Minus', 'Plus', 'Silinder'] as const).map((jenis) => (
                                                    <button
                                                        key={jenis}
                                                        onClick={() => {
                                                            setJenisLensa(jenis);
                                                            setNilaiOd('');
                                                            setNilaiOs('');
                                                            setSilinderOd('');
                                                            setSilinderOs('');
                                                        }}
                                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border-2 transition-all ${
                                                            jenisLensa === jenis
                                                                ? 'border-[#2264c0] bg-[#2264c0]/5 text-[#2264c0]'
                                                                : 'border-[#19140035] text-[#5f6368] hover:border-[#2264c0]/50'
                                                        }`}
                                                    >
                                                        {jenis}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Input Lensa OD (Mata Kanan) */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-[#19140035]">
                                            <p className="text-sm font-semibold text-[#1b1b18] mb-3">Mata Kanan (OD)</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs text-[#5f6368] mb-1 block">
                                                        {jenisLensa === 'Silinder' ? 'Silinder (CYL)' : 'Sphere'}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.25"
                                                        min="0"
                                                        max="10"
                                                        value={jenisLensa === 'Silinder' ? silinderOd : nilaiOd}
                                                        onChange={(e) => {
                                                            if (jenisLensa === 'Silinder') {
                                                                setSilinderOd(e.target.value);
                                                            } else {
                                                                setNilaiOd(e.target.value);
                                                            }
                                                        }}
                                                        placeholder={jenisLensa === 'Silinder' ? '0.00' : '0.00'}
                                                        className="w-full h-10 px-3 rounded-lg border border-[#19140035] text-sm focus:outline-none focus:border-[#2264c0]"
                                                    />
                                                </div>
                                                {jenisLensa !== 'Silinder' && (
                                                    <div>
                                                        <label className="text-xs text-[#5f6368] mb-1 block">Silinder (CYL)</label>
                                                        <input
                                                            type="number"
                                                            step="0.25"
                                                            min="0"
                                                            max="4"
                                                            value={silinderOd}
                                                            onChange={(e) => setSilinderOd(e.target.value)}
                                                            placeholder="0.00"
                                                            className="w-full h-10 px-3 rounded-lg border border-[#19140035] text-sm focus:outline-none focus:border-[#2264c0]"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Input Lensa OS (Mata Kiri) */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-[#19140035]">
                                            <p className="text-sm font-semibold text-[#1b1b18] mb-3">Mata Kiri (OS)</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs text-[#5f6368] mb-1 block">
                                                        {jenisLensa === 'Silinder' ? 'Silinder (CYL)' : 'Sphere'}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.25"
                                                        min="0"
                                                        max="10"
                                                        value={jenisLensa === 'Silinder' ? silinderOs : nilaiOs}
                                                        onChange={(e) => {
                                                            if (jenisLensa === 'Silinder') {
                                                                setSilinderOs(e.target.value);
                                                            } else {
                                                                setNilaiOs(e.target.value);
                                                            }
                                                        }}
                                                        placeholder={jenisLensa === 'Silinder' ? '0.00' : '0.00'}
                                                        className="w-full h-10 px-3 rounded-lg border border-[#19140035] text-sm focus:outline-none focus:border-[#2264c0]"
                                                    />
                                                </div>
                                                {jenisLensa !== 'Silinder' && (
                                                    <div>
                                                        <label className="text-xs text-[#5f6368] mb-1 block">Silinder (CYL)</label>
                                                        <input
                                                            type="number"
                                                            step="0.25"
                                                            min="0"
                                                            max="4"
                                                            value={silinderOs}
                                                            onChange={(e) => setSilinderOs(e.target.value)}
                                                            placeholder="0.00"
                                                            className="w-full h-10 px-3 rounded-lg border border-[#19140035] text-sm focus:outline-none focus:border-[#2264c0]"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Pilihan Tambahan */}
                                        <div>
                                            <p className="text-sm font-semibold text-[#1b1b18] mb-2">Pilihan Tambahan</p>
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-3 p-3 rounded-lg border border-[#19140035] cursor-pointer hover:bg-gray-50 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={antiRadiasi}
                                                        onChange={(e) => setAntiRadiasi(e.target.checked)}
                                                        className="w-5 h-5 rounded accent-[#2264c0]"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-[#1b1b18]">Anti Radiasi</p>
                                                        <p className="text-xs text-[#5f6368]">Melindungi mata dari radiasi layar</p>
                                                    </div>
                                                    <p className="text-sm font-semibold text-[#2264c0]">
                                                        + Rp {(lensa?.[0]?.harga_anti_radiasi || 150000).toLocaleString('id-ID')}
                                                    </p>
                                                </label>
                                                <label className="flex items-center gap-3 p-3 rounded-lg border border-[#19140035] cursor-pointer hover:bg-gray-50 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={photochromic}
                                                        onChange={(e) => setPhotochromic(e.target.checked)}
                                                        className="w-5 h-5 rounded accent-[#2264c0]"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-[#1b1b18]">Photochromic</p>
                                                        <p className="text-xs text-[#5f6368]">Lensa yang bisa berubah warna saat sinar matahari</p>
                                                    </div>
                                                    <p className="text-sm font-semibold text-[#2264c0]">
                                                        + Rp {(lensa?.[0]?.harga_photochromic || 200000).toLocaleString('id-ID')}
                                                    </p>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Harga Summary */}
                                <div className="mt-5 p-4 bg-[#2264c0]/5 rounded-xl border border-[#2264c0]/20">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-semibold text-[#1b1b18]">Total Harga</p>
                                        <p className="text-2xl font-bold text-[#2264c0]">
                                            Rp {totalHarga.toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    {tipePembelian === 'Dengan Lensa' && (
                                        <p className="text-xs text-[#5f6368] mt-1">
                                            Frame + {jenisLensa} + Silinder + tambahan
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 pb-6 flex gap-3">
                                <button
                                    onClick={() => setShowOverlay(false)}
                                    className="flex-1 py-3 rounded-full border border-[#19140035] text-[#1b1b18] font-semibold text-sm hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={konfirmasi}
                                    className="flex-1 py-3 rounded-full bg-[#2264c0] text-white font-semibold text-sm hover:bg-[#1a4f9a] transition-colors"
                                >
                                    {actionType === 'keranjang' ? 'Tambah ke Keranjang' : 'Beli Sekarang'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    className="w-full h-9 pl-4 pr-12 rounded-full border border-[#19140035] bg-white text-sm text-[#1b1b18] placeholder:text-[#9CA3AF] disabled:bg-transparent appearance-none focus:outline-none outline-none focus:border-[#2264c0] focus:border-[3px] focus:ring-2 focus:ring-[#2264c0] focus:ring-offset-0"
                                />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#706f6c]" />
                                {showSuggestions && searchSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-[#19140035] shadow-lg overflow-hidden z-50">
                                        {searchSuggestions.map((item: any, idx: number) => (
                                            <Link key={idx} href={`/produk/${item.id}`} onClick={() => setShowSuggestions(false)} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                                                <img src={`/images/produk/${item.gambar}`} alt={item.nama_produk} className="w-10 h-10 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-[#1b1b18] truncate">{item.nama_produk}</p>
                                                    <p className="text-xs text-[#706f6c]">{item.merek}</p>
                                                </div>
                                                <span className="text-xs font-bold text-[#2264c0]">Rp {(Number(item.harga_produk) || 0).toLocaleString('id-ID')}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
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
                                                    <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
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
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="dropdown-cart-footer"><Link href="/keranjang">Lihat Keranjang</Link></div>
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
                        <Link href={backHref} className="hover:text-[#2264c0] transition-colors">{backLabel}</Link>
                        <span>/</span>
                        <span className="text-[#1b1b18] font-medium">{produk.nama_produk}</span>
                    </div>
                </div>

                {/* Detail Produk */}
                <main className="mx-auto max-w-7xl px-4 pb-16">
                    <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-[#5f6368] hover:text-[#2264c0] transition-colors mb-6">
                        <ArrowLeft className="size-4" />
                        Kembali ke {backLabel}
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                        {/* Gambar Produk dengan Gallery */}
                        <div className="bg-white rounded-2xl border border-[#19140035] p-6 flex flex-col items-center sticky top-6">
                            {/* Main Image */}
                            <div className="w-full aspect-square flex items-center justify-center overflow-hidden bg-gray-50 rounded-xl mb-4">
                                <img
                                    src={`/images/produk/${allImages[selectedImage]}`}
                                    alt={produk.nama_produk}
                                    className="max-h-[420px] w-full object-contain"
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
                                />
                            </div>

                            {/* Thumbnail Gallery */}
                            {allImages.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2 w-full justify-center">
                                    {allImages.map((img: string, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                selectedImage === index
                                                    ? 'border-[#2264c0] shadow-md'
                                                    : 'border-transparent hover:border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={`/images/produk/${img}`}
                                                alt={`${produk.nama_produk} - ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
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

                            {/* Tombol aksi */}
                            <div className="flex gap-4">
                                <button
                                    disabled={produk.stok === 0}
                                    onClick={() => openOverlay('beli')}
                                    className="flex-1 py-4 rounded-full bg-[#2264c0] text-white font-semibold text-base hover:bg-[#1a4f9a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#2264c0]/20"
                                >
                                    Beli Sekarang
                                </button>
                                <button
                                    disabled={produk.stok === 0}
                                    onClick={() => openOverlay('keranjang')}
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
