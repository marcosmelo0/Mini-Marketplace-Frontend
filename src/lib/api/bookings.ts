import type { Booking, CreateBookingRequest, PaginatedResponse } from '$lib/types/api';
import { httpPost, httpGet, httpPatch } from '$lib/utils/http';

export async function createBooking(data: CreateBookingRequest): Promise<Booking> {
    return httpPost<Booking>('/bookings', data, true);
}

export async function getMyBookings(page = 1, limit = 20): Promise<PaginatedResponse<Booking>> {
    return httpGet<PaginatedResponse<Booking>>(
        `/bookings/client/my-bookings?page=${page}&limit=${limit}`,
        true
    );
}

export async function getProviderBookings(page = 1, limit = 20): Promise<PaginatedResponse<Booking>> {
    return httpGet<PaginatedResponse<Booking>>(
        `/bookings/provider/my-bookings?page=${page}&limit=${limit}`,
        true
    );
}

export async function cancelBooking(id: string): Promise<Booking> {
    return httpPatch<Booking>(`/bookings/${id}/cancel`, undefined, true);
}
