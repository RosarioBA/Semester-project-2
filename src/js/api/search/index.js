// src/js/api/search/index.js
import { API_ENDPOINTS, getPublicHeaders } from '../constants.js';

export async function searchAll(query) {
    const [listingsRes, profilesRes] = await Promise.all([
        fetch(`${API_ENDPOINTS.LISTINGS.SEARCH}?q=${query}`, { headers: getPublicHeaders() }),
        fetch(`${API_ENDPOINTS.PROFILES.SEARCH}?q=${query}`, { headers: getPublicHeaders() })
    ]);
    
    const [listings, profiles] = await Promise.all([
        listingsRes.json(),
        profilesRes.json()
    ]);
    
    return { listings: listings.data, profiles: profiles.data };
}