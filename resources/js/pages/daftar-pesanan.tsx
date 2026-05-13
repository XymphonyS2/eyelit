import { Head, Link, usePage } from '@inertiajs/react';
import { Clock, ShoppingBag, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import WaveBackground from '@/components/WaveBackground';
import Navbar from '@/components/Navbar';

export default function DaftarPesanan() {
    const { auth, pesanan } = usePage().props as any;
    const [searchQuery, setSearchQuery] = useState('');

    const getStatusColor = (status: string) => {
        const statusColors: Record<string, string> = {
            'menunggu pembayaran': 'bg-yellow-100 text-yellow-800',
            'diproses': 'bg-blue-100 text-blue-800',
            'dikirim': 'bg-indigo-100 text-indigo-800',
            'selesai': 'bg-green-100 text-green-800',
            'dibatalkan': 'bg-red-100 text-red-800',
        };
        return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    return (
        <>
            <Head title="Daftar Pesanan - EyeLit" />

            {/* Navbar */}
            <Navbar activePage="pesanan" showAdminNav={true} />

            {/* Page Content */}
            <main className="min-h-screen bg-[#ffffff]">
                {/* Header with Blue Background - Full Width */}
                <WaveBackground>
                <div className="w-full py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-white mb-2">Daftar Pesanan</h1>
                        <p className="text-white/80">Kelola semua pesanan EyeLit</p>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            {/* Total Pesanan */}
                            <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-300"></div>
                                <div className="relative flex items-center gap-4">
                                    <div className="flex-shrink-0 rounded-xl bg-white/20 p-4 group-hover:bg-white/30 transition-colors duration-300">
                                        <ShoppingBag className="size-8 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white mb-1">Total Pesanan</p>
                                        <p className="text-3xl font-bold text-white truncate">{pesanan?.length || 0}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Placeholder Cards for Layout Balance */}
                            <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-300"></div>
                                <div className="relative flex items-center gap-4">
                                    <div className="flex-shrink-0 rounded-xl bg-white/20 p-4 group-hover:bg-white/30 transition-colors duration-300">
                                        <Clock className="size-8 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white mb-1">Menunggu Pembayaran</p>
                                        <p className="text-3xl font-bold text-white truncate">{pesanan?.filter((p: any) => p.status_pesanan === 'menunggu pembayaran').length || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-300"></div>
                                <div className="relative flex items-center gap-4">
                                    <div className="flex-shrink-0 rounded-xl bg-white/20 p-4 group-hover:bg-white/30 transition-colors duration-300">
                                        <TrendingUp className="size-8 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white mb-1">Sedang Diproses</p>
                                        <p className="text-3xl font-bold text-white truncate">{pesanan?.filter((p: any) => p.status_pesanan === 'diproses' || p.status_pesanan === 'dikirim').length || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </WaveBackground>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Orders Table */}
                    {pesanan && pesanan.length > 0 ? (
                        <div className="bg-white rounded-xl border border-[#19140035] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                <thead className="bg-gray-50 border-b border-[#19140035]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">No</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">ID Pesanan</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Pengguna</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Total Harga</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#19140035]/20">
                                    {pesanan
                                        .filter((item: any) =>
                                            searchQuery === '' ||
                                            item.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .map((item: any, index: number) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-[#1b1b18]">{index + 1}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-[#1b1b18]">#{item.id}</td>
                                            <td className="px-6 py-4 text-sm text-[#706f6c]">{item.user?.username || 'N/A'}</td>
                                            <td className="px-6 py-4 text-sm text-[#706f6c]">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="size-4" />
                                                    {new Date(item.tanggal_pemesanan).toLocaleDateString('id-ID', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-[#2264c0]">Rp {(Number(item.total_harga) || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status_pesanan)}`}>
                                                    {item.status_pesanan}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/daftar-pesanan/${item.id}`}
                                                    className="text-sm font-medium text-[#2264c0] hover:text-[#1a4f9a] transition-colors"
                                                >
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-[#19140035]">
                        <ShoppingBag className="size-16 text-[#706f6c] mx-auto mb-4" />
                        <p className="text-[#706f6c]">Belum ada pesanan</p>
                    </div>
                )}
                </div>
            </main>
        </>
    );
}
