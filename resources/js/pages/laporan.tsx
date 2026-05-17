import { Head, Link, usePage } from '@inertiajs/react';
import { Clock, ShoppingBag, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import WaveBackground from '@/components/WaveBackground';
import Navbar from '@/components/Navbar';

const BULAN_OPTIONS = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
];

export default function Laporan() {
    const { auth, totalPenghasilanBulanIni, jumlahPesananSelesai, pesananSelesai, selectedMonth, selectedYear } = usePage().props as any;
    const [selectedMonthLocal, setSelectedMonthLocal] = useState(selectedMonth || new Date().getMonth() + 1);
    const [selectedYearLocal, setSelectedYearLocal] = useState(selectedYear || new Date().getFullYear());

    const handleFilter = () => {
        window.location.href = `/laporan?month=${selectedMonthLocal}&year=${selectedYearLocal}`;
    };

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

    const getBulanLabel = (bulan: number) => {
        const bulanData = BULAN_OPTIONS.find(b => b.value === bulan);
        return bulanData ? bulanData.label : '';
    };

    return (
        <>
            <Head title="Laporan - EyeLit" />

            {/* Navbar */}
            <Navbar activePage="laporan" showAdminNav={true} />

            {/* Page Content */}
            <main className="min-h-screen bg-[#ffffff]">
                {/* Header with Blue Background - Full Width */}
                <WaveBackground>
                    <div className="w-full py-12 px-4">
                        <div className="max-w-7xl mx-auto">
                            <h1 className="text-3xl font-bold text-white mb-2">Laporan</h1>
                            <p className="text-white/80">Laporan penjualan EyeLit</p>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
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

                                {/* Jumlah Pesanan Selesai */}
                                <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1">
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-300"></div>
                                    <div className="relative flex items-center gap-4">
                                        <div className="flex-shrink-0 rounded-xl bg-white/20 p-4 group-hover:bg-white/30 transition-colors duration-300">
                                            <ShoppingBag className="size-8 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white mb-1">Jumlah Pesanan Selesai</p>
                                            <p className="text-3xl font-bold text-white truncate">{jumlahPesananSelesai ?? 0}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </WaveBackground>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Filter Bulan */}
                    <div className="bg-white rounded-xl border border-[#19140035] p-4 mb-6">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-[#706f6c]">Bulan:</label>
                                <select
                                    value={selectedMonthLocal}
                                    onChange={(e) => setSelectedMonthLocal(Number(e.target.value))}
                                    className="px-3 py-2 rounded-lg border border-[#19140035] text-sm focus:outline-none focus:border-[#2264c0] focus:ring-2 focus:ring-[#2264c0]/20"
                                >
                                    {BULAN_OPTIONS.map((bulan) => (
                                        <option key={bulan.value} value={bulan.value}>
                                            {bulan.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-[#706f6c]">Tahun:</label>
                                <select
                                    value={selectedYearLocal}
                                    onChange={(e) => setSelectedYearLocal(Number(e.target.value))}
                                    className="px-3 py-2 rounded-lg border border-[#19140035] text-sm focus:outline-none focus:border-[#2264c0] focus:ring-2 focus:ring-[#2264c0]/20"
                                >
                                    {[2025, 2026, 2027].map((tahun) => (
                                        <option key={tahun} value={tahun}>
                                            {tahun}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={handleFilter}
                                className="px-4 py-2 bg-[#2264c0] text-white rounded-lg hover:bg-[#1a4f9a] transition-colors text-sm font-medium"
                            >
                                Tampilkan
                            </button>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-[#706f6c]">
                                Menampilkan laporan: <span className="font-medium text-[#1b1b18]">{getBulanLabel(selectedMonth)} {selectedYear}</span>
                            </p>
                        </div>
                    </div>

                    {/* Orders Table */}
                    {pesananSelesai && pesananSelesai.length > 0 ? (
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
                                        {pesananSelesai.map((item: any, index: number) => (
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
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-[#19140035]">
                            <ShoppingBag className="size-16 text-[#706f6c] mx-auto mb-4" />
                            <p className="text-[#706f6c]">Belum ada pesanan selesai pada bulan ini</p>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}