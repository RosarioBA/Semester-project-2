// src/js/api/constants.js
export const API_BASE_URL = 'https://v2.api.noroff.dev';

export const headers = {
    'Content-Type': 'application/json'
};

export const API_AUTH = `${API_BASE_URL}/auth`;

export const API_AUTH_REGISTER = `${API_BASE_URL}/auth/register`;


export const API_URLS = {
    login: `${API_BASE_URL}/auth/login`,
    listings: `${API_BASE_URL}/listings`
};

/**maybe after is /auction/profile */