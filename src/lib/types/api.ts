// Tipos baseados na especificação do backend

export type UserRole = 'CLIENT' | 'PROVIDER';

export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export type NotificationType = 'NEW_BOOKING' | 'BOOKING_CANCELLED';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone: string;
    created_at: string;
    updated_at: string;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    category: string;
    photos: string[];
    providerId: string;
    provider?: {
        id: string;
        name: string;
        email: string;
        phone?: string;
    };
    variations: ServiceVariation[];
    created_at: string;
    updated_at: string;
}

export interface ServiceVariation {
    id: string;
    serviceId: string;
    name: string;
    price: string;
    duration_minutes: number;
    discount_percentage?: number;
    discount_days?: number[];
    created_at: string;
    updated_at: string;
    service?: Service;
}

export interface Booking {
    id: string;
    clientId: string;
    serviceVariationId: string;
    start_time: string;
    end_time: string;
    status: BookingStatus;
    final_price: string;
    created_at: string;
    updated_at: string;
    serviceVariation?: ServiceVariation;
    client?: User;
}

export interface Review {
    id: string;
    serviceId: string;
    clientId: string;
    rating: number;
    comment: string;
    created_at: string;
    updated_at: string;
    client?: {
        name: string;
    };
}

export interface Availability {
    id: string;
    providerId: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    created_at: string;
    updated_at: string;
}

export interface AvailabilitySlot {
    start_time: string;
    end_time: string;
    available: boolean;
}

export interface AvailabilitySlotsResponse {
    slots: AvailabilitySlot[];
}

export interface Notification {
    id: string;
    providerId: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    bookingId?: string;
    created_at: string;
}

// Request/Response types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    refreshToken: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    phone: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface CreateServiceRequest {
    name: string;
    description: string;
    category: string;
    photos: string[];
    variations: {
        name: string;
        price: number;
        duration_minutes: number;
        discount_percentage?: number;
        discount_days?: number[];
    }[];
}

export interface UpdateServiceRequest {
    name?: string;
    description?: string;
    category?: string;
    photos?: string[];
}

export interface CreateBookingRequest {
    serviceVariationId: string;
    start_time: string;
}

export interface CreateReviewRequest {
    serviceId: string;
    rating: number;
    comment: string;
}

export interface CreateAvailabilityRequest {
    day_of_week: number;
    start_time: string;
    end_time: string;
}

export interface UpdateAvailabilityRequest {
    start_time?: string;
    end_time?: string;
}

export interface UpdateProfileRequest {
    name?: string;
    phone?: string;
}

// Pagination
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// API Error
export interface ApiError {
    error: string | Array<{
        code: string;
        expected: string;
        received: string;
        path: string[];
        message: string;
    }>;
}

// JWT Payload
export interface JWTPayload {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone: string;
    iat: number;
    exp: number;
}
