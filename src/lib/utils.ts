import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateSeed() {
    const randomBytes = new Uint8Array(20);
    crypto.getRandomValues(randomBytes);
    return '0x' + Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
