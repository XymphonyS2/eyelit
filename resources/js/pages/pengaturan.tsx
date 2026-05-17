import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { useState, useCallback, useRef } from 'react';
import { Camera, LogOut, Save, User, X } from 'lucide-react';
import Navbar from '@/components/Navbar';

type FormErrors = {
    username?: string;
    foto_profil?: string;
};

export default function Pengaturan() {
    const { auth, user } = usePage().props as any;
    const { data, setData, post, processing, errors } = useForm({
        username: user?.username || '',
        foto_profil: null as File | null,
    });

    const [localErrors, setLocalErrors] = useState<FormErrors>({});
    const [previewFoto, setPreviewFoto] = useState(user?.foto_profil ? `/images/profil/${user.foto_profil}` : null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const validateUsername = (username: string): string | undefined => {
        if (!username.trim()) return 'Nama pengguna wajib diisi.';
        if (!/^[a-zA-Z0-9]+$/.test(username)) return 'Nama pengguna hanya boleh huruf dan angka.';
        if (username.trim().length < 6) return 'Nama pengguna minimal 6 karakter.';
        return undefined;
    };

    const checkUsername = useCallback(async (username: string) => {
        if (!username.trim() || !/^[a-zA-Z0-9]+$/.test(username) || username.length < 6) {
            return;
        }

        try {
            const response = await fetch(`/username-check?username=${encodeURIComponent(username)}&exclude_id=${user?.id}`);
            const result = await response.json();

            if (!result.available) {
                setLocalErrors((prev) => ({
                    ...prev,
                    username: 'Nama pengguna sudah digunakan.',
                }));
            }
        } catch {
            // ignore
        }
    }, [user?.id]);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleUsernameChange = (value: string) => {
        setData('username', value);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (localErrors.username === 'Nama pengguna sudah digunakan.') {
            setLocalErrors((prev) => ({ ...prev, username: undefined }));
        }

        debounceRef.current = setTimeout(() => {
            checkUsername(value);
        }, 500);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto_profil', file);
            setPreviewFoto(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const usernameError = validateUsername(data.username);

        if (usernameError) {
            setLocalErrors({ username: usernameError });
            return;
        }

        setLocalErrors({});
        post('/pengaturan', {
            forceFormData: true,
            onError: (serverErrors) => {
                setLocalErrors(serverErrors);
            },
        });
    };

    const handleLogout = () => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/logout';
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = csrfToken || '';
        form.appendChild(csrfInput);
        document.body.appendChild(form);
        form.submit();
    };

    return (
        <>
            <Head title="Pengaturan - EyeLit" />

            <Navbar />

            <main className="min-h-screen bg-[#ffffff]">
                {/* Breadcrumb */}
                <div className="mx-auto max-w-7xl px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#5f6368]">
                        <a className="hover:text-[#2264c0] transition-colors" href="/">Beranda</a>
                        <span>/</span>
                        <span className="text-[#1b1b18] font-medium">Pengaturan</span>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto px-4">
                    <h1 className="text-2xl font-bold text-[#1b1b18] mb-8">Pengaturan Akun</h1>

                    <form onSubmit={handleSubmit}>
                        {/* Foto Profil */}
                        <div className="bg-white rounded-xl border border-[#19140035] p-6 mb-6">
                            <h2 className="text-lg font-semibold text-[#1b1b18] mb-4">Foto Profil</h2>
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    {previewFoto ? (
                                        <img
                                            src={previewFoto}
                                            alt="Foto Profil"
                                            className="w-24 h-24 rounded-full object-cover border-2 border-[#19140035]"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-[#2264c0] flex items-center justify-center text-white text-2xl font-bold border-2 border-[#19140035]">
                                            {data.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#2264c0] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#1a4f9a] transition-colors">
                                        <Camera className="size-4 text-white" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <div>
                                    <p className="text-sm text-[#706f6c] mb-1">Ubah foto profil</p>
                                    <p className="text-xs text-[#9CA3AF]">Format: JPEG, PNG, JPG, GIF, SVG. Maksimal 2MB</p>
                                </div>
                            </div>
                        </div>

                        {/* Nama Pengguna */}
                        <div className="bg-white rounded-xl border border-[#19140035] p-6 mb-6">
                            <h2 className="text-lg font-semibold text-[#1b1b18] mb-4">Nama Pengguna</h2>
                            <div className="flex items-center gap-4">
                                <User className="size-5 text-[#706f6c]" />
                                <input
                                    type="text"
                                    value={data.username}
                                    onChange={(e) => handleUsernameChange(e.target.value)}
                                    onBlur={(e) => {
                                        const error = validateUsername(e.target.value);
                                        if (error) {
                                            setLocalErrors((prev) => ({ ...prev, username: error }));
                                        }
                                    }}
                                    className={`flex-1 px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#2264c0]/20 ${localErrors.username ? 'border-red-500 focus:border-red-500' : 'border-[#19140035] focus:border-[#2264c0]'}`}
                                    placeholder="Masukkan nama pengguna"
                                />
                            </div>
                            {localErrors.username && (
                                <p className="text-red-500 text-sm mt-2 ml-9">{localErrors.username}</p>
                            )}
                        </div>

                        {/* Email (readonly) */}
                        <div className="bg-white rounded-xl border border-[#19140035] p-6 mb-6">
                            <h2 className="text-lg font-semibold text-[#1b1b18] mb-4">Email</h2>
                            <div className="flex items-center gap-4">
                                <User className="size-5 text-[#706f6c]" />
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    readOnly
                                    className="flex-1 px-4 py-2 rounded-lg border border-[#19140035] text-sm bg-gray-50 text-[#706f6c] cursor-not-allowed"
                                    placeholder="Email tidak dapat diubah"
                                />
                            </div>
                            <p className="text-xs text-[#9CA3AF] mt-2">Email tidak dapat diubah</p>
                        </div>

                        {/* Tombol Simpan */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2264c0] text-white rounded-lg hover:bg-[#1a4f9a] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                        >
                            <Save className="size-5" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </form>

                    {/* Tombol Keluar Akun */}
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium"
                    >
                        <LogOut className="size-5" />
                        Keluar Akun
                    </button>
                </div>

                {/* Logout Confirmation Modal */}
                {showLogoutModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-[#1b1b18]">Konfirmasi Keluar</h3>
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="size-5 text-[#706f6c]" />
                                </button>
                            </div>
                            <p className="text-[#706f6c] mb-6">Apakah Anda yakin ingin keluar dari akun ini?</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="flex-1 px-4 py-2 border border-[#19140035] text-[#706f6c] rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Keluar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}