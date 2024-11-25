// src/js/api/constants.js

export const API_BASE_URL = 'https://v2.api.noroff.dev';

// Check if API key is available
const apiKey = import.meta.env.VITE_API_KEY;
if (!apiKey) {
    console.error('API key not found. Make sure VITE_API_KEY is set in your .env file');
}

// Base headers with API key
export const headers = {
    'Content-Type': 'application/json',
    'X-Noroff-API-Key': apiKey
};

// Function to get auth headers (combines API key and token)
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

export const API_AUTH = `${API_BASE_URL}/auth`;
export const API_AUTH_REGISTER = `${API_BASE_URL}/auth/register`;
export const API_AUTH_LOGIN = `${API_BASE_URL}/auth/login`;