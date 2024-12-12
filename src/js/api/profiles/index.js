// src/js/api/profiles/index.js
import { API_ENDPOINTS, getAuthHeaders } from '../constants.js';

export async function getProfile(name) {
  try {
    // Get profile data with listings and bids
    const response = await fetch(`${API_ENDPOINTS.PROFILES.BASE}/${name}/listings?_bids=true`, {
      headers: getAuthHeaders(),
    });

    const listingsData = await response.json();

    // Get profile info
    const profileResponse = await fetch(`${API_ENDPOINTS.PROFILES.BASE}/${name}`, {
      headers: getAuthHeaders(),
    });

    const profileData = await profileResponse.json();

    // Combine the data
    return {
      data: {
        ...profileData.data,
        listings: listingsData.data,
      },
    };
  } catch (error) {
    console.error('Error in getProfile:', error);
    throw error;
  }
}

export async function updateProfileMedia(name, data) {
  const response = await fetch(`${API_ENDPOINTS.PROFILES.BASE}/${name}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await response.json();
}
