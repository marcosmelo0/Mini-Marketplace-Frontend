import type { Notification, PaginatedResponse } from '$lib/types/api';
import { httpGet, httpPatch } from '$lib/utils/http';

export async function getMyNotifications(): Promise<Notification[]> {
    const response = await httpGet<PaginatedResponse<Notification>>('/notifications/my-notifications', true);
    return response.data;
}

export async function getUnreadCount(): Promise<{ count: number }> {
    return httpGet<{ count: number }>('/notifications/unread-count', true);
}

export async function markAsRead(id: string): Promise<{ id: string; read: boolean }> {
    return httpPatch<{ id: string; read: boolean }>(`/notifications/${id}/read`, undefined, true);
}
