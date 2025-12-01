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

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
        credentials: 'include' // Envia cookies automaticamente
    });

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
