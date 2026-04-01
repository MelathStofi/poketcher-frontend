import React, { JSX, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../service/auth/authService';
import { useAuth } from '../context/authContext';

type AuthMode = 'login' | 'register';

export default function AuthPage(): JSX.Element {
    const navigate = useNavigate();
    const { loginSuccess } = useAuth();

    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (mode === 'login') {
                const response = await login({ email, password });
                loginSuccess(response.poketcher_token);
            } else {
                await register({ username, password, email: email || undefined });
                const response = await login({ email, password });
                loginSuccess(response.poketcher_token);
            }

            navigate('/');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Ismeretlen hiba történt.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-page__card">
                <h1 className="auth-page__title">
                    {mode === 'login' ? 'Bejelentkezés' : 'Regisztráció'}
                </h1>

                <div className="auth-page__tabs">
                    <button
                        type="button"
                        className={`auth-page__tab ${mode === 'login' ? 'auth-page__tab--active' : ''}`}
                        onClick={(): void => setMode('login')}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className={`auth-page__tab ${mode === 'register' ? 'auth-page__tab--active' : ''}`}
                        onClick={(): void => setMode('register')}
                    >
                        Register
                    </button>
                </div>

                <form className="auth-page__form" onSubmit={handleSubmit}>
                    <label className="auth-page__field">
                        <span>Email</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setEmail(e.target.value)}
                            required
                        />
                    </label>

                    {mode === 'register' && (
                        <label className="auth-page__field">
                            <span>Username</span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setUsername(e.target.value)}
                                required
                            />
                        </label>
                    )}

                    <label className="auth-page__field">
                        <span>Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value)}
                            required
                        />
                    </label>

                    {error && <p className="auth-page__error">{error}</p>}

                    <button type="submit" className="auth-page__submit" disabled={isLoading}>
                        {isLoading ? 'Feldolgozás...' : mode === 'login' ? 'Belépés' : 'Regisztráció'}
                    </button>
                </form>
            </div>
        </div>
    );
}