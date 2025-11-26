import type { Service, PaginatedResponse } from '$lib/types/api';
import { httpGet } from '$lib/utils/http';

export async function searchServices(
    query: string,
    page = 1,
    limit = 20
): Promise<PaginatedResponse<Service>> {
    return httpGet<PaginatedResponse<Service>>(
        `/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
}

export async function getRecentSearches(): Promise<{ recent: string[] }> {
    return httpGet<{ recent: string[] }>('/search/recent', true);
}
