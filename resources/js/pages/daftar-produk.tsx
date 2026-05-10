import { Head, Link, router, usePage } from '@inertiajs/react';
import { Bell, BookOpen, ImagePlus, LayoutGrid, LogOut, Package, Plus, Search, Settings, ShoppingBag, ShoppingCart, Trash2, User, Users, X } from 'lucide-react';
import { useRef, useState } from 'react';

export default function DaftarProduk() {
    const { auth, produk } = usePage().props as any;
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showCartDropdown, setShowCartDropdown] = useState(false);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editProductId, setEditProductId] = useState<number | null>(null);
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Form state
    const [formData, setFormData] = useState({
        nama_produk: '',
        merek: '',
        tipe_produk: '',
        harga_produk: '',
        stok: '',
        jenis_kelamin: '',
        warna: '',
        material: '',
        bentuk: '',
        bridge: '',
        diagonal: '',
        ukuran: '',
        status_produk: 'Aktif',
    });
    const [images, setImages] = useState<(File | null)[]>([null, null, null, null, null]);
    const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([null, null, null, null, null]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const userDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cartDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notifDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cartItems: any[] = auth.cartItems || [];
    const notifications: any[] = auth.user?.notifications || [];

    // Options for dropdowns - must match database enum values
    const jenisKelaminOptions = ['Pria', 'Wanita', 'Unisex'];
    const materialOptions = ['Metal', 'Plastic', 'Titanium', 'Rubber', 'Wood'];
    const bentukOptions = ['Aviator', 'Browline', 'Oval', 'Square', 'Round', 'Flat Top', 'Geometric', 'Cat Eye', 'Rectangle'];
    const warnaOptions = ['Hitam', 'Putih', 'Transparan', 'Rose Gold', 'Hijau', 'Biru', 'Merah', 'Ungu', 'Tortoise', 'Gold', 'Pink', 'Kuning', 'Black'];
    const merekOptions = ['Hugo', 'Giordano', 'Qina', 'Chopard', 'Illustro', 'Gucci', 'Guy Laroche', 'Beneton', 'Nike', 'Ted Baker', 'Hindar', 'Virtus', 'Puma', 'Bolon'];

    const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            const newImages = [...images];
            newImages[index] = file;

            const newPreviews = [...imagePreviews];
            newPreviews[index] = URL.createObjectURL(file);

            setImages(newImages);
            setImagePreviews(newPreviews);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        const newPreviews = [...imagePreviews];
        if (newPreviews[index]) {
            URL.revokeObjectURL(newPreviews[index]!);
        }
        newImages[index] = null;
        newPreviews[index] = null;
        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleStatusChange = (id: number, newStatus: string) => {
        router.patch(`/produk/${id}/status`, { status_produk: newStatus }, {
            onSuccess: () => {
                setToastMessage('Status produk berhasil diperbarui!');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 4000);
            },
            onError: () => {
                alert('Gagal mengubah status produk');
            },
        });
    };

    const handleEdit = (product: any) => {
        setIsEditMode(true);
        setEditProductId(product.id);
        setFormData({
            nama_produk: product.nama_produk,
            merek: product.merek,
            tipe_produk: product.tipe_produk,
            harga_produk: String(product.harga_produk),
            stok: String(product.stok),
            jenis_kelamin: product.jenis_kelamin,
            warna: product.warna,
            material: product.material,
            bentuk: product.bentuk,
            bridge: product.bridge || '',
            diagonal: product.diagonal || '',
            ukuran: product.ukuran || '',
            status_produk: product.status_produk,
        });
        setExistingImages([
            product.gambar,
            product.gambar_2,
            product.gambar_3,
            product.gambar_4,
            product.gambar_5,
        ].filter(Boolean));
        setImagePreviews([null, null, null, null, null]);
        setImages([null, null, null, null, null]);
        setShowAddModal(true);
    };

    const resetForm = () => {
        setFormData({
            nama_produk: '',
            merek: '',
            tipe_produk: '',
            harga_produk: '',
            stok: '',
            jenis_kelamin: '',
            warna: '',
            material: '',
            bentuk: '',
            bridge: '',
            diagonal: '',
            ukuran: '',
            status_produk: 'Aktif',
        });
        setImages([null, null, null, null, null]);
        setImagePreviews([null, null, null, null, null]);
        setExistingImages([]);
        setErrors({});
        setIsEditMode(false);
        setEditProductId(null);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        resetForm();
    };

    const handleSubmit = () => {
        const newErrors: Record<string, string> = {};

        // Required field validation
        if (!formData.merek) newErrors.merek = 'Merek wajib dipilih';
        if (!formData.tipe_produk) newErrors.tipe_produk = 'Tipe produk wajib dipilih';
        if (!formData.harga_produk) newErrors.harga_produk = 'Harga produk wajib diisi';
        if (!formData.stok) newErrors.stok = 'Stok wajib diisi';
        if (!formData.jenis_kelamin) newErrors.jenis_kelamin = 'Jenis kelamin wajib dipilih';
        if (!formData.warna) newErrors.warna = 'Warna wajib dipilih';
        if (!formData.material) newErrors.material = 'Material wajib dipilih';
        if (!formData.bentuk) newErrors.bentuk = 'Bentuk wajib dipilih';

        // Check minimum 1 image (only for new products)
        if (!isEditMode) {
            const hasImage = images.some(img => img !== null);
            const hasExistingImage = existingImages.length > 0;
            if (!hasImage && !hasExistingImage) {
                newErrors.images = 'Minimal upload 1 gambar produk';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Prepare form data for submission
        const submitData = new FormData();
        submitData.append('merek', formData.merek);
        submitData.append('tipe_produk', formData.tipe_produk);
        submitData.append('harga_produk', formData.harga_produk);
        submitData.append('stok', formData.stok);
        submitData.append('jenis_kelamin', formData.jenis_kelamin);
        submitData.append('warna', formData.warna);
        submitData.append('material', formData.material);
        submitData.append('bentuk', formData.bentuk);
        submitData.append('bridge', formData.bridge);
        submitData.append('diagonal', formData.diagonal);
        submitData.append('ukuran', formData.ukuran);
        submitData.append('status_produk', formData.status_produk);

        // Append new images
        images.forEach((img, index) => {
            if (img) {
                submitData.append(`gambar_${index}`, img);
            }
        });

        if (isEditMode && editProductId) {
            submitData.append('_method', 'PUT');
            router.post(`/produk/${editProductId}`, submitData, {
                onSuccess: () => {
                    handleCloseModal();
                    setToastMessage('Produk berhasil diperbarui!');
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 4000);
                },
                onError: (errors: Record<string, string>) => {
                    setErrors(errors);
                },
            });
        } else {
            router.post('/produk', submitData, {
                onSuccess: () => {
                    handleCloseModal();
                    setToastMessage('Produk berhasil disimpan!');
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 4000);
                },
                onError: (errors: Record<string, string>) => {
                    setErrors(errors);
                },
            });
        }
    };

    return (
        <>
            <Head title="Daftar Produk - EyeLit" />

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
                        <div className="flex items-center gap-6 overflow-x-auto">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 py-2 text-sm font-medium text-[#706f6c] hover:text-[#2264c0] transition-colors whitespace-nowrap"
                            >
                                <LayoutGrid className="size-4" />
                                Dashboard
                            </Link>
                            <Link
                                href="/"
                                className="flex items-center gap-2 py-2 text-sm font-medium text-[#706f6c] hover:text-[#1b1b18] transition-colors whitespace-nowrap"
                            >
                                Beranda
                            </Link>
                            <Link
                                href="/produk"
                                className="flex items-center gap-2 py-2 text-sm font-medium text-[#2264c0] whitespace-nowrap"
                            >
                                <Package className="size-4" />
                                Produk
                            </Link>
                            <Link
                                href="/daftar-pesanan"
                                className="flex items-center gap-2 py-2 text-sm font-medium text-[#706f6c] hover:text-[#2264c0] transition-colors whitespace-nowrap"
                            >
                                <ShoppingBag className="size-4" />
                                Pesanan
                            </Link>
                            <Link
                                href="/pengguna"
                                className="flex items-center gap-2 py-2 text-sm font-medium text-[#706f6c] hover:text-[#2264c0] transition-colors whitespace-nowrap"
                            >
                                <Users className="size-4" />
                                Pengguna
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <main className="mx-auto max-w-7xl px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1b1b18]">Daftar Produk</h1>
                        <p className="text-[#706f6c] mt-2">Kelola semua produk EyeLit</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#2264c0] text-white rounded-lg hover:bg-[#1a4f9a] transition-colors font-medium"
                    >
                        <Plus className="size-5" />
                        Tambah Produk
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="rounded-xl border border-[#19140035] bg-white p-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-[#2264c0]/10 p-3">
                                <Package className="size-6 text-[#2264c0]" />
                            </div>
                            <div>
                                <p className="text-sm text-[#706f6c]">Total Produk</p>
                                <p className="text-2xl font-bold text-[#1b1b18]">{produk?.length || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                {produk && produk.length > 0 ? (
                    <div className="bg-white rounded-xl border border-[#19140035] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-[#19140035]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">No</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Gambar</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Nama Produk</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Stok</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#19140035]/20">
                                    {produk.map((item: any, index: number) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-[#1b1b18]">{index + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                                    <img
                                                        src={`/images/produk/${item.gambar}`}
                                                        alt={item.nama_produk}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-[#1b1b18]">{item.nama_produk}</td>
                                            <td className="px-6 py-4 text-sm text-[#706f6c]">{item.stok}</td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={item.status_produk}
                                                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                                    className={`text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${
                                                        item.status_produk === 'Aktif'
                                                            ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                                                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    <option value="Aktif">Aktif</option>
                                                    <option value="Nonaktif">Nonaktif</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-[#19140035]">
                        <Package className="size-16 text-[#706f6c] mx-auto mb-4" />
                        <p className="text-[#706f6c]">Belum ada produk aktif</p>
                    </div>
                )}
            </main>

            {/* Modal Tambah Produk */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-[#19140035] px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-xl font-bold text-[#1b1b18]">{isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="size-5 text-[#706f6c]" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6 space-y-5">
                            {/* Nama Produk - Auto Generated */}
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">
                                    Nama Produk
                                </label>
                                <div className="w-full h-10 px-4 flex items-center rounded-lg border border-gray-200 bg-gray-50 text-sm text-[#706f6c]">
                                    {formData.merek && formData.tipe_produk
                                        ? `${formData.merek} ${formData.tipe_produk}`
                                        : 'Pilih merek dan tipe produk terlebih dahulu'}
                                </div>
                                <p className="text-xs text-[#706f6c] mt-1">Nama produk akan otomatis terisi dari Merek + Tipe Produk</p>
                            </div>

                            {/* Merek & Tipe Produk */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">
                                        Merek <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.merek}
                                        onChange={(e) => handleInputChange('merek', e.target.value)}
                                        className={`w-full h-10 px-4 rounded-lg border ${errors.merek ? 'border-red-500' : 'border-[#19140035]'} bg-white text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0] focus:border-2 focus:ring-2 focus:ring-[#2264c0]/20 cursor-pointer`}
                                    >
                                        <option value="">Pilih Merek</option>
                                        {merekOptions.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    {errors.merek && <p className="text-red-500 text-xs mt-1">{errors.merek}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">
                                        Tipe Produk <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.tipe_produk}
                                        onChange={(e) => handleInputChange('tipe_produk', e.target.value)}
                                        placeholder="ct: F BE 3101-1 884 52"
                                        className={`w-full h-10 px-4 rounded-lg border ${errors.tipe_produk ? 'border-red-500' : 'border-[#19140035]'} bg-white text-sm text-[#1b1b18] placeholder-[#706f6c] focus:outline-none focus:border-[#2264c0] focus:border-2 focus:ring-2 focus:ring-[#2264c0]/20`}
                                    />
                                    {errors.tipe_produk && <p className="text-red-500 text-xs mt-1">{errors.tipe_produk}</p>}
                                </div>
                            </div>

                            {/* Harga & Stok */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">
                                        Harga Produk <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#706f6c]">Rp</span>
                                        <input
                                            type="number"
                                            value={formData.harga_produk}
                                            onChange={(e) => handleInputChange('harga_produk', e.target.value)}
                                            placeholder="0"
                                            className={`w-full h-10 pl-10 pr-4 rounded-lg border ${errors.harga_produk ? 'border-red-500' : 'border-[#19140035]'} bg-white text-sm text-[#1b1b18] placeholder-[#706f6c] focus:outline-none focus:border-[#2264c0] focus:border-2 focus:ring-2 focus:ring-[#2264c0]/20`}
                                        />
                                    </div>
                                    {errors.harga_produk && <p className="text-red-500 text-xs mt-1">{errors.harga_produk}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">
                                        Stok <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.stok}
                                        onChange={(e) => handleInputChange('stok', e.target.value)}
                                        placeholder="0"
                                        min="0"
                                        className={`w-full h-10 px-4 rounded-lg border ${errors.stok ? 'border-red-500' : 'border-[#19140035]'} bg-white text-sm text-[#1b1b18] placeholder-[#706f6c] focus:outline-none focus:border-[#2264c0] focus:border-2 focus:ring-2 focus:ring-[#2264c0]/20`}
                                    />
                                    {errors.stok && <p className="text-red-500 text-xs mt-1">{errors.stok}</p>}
                                </div>
                            </div>

                            {/* Jenis Kelamin & Warna */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">
                                        Jenis Kelamin <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.jenis_kelamin}
                                        onChange={(e) => handleInputChange('jenis_kelamin', e.target.value)}
                                        className={`w-full h-10 px-4 rounded-lg border ${errors.jenis_kelamin ? 'border-red-500' : 'border-[#19140035]'} bg-white text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0] focus:border-2 focus:ring-2 focus:ring-[#2264c0]/20 cursor-pointer`}
                                    >
                                        <option value="">Pilih Jenis Kelamin</option>
                                        {jenisKelaminOptions.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    {errors.jenis_kelamin && <p className="text-red-500 text-xs mt-1">{errors.jenis_kelamin}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">
                                        Warna <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.warna}
                                        onChange={(e) => handleInputChange('warna', e.target.value)}
                                        className={`w-full h-10 px-4 rounded-lg border ${errors.warna ? 'border-red-500' : 'border-[#19140035]'} bg-white text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0] focus:border-2 focus:ring-2 focus:ring-[#2264c0]/20 cursor-pointer`}
                                    >
                                        <option value="">Pilih Warna</option>
                                        {warnaOptions.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    {errors.warna && <p className="text-red-500 text-xs mt-1">{errors.warna}</p>}
                                </div>
                            </div>

                            {/* Material & Bentuk */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">
                                        Material <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.material}
                                        onChange={(e) => handleInputChange('material', e.target.value)}
                                        className={`w-full h-10 px-4 rounded-lg border ${errors.material ? 'border-red-500' : 'border-[#19140035]'} bg-white text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0] focus:border-2 focus:ring-2 focus:ring-[#2264c0]/20 cursor-pointer`}
                                    >
                                        <option value="">Pilih Material</option>
                                        {materialOptions.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    {errors.material && <p className="text-red-500 text-xs mt-1">{errors.material}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">
                                        Bentuk <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.bentuk}
                                        onChange={(e) => handleInputChange('bentuk', e.target.value)}
                                        className={`w-full h-10 px-4 rounded-lg border ${errors.bentuk ? 'border-red-500' : 'border-[#19140035]'} bg-white text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0] focus:border-2 focus:ring-2 focus:ring-[#2264c0]/20 cursor-pointer`}
                                    >
                                        <option value="">Pilih Bentuk</option>
                                        {bentukOptions.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    {errors.bentuk && <p className="text-red-500 text-xs mt-1">{errors.bentuk}</p>}
                                </div>
                            </div>

                            {/* Bridge & Diagonal */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">Bridge</label>
                                    <input
                                        type="text"
                                        value={formData.bridge}
                                        onChange={(e) => handleInputChange('bridge', e.target.value)}
                                        placeholder="ct: 18"
                                        className="w-full h-10 px-4 rounded-lg border border-[#19140035] bg-white text-sm text-[#1b1b18] placeholder-[#706f6c] focus:outline-none focus:border-[#2264c0] focus:border-2 focus:ring-2 focus:ring-[#2264c0]/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">Diagonal</label>
                                    <input
                                        type="text"
                                        value={formData.diagonal}
                                        onChange={(e) => handleInputChange('diagonal', e.target.value)}
                                        placeholder="ct: 52"
                                        className="w-full h-10 px-4 rounded-lg border border-[#19140035] bg-white text-sm text-[#1b1b18] placeholder-[#706f6c] focus:outline-none focus:border-[#2264c0] focus:border-2 focus:ring-2 focus:ring-[#2264c0]/20"
                                    />
                                </div>
                            </div>

                            {/* Ukuran */}
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">Ukuran</label>
                                <input
                                    type="text"
                                    value={formData.ukuran}
                                    onChange={(e) => handleInputChange('ukuran', e.target.value)}
                                    placeholder="ct: 55-18-145"
                                    className="w-full h-10 px-4 rounded-lg border border-[#19140035] bg-white text-sm text-[#1b1b18] placeholder-[#706f6c] focus:outline-none focus:border-[#2264c0] focus:border-2 focus:ring-2 focus:ring-[#2264c0]/20"
                                />
                            </div>

                            {/* Status Produk */}
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">Status Produk</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status_produk"
                                            value="Aktif"
                                            checked={formData.status_produk === 'Aktif'}
                                            onChange={(e) => handleInputChange('status_produk', e.target.value)}
                                            className="w-4 h-4 accent-[#2264c0]"
                                        />
                                        <span className="text-sm text-[#1b1b18]">Aktif</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status_produk"
                                            value="Nonaktif"
                                            checked={formData.status_produk === 'Nonaktif'}
                                            onChange={(e) => handleInputChange('status_produk', e.target.value)}
                                            className="w-4 h-4 accent-[#2264c0]"
                                        />
                                        <span className="text-sm text-[#1b1b18]">Nonaktif</span>
                                    </label>
                                </div>
                            </div>

                            {/* Upload Gambar */}
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">
                                    Gambar Produk <span className="text-red-500">*</span>
                                    <span className="text-[#706f6c] font-normal ml-1">(Min 1, Max 5)</span>
                                </label>
                                <div className="grid grid-cols-5 gap-3">
                                    {[0, 1, 2, 3, 4].map((index) => (
                                        <div key={index} className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={(el) => { fileInputRefs.current[index] = el; }}
                                                onChange={(e) => handleImageChange(index, e)}
                                                className="hidden"
                                            />
                                            {imagePreviews[index] ? (
                                                <div className="relative aspect-square rounded-lg overflow-hidden border border-[#19140035] group">
                                                    <img
                                                        src={imagePreviews[index]!}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="size-3" />
                                                    </button>
                                                </div>
                                            ) : existingImages[index] ? (
                                                <div className="relative aspect-square rounded-lg overflow-hidden border border-[#19140035] group">
                                                    <img
                                                        src={`/images/produk/${existingImages[index]}`}
                                                        alt={`Gambar ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-white text-xs font-medium">Gambar Lama</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRefs.current[index]?.click()}
                                                    className="aspect-square rounded-lg border-2 border-dashed border-[#19140035] hover:border-[#2264c0] flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
                                                >
                                                    <ImagePlus className="size-5 text-[#706f6c]" />
                                                    <span className="text-xs text-[#706f6c]">{index === 0 ? 'Utama' : index + 1}</span>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-white border-t border-[#19140035] px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
                            <button
                                onClick={handleCloseModal}
                                className="px-5 py-2 text-sm font-medium text-[#706f6c] hover:text-[#1b1b18] hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-5 py-2 text-sm font-medium bg-[#2264c0] text-white rounded-lg hover:bg-[#1a4f9a] transition-colors"
                            >
                                {isEditMode ? 'Perbarui Produk' : 'Simpan Produk'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-6 right-6 z-[60] animate-slide-up">
                    <div className="flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        <span className="text-sm font-medium">{toastMessage}</span>
                        <button
                            onClick={() => setShowToast(false)}
                            className="ml-2 p-1 hover:bg-green-700 rounded-full transition-colors"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
