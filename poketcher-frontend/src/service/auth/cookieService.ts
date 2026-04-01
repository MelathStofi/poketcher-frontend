export function getCookie(name: string): string | null {
    const cookies: string[] = document.cookie.split('; ').filter(Boolean);

    for (const cookie of cookies) {
        const [cookieName, ...rest] = cookie.split('=');
        if (cookieName === name) {
            return decodeURIComponent(rest.join('='));
        }
    }

    return null;
}

export function setCookie(name: string, value: string, maxAgeSeconds: number): void {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; sameSite=lax`;
}

export function deleteCookie(name: string): void {
    document.cookie = `${name}=; path=/; max-age=0; sameSite=lax`;
}

export function hasCookie(name: string): boolean {
    return getCookie(name) !== null;
}