import { Head, Link, router, usePage } from '@inertiajs/react';
import { Bell, BookOpen, Camera, LogOut, Save, Settings, ShoppingBag, ShoppingCart, Shield, Trash2, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type FormErrors = {
    username?: string;
    foto_profil?: string;
    current_password?: string;
    password?: string;
    password_confirmation?: string;
};

export default function Pengaturan() {
    const { auth, user } = usePage().props as any;
    const [username, setUsername] = useState(user?.username || '');
    const [fotoProfil, setFotoProfil] = useState<File | null>(null);
    const [previewFoto, setPreviewFoto] = useState(user?.foto_profil ? `/images/profil/${user.foto_profil}` : null);

    // Password fields
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Notification preferences
    const [notifPesanan, setNotifPesanan] = useState(true);
    const [notifPromo, setNotifPromo] = useState(false);

    // Modals
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    // Errors & processing
    const [errors, setErrors] = useState<FormErrors>({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (saved) {
            const t = setTimeout(() => setSaved(false), 3000);
            return () => clearTimeout(t);
        }
    }, [saved]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFotoProfil(file);
            setPreviewFoto(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!username.trim()) {
            setErrors({ username: 'Nama pengguna wajib diisi.' });
            return;
        }
        if (username.trim().length < 6) {
            setErrors({ username: 'Nama pengguna minimal 6 karakter.' });
            return;
        }

        setSaving(true);
        const formData = new FormData();
        formData.append('username', username.trim());
        if (fotoProfil) formData.append('foto_profil', fotoProfil);
        formData.append('notif_pesanan', notifPesanan ? '1' : '0');
        formData.append('notif_promo', notifPromo ? '1' : '0');

        router.post('/pengaturan', formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setSaving(false);
                setSaved(true);
            },
            onError: (serverErrors) => {
                setSaving(false);
                setErrors(serverErrors);
            },
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!currentPassword) {
            setErrors({ current_password: 'Kata sandi saat ini wajib diisi.' });
            return;
        }
        if (newPassword.length < 8) {
            setErrors({ password: 'Kata sandi baru minimal 8 karakter.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrors({ password_confirmation: 'Konfirmasi kata sandi tidak cocok.' });
            return;
        }

        setSaving(true);
        router.post('/pengaturan/password', {
            current_password: currentPassword,
            password: newPassword,
            password_confirmation: confirmPassword,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSaving(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setSaved(true);
            },
            onError: (serverErrors) => {
                setSaving(false);
                setErrors(serverErrors);
            },
        });
    };

    const handleDeleteAccount = () => {
        if (deleteConfirmText !== 'HAPUS AKUN SAYA') return;
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/user/profile';
        const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        form.innerHTML = `
            <input type="hidden" name="_token" value="${csrf}">
            <input type="hidden" name="_method" value="DELETE">
        `;
        document.body.appendChild(form);
        form.submit();
    };

    const handleLogout = () => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/logout';
        const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        form.innerHTML = `<input type="hidden" name="_token" value="${csrf}">`;
        document.body.appendChild(form);
        form.submit();
    };

    return (
        <>
            <Head title="Pengaturan - EyeLit" />
            <FloatingParticles />
            <div className="relative z-10 min-h-screen bg-white">
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
                                        onMouseEnter={() => {}}
                                        onMouseLeave={() => {}}
                                    >
                                        <button className="p-2 rounded-full hover:bg-gray-100 relative">
                                            <Bell className="size-5 text-[#1b1b18]" />
                                        </button>
                                    </div>
                                </div>
                            )}
                            {auth.user && (
                                <div className="relative h-full flex items-center">
                                    <div
                                        onMouseEnter={() => {}}
                                        onMouseLeave={() => {}}
                                    >
                                        <button className="p-2 rounded-full hover:bg-gray-100 relative">
                                            <ShoppingCart className="size-5 text-[#1b1b18]" />
                                        </button>
                                    </div>
                                </div>
                            )}
                            {auth.user && (
                                <div className="relative h-full flex items-center">
                                    <div
                                        onMouseEnter={() => {}}
                                        onMouseLeave={() => {}}
                                    >
                                        <button className="p-2 rounded-full hover:bg-gray-100">
                                            <User className="size-5 text-[#1b1b18]" />
                                        </button>
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
                        <span className="text-[#1b1b18] font-medium">Pengaturan</span>
                    </div>
                </div>

                {/* Konten */}
                <main className="mx-auto max-w-2xl px-4 pb-16">
                    <h1 className="text-2xl font-bold text-[#1b1b18] mb-8">Pengaturan Akun</h1>

                    {/* Success Banner */}
                    {saved && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Save className="size-4 text-white" />
                            </div>
                            <p className="text-sm text-green-700 font-medium">Perubahan berhasil disimpan.</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Foto Profil */}
                        <div className="bg-white rounded-xl border border-[#19140035] p-6 mb-6">
                            <h2 className="text-base font-semibold text-[#1b1b18] mb-4 flex items-center gap-2">
                                <Camera className="size-5 text-[#2264c0]" />
                                Foto Profil
                            </h2>
                            <div className="flex items-center gap-6">
                                <div className="relative flex-shrink-0">
                                    {previewFoto ? (
                                        <img
                                            src={previewFoto}
                                            alt="Foto Profil"
                                            className="w-20 h-20 rounded-full object-cover border-2 border-[#19140035]"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-[#2264c0] flex items-center justify-center text-white text-2xl font-bold border-2 border-[#19140035]">
                                            {username.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#2264c0] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#1a4f9a] transition-colors"
                                    >
                                        <Camera className="size-4 text-white" />
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm text-[#706f6c] mb-1">Ubah foto profil</p>
                                    <p className="text-xs text-[#9CA3AF]">Format: JPEG, PNG, JPG, GIF, SVG. Maksimal 2MB</p>
                                </div>
                            </div>
                        </div>

                        {/* Nama Pengguna */}
                        <div className="bg-white rounded-xl border border-[#19140035] p-6 mb-6">
                            <h2 className="text-base font-semibold text-[#1b1b18] mb-4 flex items-center gap-2">
                                <User className="size-5 text-[#2264c0]" />
                                Nama Pengguna
                            </h2>
                            <div className="flex items-center gap-4">
                                <User className="size-5 text-[#706f6c] flex-shrink-0" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={`flex-1 px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#2264c0]/20 ${errors.username ? 'border-red-500 focus:border-red-500' : 'border-[#19140035] focus:border-[#2264c0]'}`}
                                    placeholder="Masukkan nama pengguna"
                                />
                            </div>
                            {errors.username && <p className="text-red-500 text-sm mt-2 ml-9">{errors.username}</p>}
                        </div>

                        {/* Email (readonly) */}
                        <div className="bg-white rounded-xl border border-[#19140035] p-6 mb-6">
                            <h2 className="text-base font-semibold text-[#1b1b18] mb-4 flex items-center gap-2">
                                <Settings className="size-5 text-[#2264c0]" />
                                Email
                            </h2>
                            <div className="flex items-center gap-4">
                                <Settings className="size-5 text-[#706f6c] flex-shrink-0" />
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    readOnly
                                    className="flex-1 px-4 py-2 rounded-lg border border-[#19140035] text-sm bg-gray-50 text-[#706f6c] cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-[#9CA3AF] mt-2 ml-9">Email tidak dapat diubah</p>
                        </div>

                        {/* Tombol Simpan */}
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2264c0] text-white rounded-lg hover:bg-[#1a4f9a] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                        >
                            <Save className="size-5" />
                            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </form>

                    {/* Ganti Password */}
                    <form onSubmit={handlePasswordSubmit}>
                        <div className="bg-white rounded-xl border border-[#19140035] p-6 mb-6">
                            <h2 className="text-base font-semibold text-[#1b1b18] mb-4 flex items-center gap-2">
                                <Shield className="size-5 text-[#2264c0]" />
                                Ganti Kata Sandi
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <label className="text-sm text-[#706f6c] w-36 flex-shrink-0">Kata sandi saat ini</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className={`flex-1 px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#2264c0]/20 ${errors.current_password ? 'border-red-500' : 'border-[#19140035] focus:border-[#2264c0]'}`}
                                        placeholder="Masukkan kata sandi saat ini"
                                    />
                                </div>
                                {errors.current_password && <p className="text-red-500 text-sm ml-36">{errors.current_password}</p>}

                                <div className="flex items-center gap-4">
                                    <label className="text-sm text-[#706f6c] w-36 flex-shrink-0">Kata sandi baru</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className={`flex-1 px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#2264c0]/20 ${errors.password ? 'border-red-500' : 'border-[#19140035] focus:border-[#2264c0]'}`}
                                        placeholder="Minimal 8 karakter"
                                    />
                                </div>
                                {errors.password && <p className="text-red-500 text-sm ml-36">{errors.password}</p>}

                                <div className="flex items-center gap-4">
                                    <label className="text-sm text-[#706f6c] w-36 flex-shrink-0">Konfirmasi</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`flex-1 px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#2264c0]/20 ${errors.password_confirmation ? 'border-red-500' : 'border-[#19140035] focus:border-[#2264c0]'}`}
                                        placeholder="Ulangi kata sandi baru"
                                    />
                                </div>
                                {errors.password_confirmation && <p className="text-red-500 text-sm ml-36">{errors.password_confirmation}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2264c0] text-white rounded-lg hover:bg-[#1a4f9a] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Shield className="size-4" />
                                {saving ? 'Menyimpan...' : 'Ubah Kata Sandi'}
                            </button>
                        </div>
                    </form>

                    {/* Keluar Akun */}
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium mb-6"
                    >
                        <LogOut className="size-5" />
                        Keluar Akun
                    </button>

                    {/* Hapus Akun */}
                    <div className="bg-white rounded-xl border border-red-200 p-6">
                        <h2 className="text-base font-semibold text-red-600 mb-2 flex items-center gap-2">
                            <Trash2 className="size-5" />
                            Zona Berbahaya
                        </h2>
                        <p className="text-sm text-[#706f6c] mb-4">
                            Menghapus akun akan menghilangkan semua data pesanan dan histori kamu secara permanen. Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                            <Trash2 className="size-4" />
                            Hapus Akun
                        </button>
                    </div>
                </main>
            </div>

            {/* Logout Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-[#1b1b18]">Konfirmasi Keluar</h3>
                            <button onClick={() => setShowLogoutModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X className="size-5 text-[#706f6c]" />
                            </button>
                        </div>
                        <p className="text-[#706f6c] mb-6">Apakah Anda yakin ingin keluar dari akun ini?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowLogoutModal(false)} className="flex-1 px-4 py-2 border border-[#19140035] text-[#706f6c] rounded-lg hover:bg-gray-50 transition-colors">
                                Batal
                            </button>
                            <button onClick={handleLogout} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-red-600">Hapus Akun</h3>
                            <button onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X className="size-5 text-[#706f6c]" />
                            </button>
                        </div>
                        <p className="text-sm text-[#706f6c] mb-3">
                            Ketik <strong>HAPUS AKUN SAYA</strong> untuk mengkonfirmasi penghapusan akun secara permanen.
                        </p>
                        <input
                            type="text"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            placeholder="HAPUS AKUN SAYA"
                            className="w-full px-4 py-2 rounded-lg border border-red-300 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                        <div className="flex gap-3">
                            <button onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }} className="flex-1 px-4 py-2 border border-[#19140035] text-[#706f6c] rounded-lg hover:bg-gray-50 transition-colors">
                                Batal
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmText !== 'HAPUS AKUN SAYA'}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Hapus Permanen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
