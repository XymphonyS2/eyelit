import { useCallback } from 'react';

export type GetInitialsFn = (fullName: string) => string;

export function useInitials(): GetInitialsFn {
    return useCallback((fullName: string): string => {
        if (!fullName || typeof fullName !== 'string') {
            return '';
        }

        const names = fullName.trim().split(' ');

        if (names.length === 0 || (names.length === 1 && names[0] === '')) {
            return '';
        }

        if (names.length === 1) {
            return names[0].charAt(0).toUpperCase();
        }

        const firstInitial = names[0].charAt(0);
        const lastInitial = names[names.length - 1].charAt(0);

        return `${firstInitial}${lastInitial}`.toUpperCase();
    }, []);
}
