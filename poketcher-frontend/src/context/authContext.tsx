import React, { createContext, useContext, useMemo, useState, type JSX, type ReactNode } from 'react';
import { deleteCookie, hasCookie } from '../service/auth/cookieService';

type AuthContextValue = {
    isAuthenticated: boolean;
    loginSuccess: (token: string) => void;
    logoutSuccess: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => hasCookie('poketcher_token'));
    console.log('isAuthenticated', isAuthenticated);
    const value: AuthContextValue = useMemo(
        () => ({
            isAuthenticated,
            loginSuccess: (): void => {
                setIsAuthenticated(true);
            },
            logoutSuccess: (): void => {
                deleteCookie('poketcher_token');
                setIsAuthenticated(false);
            },
        }),
        [isAuthenticated],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const context: AuthContextValue | null = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}