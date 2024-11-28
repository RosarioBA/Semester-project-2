// src/js/api/profiles/index.js
import { API_ENDPOINTS, getAuthHeaders } from '../constants.js';

export async function getProfile(name) {
    // First get profile data
    const profileResponse = await fetch(`${API_ENDPOINTS.PROFILES.BASE}/${name}`, {
        headers: getAuthHeaders()
    });
    const profileData = await profileResponse.json();
    
    // Then get listings with bid counts
    const listingsResponse = await fetch(`${API_ENDPOINTS.PROFILES.BASE}/${name}/listings`, {
        headers: getAuthHeaders()
    });
    const listingsData = await listingsResponse.json();
    
    return {
        data: {
            ...profileData.data,
            listings: listingsData.data
        }
    };
}