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
  const user = getUser();
  if (!user) {
    window.location.href = '/pages/login.html';
    return;
  }

  try {
    const [bidsResponse, winsResponse] = await Promise.all([
      fetch(`${API_ENDPOINTS.PROFILES.BASE}/${user.name}/bids?_listings=true`, {
        headers: getAuthHeaders(),
      }),
      fetch(`${API_ENDPOINTS.PROFILES.BASE}/${user.name}/wins`, {
        headers: getAuthHeaders(),
      }),
    ]);

    const bids = await bidsResponse.json();
    const wins = await winsResponse.json();

    // Filter and display active bids
    const activeBids = bids.data.filter(bid => {
      const endDate = new Date(bid.listing?.endsAt);
      return endDate > new Date();
    });
    displayActiveBids(activeBids);

    // Display won auctions
    displayWonAuctions(wins.data);
  } catch (error) {
    console.error('Error loading bids:', error);
  }
}

/**
 * Displays the active bids in the specified container.
 * If there are no active bids, displays a message indicating so.
 * 
 * @function displayActiveBids
 * @param {Array<Object>} bids - The list of active bids.
 */

function displayActiveBids(bids) {
  const container = document.getElementById('activeBids');
  if (!bids?.length) {
    container.innerHTML = '<p class="text-gray-500 text-center py-4">No active bids</p>';
    return;
  }

  // Sort bids by end date, ending soonest first
  const sortedBids = bids.sort((a, b) => new Date(a.listing.endsAt) - new Date(b.listing.endsAt));

  container.innerHTML = sortedBids
    .map(
      (bid) => `
        <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="flex gap-4">
                <div class="w-24 h-24 flex-shrink-0">
                    <img src="${bid.listing?.media?.[0]?.url || '/api/placeholder/96/96'}" 
                         alt="${bid.listing?.title}" 
                         class="w-full h-full rounded object-cover">
                </div>
                <div class="flex-1">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-medium text-lg">${bid.listing?.title || 'Unknown Listing'}</h3>
                            <p class="text-gray-600">Your bid: ${bid.amount} credits</p>
                        </div>
                        <a href="/pages/single-listing.html?id=${bid.listing?.id}" 
                           class="px-4 py-2 text-[#4f6f52] hover:underline">
                            View Listing
                        </a>
                    </div>
                    <div class="mt-2 flex items-center gap-2 text-sm text-gray-500">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ${formatTimeRemaining(new Date(bid.listing.endsAt))}
                    </div>
                </div>
            </div>
        </div>
    `
    )
    .join('');
}


/**
 * Displays the won auctions in the specified container.
 * If there are no won auctions, displays a message indicating so.
 * 
 * @function displayWonAuctions
 * @param {Array<Object>} wins - The list of won auctions.
 */


function displayWonAuctions(wins) {
  const container = document.getElementById('wonAuctions');
  if (!wins?.length) {
    container.innerHTML = '<p class="text-gray-500 text-center py-4">No auctions won yet</p>';
    return;
  }

  // Sort wins by end date, most recent first
  const sortedWins = wins.sort((a, b) => new Date(b.endsAt) - new Date(a.endsAt));

  container.innerHTML = sortedWins
    .map(
      (listing) => `
        <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="flex gap-4">
                <div class="w-24 h-24 flex-shrink-0">
                    <img src="${listing.media?.[0]?.url || '/api/placeholder/96/96'}" 
                         alt="${listing.title}" 
                         class="w-full h-full rounded object-cover">
                </div>
                <div class="flex-1">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-medium text-lg">${listing.title}</h3>
                            <p class="text-gray-600">Won on ${new Date(listing.endsAt).toLocaleDateString()}</p>
                        </div>
                        <a href="/pages/single-listing.html?id=${listing.id}" 
                           class="px-4 py-2 text-[#4f6f52] hover:underline">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `
    )
    .join('');
}