import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Bell, BookOpen, Check, LogOut, Minus, Plus, Settings, ShoppingBag, ShoppingCart, Trash2, User } from 'lucide-react';
import { useRef, useState } from 'react';

interface KeranjangItem {
    id: number;
    produk_id: number;
    nama_produk: string;
    merek: string;
    gambar: string;
    harga_produk: number;
    stok: number;
    jumlah: number;
    tipe_pembelian: string;
    jenis_lensa_od: string | null;
    nilai_lensa_od: number | null;
    silinder_od: number | null;
    jenis_lensa_os: string | null;
    nilai_lensa_os: number | null;
    silinder_os: number | null;
    anti_radiasi: boolean;
    photochromic: boolean;
    harga_lensa: number;
    subtotal: number;
}

export default function Keranjang() {
    const { auth, keranjang, total } = usePage().props as any;
    const items: KeranjangItem[] = keranjang || [];

    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const userDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notifDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const notifications: any[] = auth.user?.notifications || [];

    const toggleItem = (id: number) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selectedItems.length === items.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(items.map((item: KeranjangItem) => item.id));
        }
    };

    const selectedTotal = items
        .filter((item: KeranjangItem) => selectedItems.includes(item.id))
        .reduce((sum: number, item: KeranjangItem) => sum + item.subtotal, 0);

    const selectedCount = selectedItems.length;

    function updateJumlah(id: number, jumlah: number) {
        if (jumlah < 1) return;
        router.patch(`/keranjang/${id}`, { jumlah }, { preserveScroll: true });
    }

    function hapusItem(id: number) {
        router.delete(`/keranjang/${id}`, { preserveScroll: true });
    }

    function checkoutSelected() {
        if (selectedItems.length === 0) return;
        const ids = selectedItems.join(',');
        router.visit(`/checkout?items=${ids}`);
    }

    return (
        <>
            <Head title="Keranjang - EyeLit" />
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
                                    {items.length > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#2264c0] text-white text-xs font-bold rounded-full flex items-center justify-center">
                                            {items.length}
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
                        <span className="text-[#1b1b18] font-medium">Keranjang</span>
                    </div>
                </div>

                {/* Konten */}
                <main className="mx-auto max-w-7xl px-4 pb-16">
                    <Link href="/katalog" className="inline-flex items-center gap-2 text-sm text-[#5f6368] hover:text-[#2264c0] transition-colors mb-6">
                        <ArrowLeft className="size-4" />
                        Lanjut Belanja
                    </Link>

                    <h1 className="text-2xl font-bold text-[#1b1b18] mb-6">Keranjang Belanja</h1>

                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 text-[#5f6368]">
                            <ShoppingCart className="size-16 text-gray-300" />
                            <p className="text-lg font-medium">Keranjangmu masih kosong</p>
                            <Link href="/katalog" className="px-6 py-2 bg-[#2264c0] text-white rounded-full text-sm font-semibold hover:bg-[#1a4f9a] transition-colors">
                                Mulai Belanja
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Daftar Item */}
                            <div className="lg:col-span-2 flex flex-col gap-4">
                                {/* Select All Header */}
                                <div className="bg-white rounded-xl border border-[#19140035] p-4 flex items-center justify-between">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <div
                                            onClick={toggleAll}
                                            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                                                selectedItems.length === items.length
                                                    ? 'bg-[#2264c0] border-[#2264c0]'
                                                    : 'border-[#19140035] hover:border-[#2264c0]'
                                            }`}
                                        >
                                            {selectedItems.length === items.length && items.length > 0 && (
                                                <Check className="size-4 text-white" />
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-[#1b1b18]">Pilih Semua</span>
                                    </label>
                                    <span className="text-sm text-[#5f6368]">{selectedCount} item dipilih</span>
                                </div>

                                {/* Item Cards */}
                                {items.map((item: KeranjangItem) => {
                                    const isSelected = selectedItems.includes(item.id);
                                    return (
                                        <div
                                            key={item.id}
                                            className={`bg-white rounded-xl border-2 p-4 flex gap-4 transition-all ${
                                                isSelected
                                                    ? 'border-[#2264c0] shadow-md'
                                                    : 'border-[#19140035]'
                                            }`}
                                        >
                                            {/* Checkbox */}
                                            <div className="flex items-start pt-1">
                                                <div
                                                    onClick={() => toggleItem(item.id)}
                                                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all ${
                                                        isSelected
                                                            ? 'bg-[#2264c0] border-[#2264c0]'
                                                            : 'border-[#19140035] hover:border-[#2264c0]'
                                                    }`}
                                                >
                                                    {isSelected && (
                                                        <Check className="size-4 text-white" />
                                                    )}
                                                </div>
                                            </div>

                                            <Link href={`/produk/${item.produk_id}`} className="flex-shrink-0">
                                                <img
                                                    src={`/images/produk/${item.gambar}`}
                                                    alt={item.nama_produk}
                                                    className="w-24 h-24 object-contain rounded-lg bg-gray-50"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
                                                />
                                            </Link>

                                            <div className="flex-1 flex flex-col gap-2">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <p className="text-xs text-[#2264c0] font-medium">{item.merek}</p>
                                                        <Link href={`/produk/${item.produk_id}`} className="text-sm font-semibold text-[#1b1b18] hover:text-[#2264c0] transition-colors">
                                                            {item.nama_produk}
                                                        </Link>
                                                        <p className="text-xs text-[#5f6368] mt-0.5">{item.tipe_pembelian}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => hapusItem(item.id)}
                                                        className="p-1.5 rounded-full hover:bg-red-50 text-[#5f6368] hover:text-red-500 transition-colors flex-shrink-0"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                </div>

                                                {item.tipe_pembelian === 'Frame + Lensa' && (
                                                    <div className="bg-blue-50 rounded-lg px-3 py-2.5 space-y-1.5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-1">
                                                                <p className="text-xs font-semibold text-[#2264c0] mb-0.5">Mata Kanan (OD)</p>
                                                                <div className="text-xs text-[#1b1b18] space-y-0.5">
                                                                    <p className="font-medium">
                                                                        {item.jenis_lensa_od ? `${item.jenis_lensa_od} ${item.nilai_lensa_od}` : '-'}
                                                                        {item.silinder_od ? <span className="font-medium text-[#5f6368]"> / Silinder {item.silinder_od}</span> : ''}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-xs font-semibold text-[#2264c0] mb-0.5">Mata Kiri (OS)</p>
                                                                <div className="text-xs text-[#1b1b18] space-y-0.5">
                                                                    <p className="font-medium">
                                                                        {item.jenis_lensa_os ? `${item.jenis_lensa_os} ${item.nilai_lensa_os}` : '-'}
                                                                        {item.silinder_os ? <span className="font-medium text-[#1b1b18]"> / Silinder {item.silinder_os}</span> : ''}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {(item.anti_radiasi || item.photochromic) && (
                                                            <div className="pt-1.5 border-t border-[#2264c0]/20">
                                                                <div className="text-xs text-[#5f6368] space-y-0.5">
                                                                    {item.anti_radiasi && <p>+ Anti Radiasi</p>}
                                                                    {item.photochromic && <p>+ Photochromic</p>}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => updateJumlah(item.id, item.jumlah - 1)}
                                                            disabled={item.jumlah <= 1}
                                                            className="w-7 h-7 rounded-full border border-[#19140035] flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            <Minus className="size-3" />
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-semibold">{item.jumlah}</span>
                                                        <button
                                                            onClick={() => updateJumlah(item.id, item.jumlah + 1)}
                                                            disabled={item.jumlah >= item.stok}
                                                            className="w-7 h-7 rounded-full border border-[#19140035] flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            <Plus className="size-3" />
                                                        </button>
                                                    </div>
                                                    <p className={`text-sm font-bold ${isSelected ? 'text-[#2264c0]' : 'text-[#5f6368]'}`}>
                                                        Rp {item.subtotal.toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Ringkasan */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl border border-[#19140035] p-5 sticky top-6">
                                    <h2 className="text-base font-semibold text-[#1b1b18] mb-4">Ringkasan Belanja</h2>

                                    {selectedCount > 0 ? (
                                        <>
                                            <div className="flex flex-col gap-3 text-sm max-h-60 overflow-y-auto">
                                                {items
                                                    .filter((item: KeranjangItem) => selectedItems.includes(item.id))
                                                    .map((item: KeranjangItem) => (
                                                        <div key={item.id} className="flex justify-between text-[#5f6368]">
                                                            <span className="truncate max-w-[160px]">{item.nama_produk} x{item.jumlah}</span>
                                                            <span>Rp {item.subtotal.toLocaleString('id-ID')}</span>
                                                        </div>
                                                    ))}
                                            </div>
                                            <div className="border-t border-[#19140035] mt-3 pt-3 flex justify-between font-bold text-[#1b1b18]">
                                                <span>Total ({selectedCount} item)</span>
                                                <span className="text-[#2264c0]">Rp {selectedTotal.toLocaleString('id-ID')}</span>
                                            </div>
                                            <button
                                                onClick={checkoutSelected}
                                                className="mt-5 w-full py-3 bg-[#2264c0] text-white rounded-full font-semibold text-sm hover:bg-[#1a4f9a] transition-colors"
                                            >
                                                Checkout ({selectedCount} item)
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex flex-col gap-3 text-sm text-[#5f6368] mb-3">
                                                <p className="text-center py-4">Pilih item yang ingin checkout</p>
                                            </div>
                                            <div className="border-t border-[#19140035] pt-3 flex justify-between font-bold text-[#1b1b18]">
                                                <span>Total</span>
                                                <span className="text-[#5f6368]">Rp 0</span>
                                            </div>
                                            <button
                                                disabled
                                                className="mt-5 w-full py-3 bg-gray-200 text-gray-400 rounded-full font-semibold text-sm cursor-not-allowed"
                                            >
                                                Pilih item terlebih dahulu
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
