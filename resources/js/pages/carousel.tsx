import { Head, Link, usePage } from '@inertiajs/react';
import { Bell, BookOpen, Clock, Edit, Image, LayoutGrid, LogOut, Package, Plus, Search, Settings, ShoppingBag, ShoppingCart, Trash2, User, Users, X } from 'lucide-react';
import { useRef, useState } from 'react';

const safe = (v: any) => (v ?? "").toString().trim();

export default function Carousel() {
    const { auth, carousels } = usePage().props as any;

    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showCartDropdown, setShowCartDropdown] = useState(false);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isAddClosing, setIsAddClosing] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isEditClosing, setIsEditClosing] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editCarouselId, setEditCarouselId] = useState<number | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [imageAnimClass, setImageAnimClass] = useState('opacity-100');
    const [textAnimClass, setTextAnimClass] = useState('opacity-100');
    const [buttonAnimClass, setButtonAnimClass] = useState('');
    const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

    const userDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cartDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const notifDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cartItems: any[] = auth.cartItems || [];
    const notifications: any[] = auth.user?.notifications || [];

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
    };

    const [form, setForm] = useState({
        judul_carousel: '',
        deskripsi: '',
        url_gambar: null as File | null,
        urutan: 1,
        status_carousel: true,
    });

    const resetForm = () => {
        setForm({
            judul_carousel: '',
            deskripsi: '',
            url_gambar: null,
            urutan: 1,
            status_carousel: true,
        });
        setIsEditMode(false);
        setEditCarouselId(null);
    };

    const handleAdd = () => {
        resetForm();
        setIsEditMode(false);
        setIsAddClosing(false);
        setShowAddModal(true);
    };

    const handleCloseAddModal = () => {
        setIsAddClosing(true);
        setTimeout(() => {
            setShowAddModal(false);
            setIsAddClosing(false);
            resetForm();
        }, 300);
    };

    const handleCloseEditModal = () => {
        setIsEditClosing(true);
        setTimeout(() => {
            setShowEditModal(false);
            setIsEditClosing(false);
            resetForm();
        }, 300);
    };

    const handleEdit = (carousel: any) => {
        setForm({
            judul_carousel: carousel.judul_carousel || '',
            deskripsi: carousel.deskripsi || '',
            url_gambar: carousel.url_gambar || '',
            urutan: carousel.urutan || 1,
            status_carousel: carousel.status_carousel ?? true,
        });
        setIsEditMode(true);
        setIsEditClosing(false);
        setEditCarouselId(carousel.id);
        setShowEditModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('judul_carousel', form.judul_carousel);
        formData.append('deskripsi', form.deskripsi);
        formData.append('urutan', String(form.urutan));
        formData.append('status_carousel', form.status_carousel ? 'true' : 'false');
        if (form.url_gambar) {
            formData.append('url_gambar', form.url_gambar);
        }

        const url = isEditMode ? `/carousel/${editCarouselId}` : '/carousel';
        const method = isEditMode ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || '',
                'Accept': 'application/json',
            },
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    showNotification(data.message || 'Slide berhasil disimpan!', 'success');
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    showNotification(data.message || 'Gagal menyimpan slide. Silakan coba lagi.', 'error');
                }
            })
            .catch((err) => {
                console.error(err);
                showNotification('Gagal menyimpan slide. Silakan coba lagi.', 'error');
            });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Yakin ingin menghapus slide ini?')) return;
        fetch(`/carousel/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || '',
            },
        })
            .then((res) => {
                if (res.ok) {
                    showNotification('Slide berhasil dihapus!', 'success');
                    setTimeout(() => window.location.reload(), 1500);
                }
            })
            .catch((err) => {
                console.error(err);
                showNotification('Gagal menghapus slide.', 'error');
            });
    };

    const handleStatusToggle = (id: number) => {
        fetch(`/carousel/${id}/status`, {
            method: 'PATCH',
            headers: {
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || '',
            },
        })
            .then((res) => {
                if (res.ok) {
                    showNotification('Status slide berhasil diperbarui!', 'success');
                    setTimeout(() => window.location.reload(), 1500);
                }
            })
            .catch((err) => {
                console.error(err);
                showNotification('Gagal memperbarui status slide.', 'error');
            });
    };

    const handlePrev = () => {
        if (carousels.length === 0) return;
        setImageAnimClass('carousel-image-out');
        setTextAnimClass('carousel-text-out');
        setButtonAnimClass('carousel-button-click');
        setTimeout(() => {
            setCurrentSlide((prev) => (prev === 0 ? carousels.length - 1 : prev - 1));
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
        if (carousels.length === 0) return;
        setImageAnimClass('carousel-image-out');
        setTextAnimClass('carousel-text-out');
        setButtonAnimClass('carousel-button-click');
        setTimeout(() => {
            setCurrentSlide((prev) => (prev === carousels.length - 1 ? 0 : prev + 1));
            setImageAnimClass('carousel-image-in');
            setTextAnimClass('carousel-text-in');
            setButtonAnimClass('');
            setTimeout(() => {
                setImageAnimClass('');
                setTextAnimClass('');
            }, 250);
        }, 400);
    };

    const activeCarousels = carousels.filter((c: any) => c.status_carousel);
    const currentSlideData = activeCarousels[currentSlide] || carousels[0];

    return (
        <>
            <Head title="Carousel - EyeLit" />

            {/* Navbar */}
            <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 gap-4">
                    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                        <img src="/images/logo/AuthMobile.svg" alt="EyeLit Logo" className="h-10 w-auto" />
                        <span className="text-2xl font-bold text-[#2264c0]">EyeLit</span>
                    </Link>

                    <div className="flex-1 max-w-lg ml-[90px]">
                        <div className="relative">
                            <input
                                type="text"
                                autoComplete="off"
                                placeholder="Cari..."
                                className="w-full h-9 pl-4 pr-12 rounded-full border border-[#19140035] bg-white text-sm text-[#1b1b18] appearance-none focus:outline-none"
                            />
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#706f6c]" />
                        </div>
                    </div>

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
                            <Link href="/dashboard" className="py-2 text-sm font-medium text-[#706f6c] hover:text-[#2264c0] transition-colors whitespace-nowrap">
                                Dashboard
                            </Link>
                            <Link href="/produk" className="py-2 text-sm font-medium text-[#706f6c] hover:text-[#2264c0] transition-colors whitespace-nowrap">
                                Produk
                            </Link>
                            <Link href="/daftar-pesanan" className="py-2 text-sm font-medium text-[#706f6c] hover:text-[#2264c0] transition-colors whitespace-nowrap">
                                Pesanan
                            </Link>
                            <Link href="/pengguna" className="py-2 text-sm font-medium text-[#706f6c] hover:text-[#2264c0] transition-colors whitespace-nowrap">
                                Pengguna
                            </Link>
                            <Link href="/carousel" className="py-2 text-sm font-medium text-[#2264c0] whitespace-nowrap">
                                Carousel
                            </Link>
                            <Link href="/" className="py-2 text-sm font-medium text-[#706f6c] hover:text-[#2264c0] transition-colors whitespace-nowrap">
                                Beranda
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Notification Toast */}
            {notification.show && (
                <div className={`fixed top-24 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
                    notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                    {notification.type === 'success' ? (
                        <svg className="size-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="size-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                    <span className="text-sm font-medium">{notification.message}</span>
                    <button onClick={() => setNotification({ show: false, message: '', type: 'success' })} className="ml-2 hover:opacity-80">
                        <X className="size-4" />
                    </button>
                </div>
            )}

            {/* Page Content */}
            <main className="min-h-screen bg-[#ffffff]">
                {/* Header with Blue Background - Full Width */}
                <div className="bg-[#2264c0] w-full py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">Daftar Carousel</h1>
                                <p className="text-white/80">Kelola semua carousel EyeLit</p>
                            </div>
                            <button
                                onClick={handleAdd}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#2264c0] rounded-xl hover:bg-white/90 transition-colors font-semibold shadow-lg"
                            >
                                <Plus className="size-5" />
                                Tambah Slide
                            </button>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            {/* Total Carousel */}
                            <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-300"></div>
                                <div className="relative flex items-center gap-4">
                                    <div className="flex-shrink-0 rounded-xl bg-white/20 p-4 group-hover:bg-white/30 transition-colors duration-300">
                                        <Image className="size-8 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white mb-1">Total Carousel</p>
                                        <p className="text-3xl font-bold text-white truncate">{carousels?.length || 0}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Active Carousel */}
                            <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-300"></div>
                                <div className="relative flex items-center gap-4">
                                    <div className="flex-shrink-0 rounded-xl bg-white/20 p-4 group-hover:bg-white/30 transition-colors duration-300">
                                        <BookOpen className="size-8 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white mb-1">Carousel Aktif</p>
                                        <p className="text-3xl font-bold text-white truncate">{activeCarousels.length}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Inactive Carousel */}
                            <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-300"></div>
                                <div className="relative flex items-center gap-4">
                                    <div className="flex-shrink-0 rounded-xl bg-white/20 p-4 group-hover:bg-white/30 transition-colors duration-300">
                                        <Clock className="size-8 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white mb-1">Carousel Nonaktif</p>
                                        <p className="text-3xl font-bold text-white truncate">{(carousels?.length || 0) - activeCarousels.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Carousel Preview Section - Full Width Background */}
                {carousels && carousels.length > 0 && (
                    <section id="carousel" className="w-full py-8 sm:py-16 bg-[#2264c0] mb-8">
                        <div className="container mx-auto px-4 max-w-7xl">
                            <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-12">
                                <div className="w-full lg:w-1/2">
                                    <div className="relative rounded-2xl overflow-hidden shadow-xl">
                                        <img
                                            src={currentSlideData?.url_gambar}
                                            alt={currentSlideData?.judul_carousel}
                                            className={`w-full h-auto transition-opacity duration-300 ${imageAnimClass}`}
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-1/2 text-center lg:text-left">
                                    <h3 className={`text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight ${textAnimClass}`}>
                                        {currentSlideData?.judul_carousel || '-'}
                                    </h3>
                                    <p className={`text-white/80 text-xs sm:text-sm lg:text-lg leading-relaxed mb-6 sm:mb-8 ${textAnimClass}`}>
                                        {currentSlideData?.deskripsi || '-'}
                                    </p>
                                    <div className="flex items-center gap-3 sm:gap-4 justify-center lg:justify-start">
                                        <button
                                            onClick={handlePrev}
                                            className={`w-10 h-10 sm:w-12 sm:h-12 bg-white text-[#2264c0] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg ${buttonAnimClass}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 sm:size-6">
                                                <path d="m15 18-6-6 6-6"/>
                                            </svg>
                                        </button>
                                        <div className="flex gap-2">
                                            {activeCarousels.map((_: any, index: number) => (
                                                <span
                                                    key={index}
                                                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors ${
                                                        index === currentSlide
                                                            ? 'bg-white carousel-dot-active'
                                                            : 'bg-white/30'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <button
                                            onClick={handleNext}
                                            className={`w-10 h-10 sm:w-12 sm:h-12 bg-white text-[#2264c0] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg ${buttonAnimClass}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 sm:size-6">
                                                <path d="m9 18 6-6-6-6"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <div className="max-w-7xl mx-auto px-4 pb-8">
                    {carousels && carousels.length > 0 ? (
                        <div className="bg-white rounded-xl border border-[#19140035] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-[#19140035]">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase">No</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase">Urutan</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase">Gambar</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase">Judul</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase">Deskripsi</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#19140035]/20">
                                        {carousels.map((item: any, index: number) => (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-[#1b1b18]">{index + 1}</td>
                                                <td className="px-6 py-4 text-sm text-[#1b1b18]">{item.urutan}</td>
                                                <td className="px-6 py-4">
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                                        <img
                                                            src={item.url_gambar}
                                                            alt={item.judul_carousel}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-[#1b1b18] max-w-[200px] truncate">{safe(item.judul_carousel) || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-[#706f6c] max-w-[250px] truncate">{safe(item.deskripsi) || '-'}</td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleStatusToggle(item.id)}
                                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                                            item.status_carousel
                                                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {item.status_carousel ? 'Aktif' : 'Nonaktif'}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="p-2 text-[#2264c0] hover:bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            <Edit className="size-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-[#19140035]">
                            <BookOpen className="size-16 text-[#706f6c] mx-auto mb-4" />
                            <p className="text-[#706f6c]">Belum ada slide carousel</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Add Modal */}
            {showAddModal && (
                <>
                    {/* Backdrop */}
                    <div
                        className={`fixed inset-0 bg-black/30 z-40 ${isAddClosing ? 'animate-backdrop-fade-out' : 'animate-backdrop-fade-in'}`}
                        onClick={handleCloseAddModal}
                    />

                    {/* Sidebar */}
                    <div className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-white z-50 shadow-xl overflow-y-auto ${isAddClosing ? 'filter-panel-exit' : 'filter-panel-enter'}`}>
                        <div className="sticky top-0 bg-white border-b border-[#19140035] px-6 py-4 flex items-center justify-between z-10">
                            <h2 className="text-xl font-bold text-[#1b1b18]">Tambah Slide</h2>
                            <button onClick={handleCloseAddModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="size-5 text-[#706f6c]" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">Judul</label>
                                <input
                                    type="text"
                                    value={form.judul_carousel}
                                    onChange={(e) => setForm({ ...form, judul_carousel: e.target.value })}
                                    className="w-full h-10 px-4 rounded-lg border border-[#19140035] text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0] focus:border-2 focus:ring-2 focus:ring-[#2264c0]/20"
                                    placeholder="Masukkan judul slide"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">Deskripsi</label>
                                <textarea
                                    value={form.deskripsi}
                                    onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-[#19140035] text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0] focus:border-2 focus:ring-2 focus:ring-[#2264c0]/20"
                                    rows={3}
                                    placeholder="Masukkan deskripsi slide"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">Gambar</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setForm({ ...form, url_gambar: e.target.files?.[0] || null })}
                                    className="w-full px-3 py-2 border border-[#19140035] rounded-lg text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0]"
                                    required={!isEditMode}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">Urutan</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={form.urutan}
                                    onChange={(e) => setForm({ ...form, urutan: parseInt(e.target.value) || 1 })}
                                    className="w-full h-10 px-4 rounded-lg border border-[#19140035] text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0] focus:border-2 focus:ring-2 focus:ring-[#2264c0]/20"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">Status</label>
                                <select
                                    value={form.status_carousel ? 'true' : 'false'}
                                    onChange={(e) => setForm({ ...form, status_carousel: e.target.value === 'true' })}
                                    className="w-full h-10 px-4 rounded-lg border border-[#19140035] text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0] focus:border-2 focus:ring-2 focus:ring-[#2264c0]/20 cursor-pointer"
                                >
                                    <option value="true">Aktif</option>
                                    <option value="false">Nonaktif</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseAddModal}
                                    className="flex-1 px-5 py-2.5 border border-[#19140035] text-[#706f6c] hover:text-[#1b1b18] hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-5 py-2.5 bg-[#2264c0] text-white rounded-lg hover:bg-[#1a4f9a] transition-colors"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <>
                    {/* Backdrop */}
                    <div
                        className={`fixed inset-0 bg-black/30 z-40 ${isEditClosing ? 'animate-backdrop-fade-out' : 'animate-backdrop-fade-in'}`}
                        onClick={handleCloseEditModal}
                    />

                    {/* Sidebar */}
                    <div className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-white z-50 shadow-xl overflow-y-auto ${isEditClosing ? 'filter-panel-exit' : 'filter-panel-enter'}`}>
                        <div className="sticky top-0 bg-white border-b border-[#19140035] px-6 py-4 flex items-center justify-between z-10">
                            <h2 className="text-xl font-bold text-[#1b1b18]">Edit Slide</h2>
                            <button onClick={handleCloseEditModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="size-5 text-[#706f6c]" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">Judul</label>
                                <input
                                    type="text"
                                    value={form.judul_carousel}
                                    onChange={(e) => setForm({ ...form, judul_carousel: e.target.value })}
                                    className="w-full h-10 px-4 rounded-lg border border-[#19140035] text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0] focus:border-2 focus:ring-2 focus:ring-[#2264c0]/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">Deskripsi</label>
                                <textarea
                                    value={form.deskripsi}
                                    onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-[#19140035] text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0] focus:border-2 focus:ring-2 focus:ring-[#2264c0]/20"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">Gambar</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setForm({ ...form, url_gambar: e.target.files?.[0] || null })}
                                    className="w-full px-3 py-2 border border-[#19140035] rounded-lg text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0]"
                                />
                                {form.url_gambar && typeof form.url_gambar === 'string' && (
                                    <p className="text-xs text-[#706f6c] mt-1">Gambar saat ini: {form.url_gambar}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">Urutan</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={form.urutan}
                                    onChange={(e) => setForm({ ...form, urutan: parseInt(e.target.value) || 1 })}
                                    className="w-full h-10 px-4 rounded-lg border border-[#19140035] text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0] focus:border-2 focus:ring-2 focus:ring-[#2264c0]/20"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1.5">Status</label>
                                <select
                                    value={form.status_carousel ? 'true' : 'false'}
                                    onChange={(e) => setForm({ ...form, status_carousel: e.target.value === 'true' })}
                                    className="w-full h-10 px-4 rounded-lg border border-[#19140035] text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0] focus:border-2 focus:ring-2 focus:ring-[#2264c0]/20 cursor-pointer"
                                >
                                    <option value="true">Aktif</option>
                                    <option value="false">Nonaktif</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseEditModal}
                                    className="flex-1 px-5 py-2.5 border border-[#19140035] text-[#706f6c] hover:text-[#1b1b18] hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-5 py-2.5 bg-[#2264c0] text-white rounded-lg hover:bg-[#1a4f9a] transition-colors"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </>
    );
}