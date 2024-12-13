// src/js/features/listings/bid.js
import { placeBid } from '../../api/bids/index.js';
import { getProfile } from '../../api/profiles/index.js';
import { getUser } from '../../utils/userData.js';
import { updateUserInfo } from '../../components/userInfo.js'; // We'll update this path later when we move updateUserInfo

export function initializeBidding(listing, onBidPlaced) {
  const bidButton = document.getElementById('placeBidBtn');
  const bidInput = document.getElementById('bidAmount');
  const errorText = document.getElementById('bidError');
  let hasBid = false;

  if (!bidButton || !bidInput) return;

  bidButton.addEventListener('click', async () => {
    if (hasBid) {
      bidButton.className =
        'px-4 py-2 bg-[#D66853] text-white rounded hover:bg-[#D66853]/90 transition-colors';
      bidButton.textContent = 'Place Bid';
      bidInput.value = '';
      hasBid = false;
      return;
    }

    try {
      bidButton.disabled = true;
      await placeBid(listing.id, Number(bidInput.value));

      // Update credits after successful bid
      const { data: profile } = await getProfile(getUser().name);
      localStorage.setItem('userCredits', profile.credits);
      updateUserInfo(); // Update display

      bidButton.className = 'px-4 py-2 bg-green-600 text-white rounded transition-colors';
      bidButton.textContent = 'Bid Placed';
      bidButton.disabled = false;
      hasBid = true;

      await onBidPlaced();
    } catch (error) {
      bidButton.disabled = false;
      bidButton.textContent = 'Place Bid';
      errorText.textContent = error.message;
      errorText.classList.remove('hidden');
    }
  });
}