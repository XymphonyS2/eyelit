import { Head, usePage } from '@inertiajs/react';
import { Calendar, Mail, Package, User, Users } from 'lucide-react';
import { useState } from 'react';
import WaveBackground from '@/components/WaveBackground';
import Navbar from '@/components/Navbar';

export default function DaftarPengguna() {
    const { auth, pengguna } = usePage().props as any;
    const [searchQuery, setSearchQuery] = useState('');

    const getRoleBadgeColor = (role: string) => {
        const colors: Record<string, string> = {
            'admin': 'bg-purple-100 text-purple-800',
            'pengguna': 'bg-blue-100 text-blue-800',
        };
        return colors[role?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    const formatRole = (peran: string) => {
        if (!peran) return '-';
        return peran.charAt(0).toUpperCase() + peran.slice(1).toLowerCase();
    };

    const getStatusBadgeColor = (status: string) => {
        const colors: Record<string, string> = {
            'aktif': 'bg-green-100 text-green-800',
            'nonaktif': 'bg-red-100 text-red-800',
            'terblokir': 'bg-gray-100 text-gray-800',
        };
        return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    return (
        <>
            <Head title="Daftar Pengguna - EyeLit" />

            {/* Navbar */}
            <Navbar activePage="pengguna" showAdminNav={true} />

            {/* Page Content */}
            <main className="min-h-screen bg-[#ffffff]">
                {/* Header with Blue Background - Full Width */}
                <WaveBackground>
                <div className="w-full py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-white mb-2">Daftar Pengguna</h1>
                        <p className="text-white/80">Kelola semua pengguna EyeLit</p>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            {/* Total Pengguna */}
                            <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-300"></div>
                                <div className="relative flex items-center gap-4">
                                    <div className="flex-shrink-0 rounded-xl bg-white/20 p-4 group-hover:bg-white/30 transition-colors duration-300">
                                        <Users className="size-8 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white mb-1">Total Pengguna</p>
                                        <p className="text-3xl font-bold text-white truncate">{pengguna?.length || 0}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Admin */}
                            <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-300"></div>
                                <div className="relative flex items-center gap-4">
                                    <div className="flex-shrink-0 rounded-xl bg-white/20 p-4 group-hover:bg-white/30 transition-colors duration-300">
                                        <User className="size-8 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white mb-1">Admin</p>
                                        <p className="text-3xl font-bold text-white truncate">{pengguna?.filter((p: any) => p.peran === 'Admin').length || 0}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Pengguna Biasa */}
                            <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-300"></div>
                                <div className="relative flex items-center gap-4">
                                    <div className="flex-shrink-0 rounded-xl bg-white/20 p-4 group-hover:bg-white/30 transition-colors duration-300">
                                        <Package className="size-8 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white mb-1">Pengguna Biasa</p>
                                        <p className="text-3xl font-bold text-white truncate">{pengguna?.filter((p: any) => p.peran === 'Pengguna').length || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </WaveBackground>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Users Table */}
                    {pengguna && pengguna.length > 0 ? (
                        <div className="bg-white rounded-xl border border-[#19140035] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-[#19140035]">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">No</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Profil</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Nama Pengguna</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Tanggal Daftar</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#19140035]/20">
                                        {pengguna
                                            .filter((item: any) =>
                                                searchQuery === '' ||
                                                item.username?.toLowerCase().includes(searchQuery.toLowerCase())
                                            )
                                            .map((item: any, index: number) => (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-[#1b1b18]">{index + 1}</td>
                                                <td className="px-6 py-4">
                                                    <div className="w-12 h-12 rounded-full bg-[#2264c0] flex items-center justify-center text-white font-bold text-lg">
                                                        {item.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-[#1b1b18]">{item.username}</td>
                                                <td className="px-6 py-4 text-sm text-[#706f6c]">
                                                    <div className="flex items-center gap-1">
                                                        <Mail className="size-4" />
                                                        {item.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(item.peran)}`}>
                                                        {formatRole(item.peran)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-[#706f6c]">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="size-4" />
                                                        {item.tanggal_daftar
                                                            ? new Date(item.tanggal_daftar).toLocaleDateString('id-ID', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })
                                                            : item.created_at
                                                                ? new Date(item.created_at).toLocaleDateString('id-ID', {
                                                                    day: '2-digit',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                })
                                                                : '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(item.status_akun)}`}>
                                                        {item.status_akun}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-[#19140035]">
                            <Users className="size-16 text-[#706f6c] mx-auto mb-4" />
                            <p className="text-[#706f6c]">Belum ada pengguna aktif</p>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}