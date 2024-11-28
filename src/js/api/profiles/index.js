// src/js/api/profile/index.js
import { API_ENDPOINTS, getAuthHeaders } from '../constants.js';

export async function getProfile(name) {
    const response = await fetch(`${API_ENDPOINTS.PROFILES.BASE}/${name}?_listings=true`, {
        headers: getAuthHeaders()
    });
    return await response.json();
}

