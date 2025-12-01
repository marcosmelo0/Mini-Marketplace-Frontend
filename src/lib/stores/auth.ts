import { writable, derived } from 'svelte/store';
import type { User, LoginRequest, RegisterRequest } from '$lib/types/api';
import * as authApi from '$lib/api/auth';
import { browser } from '$app/environment';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;
}

function createAuthStore() {
    const { subscribe, set, update } = writable<AuthState>({
        user: null,
        isLoading: false,
        isInitialized: false,
        error: null
    });

    return {
        subscribe,
        loadUser: async () => {
            if (!browser) return;

            // Tenta carregar o usuário - se houver cookie válido, funcionará
            try {
                const user = await authApi.getProfile();
                update((state) => ({ ...state, user, isInitialized: true }));
            } catch (error) {
                // Sem cookie válido ou expirado
                update((state) => ({ ...state, user: null, isInitialized: true }));
            }
        },
        login: async (credentials: LoginRequest) => {
            update((state) => ({ ...state, isLoading: true, error: null }));
            try {
                await authApi.login(credentials);
                const user = await authApi.getProfile();
                update((state) => ({ ...state, user, isLoading: false, isInitialized: true }));
                return user;
            } catch (error: any) {
                const errorMessage = error.message || 'Erro ao fazer login';
                update((state) => ({ ...state, error: errorMessage, isLoading: false }));
                throw error;
            }
        },
        register: async (data: RegisterRequest) => {
            update((state) => ({ ...state, isLoading: true, error: null }));
            try {
                const user = await authApi.register(data);
                // Após registro, fazer login automaticamente
                await authApi.login({ email: data.email, password: data.password });
                const profile = await authApi.getProfile();
                update((state) => ({ ...state, user: profile, isLoading: false, isInitialized: true }));
                return user;
            } catch (error: any) {
                const errorMessage = error.message || 'Erro ao registrar';
                update((state) => ({ ...state, error: errorMessage, isLoading: false }));
                throw error;
            }
        },
        logout: async () => {
            await authApi.logout();
            set({ user: null, isLoading: false, isInitialized: true, error: null });
        },
        updateProfile: async (data: { name?: string; phone?: string }) => {
            update((state) => ({ ...state, isLoading: true, error: null }));
            try {
                const user = await authApi.updateProfile(data);
                update((state) => ({ ...state, user, isLoading: false }));
                return user;
            } catch (error: any) {
                const errorMessage = error.message || 'Erro ao atualizar perfil';
                update((state) => ({ ...state, error: errorMessage, isLoading: false }));
                throw error;
            }
        },
        clearError: () => {
            update((state) => ({ ...state, error: null }));
        }
    };
}

export const authStore = createAuthStore();

// Derived stores para facilitar o acesso
export const isAuthenticated = derived(authStore, ($auth) => $auth.user !== null);

export const isProvider = derived(
    authStore,
    ($auth) => $auth.user !== null && $auth.user.role === 'PROVIDER'
);

export const isClient = derived(
    authStore,
    ($auth) => $auth.user !== null && $auth.user.role === 'CLIENT'
);

export const currentUser = derived(authStore, ($auth) => $auth.user);

export const isInitialized = derived(authStore, ($auth) => $auth.isInitialized);
