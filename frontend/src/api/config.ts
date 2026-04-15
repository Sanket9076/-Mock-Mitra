// Centralized API configuration
// In production (Docker), the frontend is served via Nginx which proxies /api and /users to the backend.
// In development, the API might be on a different port.

const isProduction = process.env.NODE_ENV === 'production';

// When in production, we use relative paths (/api) so the proxy handles it.
// When in development, we target localhost:8080.
export const API_BASE_URL = isProduction 
    ? '' 
    : (process.env.REACT_APP_API_URL || 'http://localhost:8080');

export const API_ENDPOINTS = {
    interview: `${API_BASE_URL}/api/interview`,
    users: `${API_BASE_URL}/users`,
    bot: `${API_BASE_URL}/bot`
};
