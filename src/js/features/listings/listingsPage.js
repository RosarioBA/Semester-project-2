// src/js/handlers/listingsPage.js

import { getListings } from '../../api/listings/index.js';
import { createListingHTML, displayLoadingState, showError } from '../../utils/listingUtils.js';

const ITEMS_PER_PAGE = 12;
let currentPage = 1;

let container = null;

/**
 * Handles the listings page by fetching and displaying listings, setting up sorting, and handling pagination.
 *
 * @param {string} [containerId='listings'] - The ID of the container element where listings will be displayed.
 * @returns {Promise<void>}
 */

export async function handleListingsPage(containerId = 'listings') {
  try {
    const container = document.getElementById(containerId);
    if (!container) return;

    displayLoadingState(container);

    // Set up filter and sort event listeners
    const activeFilter = document.getElementById('activeFilter');
    const sortSelect = document.getElementById('sortSelect');

    activeFilter?.addEventListener('change', () => {
      currentPage = 1; // Reset to first page when filter changes
      fetchAndDisplayListings(container);
    });

    sortSelect?.addEventListener('change', () => {
      currentPage = 1; // Reset to first page when sort changes
      fetchAndDisplayListings(container);
    });

    // Initial fetch
    await fetchAndDisplayListings(container);
  } catch (error) {
    console.error('Error:', error);
    showError(container, error.message);
  }
}

/**
 * Fetches and displays listings in the specified container with optional sorting and pagination.
 *
 * @param {HTMLElement} container - The container element where listings will be displayed.
 * @param {Object} [options={}] - Optional parameters for sorting and pagination.
 * @param {string} [options.sort='created'] - The field to sort by.
 * @param {string} [options.sortOrder='desc'] - The order to sort by (asc or desc).
 * @returns {Promise<void>}
 */

async function fetchAndDisplayListings(container) {
  try {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator?.classList.remove('hidden');

    const activeFilter = document.getElementById('activeFilter');
    const sortSelect = document.getElementById('sortSelect');

    const [sort, sortOrder] = sortSelect?.value.split('-') || ['created', 'desc'];
    const isActive = activeFilter?.value;

    const { data: listings, meta } = await getListings({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      sort,
      sortOrder,
      _active: isActive || undefined, // Only include if set
    });

    if (!listings?.length) {
      container.innerHTML = `
        <div class="text-center py-12">
          <p class="text-gray-500">No listings found</p>
        </div>
      `;
      loadingIndicator?.classList.add('hidden');
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

    listings.forEach((listing) => {
      const listingElement = document.createElement('div');
      listingElement.innerHTML = createListingHTML(listing);
      listingElement.querySelector('article').addEventListener('click', () => {
        window.location.href = `/pages/single-listing.html?id=${listing.id}`;
      });
      grid.appendChild(listingElement);
    });

    container.innerHTML = '';
    container.appendChild(grid);
    loadingIndicator?.classList.add('hidden');

    updatePagination(meta);
  } catch (error) {
    console.error('Error:', error);
    showError(container, error.message);
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator?.classList.add('hidden');
  }
}
/**
 * Updates the pagination controls based on the provided metadata.
 *
 * @param {Object} meta - Metadata for pagination.
 * @param {number} meta.currentPage - The current page number.
 * @param {number} meta.pageCount - The total number of pages.
 * @param {boolean} meta.isFirstPage - Whether the current page is the first page.
 * @param {boolean} meta.isLastPage - Whether the current page is the last page.
 */

function updatePagination(meta) {
  const paginationContainer = document.getElementById('pagination');
  if (!paginationContainer) return;

  const { currentPage: page, pageCount, isFirstPage, isLastPage } = meta;

  paginationContainer.innerHTML = `
    <div class="flex justify-center items-center gap-4">
      <button 
        ${isFirstPage ? 'disabled' : ''}
        class="px-4 py-2 rounded-md ${
          isFirstPage
            ? 'bg-gray-100 text-gray-400'
            : 'bg-[#4F6F52] text-white hover:bg-[#4F6F52]/90'
        }"
        onclick="changePage(${page - 1})"
      >
        Previous
      </button>
      <span class="text-gray-600">
        Page ${page} of ${pageCount}
      </span>
      <button 
        ${isLastPage ? 'disabled' : ''}
        class="px-4 py-2 rounded-md ${
          isLastPage ? 'bg-gray-100 text-gray-400' : 'bg-[#4F6F52] text-white hover:bg-[#4F6F52]/90'
        }"
        onclick="changePage(${page + 1})"
      >
        Next
      </button>
    </div>
  `;
}

// Global pagination handler
window.changePage = async function (newPage) {
  currentPage = newPage;
  const container = document.getElementById('listings');
  if (container) {
    await fetchAndDisplayListings(container);
    // Scroll to top of listings when page changes
    container.scrollIntoView({ behavior: 'smooth' });
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  handleListingsPage();
});
