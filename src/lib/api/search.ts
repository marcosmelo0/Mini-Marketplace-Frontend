import type { Service, PaginatedResponse } from '$lib/types/api';
import { httpGet } from '$lib/utils/http';

export async function searchServices(
    query: string,
    page = 1,
    limit = 20,
    sort?: string,
    order?: 'asc' | 'desc'
): Promise<PaginatedResponse<Service>> {
    let url = `/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
    if (sort) url += `&sort=${sort}`;
    if (order) url += `&order=${order}`;
    return httpGet<PaginatedResponse<Service>>(url, true);
}

export async function getRecentSearches(): Promise<{ searches: string[] }> {
    return httpGet<{ searches: string[] }>('/search/recent', true);
}
