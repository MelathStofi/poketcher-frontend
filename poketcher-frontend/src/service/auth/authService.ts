import type {
    LoginRequest,
    LoginResponse,
    LogoutResponse,
    RegisterRequest,
    RegisterResponse,
} from './authModels';
import { BASE_URL } from '../serviceUtil';

async function postJson<T>(url: string, body: unknown): Promise<T> {
    const res: Response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        let message: string = `Request failed: ${res.status} ${res.statusText}`;

        try {
            const errorData: unknown = await res.json();
            if (
                typeof errorData === 'object' &&
                errorData !== null &&
                'message' in errorData &&
                typeof (errorData as { message?: unknown }).message === 'string'
            ) {
                message = (errorData as { message: string }).message;
            }
        } catch {
            // TODO
        }

        throw new Error(message);
    }

    return await res.json() as Promise<T>;
}

export async function login(user: LoginRequest): Promise<LoginResponse> {
    return postJson<LoginResponse>(`${BASE_URL}/auth/login`, user);
}

export async function register(user: RegisterRequest): Promise<RegisterResponse> {
    return postJson<RegisterResponse>(`${BASE_URL}/auth/register`, user);
}

export async function logout(): Promise<LogoutResponse> {
    return postJson<LogoutResponse>(`${BASE_URL}/auth/logout`, {});
}