/**
 * Utility functions for date and time formatting with UTC-3 (Brazil) timezone
 */

/**
 * Converts a UTC date string to Brazil timezone (UTC-3)
 * @param dateString - ISO date string from API
 * @returns Date object adjusted to UTC-3
 */
export function toBrazilTime(dateString: string): Date {
    const date = new Date(dateString);
    // Get UTC time in milliseconds
    const utcTime = date.getTime();
    // Brazil is UTC-3, so subtract 3 hours (in milliseconds)
    const brazilOffset = -3 * 60 * 60 * 1000;
    return new Date(utcTime + brazilOffset);
}

/**
 * Formats a date to Brazilian format (dd/MM/yyyy HH:mm)
 * @param dateString - ISO date string from API
 * @returns Formatted date string in Brazil timezone
 */
export function formatBrazilDateTime(dateString: string): string {
    const date = toBrazilTime(dateString);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Formats a date to Brazilian date format (dd/MM/yyyy)
 * @param dateString - ISO date string from API
 * @returns Formatted date string in Brazil timezone
 */
export function formatBrazilDate(dateString: string): string {
    const date = toBrazilTime(dateString);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
}

/**
 * Formats a time to Brazilian format (HH:mm) with UTC-3 conversion
 * @param timeString - Time string (HH:mm:ss, HH:mm, or ISO datetime string)
 * @returns Formatted time string in Brazil timezone (UTC-3)
 */
export function formatBrazilTime(timeString: string): string {
    // If it's an ISO datetime string (contains 'T' or '-')
    if (timeString.includes('T') || timeString.includes('-')) {
        const date = new Date(timeString);
        // Apply UTC-3 offset (subtract 3 hours in milliseconds)
        const brazilOffset = -3 * 60 * 60 * 1000;
        const brazilTime = new Date(date.getTime() + brazilOffset);

        const hours = String(brazilTime.getUTCHours()).padStart(2, '0');
        const minutes = String(brazilTime.getUTCMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // If it's already in HH:mm format, return as is
    if (timeString.length === 5 && timeString.includes(':')) {
        return timeString;
    }

    // If it's in HH:mm:ss format, remove seconds
    if (timeString.includes(':')) {
        return timeString.substring(0, 5);
    }

    return timeString;
}

/**
 * Formats a relative time (e.g., "2 horas atrás", "3 dias atrás")
 * @param dateString - ISO date string from API
 * @returns Relative time string in Portuguese
 */
export function formatRelativeTime(dateString: string): string {
    const now = new Date();
    const date = toBrazilTime(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) {
        return 'agora mesmo';
    } else if (diffMin < 60) {
        return `${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'} atrás`;
    } else if (diffHour < 24) {
        return `${diffHour} ${diffHour === 1 ? 'hora' : 'horas'} atrás`;
    } else if (diffDay < 7) {
        return `${diffDay} ${diffDay === 1 ? 'dia' : 'dias'} atrás`;
    } else {
        return formatBrazilDate(dateString);
    }
}

/**
 * Converts a local date/time to UTC for API submission
 * @param dateTime - Local date/time string
 * @returns ISO string in UTC
 */
export function toUTC(dateTime: Date | string): string {
    const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
    return date.toISOString();
}
