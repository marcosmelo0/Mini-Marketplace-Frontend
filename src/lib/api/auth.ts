import type {
    LoginRequest,
    RegisterRequest,
    User,
    UpdateProfileRequest
} from '$lib/types/api';
import { httpPost, httpGet, httpPut } from '$lib/utils/http';

export async function register(data: RegisterRequest): Promise<User> {
    return httpPost<User>('/auth/register', data);
}

export async function login(credentials: LoginRequest): Promise<{ message: string }> {
    // Backend define cookies automaticamente via Set-Cookie header
    return httpPost<{ message: string }>('/auth/login', credentials);
}

export async function refreshToken(): Promise<{ message: string }> {
    // Backend lê refreshToken do cookie automaticamente
    return httpPost<{ message: string }>('/auth/refresh', {});
}

export async function getProfile(): Promise<User> {
    return httpGet<User>('/users/profile', true);
}

export async function updateProfile(data: UpdateProfileRequest): Promise<User> {
    return httpPut<User>('/users/profile', data, true);
}

export async function logout(): Promise<void> {
    // Chama endpoint do backend para limpar cookies
    await httpPost<{ message: string }>('/auth/logout', {});
}

export async function getProviders(page = 1, limit = 20) {
    return httpGet(`/users/providers?page=${page}&limit=${limit}`);
}
