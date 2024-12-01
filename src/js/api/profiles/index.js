// src/js/api/profiles/index.js
import { API_ENDPOINTS, getAuthHeaders } from '../constants.js';

export async function getProfile(name) {
  // First get profile data
  const profileResponse = await fetch(`${API_ENDPOINTS.PROFILES.BASE}/${name}`, {
    headers: getAuthHeaders(),
  });
  const profileData = await profileResponse.json();

  // Then get listings with bid counts
  const listingsResponse = await fetch(`${API_ENDPOINTS.PROFILES.BASE}/${name}/listings`, {
    headers: getAuthHeaders(),
  });
  const listingsData = await listingsResponse.json();

  return {
    data: {
      ...profileData.data,
      listings: listingsData.data,
    },
  };
}

export async function updateProfileMedia(name, data) {
  const response = await fetch(`${API_ENDPOINTS.PROFILES.BASE}/${name}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await response.json();
}

/*export async function searchProfiles(query) {
    const response = await fetch(`${API_ENDPOINTS.PROFILES.BASE}/search?q=${query}`, {
        headers: getAuthHeaders()
    });
    return await response.json();
}*/
