// src/js/features/listings/activeBids.js
import { API_ENDPOINTS, getAuthHeaders } from '../../api/constants.js';
import { getUser } from '../../utils/userData.js';
import { formatTimeRemaining } from '../../utils/listingUtils.js';

/**
 * Loads the active bids and won auctions for the current user.
 * If the user is not authenticated, redirects to the login page.
 * Fetches the active bids and won auctions from the API and displays them.
 *
 * @async
 * @function loadActiveBids
 * @returns {Promise<void>}
 */
export async function loadActiveBids() {
  try {
    // Detailed logging for authentication
    const user = getUser();

    if (!user) {
      console.warn('No user found, redirecting to login');
      window.location.href = '/pages/login.html';
      return;
    }

    // Verify API endpoints and headers
    const authHeaders = getAuthHeaders();

    const bidsUrl = `${API_ENDPOINTS.PROFILES.BASE}/${user.name}/bids?_listings=true`;
    const winsUrl = `${API_ENDPOINTS.PROFILES.BASE}/${user.name}/wins`;

    // Fetch bids and wins with error handling
    const [bidsResponse, winsResponse] = await Promise.all([
      fetch(bidsUrl, { headers: authHeaders }).catch(handleFetchError('Bids')),
      fetch(winsUrl, { headers: authHeaders }).catch(handleFetchError('Wins')),
    ]);

    // Check response status
    if (!bidsResponse.ok) {
      console.error('Bids fetch failed:', bidsResponse.status, bidsResponse.statusText);
      displayErrorMessage('activeBids', 'Failed to load active bids');
      return;
    }

    if (!winsResponse.ok) {
      console.error('Wins fetch failed:', winsResponse.status, winsResponse.statusText);
      displayErrorMessage('wonAuctions', 'Failed to load won auctions');
      return;
    }

    // Parse responses
    const bids = await bidsResponse.json();
    const wins = await winsResponse.json();

    // Filter and display active bids
    const activeBids = bids.data.filter((bid) => {
      const endDate = new Date(bid.listing?.endsAt);
      return endDate > new Date();
    });

    displayActiveBids(activeBids);

    // Display won auctions
    displayWonAuctions(wins.data);
  } catch (error) {
    console.error('Critical error in loadActiveBids:', error);
    displayCriticalErrorMessage();
  }
}

/**
 * Displays the active bids in the specified container.
 *
 * @function displayActiveBids
 * @param {Array<Object>} bids - The list of active bids.
 */
function displayActiveBids(bids) {
  const container = document.getElementById('activeBids');

  if (!container) {
    console.error('Active Bids container not found');
    return;
  }

  if (!bids?.length) {
    container.innerHTML = `
      <p class="text-gray-500 text-center py-4">
        No active bids. Start bidding on some exciting auctions!
      </p>
    `;
    return;
  }

  // Sort bids by end date, ending soonest first
  const sortedBids = bids.sort((a, b) => new Date(a.listing.endsAt) - new Date(b.listing.endsAt));

  container.innerHTML = sortedBids.map(createActiveBidHTML).join('');
}

/**
 * Displays the won auctions in the specified container.
 *
 * @function displayWonAuctions
 * @param {Array<Object>} wins - The list of won auctions.
 */
function displayWonAuctions(wins) {
  const container = document.getElementById('wonAuctions');

  if (!container) {
    console.error('Won Auctions container not found');
    return;
  }

  if (!wins?.length) {
    container.innerHTML = `
      <p class="text-gray-500 text-center py-4">
        No auctions won yet. Keep bidding!
      </p>
    `;
    return;
  }

  // Sort wins by end date, most recent first
  const sortedWins = wins.sort((a, b) => new Date(b.endsAt) - new Date(a.endsAt));

  container.innerHTML = sortedWins.map(createWonAuctionHTML).join('');
}

/**
 * Creates HTML for an active bid
 *
 * @function createActiveBidHTML
 * @param {Object} bid - The bid object
 * @returns {string} HTML string for the bid
 */
function createActiveBidHTML(bid) {
  return `
    <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div class="flex gap-4">
        <div class="w-24 h-24 flex-shrink-0">
          <img 
            src="${bid.listing?.media?.[0]?.url || '/images/placeholder.png'}" 
            alt="${bid.listing?.title || 'Auction Item'}" 
            class="w-full h-full rounded object-cover"
          >
        </div>
        <div class="flex-1">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-medium text-lg">
                ${bid.listing?.title || 'Unknown Listing'}
              </h3>
              <p class="text-gray-600">
                Your bid: ${bid.amount} credits
              </p>
            </div>
            <a 
              href="/pages/single-listing.html?id=${bid.listing?.id}" 
              class="px-4 py-2 text-[#4f6f52] hover:underline"
            >
              View Listing
            </a>
          </div>
          <div class="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            ${formatTimeRemaining(new Date(bid.listing.endsAt))}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Creates HTML for a won auction
 *
 * @function createWonAuctionHTML
 * @param {Object} listing - The listing object
 * @returns {string} HTML string for the won auction
 */
function createWonAuctionHTML(listing) {
  return `
    <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div class="flex gap-4">
        <div class="w-24 h-24 flex-shrink-0">
          <img 
            src="${listing.media?.[0]?.url || '/images/placeholder.png'}" 
            alt="${listing.title}" 
            class="w-full h-full rounded object-cover"
          >
        </div>
        <div class="flex-1">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-medium text-lg">${listing.title}</h3>
              <p class="text-gray-600">
                Won on ${new Date(listing.endsAt).toLocaleDateString()}
              </p>
            </div>
            <a 
              href="/pages/single-listing.html?id=${listing.id}" 
              class="px-4 py-2 text-[#4f6f52] hover:underline"
            >
              View Details
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Handle fetch errors with specific logging
 *
 * @function handleFetchError
 * @param {string} resourceName - Name of the resource being fetched
 * @returns {Function} Error handling function
 */
function handleFetchError(resourceName) {
  return (error) => {
    console.error(`Error fetching ${resourceName}:`, error);
    return { ok: false, status: 500, statusText: error.message };
  };
}

/**
 * Display error message in a specific container
 *
 * @function displayErrorMessage
 * @param {string} containerId - ID of the container to display error
 * @param {string} message - Error message to display
 */
function displayErrorMessage(containerId, message) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        ${message}
      </div>
    `;
  }
}

/**
 * Display a critical error message
 *
 * @function displayCriticalErrorMessage
 */
function displayCriticalErrorMessage() {
  const errorContainer = document.createElement('div');
  errorContainer.className = 'fixed inset-0 bg-red-500 text-white p-4 z-50';
  errorContainer.innerHTML = `
    <div class="max-w-md mx-auto text-center">
      <h2 class="text-2xl font-bold mb-4">Unexpected Error</h2>
      <p>We encountered an issue loading your data. Please try again later.</p>
      <button 
        onclick="window.location.reload()" 
        class="mt-4 bg-white text-red-500 px-4 py-2 rounded"
      >
        Reload Page
      </button>
    </div>
  `;
  document.body.appendChild(errorContainer);
}
