import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RefreshTokenRequest,
    User,
    UpdateProfileRequest
} from '$lib/types/api';
import { httpPost, httpGet, httpPut, setTokens, clearTokens } from '$lib/utils/http';

export async function register(data: RegisterRequest): Promise<User> {
    return httpPost<User>('/auth/register', data);
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await httpPost<LoginResponse>('/auth/login', credentials);
    await setTokens(response.token, response.refreshToken);
    return response;
}

export async function refreshToken(data: RefreshTokenRequest): Promise<LoginResponse> {
    const response = await httpPost<LoginResponse>('/auth/refresh', data);
    await setTokens(response.token, response.refreshToken);
    return response;
}

export async function getProfile(): Promise<User> {
    return httpGet<User>('/users/profile', true);
}

export async function updateProfile(data: UpdateProfileRequest): Promise<User> {
    return httpPut<User>('/users/profile', data, true);
}

export async function logout(): Promise<void> {
    await clearTokens();
}

export async function getProviders(page = 1, limit = 20) {
    return httpGet(`/users/providers?page=${page}&limit=${limit}`);
}
