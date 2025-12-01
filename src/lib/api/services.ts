import type {
    Service,
    CreateServiceRequest,
    UpdateServiceRequest,
    PaginatedResponse
} from '$lib/types/api';
import { httpGet, httpPost, httpPut, httpDelete } from '$lib/utils/http';

export async function getServices(params?: {
    page?: number;
    limit?: number;
    category?: string;
    sort?: string;
    order?: 'asc' | 'desc';
}): Promise<PaginatedResponse<Service>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);

    const query = queryParams.toString();
    return httpGet<PaginatedResponse<Service>>(`/services${query ? `?${query}` : ''}`);
}

export async function getServiceById(id: string): Promise<Service> {
    return httpGet<Service>(`/services/${id}`);
}

export async function getServiceTypes(): Promise<string[]> {
    return httpGet<string[]>('/services/types');
}

export async function getPopularServices(page = 1, limit = 10): Promise<PaginatedResponse<Service>> {
    return httpGet<PaginatedResponse<Service>>(`/services/popular?page=${page}&limit=${limit}`);
}

export async function createService(data: CreateServiceRequest): Promise<Service> {
    return httpPost<Service>('/services', data, true);
}

export async function updateService(id: string, data: UpdateServiceRequest): Promise<Service> {
    return httpPut<Service>(`/services/${id}`, data, true);
}

export async function deleteService(id: string): Promise<void> {
    return httpDelete<void>(`/services/${id}`, true);
}

export async function getMyServices(page = 1, limit = 20): Promise<PaginatedResponse<Service>> {
    return httpGet<PaginatedResponse<Service>>(
        `/services/provider/my-services?page=${page}&limit=${limit}`,
        true
    );
}
