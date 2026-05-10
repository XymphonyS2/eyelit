import type { AppLayoutProps } from '@/types';

export default function AppHeaderOnlyLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-[#FDFDFC]">
            {children}
        </div>
    );
}
