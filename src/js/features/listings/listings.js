
// src/js/features/listings/listings.js

import { getListings } from '../../api/listings/index.js';
import { createListingHTML, displayLoadingState, showError } from '../../utils/listingUtils.js';

let container = null;

/**
 * Handles the retrieval and display of listings.
 * 
 * @param {string} [containerId='listings'] - The ID of the container element where the listings will be displayed.
 * @returns {Promise<void>} - A promise that resolves when the listings have been handled.
 * 
 * @async
 * @function handleListings
 * 
 * @example
 * // Call the function to handle listings
 * handleListings();
 * 
 * @throws Will throw an error if the listings cannot be retrieved or displayed.
 */

export async function handleListings(containerId = 'listings') {
  try {
    container = document.getElementById(containerId);
    if (!container) return;

    displayLoadingState(container);

    const { data: allListings } = await getListings({ limit: 12 });

    // Filter out expired listings
    const activeListings = allListings?.filter((listing) => {
      const endDate = new Date(listing.endsAt);
      return endDate > new Date();
    });

    if (!activeListings?.length) {
      container.innerHTML = `
        <div class="text-center py-12">
          <p class="text-gray-500">No active listings found</p>
        </div>
      `;
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

    activeListings.forEach((listing) => {
      const listingElement = document.createElement('div');
      listingElement.innerHTML = createListingHTML(listing);
      listingElement.querySelector('article').addEventListener('click', () => {
        window.location.href = `/pages/single-listing.html?id=${listing.id}`;
      });
      grid.appendChild(listingElement);
    });

    container.innerHTML = '';
    container.appendChild(grid);
  } catch (error) {
    console.error('Error:', error);
    showError(container, error.message);
  }
}