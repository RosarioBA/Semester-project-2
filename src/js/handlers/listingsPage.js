// src/js/handlers/listingsPage.js

import { getListings } from '../api/listings/index.js';
import { createListingHTML, displayLoadingState, showError } from '../utils/listingUtils.js';

const ITEMS_PER_PAGE = 12;
let currentPage = 1;

let container = null;

export async function handleListingsPage(containerId = 'listings') {
  try {
    container = document.getElementById(containerId);
    if (!container) return;

    displayLoadingState(container);

    // Set up sorting
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', async (e) => {
        const [sort, sortOrder] = e.target.value.split('-');
        await fetchAndDisplayListings(container, { sort, sortOrder });
      });
    }

    // Initial fetch
    await fetchAndDisplayListings(container);
  } catch (error) {
    console.error('Error:', error);
    showError(container, error.message);
  }
}

async function fetchAndDisplayListings(container, options = {}) {
  try {
    // First, get total count without limit to know how many pages we really have
    const initialFetch = await getListings({
      page: 1,
      sort: options.sort || 'created',
      sortOrder: options.sortOrder || 'desc',
    });

    // Get more items per page to account for filtering
    const { data: allListings, meta } = await getListings({
      page: currentPage,
      limit: ITEMS_PER_PAGE * 2, // Get more items to account for filtering
      sort: options.sort || 'created',
      sortOrder: options.sortOrder || 'desc',
    });

    // Filter out expired listings
    const activeListings = allListings?.filter(listing => {
      const endDate = new Date(listing.endsAt);
      return endDate > new Date();
    });

    // Take only the first ITEMS_PER_PAGE active listings
    const displayListings = activeListings.slice(0, ITEMS_PER_PAGE);

    if (!displayListings?.length) {
      container.innerHTML = `
        <div class="text-center py-12">
          <p class="text-gray-500">No active listings found</p>
        </div>
      `;
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

    displayListings.forEach((listing) => {
      const listingElement = document.createElement('div');
      listingElement.innerHTML = createListingHTML(listing);
      listingElement.querySelector('article').addEventListener('click', () => {
        window.location.href = `/pages/single-listing.html?id=${listing.id}`;
      });
      grid.appendChild(listingElement);
    });

    container.innerHTML = '';
    container.appendChild(grid);

    // Calculate total active pages
    const totalActiveListings = initialFetch.data.filter(listing => {
      const endDate = new Date(listing.endsAt);
      return endDate > new Date();
    }).length;

    // Update pagination with correct count of active listings
    const adjustedMeta = {
      ...meta,
      currentPage: currentPage,
      pageCount: Math.ceil(totalActiveListings / ITEMS_PER_PAGE),
      isFirstPage: currentPage === 1,
      isLastPage: currentPage >= Math.ceil(totalActiveListings / ITEMS_PER_PAGE)
    };
    updatePagination(adjustedMeta);
  } catch (error) {
    console.error('Error:', error);
    showError(container, error.message);
  }
}

function updatePagination(meta) {
  const paginationContainer = document.getElementById('pagination');
  if (!paginationContainer) return;

  const { currentPage: page, pageCount, isFirstPage, isLastPage } = meta;

  const paginationHTML = `
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
                  isLastPage
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-[#4F6F52] text-white hover:bg-[#4F6F52]/90'
                }"
                onclick="changePage(${page + 1})"
            >
                Next
            </button>
        </div>
    `;

  paginationContainer.innerHTML = paginationHTML;
}

// Global pagination handler
window.changePage = async function (newPage) {
  currentPage = newPage;
  const container = document.getElementById('listings');
  const sortSelect = document.getElementById('sortSelect');
  const [sort, sortOrder] = sortSelect ? sortSelect.value.split('-') : ['created', 'desc'];
  await fetchAndDisplayListings(container, { sort, sortOrder });
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  handleListingsPage();
});
