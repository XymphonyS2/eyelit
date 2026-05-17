import { Head, Link, usePage } from '@inertiajs/react';
import { Clock, Filter, ShoppingBag, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';
import WaveBackground from '@/components/WaveBackground';
import Navbar from '@/components/Navbar';

const STATUS_OPTIONS = [
    { value: '', label: 'Semua Status' },
    { value: 'Menunggu Konfirmasi Pembayaran', label: 'Menunggu Konfirmasi Pembayaran' },
    { value: 'Dikemas', label: 'Dikemas' },
    { value: 'Dikirim', label: 'Dikirim' },
    { value: 'Pesanan Tiba di Tujuan', label: 'Pesanan Tiba di Tujuan' },
    { value: 'Selesai', label: 'Selesai' },
    { value: 'Dibatalkan', label: 'Dibatalkan' },
];

const SORT_OPTIONS = [
    { value: 'terbaru', label: 'Terbaru' },
    { value: 'terlama', label: 'Terlama' },
];

export default function DaftarPesanan() {
    const { auth, pesanan } = usePage().props as any;
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterSort, setFilterSort] = useState('terbaru');

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

    // Filter and sort pesanan
    const filteredPesanan = pesanan
        ? pesanan
            .filter((p: any) => {
                const matchesStatus = filterStatus === '' || p.status_pesanan === filterStatus;
                const matchesSearch = searchQuery === '' ||
                    p.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.no_pesanan?.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesStatus && matchesSearch;
            })
            .sort((a: any, b: any) => {
                if (filterSort === 'terbaru') {
                    return b.id - a.id;
                } else {
                    return a.id - b.id;
                }
            })
        : [];

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
                                        <p className="text-sm font-medium text-white mb-1">Pesanan Selesai</p>
                                        <p className="text-3xl font-bold text-white truncate">{pesanan?.filter((p: any) => p.status_pesanan === 'Pesanan Tiba di Tujuan' || p.status_pesanan === 'Selesai').length || 0}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Menunggu Konfirmasi Pembayaran */}
                            <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-300"></div>
                                <div className="relative flex items-center gap-4">
                                    <div className="flex-shrink-0 rounded-xl bg-white/20 p-4 group-hover:bg-white/30 transition-colors duration-300">
                                        <Clock className="size-8 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white mb-1">Menunggu Pembayaran</p>
                                        <p className="text-3xl font-bold text-white truncate">{pesanan?.filter((p: any) => p.status_pesanan === 'Menunggu Konfirmasi Pembayaran').length || 0}</p>
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
                                        <p className="text-3xl font-bold text-white truncate">{pesanan?.filter((p: any) => p.status_pesanan === 'Dikemas' || p.status_pesanan === 'Dikirim').length || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </WaveBackground>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Search and Filter Bar */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex-1 max-w-md">
                            <input
                                type="text"
                                placeholder="Cari pesanan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-[#19140035] text-sm focus:outline-none focus:border-[#2264c0] focus:ring-2 focus:ring-[#2264c0]/20"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilter(true)}
                            className="ml-4 flex items-center gap-2 px-4 py-2 bg-[#2264c0] text-white rounded-lg hover:bg-[#1a4f9a] transition-colors"
                        >
                            <Filter className="size-4" />
                            Filter
                        </button>
                    </div>

                    {/* Filter Overlay */}
                    {showFilter && (
                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-[#1b1b18]">Filter Pesanan</h3>
                                    <button
                                        onClick={() => setShowFilter(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X className="size-5 text-[#706f6c]" />
                                    </button>
                                </div>

                                {/* Status Filter */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-[#706f6c] mb-2">Status Pesanan</label>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-[#19140035] text-sm focus:outline-none focus:border-[#2264c0] focus:ring-2 focus:ring-[#2264c0]/20"
                                    >
                                        {STATUS_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sort Filter */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-[#706f6c] mb-2">Urutkan</label>
                                    <select
                                        value={filterSort}
                                        onChange={(e) => setFilterSort(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-[#19140035] text-sm focus:outline-none focus:border-[#2264c0] focus:ring-2 focus:ring-[#2264c0]/20"
                                    >
                                        {SORT_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setFilterStatus('');
                                            setFilterSort('terbaru');
                                        }}
                                        className="flex-1 px-4 py-2 border border-[#19140035] text-[#706f6c] rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={() => setShowFilter(false)}
                                        className="flex-1 px-4 py-2 bg-[#2264c0] text-white rounded-lg hover:bg-[#1a4f9a] transition-colors"
                                    >
                                        Terapkan
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Orders Table */}
                    {filteredPesanan.length > 0 ? (
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
                                    {filteredPesanan
                                        .map((item: any, index: number) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-[#1b1b18]">{index + 1}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-[#1b1b18]">{item.no_pesanan || `#${item.id}`}</td>
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
                        <p className="text-[#706f6c]">Tidak ada pesanan yang sesuai filter</p>
                    </div>
                )}
                </div>
            </main>
        </>
    );
}
