import { getProfile, updateProfileMedia } from '../api/profiles/index.js';
import { getUser } from '../utils/storage.js';
import { displayProfileLoading } from '../utils/loadingStates.js';

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

function updateProfileDisplay(profile, isOwnProfile) {
  // Update profile name
  document.querySelectorAll('.profile-name').forEach((el) => {
    el.textContent = profile.name || '';
  });

  // Only show email and credits for own profile
  document.querySelectorAll('.profile-email').forEach((el) => {
    if (isOwnProfile) {
      el.textContent = profile.email || '';
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });

  document.querySelector('.profile-credits-container')?.classList.toggle('hidden', !isOwnProfile);
  document.querySelectorAll('.profile-credits').forEach((el) => {
    el.textContent = `${profile.credits || 0} credits available`;
  });

  // Update avatar
  if (profile.avatar?.url) {
    document.querySelectorAll('.profile-avatar').forEach(el => {
      el.src = profile.avatar.url;
      el.alt = profile.avatar.alt || 'Profile avatar';
      el.classList.remove('animate-pulse');
    });
  }

  // Show/hide edit controls
  document.querySelectorAll('.edit-profile, .update-avatar').forEach((el) => {
    el.classList.toggle('hidden', !isOwnProfile);
  });

  // Update listings title
  const listingsTitle = document.querySelector('.profile-listings-title');
  if (listingsTitle) {
    listingsTitle.textContent = isOwnProfile ? 'My Listings' : `${profile.name}'s Listings`;
  }

  const listingsContainer = document.querySelector('.listings-container');
  if (!listingsContainer) return;

  if (!profile.listings?.length) {
    listingsContainer.innerHTML = '<p class="text-gray-500 text-center py-4">No listings yet</p>';
    return;
  }

  listingsContainer.innerHTML = profile.listings
    .map(listing => `
      <div class="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
        <a href="/pages/single-listing.html?id=${listing.id}" class="flex items-center gap-4 flex-1">
          <img src="${listing.media?.[0]?.url || '/api/placeholder/64/64'}" 
               alt="${listing.title}" 
               class="w-16 h-16 rounded object-cover">
          <div>
            <h3 class="font-medium">${listing.title}</h3>
            <div class="text-gray-600">
              <p>${listing._count?.bids || 0} bids</p>
              <p class="text-sm">Last bid: ${listing.bids?.[0]?.amount || 'No bids yet'}</p>
            </div>
          </div>
        </a>
        ${isOwnProfile ? `
          <a href="/pages/edit-listing.html?id=${listing.id}" 
             class="px-4 py-2 bg-[#4f6f52] text-white rounded">
            Edit
          </a>
        ` : ''}
      </div>
    `).join('');
}

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
