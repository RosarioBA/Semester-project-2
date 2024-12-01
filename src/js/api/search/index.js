// src/js/api/search/index.js
import { API_ENDPOINTS, getAuthHeaders } from '../constants.js';

export async function searchAll(query) {
    const [listingsRes, profilesRes] = await Promise.all([
        fetch(`${API_ENDPOINTS.LISTINGS.SEARCH}?q=${query}`, { 
            headers: getAuthHeaders() 
        }),
        fetch(`${API_ENDPOINTS.PROFILES.SEARCH}?q=${query}`, { 
            headers: getAuthHeaders() 
        })
    ]);
    
    const [listings, profiles] = await Promise.all([
        listingsRes.json(),
        profilesRes.json()
    ]);
    
    return { listings: listings.data, profiles: profiles.data };
}
