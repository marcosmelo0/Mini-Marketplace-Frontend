import { writable } from 'svelte/store';
import type { Notification } from '$lib/types/api';
import * as notificationsApi from '$lib/api/notifications';
import { browser } from '$app/environment';

interface NotificationsState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
}

function createNotificationsStore() {
    const { subscribe, set, update } = writable<NotificationsState>({
        notifications: [],
        unreadCount: 0,
        isLoading: false,
        error: null
    });

    let pollInterval: ReturnType<typeof setInterval> | null = null;

    return {
        subscribe,
        fetch: async () => {
            update((state) => ({ ...state, isLoading: true, error: null }));
            try {
                const [notifications, { count }] = await Promise.all([
                    notificationsApi.getMyNotifications(),
                    notificationsApi.getUnreadCount()
                ]);
                update((state) => ({
                    ...state,
                    notifications,
                    unreadCount: count,
                    isLoading: false
                }));
            } catch (error: any) {
                console.error('Erro ao carregar notificações:', error);
                const errorMessage = error.message || 'Erro ao carregar notificações';
                update((state) => ({ ...state, error: errorMessage, isLoading: false }));
            }
        },
        markAsRead: async (id: string) => {
            try {
                await notificationsApi.markAsRead(id);
                update((state) => ({
                    ...state,
                    notifications: state.notifications.map((n) =>
                        n.id === id ? { ...n, read: true } : n
                    ),
                    unreadCount: Math.max(0, state.unreadCount - 1)
                }));
            } catch (error: any) {
                console.error('Erro ao marcar notificação como lida:', error);
            }
        },
        startPolling: (intervalMs = 30000) => {
            if (!browser) return;

            if (pollInterval) {
                clearInterval(pollInterval);
            }

            pollInterval = setInterval(async () => {
                try {
                    const { count } = await notificationsApi.getUnreadCount();
                    update((state) => ({ ...state, unreadCount: count }));
                } catch (error) {
                    console.error('Erro ao atualizar contador de notificações:', error);
                }
            }, intervalMs);
        },
        stopPolling: () => {
            if (pollInterval) {
                clearInterval(pollInterval);
                pollInterval = null;
            }
        },
        clear: () => {
            set({
                notifications: [],
                unreadCount: 0,
                isLoading: false,
                error: null
            });
        }
    };
}

export const notificationsStore = createNotificationsStore();
