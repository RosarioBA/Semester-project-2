// src/js/api/constants.js

// Base URL
export const API_BASE_URL = 'https://v2.api.noroff.dev';

// Auth endpoints
export const API_ENDPOINTS = {
    AUTH: {
        BASE: `${API_BASE_URL}/auth`,
        LOGIN: `${API_BASE_URL}/auth/login`,
        REGISTER: `${API_BASE_URL}/auth/register`
    },
    LISTINGS: {
        BASE: `${API_BASE_URL}/auction/listings`,
        SEARCH: `${API_BASE_URL}/auction/listings/search`
    }
};

// Check if API key is available
const apiKey = import.meta.env.VITE_API_KEY;
if (!apiKey) {
    console.error('API key not found. Make sure VITE_API_KEY is set in your .env file');
}

// Default headers
export const headers = {
    'Content-Type': 'application/json',
    'X-Noroff-API-Key': apiKey
};

/**
 * Get headers with authentication token
 * @throws {Error} If no token is found in localStorage
 * @returns {Object} Headers with auth token
 */
export function getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }
    
    return {
        ...headers,
        'Authorization': `Bearer ${token}`
    };
}

/**
 * Get headers without requiring authentication
 * @returns {Object} Headers without auth token
 */
export function getPublicHeaders() {
    return { ...headers };
}


