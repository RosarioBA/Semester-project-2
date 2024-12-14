// src/js/features/profile/profile.js
import { getProfile, updateProfileMedia } from '../../api/profiles/index.js';
import { getUser } from '../../utils/storage.js';
import { displayProfileLoading } from '../../utils/loadingStates.js';
import { renderListingsSection } from '../../utils/profileListings.js';

/**
 * Loads the profile page by fetching the profile data and updating the display.
 * Redirects to the login page if no username is found in the URL parameters or in the current user data.
 * Displays a loading state while fetching the profile data.
 *
 * @async
 * @function loadProfilePage
 * @returns {Promise<void>}
 */

export async function loadProfilePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const viewUsername = urlParams.get('name');
  const currentUser = getUser();

  if (!viewUsername && !currentUser) {
    window.location.href = '/pages/login.html';
    return;
  }

  displayProfileLoading();

  try {
    const username = viewUsername || currentUser.name;
    const { data: profile } = await getProfile(username);

    const isOwnProfile = currentUser && username === currentUser.name;
    updateProfileDisplay(profile, isOwnProfile);

    if (isOwnProfile) {
      initializeMediaUpdates();
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  }
}

/**
 * Updates the profile display with the provided profile data.
 *
 * @function updateProfileDisplay
 * @param {Object} profile - The profile data to display.
 * @param {boolean} isOwnProfile - Indicates if the profile belongs to the current user.
 */

function updateProfileDisplay(profile, isOwnProfile) {
  // 1. Update profile name everywhere it appears
  document.querySelectorAll('.profile-name').forEach((el) => {
    el.textContent = profile.name || '';
  });

  // 2. Handle email display
  document.querySelectorAll('.profile-email').forEach((el) => {
    if (isOwnProfile) {
      el.textContent = profile.email || '';
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });

  // 3. Handle credits display
  // First, toggle the container visibility
  const creditsContainer = document.querySelector('.profile-credits-container');
  if (creditsContainer) {
    creditsContainer.classList.toggle('hidden', !isOwnProfile);
  }

  // Then update all credits displays
  document.querySelectorAll('.profile-credits').forEach((el) => {
    el.textContent = `${profile.credits || 0} credits available`;
  });

  // 4. Update avatar
  if (profile.avatar?.url) {
    document.querySelectorAll('.profile-avatar').forEach((el) => {
      el.src = profile.avatar.url;
      el.alt = profile.avatar.alt || 'Profile avatar';
      el.classList.remove('animate-pulse'); // Remove loading state
    });
  }

  // 5. Toggle edit controls visibility
  document.querySelectorAll('.edit-profile, .update-avatar').forEach((el) => {
    el.classList.toggle('hidden', !isOwnProfile);
  });

  // 6. Update listings section title
  const listingsTitle = document.querySelector('.profile-listings-title');
  if (listingsTitle) {
    listingsTitle.textContent = isOwnProfile ? 'My Listings' : `${profile.name}'s Listings`;
  }

  // 7. Handle listings display
  const listingsContainer = document.querySelector('.listings-container');
  if (!listingsContainer) return;

  // If no listings, show appropriate message
  if (!profile.listings?.length) {
    listingsContainer.innerHTML = `
      <p class="text-gray-500 text-center py-4">
        ${isOwnProfile ? "You haven't created any listings yet" : 'No listings yet'}
      </p>`;
    return;
  }

  // 8. Render listings sections (active and past)
  listingsContainer.innerHTML = renderListingsSection(profile, isOwnProfile);
}

// Export the function if needed
export { updateProfileDisplay };

/**
 * Initializes the media update functionality for the profile.
 * Sets up event listeners for updating the profile avatar.
 *
 * @function initializeMediaUpdates
 */

function initializeMediaUpdates() {
  const modal = document.getElementById('mediaModal');
  const avatarBtn = document.querySelector('.update-avatar');

  avatarBtn?.addEventListener('click', () => {
    modal.showModal();
  });

  modal?.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = document.getElementById('mediaUrl').value;
    const alt = document.getElementById('mediaAlt').value;

    try {
      const user = getUser();
      await updateProfileMedia(user.name, {
        avatar: { url, alt },
      });
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  });
}
