import { Head, Link, usePage, router } from '@inertiajs/react';
import { Clock, Edit, ShoppingBag, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';
import WaveBackground from '@/components/WaveBackground';
import Navbar from '@/components/Navbar';

export default function Demo() {
    const { auth, pesanan } = usePage().props as any;
    const [searchQuery, setSearchQuery] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const getStatusColor = (status: string) => {
        const statusColors: Record<string, string> = {
            'Menunggu Konfirmasi Pembayaran': 'bg-yellow-100 text-yellow-800',
            'Dikemas': 'bg-indigo-100 text-indigo-800',
            'Dikirim': 'bg-purple-100 text-purple-800',
            'Pesanan Tiba di Tujuan': 'bg-cyan-100 text-cyan-800',
            'Selesai': 'bg-green-100 text-green-800',
            'Dibatalkan': 'bg-red-100 text-red-800',
        };
        return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    const statusOptions = [
        { value: 'Menunggu Konfirmasi Pembayaran', label: 'Menunggu Konfirmasi Pembayaran' },
        { value: 'Dikemas', label: 'Dikemas' },
        { value: 'Dikirim', label: 'Dikirim' },
        { value: 'Pesanan Tiba di Tujuan', label: 'Pesanan Tiba di Tujuan' },
        { value: 'Selesai', label: 'Selesai' },
        { value: 'Dibatalkan', label: 'Dibatalkan' },
    ];

    const getKodeEkspedisi = (nama: string): string => {
        const kodeMap: Record<string, string> = {
            'JNE (REG)': 'JNE',
            'J&T Express': 'JNT',
            'SiCepat (BEST)': 'SICEPAT',
            'AnterAja': 'AA',
            'Pos Indonesia': 'POS',
        };
        return kodeMap[nama] || nama.substring(0, 3).toUpperCase();
    };

    const NEXT_STATUS: Record<string, { next: string; label: string } | null> = {
        'Menunggu Konfirmasi Pembayaran': { next: 'Dikemas', label: 'Kirim' },
        'Dikemas': { next: 'Dikirim', label: 'Kirim' },
        'Dikirim': { next: 'Pesanan Tiba di Tujuan', label: 'Tiba' },
        'Pesanan Tiba di Tujuan': { next: 'Selesai', label: 'Selesai' },
        'Selesai': null,
        'Dibatalkan': null,
    };

    const handleEdit = (item: any) => {
        setSelectedOrder(item);
        setShowEditModal(true);
    };

    const formatLocalDateTime = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    };

    const handleNextStatus = () => {
        if (!selectedOrder) return;
        const next = NEXT_STATUS[selectedOrder.status_pesanan];
        if (next) {
            const updated = { ...selectedOrder, status_pesanan: next.next };
            const ekspedisiKode = getKodeEkspedisi(updated.ekspedisi?.nama_ekspedisi || 'N/A');
            const resiNumber = (updated.id || '').toString().padStart(4, '0') + Math.floor(Math.random() * 90000 + 10000).toString();
            if (next.next === 'Dikemas') {
                updated.tanggal_konfirmasi_pembayaran = formatLocalDateTime(new Date());
                updated.no_resi = updated.no_resi || ekspedisiKode + resiNumber;
            }
            if (next.next === 'Dikirim') {
                updated.tanggal_pengiriman = formatLocalDateTime(new Date());
                updated.no_resi = updated.no_resi || ekspedisiKode + resiNumber;
            }
            if (['Pesanan Tiba di Tujuan'].includes(next.next)) {
                updated.no_resi = updated.no_resi || ekspedisiKode + resiNumber;
            }
            if (next.next === 'Pesanan Tiba di Tujuan') {
                updated.tanggal_tiba = formatLocalDateTime(new Date());
            }
            if (next.next === 'Selesai') {
                updated.tanggal_tiba = updated.tanggal_tiba || formatLocalDateTime(new Date());
                updated.tanggal_selesai = formatLocalDateTime(new Date());
            }
            setSelectedOrder(updated);
        }
    };

    const handleSave = () => {
        if (!selectedOrder) return;

        router.put(`/demo/${selectedOrder.id}`, {
            status_pesanan: selectedOrder.status_pesanan,
            no_resi: selectedOrder.no_resi || null,
            tanggal_konfirmasi_pembayaran: selectedOrder.tanggal_konfirmasi_pembayaran || null,
            tanggal_pengiriman: selectedOrder.tanggal_pengiriman || null,
            tanggal_tiba: selectedOrder.tanggal_tiba || null,
            tanggal_selesai: selectedOrder.tanggal_selesai || null,
        }, {
            onSuccess: () => setShowEditModal(false),
        });
    };

    return (
        <>
            <Head title="Demo - EyeLit" />

            {/* Navbar */}
            <Navbar activePage="demo" showAdminNav={true} />

            {/* Page Content */}
            <main className="min-h-screen bg-[#ffffff]">
                {/* Header with Blue Background - Full Width */}
                <WaveBackground>
                <div className="w-full py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-white mb-2">Demo Edit Pesanan</h1>
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
                                        <p className="text-3xl font-bold text-white truncate">{pesanan?.filter((p: any) => ['Dikemas', 'Dikirim', 'Pesanan Tiba di Tujuan'].includes(p.status_pesanan)).length || 0}</p>
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
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-[#2264c0] rounded-full hover:bg-[#1a4f9a] transition-colors"
                                                >
                                                    <Edit className="size-4" />
                                                    Edit
                                                </button>
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

                {/* Edit Modal */}
                {showEditModal && selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-[#19140035]">
                                <h3 className="text-lg font-semibold text-[#1b1b18]">Edit Pesanan #{selectedOrder.id}</h3>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X className="size-5 text-[#706f6c]" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-[#1b1b18] mb-2">Pengguna</label>
                                    <p className="text-sm text-[#706f6c]">{selectedOrder.user?.username || 'N/A'}</p>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-[#1b1b18] mb-2">Total Harga</label>
                                    <p className="text-sm font-bold text-[#2264c0]">Rp {(Number(selectedOrder.total_harga) || 0).toLocaleString('id-ID')}</p>
                                </div>

                                {selectedOrder.no_resi && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-[#1b1b18] mb-2">No. Resi</label>
                                        <p className="text-sm text-[#706f6c] font-mono">
                                            {selectedOrder.no_resi}
                                        </p>
                                    </div>
                                )}

                                {selectedOrder.tanggal_konfirmasi_pembayaran && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-[#1b1b18] mb-2">Tanggal Konfirmasi Pembayaran</label>
                                        <p className="text-sm text-[#706f6c]">
                                            {new Date(selectedOrder.tanggal_konfirmasi_pembayaran).toLocaleDateString('id-ID', {
                                                day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                )}

                                {selectedOrder.tanggal_pengiriman && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-[#1b1b18] mb-2">Tanggal Pengiriman</label>
                                        <p className="text-sm text-[#706f6c]">
                                            {new Date(selectedOrder.tanggal_pengiriman).toLocaleDateString('id-ID', {
                                                day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                )}

                                {selectedOrder.tanggal_tiba && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-[#1b1b18] mb-2">Tanggal Tiba</label>
                                        <p className="text-sm text-[#706f6c]">
                                            {new Date(selectedOrder.tanggal_tiba).toLocaleDateString('id-ID', {
                                                day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                )}

                                {selectedOrder.tanggal_selesai && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-[#1b1b18] mb-2">Tanggal Selesai</label>
                                        <p className="text-sm text-[#706f6c]">
                                            {new Date(selectedOrder.tanggal_selesai).toLocaleDateString('id-ID', {
                                                day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-[#1b1b18] mb-3">Status Pesanan Saat Ini</label>
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        {selectedOrder.status_pesanan}
                                    </span>
                                    {NEXT_STATUS[selectedOrder.status_pesanan] ? (
                                        <button
                                            onClick={handleNextStatus}
                                            className="w-full mt-6 py-3 bg-[#2264c0] text-white font-semibold rounded-full hover:bg-[#1a4f9a] transition-colors"
                                        >
                                            Lanjut ke: {NEXT_STATUS[selectedOrder.status_pesanan]?.label}
                                        </button>
                                    ) : (
                                        <p className="text-center text-sm text-[#9CA3AF] py-3">Pesanan sudah selesai atau dibatalkan</p>
                                    )}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#19140035] bg-gray-50">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-[#706f6c] hover:text-[#1b1b18] transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#2264c0] rounded-full hover:bg-[#1a4f9a] transition-colors"
                                >
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}