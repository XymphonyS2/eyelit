import { Head, Link, usePage } from '@inertiajs/react';
import { Clock, TrendingUp, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import WaveBackground from '@/components/WaveBackground';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
    const { auth, produk, totalPengguna, totalPesanan, jumlahPesananBulanIni, totalPenghasilanBulanIni, recentOrders } = usePage().props as any;

    const getStatusColor = (status: string) => {
        const statusColors: Record<string, string> = {
            'menunggu konfirmasi pembayaran': 'bg-yellow-100 text-yellow-800',
            'dikemas': 'bg-blue-100 text-blue-800',
            'dikirim': 'bg-indigo-100 text-indigo-800',
            'pesanan tiba di tujuan': 'bg-purple-100 text-purple-800',
            'selesai': 'bg-green-100 text-green-800',
            'dibatalkan': 'bg-red-100 text-red-800',
        };
        return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    return (
        <>
            <Head title="Dashboard" />

            {/* Navbar */}
            <Navbar activePage="dashboard" showAdminNav={true} />

            {/* Dashboard Content */}
            {/* Header with Blue Background - Full Width */}
            <WaveBackground>
            <div className="w-full py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-white/80">Selamat datang, {auth.user?.username}!</p>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {/* Jumlah Pesanan Bulan Ini */}
                        <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-300"></div>
                            <div className="relative flex items-center gap-4">
                                <div className="flex-shrink-0 rounded-xl bg-white/20 p-4 group-hover:bg-white/30 transition-colors duration-300">
                                    <ShoppingBag className="size-8 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white mb-1">Jumlah Pesanan Bulan Ini</p>
                                    <p className="text-3xl font-bold text-white truncate">{jumlahPesananBulanIni ?? 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Total Penghasilan Bulan Ini */}
                        <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-300"></div>
                            <div className="relative flex items-center gap-4">
                                <div className="flex-shrink-0 rounded-xl bg-white/20 p-4 group-hover:bg-white/30 transition-colors duration-300">
                                    <TrendingUp className="size-8 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white mb-1">Total Penghasilan Bulan Ini</p>
                                    <p className="text-2xl font-bold text-white truncate">Rp {(Number(totalPenghasilanBulanIni) || 0).toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Lihat Detail */}
                        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/30 p-6 transition-all duration-300 hover:from-white/30 hover:to-white/15 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1">
                            <Link
                                href="/laporan"
                                className="relative flex flex-col items-center justify-center gap-2 text-center h-full"
                            >
                                <span className="text-xl font-bold text-white group-hover:scale-105 transition-transform duration-300">Lihat Detail Bulan Ini</span>
                                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">Lihat Laporan Lengkap →</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            </WaveBackground>

            <main className="mx-auto max-w-7xl px-4 py-8">
                {/* Recent Orders Table */}
                <div className="bg-white rounded-xl border border-[#19140035] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-[#19140035]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Nomer</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">No Pesanan</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Total Harga</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#706f6c] uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#19140035]/20">
                                {recentOrders && recentOrders.length > 0 ? (
                                    recentOrders.map((item: any, index: number) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-[#1b1b18]">{index + 1}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-[#1b1b18]">{item.no_pesanan || `#${item.id}`}</td>
                                            <td className="px-6 py-4 text-sm text-[#706f6c]">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="size-4" />
                                                    {item.tanggal_pemesanan
                                                        ? new Date(item.tanggal_pemesanan).toLocaleDateString('id-ID', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })
                                                        : '-'}
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
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-[#706f6c]">
                                            Belum ada pesanan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [],
};
