// src/js/features/listings/myListings.js

import { getMyListings } from '../../api/listings/index.js';
import { createListingHTML } from '../../utils/listingUtils.js';

/**
 * Handles the display of user's listings.
 *
 * This function fetches the user's listings from the API and displays them on the page.
 * If there are no listings, it shows a message indicating that the user hasn't created any listings yet.
 * If there are listings, it creates HTML elements for each listing and appends them to the main content.
 * In case of an error, it displays an error message.
 *
 * @async
 * @function handleMyListings
 * @returns {Promise<void>} A promise that resolves when the listings have been handled.
 */

export async function handleMyListings() {
  const mainContent = document.querySelector('main');
  try {
    mainContent.innerHTML =
      '<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F6F52] mx-auto mt-12"></div>';

    const { data: listings } = await getMyListings();

    const grid = document.createElement('div');
    grid.className =
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 py-8';

    if (!listings.length) {
      grid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-500">You haven't created any listings yet</p>
                    <a href="/pages/create-listing.html" class="text-[#4F6F52] hover:underline mt-4 inline-block">Create your first listing</a>
                </div>
            `;
    } else {
      listings.forEach((listing) => {
        const listingElement = document.createElement('div');
        listingElement.innerHTML = createListingHTML(listing);
        grid.appendChild(listingElement);
      });
    }

    mainContent.innerHTML = '';
    mainContent.appendChild(grid);
  } catch (error) {
    mainContent.innerHTML = `
            <div class="text-center py-12">
                <p class="text-red-500">${error.message}</p>
            </div>
        `;
  }
}

document.addEventListener('DOMContentLoaded', handleMyListings);
