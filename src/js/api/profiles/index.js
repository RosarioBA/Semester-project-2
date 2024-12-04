// src/js/api/profiles/index.js
import { API_ENDPOINTS, getAuthHeaders } from '../constants.js';

export async function getProfile(name) {
   // Get profile data with listings in a single request
   const response = await fetch(`${API_ENDPOINTS.PROFILES.BASE}/${name}?_listings=true`, {
       headers: getAuthHeaders()
   });
   
   const data = await response.json();
   
   if (!response.ok) {
       throw new Error('Failed to fetch profile');
   }

   return data;
}

export async function updateProfileMedia(name, data) {
   const response = await fetch(`${API_ENDPOINTS.PROFILES.BASE}/${name}`, {
       method: 'PUT',
       headers: getAuthHeaders(),
       body: JSON.stringify(data)
   });
   return await response.json();
}

/*export async function searchProfiles(query) {
   const response = await fetch(`${API_ENDPOINTS.PROFILES.BASE}/search?q=${query}`, {
       headers: getAuthHeaders()
   });
   return await response.json();
}
*/
