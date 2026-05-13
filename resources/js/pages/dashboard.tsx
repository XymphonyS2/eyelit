import { Head, Link, usePage } from '@inertiajs/react';
import { TrendingUp, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import WaveBackground from '@/components/WaveBackground';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
    const { auth, produk, totalPengguna, totalPesanan, jumlahPesananBulanIni, totalPenghasilanBulanIni } = usePage().props as any;

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
                                    <p className="text-2xl font-bold text-white truncate">Rp {(totalPenghasilanBulanIni ?? 0).toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Lihat Detail */}
                        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/30 p-6 transition-all duration-300 hover:from-white/30 hover:to-white/15 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1">
                            <Link
                                href="/detail-bulan-ini"
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
            </main>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [],
};
