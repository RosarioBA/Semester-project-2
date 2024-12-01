import { API_ENDPOINTS, getAuthHeaders } from '../api/constants.js';
import { getUser } from '../utils/userData.js';

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

    displayActiveBids(bids.data);
    displayWonAuctions(wins.data);
  } catch (error) {
    console.error('Error loading bids:', error);
  }
}

function displayActiveBids(bids) {
  const container = document.getElementById('activeBids');
  if (!bids?.length) {
    container.innerHTML = '<p class="text-gray-500 text-center py-4">No active bids</p>';
    return;
  }

  container.innerHTML = bids
    .map(
      (bid) => `
        <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="font-medium">${bid.listing?.title || 'Unknown Listing'}</h3>
                    <p class="text-gray-600">Your bid: ${bid.amount} credits</p>
                    <p class="text-sm text-gray-500">Placed on ${new Date(bid.created).toLocaleDateString()}</p>
                </div>
                <a href="/pages/single-listing.html?id=${bid.listing?.id}" 
                   class="px-4 py-2 text-[#4f6f52] hover:underline">
                    View Listing
                </a>
            </div>
        </div>
    `
    )
    .join('');
}

function displayWonAuctions(wins) {
  const container = document.getElementById('wonAuctions');
  if (!wins?.length) {
    container.innerHTML = '<p class="text-gray-500 text-center py-4">No auctions won yet</p>';
    return;
  }

  container.innerHTML = wins
    .map(
      (listing) => `
        <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <img src="${listing.media?.[0]?.url || '/api/placeholder/64/64'}" 
                         alt="${listing.title}" 
                         class="w-16 h-16 rounded object-cover">
                    <div>
                        <h3 class="font-medium">${listing.title}</h3>
                        <p class="text-gray-600">Won on ${new Date(listing.endsAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <a href="/pages/single-listing.html?id=${listing.id}" 
                   class="px-4 py-2 text-[#4f6f52] hover:underline">
                    View Details
                </a>
            </div>
        </div>
    `
    )
    .join('');
}
