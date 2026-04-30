import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {

    return (
        <div className="relative grid min-h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Kolom Kiri - Background Image */}
            <div className="relative hidden h-full flex-col p-10 lg:flex">
                <div className="absolute inset-0">
                    <img
                        src="/images/auth/login-background.png"
                        alt="EyeLit Background"
                        className="h-full w-full object-cover object-center"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
                </div>
                <a href="/" className="z-20 block size-12">
                    <img
                        src="/images/logo/Auth.svg"
                        alt="EyeLit Logo"
                        className="size-full object-contain"
                    />
                </a>
                {/* Teks overlay di bawah logo */}
                <div className="relative z-20 mt-auto">
                    <h2 className="text-3xl font-bold text-white">Selamat Datang di EyeLit</h2>
                    <p className="mt-2 text-white/80">Kacamata pilihan terbaik untuk gaya hidup Anda</p>
                </div>
            </div>

            {/* Kolom Kanan - Form */}
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                    <a href="/" className="max-lg:block hidden z-20 mx-auto size-14">
                    <img
                        src="/images/logo/AuthMobile.svg"
                        alt="EyeLit Logo"
                        className="size-full object-contain"
                    />
                    </a>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-2xl font-semibold">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}