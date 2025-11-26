import type {
    Availability,
    CreateAvailabilityRequest,
    UpdateAvailabilityRequest
} from '$lib/types/api';
import { httpPost, httpGet, httpPut, httpDelete } from '$lib/utils/http';

export async function createAvailability(data: CreateAvailabilityRequest): Promise<Availability> {
    return httpPost<Availability>('/availabilities', data, true);
}

export async function getMyAvailabilities(): Promise<Availability[]> {
    return httpGet<Availability[]>('/availabilities/my-availabilities', true);
}

export async function updateAvailability(
    id: string,
    data: UpdateAvailabilityRequest
): Promise<Availability> {
    return httpPut<Availability>(`/availabilities/${id}`, data, true);
}

export async function deleteAvailability(id: string): Promise<void> {
    return httpDelete<void>(`/availabilities/${id}`, true);
}
