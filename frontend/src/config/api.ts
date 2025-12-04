// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to construct API URLs
export const getApiUrl = (endpoint: string): string => {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Helper function to construct full image URLs
export const getImageUrl = (path: string): string => {
    if (!path) return '';
    // If path already includes http/https, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    // Otherwise, prepend the API base URL
    return `${API_BASE_URL}${path}`;
};
