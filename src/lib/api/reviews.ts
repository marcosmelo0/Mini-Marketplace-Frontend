import type { Review, CreateReviewRequest, PaginatedResponse } from '$lib/types/api';
import { httpPost, httpGet } from '$lib/utils/http';

export async function createReview(data: CreateReviewRequest): Promise<Review> {
    return httpPost<Review>('/reviews', data, true);
}

export async function getServiceReviews(
    serviceId: string,
    page = 1,
    limit = 20
): Promise<PaginatedResponse<Review>> {
    return httpGet<PaginatedResponse<Review>>(
        `/reviews/services/${serviceId}?page=${page}&limit=${limit}`
    );
}
