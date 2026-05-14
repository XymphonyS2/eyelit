import { Head, Link, usePage } from '@inertiajs/react';
import { Bell, BookOpen, Copy, CreditCard, LogOut, MapPin, Package, Settings, ShoppingBag, ShoppingCart, Truck, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useRef, useState } from 'react';

const METODE_INFO: Record<string, { label: string; desc: string; icon: string }> = {
    QRIS: {
        label: 'QRIS',
        desc: 'Scan QR dari aplikasi e-wallet & mobile banking',
        icon: '/images/metodepem/qris.png',
    },
    BCA: {
        label: 'Bank Central Asia',
        desc: 'Transfer via BCA Virtual Account',
        icon: '/images/metodepem/bca.png',
    },
    BNI: {
        label: 'Bank Negara Indonesia',
        desc: 'Transfer via BNI Virtual Account',
        icon: '/images/metodepem/bni.png',
    },
};

const safe = (v: any) => (v ?? '').toString().trim();

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    function copy() {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    }
    return (
        <button
            onClick={copy}
            className="flex items-center gap-1 text-xs text-[#2264c0] hover:text-[#1a4f9a] transition-colors font-medium"
        >
            <Copy className="size-3.5" />
            {copied ? 'Tersalin!' : 'Salin'}
        </button>
    );
}

export default function Pembayaran() {
    const { auth, midtrans, pesanan, pembayaran, subtotal_produk, grand_total } = usePage().props as any;
    const keranjangCount: number = auth.keranjang_count || 0;

    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);

    // Transaction state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transactionReady, setTransactionReady] = useState(!!pembayaran?.no_va_bca || !!pembayaran?.kode_qris);
    const [vaNumber, setVaNumber] = useState<string>(pembayaran?.no_va_bca || '');
    const [qrisUrl, setQrisUrl] = useState<string>(pembayaran?.kode_qris || '');
    const [orderIdDisplay, setOrderIdDisplay] = useState<string>(pembayaran?.order_id || '');
    const metode = pesanan.metode_pembayaran || 'QRIS';

    const userDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notifDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notifications: any[] = Array.isArray(auth?.notifications) ? auth.notifications : [];

    // Generate QRIS image URL from Snap (Midtrans)
    function getQrisImageUrl(url: string) {
        // Midtrans QRIS URL is a redirect URL, for display we use the URL directly
        return url;
    }

    async function handleBayar() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/pembayaran/${pesanan.id}/bayar`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            let data;
            try {
                data = await res.json();
            } catch {
                // Response bukan JSON — berarti HTML error page
                setError(`Server error (HTTP ${res.status}). Cek logs atau coba lagi.`);
                setLoading(false);
                return;
            }

            if (res.ok && data.ok) {
                if (metode === 'QRIS') {
                    setQrisUrl(data.qr_url || '');
                } else {
                    setVaNumber(data.va_number || '');
                }
                setOrderIdDisplay(data.order_id || '');
                setTransactionReady(true);
            } else {
                setError(data.message || `Gagal (HTTP ${res.status})`);
            }
        } catch (e: any) {
            setError(e?.message || 'Terjadi kesalahan koneksi.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Head title={`Pembayaran ${safe(pesanan.no_pesanan)} - EyeLit`} />
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
                                            {notifications.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
                                        </button>
                                        {showNotifDropdown && (
                                            <div className="dropdown-menu show" style={{ top: '64px', right: '24px' }}>
                                                <div className="dropdown-header"><span className="text-sm font-semibold text-[#202124]">Notifikasi</span></div>
                                                {notifications.length === 0 ? (
                                                    <div className="dropdown-notif-empty"><Bell className="size-10" /><p>Tidak ada notifikasi</p></div>
                                                ) : (
                                                    <div className="max-h-80 overflow-y-auto">
                                                        {notifications.map((notif: any, index: number) => (
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
                                                {notifications.length > 0 && (
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
                        </div>
                    </div>
                </nav>

                {/* Breadcrumb */}
                <div className="mx-auto max-w-7xl px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#5f6368]">
                        <Link href="/" className="hover:text-[#2264c0] transition-colors">Beranda</Link>
                        <span>/</span>
                        <Link href="/pesanan" className="hover:text-[#2264c0] transition-colors">Pesanan Saya</Link>
                        <span>/</span>
                        <Link href={`/pesanan/${pesanan.id}`} className="hover:text-[#2264c0] transition-colors">{safe(pesanan.no_pesanan)}</Link>
                        <span>/</span>
                        <span className="text-[#1b1b18] font-medium">Pembayaran</span>
                    </div>
                </div>

                <main className="mx-auto max-w-7xl px-4 pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                        {/* Kiri */}
                        <div className="lg:col-span-2 flex flex-col gap-5">

                            {/* Instruksi Pembayaran */}
                            <div className="bg-white rounded-xl border border-[#19140035] overflow-hidden">
                                <div className="flex items-center gap-2 px-5 py-4 border-b border-[#19140035]">
                                    <CreditCard className="size-4 text-[#2264c0]" />
                                    <h2 className="text-sm font-semibold text-[#1b1b18]">Instruksi Pembayaran</h2>
                                </div>

                                {/* Metode aktif */}
                                <div className="px-5 py-4 bg-[#f0f4ff] border-b border-[#19140035]">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={METODE_INFO[metode]?.icon}
                                            alt={METODE_INFO[metode]?.label}
                                            className="w-10 h-10 object-contain rounded-lg flex-shrink-0"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                        <div>
                                            <p className="text-sm font-semibold text-[#1b1b18]">{METODE_INFO[metode]?.label}</p>
                                            <p className="text-xs text-[#5f6368]">{METODE_INFO[metode]?.desc}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* ====== BELUM ADA TRANSACTION ====== */}
                                {!transactionReady && (
                                    <div className="p-8 flex flex-col items-center text-center gap-4">
                                        <div className="w-16 h-16 bg-[#f0f4ff] rounded-full flex items-center justify-center">
                                            <CreditCard className="size-8 text-[#2264c0]" />
                                        </div>
                                        <div>
                                            <p className="text-base font-semibold text-[#1b1b18]">Siap melakukan pembayaran?</p>
                                            <p className="text-sm text-[#5f6368] mt-1">
                                                Klik tombol di bawah untuk mendapatkan{' '}
                                                {metode === 'QRIS' ? 'QR code pembayaran' : 'nomor Virtual Account'} dari Midtrans.
                                            </p>
                                        </div>
                                        {error && (
                                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-lg">
                                                <AlertCircle className="size-4 flex-shrink-0" />
                                                {error}
                                            </div>
                                        )}
                                        <button
                                            onClick={handleBayar}
                                            disabled={loading}
                                            className="mt-2 px-8 py-3 bg-[#2264c0] text-white rounded-full font-semibold text-sm hover:bg-[#1a4f9a] transition-colors disabled:opacity-60"
                                        >
                                            {loading ? 'Membuat transaksi...' : `Dapatkan ${metode === 'QRIS' ? 'QR Code' : 'Virtual Account'}`}
                                        </button>
                                    </div>
                                )}

                                {/* ====== SUDAH ADA VA / QRIS ====== */}
                                {transactionReady && (
                                    <div>
                                        {/* BCA Virtual Account */}
                                        {(metode === 'BCA' || metode === 'BNI') && (
                                            <div className="p-6 flex flex-col gap-5">
                                                <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                                                    <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-semibold text-green-800">Nomor Virtual Account berhasil dibuat!</p>
                                                        <p className="text-xs text-green-600 mt-0.5">Sistem: {METODE_INFO[metode]?.label}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-[#f8f8f8] rounded-xl p-5 border border-[#19140035]">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs text-[#5f6368]">Nomor Virtual Account</span>
                                                        <CopyButton text={vaNumber} />
                                                    </div>
                                                    <p className="text-xl font-bold font-mono text-[#1b1b18] tracking-widest">{vaNumber}</p>
                                                    {orderIdDisplay && (
                                                        <p className="text-xs text-[#5f6368] mt-2">Order ID: <span className="font-mono">{orderIdDisplay}</span></p>
                                                    )}
                                                </div>
                                                <div className="bg-[#fff8e1] rounded-xl p-4 border border-[#f0c040]">
                                                    <p className="text-sm font-medium text-[#1b1b18]">Cara Pembayaran via ATM {metode}:</p>
                                                    <ol className="mt-2 text-xs text-[#5f6368] space-y-1">
                                                        <li>1. Masukkan kartu ATM &amp; PIN {metode} Anda</li>
                                                        <li>2. Pilih menu <strong>Transfer</strong> → <strong>Ke Rekening {metode === 'BCA' ? 'BCA' : 'BNI'} Virtual Account</strong></li>
                                                        <li>3. Masukkan nomor Virtual Account di atas</li>
                                                        <li>4. Masukkan jumlah bayar: <strong>Rp {Number(grand_total ?? 0).toLocaleString('id-ID')}</strong></li>
                                                        <li>5. Ikuti instruksi hingga selesai &amp; simpan bukti transfer</li>
                                                    </ol>
                                                </div>
                                                <div className="bg-[#fff8e1] rounded-xl p-4 border border-[#f0c040]">
                                                    <p className="text-sm font-medium text-[#1b1b18]">Cara Pembayaran via Mobile Banking {metode}:</p>
                                                    <ol className="mt-2 text-xs text-[#5f6368] space-y-1">
                                                        <li>1. Buka aplikasi <strong>{metode === 'BCA' ? 'BCA Mobile' : 'BNI Mobile'}</strong></li>
                                                        <li>2. Pilih <strong>{metode === 'BCA' ? 'm-BCA' : 'Transfer'}</strong> → <strong>Transfer</strong></li>
                                                        <li>3. Pilih <strong>{metode === 'BCA' ? 'VAC' : 'Virtual Account Billing'}</strong></li>
                                                        <li>4. Masukkan nomor Virtual Account di atas</li>
                                                        <li>5. Masukkan jumlah bayar &amp; konfirmasi dengan PIN</li>
                                                    </ol>
                                                </div>
                                            </div>
                                        )}

                                        {/* QRIS */}
                                        {metode === 'QRIS' && (
                                            <div className="p-6 flex flex-col items-center text-center gap-4">
                                                <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4 w-full">
                                                    <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                    <div className="text-left">
                                                        <p className="text-sm font-semibold text-green-800">QR Code siap di-scan!</p>
                                                        <p className="text-xs text-green-600 mt-0.5">Scan menggunakan aplikasi e-wallet atau mobile banking</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-medium text-[#1b1b18]">Total Pembayaran</p>
                                                <p className="text-2xl font-bold text-[#2264c0]">Rp {Number(grand_total ?? 0).toLocaleString('id-ID')}</p>
                                                {/* QR Code display - redirect to Midtrans QR URL */}
                                                <div className="bg-white p-4 rounded-xl border-2 border-[#2264c0]">
                                                    {qrisUrl ? (
                                                        <img
                                                            src={qrisUrl}
                                                            alt="QRIS Payment"
                                                            className="w-56 h-56 object-contain"
                                                            onError={(e) => {
                                                                // Fallback: generate QR from URL params if direct image fails
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                            }}
                                                        />
                                                    ) : (
                                                        /* Placeholder QR visual */
                                                        <div className="w-56 h-56 flex items-center justify-center text-xs text-[#5f6368]">
                                                            <div className="text-center">
                                                                <Package className="size-12 mx-auto mb-2 text-[#2264c0]" />
                                                                <p>QRIS</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-xs text-[#5f6368]">
                                                    Jangan tutup atau refresh halaman ini hingga pembayaran selesai diproses.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Detail Pesanan */}
                            <div className="bg-white rounded-xl border border-[#19140035] overflow-hidden">
                                <div className="flex items-center gap-2 px-5 py-4 border-b border-[#19140035]">
                                    <Package className="size-4 text-[#2264c0]" />
                                    <h2 className="text-sm font-semibold text-[#1b1b18]">Detail Pesanan</h2>
                                </div>
                                <div className="divide-y divide-[#19140035]">
                                    {(pesanan.detail_pesanan ?? []).map((d: any) => (
                                        <div key={d.id} className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5">
                                            <img
                                                src={d.produk?.gambar ? `/images/produk/${d.produk.gambar}` : '/images/placeholder.png'}
                                                alt={safe(d.produk?.nama_produk)}
                                                className="w-full sm:w-20 h-32 sm:h-20 object-contain rounded-lg bg-gray-50 flex-shrink-0"
                                                onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
                                            />
                                            <div className="flex-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                                <div className="flex-1">
                                                    <p className="text-xs text-[#2264c0] font-medium">{safe(d.produk?.merek)}</p>
                                                    <p className="text-sm font-semibold text-[#1b1b18]">{safe(d.produk?.nama_produk)}</p>
                                                    <p className="text-xs text-[#5f6368] mt-0.5">{safe(d.tipe_pembelian)} · ×{d.jumlah ?? 0}</p>
                                                </div>
                                                <div className="text-right sm:flex-shrink-0">
                                                    <p className="text-sm font-bold text-[#2264c0]">Rp {Number(d.subtotal ?? 0).toLocaleString('id-ID')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-5 py-4 border-t border-[#19140035] flex flex-col gap-2 text-sm">
                                    <div className="flex gap-2">
                                        <Truck className="size-4 text-[#5f6368] flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-[#1b1b18]">{safe(pesanan.ekspedisi?.nama_ekspedisi)}</p>
                                        </div>
                                    </div>
                                    {pesanan.alamat && (
                                        <div className="flex gap-2">
                                            <MapPin className="size-4 text-[#5f6368] flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-[#1b1b18]">{safe(pesanan.alamat.nama_penerima)} · {safe(pesanan.alamat.no_hp_penerima)}</p>
                                                <p className="text-[#5f6368] text-xs mt-0.5">
                                                    {safe(pesanan.alamat.alamat_lengkap)}, {safe(pesanan.alamat.kecamatan)}, {safe(pesanan.alamat.kota_kabupaten)}, {safe(pesanan.alamat.provinsi?.nama_provinsi)}, {safe(pesanan.alamat.kode_pos)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Kanan: Ringkasan Pembayaran */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl border border-[#19140035] p-5 sticky top-6">
                                <h2 className="text-base font-semibold text-[#1b1b18] mb-4">Ringkasan Pembayaran</h2>
                                <div className="flex flex-col gap-2 text-sm">
                                    <div className="flex justify-between text-[#5f6368]">
                                        <span>Subtotal Produk</span>
                                        <span>Rp {Number(subtotal_produk ?? 0).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-[#5f6368]">
                                        <span>Ongkos Kirim</span>
                                        <span>Rp {Number(pesanan.ongkos_kirim ?? 0).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-[#1b1b18] pt-2 border-t border-[#19140035]">
                                        <span>Total</span>
                                        <span className="text-[#2264c0]">Rp {Number(grand_total ?? 0).toLocaleString('id-ID')}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-[#19140035] flex flex-col gap-2 text-sm">
                                    <div className="flex justify-between text-[#5f6368]">
                                        <span>Metode</span>
                                        <span className="font-medium text-[#1b1b18]">{safe(metode)}</span>
                                    </div>
                                    <div className="flex justify-between text-[#5f6368]">
                                        <span>No. Pesanan</span>
                                        <span className="font-medium text-[#1b1b18]">{safe(pesanan.no_pesanan)}</span>
                                    </div>
                                    {transactionReady && orderIdDisplay && (
                                        <div className="flex justify-between text-[#5f6368]">
                                            <span>Order ID</span>
                                            <span className="font-medium text-[#1b1b18] font-mono text-xs">{safe(orderIdDisplay)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-5 p-3 bg-[#fff8e1] rounded-xl border border-[#f0c040]">
                                    <p className="text-xs text-[#5f6368]leading-relaxed">
                                        Pastikan nominal transfer <strong>sama persis</strong> dengan total yang tertera. Pembayaran akan diproses secara otomatis setelah transfer diterima.
                                    </p>
                                </div>

                                <Link
                                    href={`/pesanan/${pesanan.id}`}
                                    className="mt-4 block w-full py-3 border border-[#2264c0] text-[#2264c0] rounded-full font-semibold text-sm hover:bg-blue-50 transition-colors text-center"
                                >
                                    Kembali ke Detail Pesanan
                                </Link>

                                <p className="mt-3 text-xs text-center text-[#5f6368]">
                                    Pembayaran hangus dalam 24 jam. Pesanan akan otomatis dibatalkan jika tidak dibayar.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}