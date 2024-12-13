// src/js/api/profiles/index.js

import { API_ENDPOINTS, getAuthHeaders } from '../constants.js';

/**
 * Fetches the profile data along with listings and bids for a given profile name.
 *
 * @param {string} name - The name of the profile to fetch.
 * @returns {Promise<Object>} A promise that resolves to an object containing the profile data and listings.
 * @throws Will throw an error if the fetch operation fails.
 */

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

/**
 * Updates the profile media for a given profile name.
 *
 * @param {string} name - The name of the profile to update.
 * @param {Object} data - The data to update the profile with.
 * @returns {Promise<Object>} A promise that resolves to the updated profile data.
 * @throws Will throw an error if the fetch operation fails.
 */

export async function updateProfileMedia(name, data) {
  const response = await fetch(`${API_ENDPOINTS.PROFILES.BASE}/${name}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await response.json();
}
