import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, Clock, Edit, LayoutGrid, LogOut, Package, Plus, Search, Settings, ShoppingBag, ShoppingCart, Trash2, User, Users, X } from 'lucide-react';
import { useRef, useState } from 'react';

const safe = (v: any) => (v ?? "").toString().trim();

export default function Carousel() {
    const { auth, carousels } = usePage().props as any;

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editCarouselId, setEditCarouselId] = useState<number | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [imageAnimClass, setImageAnimClass] = useState('opacity-100');
    const [textAnimClass, setTextAnimClass] = useState('opacity-100');
    const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

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
        setShowAddModal(true);
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
        setImageAnimClass('opacity-0 translate-x-4');
        setTextAnimClass('opacity-0 translate-x-4');
        setTimeout(() => {
            setCurrentSlide((prev) => (prev === 0 ? carousels.length - 1 : prev - 1));
            setImageAnimClass('opacity-100 translate-x-0');
            setTextAnimClass('opacity-100 translate-x-0');
        }, 150);
    };

    const handleNext = () => {
        if (carousels.length === 0) return;
        setImageAnimClass('opacity-0 translate-x-4');
        setTextAnimClass('opacity-0 translate-x-4');
        setTimeout(() => {
            setCurrentSlide((prev) => (prev === carousels.length - 1 ? 0 : prev + 1));
            setImageAnimClass('opacity-100 translate-x-0');
            setTextAnimClass('opacity-100 translate-x-0');
        }, 150);
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

                    <div className="flex-1 max-w-lg">
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
                        {auth.user ? (
                            <Link href="/user/profile" className="icon-btn icon-user p-2 rounded-full hover:bg-gray-100">
                                <User className="size-5 text-[#1b1b18]" />
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login" className="px-4 py-2 text-sm font-medium text-[#1b1b18]">Masuk</Link>
                                <Link href="/register" className="px-4 py-2 text-sm font-medium bg-[#2264c0] text-white rounded-full">Daftar</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="border-t border-[#19140035]/50">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="flex items-center gap-6 overflow-x-auto">
                            <Link href="/dashboard" className="flex items-center gap-2 py-2 text-sm font-medium text-[#706f6c] hover:text-[#2264c0] whitespace-nowrap">
                                <LayoutGrid className="size-4" />Dashboard
                            </Link>
                            <Link href="/" className="flex items-center gap-2 py-2 text-sm font-medium text-[#706f6c] hover:text-[#1b1b18] whitespace-nowrap">Beranda</Link>
                            <Link href="/produk" className="flex items-center gap-2 py-2 text-sm font-medium text-[#706f6c] hover:text-[#2264c0] whitespace-nowrap">
                                <Package className="size-4" />Produk
                            </Link>
                            <Link href="/daftar-pesanan" className="flex items-center gap-2 py-2 text-sm font-medium text-[#706f6c] hover:text-[#2264c0] whitespace-nowrap">
                                <ShoppingBag className="size-4" />Pesanan
                            </Link>
                            <Link href="/pengguna" className="flex items-center gap-2 py-2 text-sm font-medium text-[#706f6c] hover:text-[#2264c0] whitespace-nowrap">
                                <Users className="size-4" />Pengguna
                            </Link>
                            <Link href="/carousel" className="flex items-center gap-2 py-2 text-sm font-medium text-[#2264c0] whitespace-nowrap">
                                <BookOpen className="size-4" />Carousel
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
            <main className="min-h-screen bg-[#ffffff] mx-auto max-w-7xl px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1b1b18]">Daftar Carousel</h1>
                        <p className="text-[#706f6c] mt-2">Kelola semua carousel EyeLit</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-[#2264c0] text-white rounded-lg hover:bg-[#1a4f9a] transition-colors font-medium"
                    >
                        <Plus className="size-5" />
                        Tambah Slide
                    </button>
                </div>

                {/* Carousel Preview */}
                {carousels.length > 0 && (
                    <div className="bg-white rounded-xl border border-[#19140035] p-6 mb-8">
                        <h2 className="text-lg font-semibold text-[#1b1b18] mb-4">Preview Carousel</h2>
                        <div className="flex flex-col lg:flex-row items-center gap-6">
                            <div className="w-full lg:w-1/2">
                                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                                    <img
                                        src={currentSlideData?.url_gambar}
                                        alt={currentSlideData?.judul_carousel}
                                        className={`w-full h-auto transition-all duration-300 ${imageAnimClass}`}
                                    />
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 text-center lg:text-left">
                                <h3 className={`text-xl font-bold text-[#1b1b18] mb-2 ${textAnimClass}`}>
                                    {safe(currentSlideData?.judul_carousel) || '-'}
                                </h3>
                                <p className={`text-[#5f6368] mb-4 ${textAnimClass}`}>
                                    {safe(currentSlideData?.deskripsi) || '-'}
                                </p>
                                <div className="flex items-center gap-3 justify-center lg:justify-start">
                                    <button onClick={handlePrev} className="w-10 h-10 bg-[#2264c0] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-white">
                                            <path d="m15 18-6-6 6-6"/>
                                        </svg>
                                    </button>
                                    <div className="flex gap-2">
                                        {activeCarousels.map((_: any, index: number) => (
                                            <span key={index} className={`w-2.5 h-2.5 rounded-full ${index === currentSlide ? 'bg-[#2264c0]' : 'bg-[#2264c0]/30'}`} />
                                        ))}
                                    </div>
                                    <button onClick={handleNext} className="w-10 h-10 bg-[#2264c0] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-white">
                                            <path d="m9 18 6-6-6-6"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table */}
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
            </main>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-[#19140035]">
                            <h2 className="text-lg font-semibold text-[#1b1b18]">Tambah Slide</h2>
                            <button onClick={() => { setShowAddModal(false); resetForm(); }} className="p-1 hover:bg-gray-100 rounded-lg">
                                <X className="size-5 text-[#706f6c]" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1">Judul</label>
                                <input
                                    type="text"
                                    value={form.judul_carousel}
                                    onChange={(e) => setForm({ ...form, judul_carousel: e.target.value })}
                                    className="w-full px-3 py-2 border border-[#19140035] rounded-lg text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0]"
                                    placeholder="Masukkan judul slide"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1">Deskripsi</label>
                                <textarea
                                    value={form.deskripsi}
                                    onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                                    className="w-full px-3 py-2 border border-[#19140035] rounded-lg text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0]"
                                    rows={3}
                                    placeholder="Masukkan deskripsi slide"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1">Gambar</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setForm({ ...form, url_gambar: e.target.files?.[0] || null })}
                                    className="w-full px-3 py-2 border border-[#19140035] rounded-lg text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0]"
                                    required={!isEditMode}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1">Urutan</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={form.urutan}
                                    onChange={(e) => setForm({ ...form, urutan: parseInt(e.target.value) || 1 })}
                                    className="w-full px-3 py-2 border border-[#19140035] rounded-lg text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1">Status</label>
                                <select
                                    value={form.status_carousel ? 'true' : 'false'}
                                    onChange={(e) => setForm({ ...form, status_carousel: e.target.value === 'true' })}
                                    className="w-full px-3 py-2 border border-[#19140035] rounded-lg text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0]"
                                >
                                    <option value="true">Aktif</option>
                                    <option value="false">Nonaktif</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setShowAddModal(false); resetForm(); }}
                                    className="flex-1 px-4 py-2 border border-[#19140035] text-[#1b1b18] rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-[#2264c0] text-white rounded-lg hover:bg-[#1a4f9a] transition-colors"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-[#19140035]">
                            <h2 className="text-lg font-semibold text-[#1b1b18]">Edit Slide</h2>
                            <button onClick={() => { setShowEditModal(false); resetForm(); }} className="p-1 hover:bg-gray-100 rounded-lg">
                                <X className="size-5 text-[#706f6c]" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1">Judul</label>
                                <input
                                    type="text"
                                    value={form.judul_carousel}
                                    onChange={(e) => setForm({ ...form, judul_carousel: e.target.value })}
                                    className="w-full px-3 py-2 border border-[#19140035] rounded-lg text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1">Deskripsi</label>
                                <textarea
                                    value={form.deskripsi}
                                    onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                                    className="w-full px-3 py-2 border border-[#19140035] rounded-lg text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0]"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1">Gambar</label>
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
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1">Urutan</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={form.urutan}
                                    onChange={(e) => setForm({ ...form, urutan: parseInt(e.target.value) || 1 })}
                                    className="w-full px-3 py-2 border border-[#19140035] rounded-lg text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1b1b18] mb-1">Status</label>
                                <select
                                    value={form.status_carousel ? 'true' : 'false'}
                                    onChange={(e) => setForm({ ...form, status_carousel: e.target.value === 'true' })}
                                    className="w-full px-3 py-2 border border-[#19140035] rounded-lg text-sm text-[#1b1b18] focus:outline-none focus:border-[#2264c0]"
                                >
                                    <option value="true">Aktif</option>
                                    <option value="false">Nonaktif</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setShowEditModal(false); resetForm(); }}
                                    className="flex-1 px-4 py-2 border border-[#19140035] text-[#1b1b18] rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-[#2264c0] text-white rounded-lg hover:bg-[#1a4f9a] transition-colors"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}