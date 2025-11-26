import type { ApiError } from '$lib/types/api';

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';

export class HttpError extends Error {
    constructor(
        public status: number,
        public data: ApiError
    ) {
        super(typeof data.error === 'string' ? data.error : 'Validation error');
    }
}

async function getToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}

async function getRefreshToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
}

export async function setTokens(token: string, refreshToken: string): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
}

export async function clearTokens(): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
}

async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return null;

    try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });

        if (!response.ok) {
            await clearTokens();
            return null;
        }

        const data = await response.json();
        await setTokens(data.token, data.refreshToken);
        return data.token;
    } catch (error) {
        await clearTokens();
        return null;
    }
}

interface RequestOptions extends RequestInit {
    requiresAuth?: boolean;
}

export async function http<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { requiresAuth = false, ...fetchOptions } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (requiresAuth) {
        let token = await getToken();

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    let response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        headers
    });

    // Se receber 401 e tiver refresh token, tentar renovar
    if (response.status === 401 && requiresAuth) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            headers['Authorization'] = `Bearer ${newToken}`;
            response = await fetch(`${API_URL}${endpoint}`, {
                ...fetchOptions,
                headers
            });
        }
    }

    if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
            error: 'An error occurred'
        }));
        throw new HttpError(response.status, error);
    }

    // Para respostas 204 (No Content)
    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}

// Helpers para métodos HTTP comuns
export const httpGet = <T>(endpoint: string, requiresAuth = false) =>
    http<T>(endpoint, { method: 'GET', requiresAuth });

export const httpPost = <T>(endpoint: string, body: unknown, requiresAuth = false) =>
    http<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
        requiresAuth
    });

export const httpPut = <T>(endpoint: string, body: unknown, requiresAuth = false) =>
    http<T>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body),
        requiresAuth
    });

export const httpPatch = <T>(endpoint: string, body?: unknown, requiresAuth = false) =>
    http<T>(endpoint, {
        method: 'PATCH',
        body: body ? JSON.stringify(body) : undefined,
        requiresAuth
    });

export const httpDelete = <T>(endpoint: string, requiresAuth = false) =>
    http<T>(endpoint, { method: 'DELETE', requiresAuth });
