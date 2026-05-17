import { Link } from '@inertiajs/react';

interface AdminNavLinksProps {
    activePage: 'dashboard' | 'produk' | 'pesanan' | 'pengguna' | 'laporan' | 'carousel' | 'demo';
}

export default function AdminNavLinks({ activePage }: AdminNavLinksProps) {
    const navItems = [
        { href: '/dashboard', label: 'Dashboard', key: 'dashboard' as const },
        { href: '/produk', label: 'Produk', key: 'produk' as const },
        { href: '/daftar-pesanan', label: 'Pesanan', key: 'pesanan' as const },
        { href: '/pengguna', label: 'Pengguna', key: 'pengguna' as const },
        { href: '/laporan', label: 'Laporan', key: 'laporan' as const },
        { href: '/carousel', label: 'Carousel', key: 'carousel' as const },
        { href: '/demo', label: 'Demo', key: 'demo' as const },
    ];

    return (
        <div className="border-b border-[#19140035]/50 bg-white">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex items-center justify-center gap-6 overflow-x-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.key}
                            href={item.href}
                            className={`py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                                activePage === item.key
                                    ? 'text-[#2264c0]'
                                    : 'text-[#706f6c] hover:text-[#2264c0]'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}