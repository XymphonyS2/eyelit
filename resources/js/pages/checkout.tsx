import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { ArrowLeft, Bell, BookOpen, LogOut, MapPin, Plus, Settings, ShoppingBag, ShoppingCart, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// 🔥 safe helper — aman untuk nilai null/undefined
const safe = (v: any) => (v ?? "").toString().trim();

interface Item {
    id: number;
    produk_id: number;
    nama_produk: string;
    merek: string;
    gambar: string;
    harga_produk: number;
    jumlah: number;
    tipe_pembelian: string;
    harga_lensa: number;
    subtotal: number;
}

interface Alamat {
    id: number;
    nama_penerima: string;
    no_hp_penerima: string;
    kota_kabupaten: string;
    kecamatan: string;
    kode_pos: string;
    alamat_lengkap: string;
    alamat_utama: boolean;
    provinsi: { id: number; nama_provinsi: string; ongkir?: { harga: number; estimasi_hari_min: string; estimasi_hari_max: string } };
}

interface Provinsi {
    id: number;
    nama_provinsi: string;
    ongkir?: { harga: number; estimasi_hari_min: string; estimasi_hari_max: string };
}

interface Ekspedisi {
    id: number;
    nama_ekspedisi: string;
    kode: string;
}

export default function Checkout() {
    const { auth, items, total, alamat, provinsi, ekspedisi } = usePage().props as any;
    const keranjangCount: number = auth.keranjang_count || 0;

    const page = usePage();
    const flash = (page.props as any).flash;
    const prevFlash = useRef<string | null>(null);
    useEffect(() => {
        const msg = flash?.success || flash?.error;
        if (msg && msg !== prevFlash.current) {
            prevFlash.current = msg;
            if (flash.success) toast.success(flash.success);
            else if (flash.error) toast.error(flash.error);
        }
    }, [flash]);

    // 🔥 PERBAIKAN: guard array props agar tidak crash saat undefined
    const alamatList: Alamat[]   = Array.isArray(alamat)    ? alamat    : [];
    const ekspedisiList: Ekspedisi[] = Array.isArray(ekspedisi) ? ekspedisi : [];
    const itemList: Item[]       = Array.isArray(items)     ? items     : [];
    const provinsiList: Provinsi[] = Array.isArray(provinsi) ? provinsi : [];
    const totalHarga: number     = Number(total ?? 0);

    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [showTambahAlamat, setShowTambahAlamat] = useState(false);

    const userDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notifDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notifications: any[] = auth.user?.notifications || [];

    // 🔥 PERBAIKAN: guard find/[0] dengan fallback null
    const [selectedAlamat, setSelectedAlamat] = useState<Alamat | null>(
        alamatList.find((a) => a.alamat_utama) || alamatList[0] || null
    );
    const [selectedEkspedisi, setSelectedEkspedisi] = useState<Ekspedisi | null>(
        ekspedisiList[0] || null
    );
    const [metodePembayaran, setMetodePembayaran] = useState<string>('QRIS');

    // Kota states (plain text — no master kota table in DB)
    const [kotaError, setKotaError] = useState<string | null>(null);

    const [ongkirMap, setOngkirMap] = useState<Record<number, { harga: number; estimasi_hari_min: string; estimasi_hari_max: string }>>({});
    const [loadingOngkir, setLoadingOngkir] = useState(false);
    const ongkirInfo = selectedEkspedisi ? (ongkirMap[selectedEkspedisi.id] ?? null) : null;
    const ongkir = Number(ongkirInfo?.harga ?? 0);
    const estimasi = ongkirInfo
        ? `${ongkirInfo.estimasi_hari_min}–${ongkirInfo.estimasi_hari_max} hari`
        : '-';
    const grandTotal = totalHarga + ongkir;

    useEffect(() => {
        if (!selectedAlamat) {
            setOngkirMap({});
            return;
        }
        setLoadingOngkir(true);
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        Promise.all(
            ekspedisiList.map((e) =>
                fetch('/checkout/ongkir', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ alamat_id: selectedAlamat.id, ekspedisi_id: e.id }),
                })
                .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
                .then(data => ({ id: e.id, data }))
                .catch(() => ({ id: e.id, data: { harga: 0, estimasi_hari_min: '1', estimasi_hari_max: '3' } }))
            )
        ).then(results => {
            const map: Record<number, { harga: number; estimasi_hari_min: string; estimasi_hari_max: string }> = {};
            results.forEach(({ id, data }) => { map[id] = data; });
            setOngkirMap(map);
        }).finally(() => setLoadingOngkir(false));
    }, [selectedAlamat?.id]);

    const alamatForm = useForm({
        nama_penerima: '',
        no_hp_penerima: '',
        provinsi_id: '',
        kode_kota: '',
        nama_kota: '',
        kota_kabupaten: '',
        kecamatan: '',
        kode_pos: '',
        alamat_lengkap: '',
    });

    function submitAlamat(e: React.FormEvent) {
        e.preventDefault();
        alamatForm.post('/checkout/alamat', {
            preserveScroll: true,
            onSuccess: () => {
                setShowTambahAlamat(false);
                alamatForm.reset();
            },
        });
    }

    function submitCheckout() {
        if (!selectedAlamat || !selectedEkspedisi) return;
        const itemIds = itemList.map((item: Item) => item.id).join(',');
        router.post('/checkout', {
            alamat_id: selectedAlamat.id,
            ekspedisi_id: selectedEkspedisi.id,
            metode_pembayaran: metodePembayaran,
            items: itemIds,
        });
    }

    return (
        <>
            <Head title="Checkout - EyeLit" />
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
                                        <button className="p-2 rounded-full hover:bg-gray-100"><User className="size-5 text-[#1b1b18]" /></button>
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
                        </div>
                    </div>
                </nav>

                {/* Breadcrumb */}
                <div className="mx-auto max-w-7xl px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#5f6368]">
                        <Link href="/" className="hover:text-[#2264c0] transition-colors">Beranda</Link>
                        <span>/</span>
                        <Link href="/keranjang" className="hover:text-[#2264c0] transition-colors">Keranjang</Link>
                        <span>/</span>
                        <span className="text-[#1b1b18] font-medium">Checkout</span>
                    </div>
                </div>

                <main className="mx-auto max-w-7xl px-4 pb-16">
                    <Link href="/keranjang" className="inline-flex items-center gap-2 text-sm text-[#5f6368] hover:text-[#2264c0] transition-colors mb-6">
                        <ArrowLeft className="size-4" />
                        Kembali ke Keranjang
                    </Link>

                    <h1 className="text-2xl font-bold text-[#1b1b18] mb-6">Checkout</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Kiri: Alamat + Ekspedisi + Pembayaran */}
                        <div className="lg:col-span-2 flex flex-col gap-5">

                            {/* Alamat Pengiriman */}
                            <div className="bg-white rounded-xl border border-[#19140035] overflow-hidden">
                                <div className="flex items-center justify-between px-5 py-4 border-b border-[#19140035]">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="size-4 text-[#2264c0]" />
                                        <h2 className="text-sm font-semibold text-[#1b1b18]">Alamat Pengiriman</h2>
                                    </div>
                                    <button
                                        onClick={() => setShowTambahAlamat(true)}
                                        className="flex items-center gap-1 text-xs text-[#2264c0] hover:underline"
                                    >
                                        <Plus className="size-3" /> Tambah Alamat
                                    </button>
                                </div>

                                {alamatList.length === 0 ? (
                                    <div className="px-5 py-8 text-center text-sm text-[#5f6368]">
                                        Belum ada alamat. Tambahkan alamat pengiriman terlebih dahulu.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-[#19140035]">
                                        {alamatList.map((a) => (
                                            <label key={a.id} className="flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                                                <input
                                                    type="radio"
                                                    name="alamat"
                                                    checked={selectedAlamat?.id === a.id}
                                                    onChange={() => setSelectedAlamat(a)}
                                                    className="mt-1 accent-[#2264c0]"
                                                />
                                                <div className="flex-1 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        {/* 🔥 PERBAIKAN: safe() untuk nama & no hp penerima */}
                                                        <span className="font-semibold text-[#1b1b18]">{safe(a.nama_penerima)}</span>
                                                        <span className="text-[#5f6368]">{safe(a.no_hp_penerima)}</span>
                                                        {a.alamat_utama && (
                                                            <span className="px-2 py-0.5 bg-blue-50 text-[#2264c0] text-xs rounded-full font-medium">Utama</span>
                                                        )}
                                                    </div>
                                                    {/* 🔥 PERBAIKAN: safe() untuk semua field alamat */}
                                                    <p className="text-[#5f6368] mt-0.5">
                                                        {safe(a.alamat_lengkap)}, {safe(a.kecamatan)}, {safe(a.kota_kabupaten)}, {safe(a.provinsi?.nama_provinsi)}, {safe(a.kode_pos)}
                                                    </p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Ekspedisi */}
                            <div className="bg-white rounded-xl border border-[#19140035] overflow-hidden">
                                <div className="px-5 py-4 border-b border-[#19140035]">
                                    <h2 className="text-sm font-semibold text-[#1b1b18]">Ekspedisi</h2>
                                    {!selectedAlamat && (
                                        <p className="text-xs text-[#5f6368] mt-1">Pilih alamat terlebih dahulu untuk melihat ongkos kirim</p>
                                    )}
                                </div>
                                <div className="divide-y divide-[#19140035]">
                                    {ekspedisiList.map((e) => {
                                        const info = ongkirMap[e.id] ?? null;
                                        return (
                                            <label
                                                key={e.id}
                                                className={`flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors ${
                                                    selectedEkspedisi?.id === e.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="ekspedisi"
                                                    checked={selectedEkspedisi?.id === e.id}
                                                    onChange={() => setSelectedEkspedisi(e)}
                                                    className="accent-[#2264c0]"
                                                />
                                                <div className="flex-1 flex items-center justify-between text-sm">
                                                    {/* 🔥 PERBAIKAN: safe() untuk nama ekspedisi */}
                                                    <span className="font-medium text-[#1b1b18]">{safe(e.nama_ekspedisi)}</span>
                                                    <div className="text-right">
                                                        {!selectedAlamat ? (
                                                            <span className="text-[#9ca3af] text-xs">Pilih alamat dulu</span>
                                                        ) : loadingOngkir ? (
                                                            <span className="text-[#9ca3af] text-xs">Menghitung...</span>
                                                        ) : info && info.harga > 0 ? (
                                                            <>
                                                                <span className="font-semibold text-[#2264c0]">Rp {Number(info.harga).toLocaleString('id-ID')}</span>
                                                                <span className="text-[#5f6368] text-xs ml-2">{safe(info.estimasi_hari_min)}–{safe(info.estimasi_hari_max)} hari</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-[#9ca3af] text-xs">Tidak tersedia</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Metode Pembayaran */}
                            <div className="bg-white rounded-xl border border-[#19140035] overflow-hidden">
                                <div className="px-5 py-4 border-b border-[#19140035]">
                                    <h2 className="text-sm font-semibold text-[#1b1b18]">Metode Pembayaran</h2>
                                </div>
                                <div className="divide-y divide-[#19140035]">
                                    {['QRIS'].map((m) => (
                                        <label key={m} className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                                            <input
                                                type="radio"
                                                name="pembayaran"
                                                checked={metodePembayaran === m}
                                                onChange={() => setMetodePembayaran(m)}
                                                className="accent-[#2264c0]"
                                            />
                                            <span className="text-sm font-medium text-[#1b1b18]">{m}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Kanan: Ringkasan */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl border border-[#19140035] p-5 sticky top-6">
                                <h2 className="text-base font-semibold text-[#1b1b18] mb-4">Ringkasan Pesanan</h2>

                                <div className="flex flex-col gap-2 text-sm mb-4">
                                    {itemList.map((item) => (
                                        <div key={item.id} className="flex gap-3 items-center">
                                            {/* 🔥 PERBAIKAN: fallback gambar + safe() untuk nama */}
                                            <img
                                                src={item.gambar ? `/images/produk/${item.gambar}` : '/images/placeholder.png'}
                                                alt={safe(item.nama_produk)}
                                                className="w-10 h-10 object-contain rounded bg-gray-50 flex-shrink-0"
                                                onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                {/* 🔥 PERBAIKAN: safe() untuk nama_produk & tipe_pembelian */}
                                                <p className="truncate font-medium text-[#1b1b18]">{safe(item.nama_produk)}</p>
                                                <p className="text-[#5f6368] text-xs">×{item.jumlah ?? 0} · {safe(item.tipe_pembelian)}</p>
                                            </div>
                                            {/* 🔥 PERBAIKAN: ?? 0 untuk subtotal */}
                                            <span className="text-[#1b1b18] font-medium flex-shrink-0">Rp {Number(item.subtotal ?? 0).toLocaleString('id-ID')}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-[#19140035] pt-3 flex flex-col gap-2 text-sm">
                                    <div className="flex justify-between text-[#5f6368]">
                                        <span>Subtotal Produk</span>
                                        <span>Rp {totalHarga.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-[#5f6368]">
                                        <span>Ongkos Kirim</span>
                                        <span>{ongkir > 0 ? `Rp ${ongkir.toLocaleString('id-ID')}` : '-'}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-[#1b1b18] pt-2 border-t border-[#19140035]">
                                        <span>Total</span>
                                        <span className="text-[#2264c0]">Rp {grandTotal.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={submitCheckout}
                                    disabled={!selectedAlamat || !selectedEkspedisi}
                                    className="mt-5 w-full py-3 bg-[#2264c0] text-white rounded-full font-semibold text-sm hover:bg-[#1a4f9a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Buat Pesanan
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal Tambah Alamat */}
            {showTambahAlamat && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#19140035]">
                            <h3 className="text-base font-semibold text-[#1b1b18]">Tambah Alamat Baru</h3>
                            <button onClick={() => setShowTambahAlamat(false)} className="p-1 rounded-full hover:bg-gray-100">
                                <X className="size-5 text-[#5f6368]" />
                            </button>
                        </div>
                        <form onSubmit={submitAlamat} className="px-6 py-5 flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-[#5f6368]">Nama Penerima</label>
                                    <input
                                        type="text"
                                        value={alamatForm.data.nama_penerima}
                                        onChange={(e) => alamatForm.setData('nama_penerima', e.target.value)}
                                        className="h-9 px-3 rounded-lg border border-[#19140035] text-sm focus:outline-none focus:border-[#2264c0]"
                                        placeholder="Nama lengkap"
                                    />
                                    {alamatForm.errors.nama_penerima && <p className="text-xs text-red-500">{alamatForm.errors.nama_penerima}</p>}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-[#5f6368]">No. HP</label>
                                    <input
                                        type="text"
                                        value={alamatForm.data.no_hp_penerima}
                                        onChange={(e) => alamatForm.setData('no_hp_penerima', e.target.value)}
                                        className="h-9 px-3 rounded-lg border border-[#19140035] text-sm focus:outline-none focus:border-[#2264c0]"
                                        placeholder="08xxxxxxxxxx"
                                    />
                                    {alamatForm.errors.no_hp_penerima && <p className="text-xs text-red-500">{alamatForm.errors.no_hp_penerima}</p>}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-[#5f6368]">Provinsi</label>
                                <select
                                    value={alamatForm.data.provinsi_id}
                                    onChange={(e) => {
                                        alamatForm.setData('provinsi_id', e.target.value);
                                        alamatForm.setData('kode_kota', '');
                                        alamatForm.setData('nama_kota', '');
                                    }}
                                    className="h-9 px-3 rounded-lg border border-[#19140035] text-sm focus:outline-none focus:border-[#2264c0] bg-white"
                                >
                                    <option value="">Pilih Provinsi</option>
                                    {/* 🔥 PERBAIKAN: provinsiList sudah di-guard atas */}
                                    {provinsiList.map((p) => (
                                        <option key={p.id} value={p.id}>{safe(p.nama_provinsi)}</option>
                                    ))}
                                </select>
                                {alamatForm.errors.provinsi_id && <p className="text-xs text-red-500">{alamatForm.errors.provinsi_id}</p>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-[#5f6368]">Kota / Kabupaten</label>
                                <input
                                    type="text"
                                    value={alamatForm.data.kota_kabupaten}
                                    onChange={(e) => {
                                        alamatForm.setData('kota_kabupaten', e.target.value);
                                        alamatForm.setData('nama_kota', e.target.value);
                                        alamatForm.setData('kode_kota', '');
                                    }}
                                    className="h-9 px-3 rounded-lg border border-[#19140035] text-sm focus:outline-none focus:border-[#2264c0]"
                                    placeholder="Contoh: Kota Jakarta Selatan"
                                />
                                {alamatForm.errors.kota_kabupaten && <p className="text-xs text-red-500">{alamatForm.errors.kota_kabupaten}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-[#5f6368]">Kecamatan</label>
                                    <input
                                        type="text"
                                        value={alamatForm.data.kecamatan}
                                        onChange={(e) => alamatForm.setData('kecamatan', e.target.value)}
                                        className="h-9 px-3 rounded-lg border border-[#19140035] text-sm focus:outline-none focus:border-[#2264c0]"
                                    />
                                    {alamatForm.errors.kecamatan && <p className="text-xs text-red-500">{alamatForm.errors.kecamatan}</p>}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-[#5f6368]">Kode Pos</label>
                                    <input
                                        type="text"
                                        value={alamatForm.data.kode_pos}
                                        onChange={(e) => alamatForm.setData('kode_pos', e.target.value)}
                                        className="h-9 px-3 rounded-lg border border-[#19140035] text-sm focus:outline-none focus:border-[#2264c0]"
                                        placeholder="12345"
                                    />
                                    {alamatForm.errors.kode_pos && <p className="text-xs text-red-500">{alamatForm.errors.kode_pos}</p>}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-[#5f6368]">Alamat Lengkap</label>
                                <textarea
                                    value={alamatForm.data.alamat_lengkap}
                                    onChange={(e) => alamatForm.setData('alamat_lengkap', e.target.value)}
                                    rows={3}
                                    className="px-3 py-2 rounded-lg border border-[#19140035] text-sm focus:outline-none focus:border-[#2264c0] resize-none"
                                    placeholder="Nama jalan, nomor rumah, RT/RW, dll."
                                />
                                {alamatForm.errors.alamat_lengkap && <p className="text-xs text-red-500">{alamatForm.errors.alamat_lengkap}</p>}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowTambahAlamat(false)}
                                    className="flex-1 py-2.5 rounded-full border border-[#19140035] text-sm font-medium text-[#5f6368] hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={alamatForm.processing}
                                    className="flex-1 py-2.5 rounded-full bg-[#2264c0] text-white text-sm font-semibold hover:bg-[#1a4f9a] transition-colors disabled:opacity-50"
                                >
                                    Simpan Alamat
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
