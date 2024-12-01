// src/js/handlers/profile.js
import { getProfile, updateProfileMedia } from '../api/profiles/index.js';
import { getUser } from '../utils/storage.js';

export async function loadProfilePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const viewUsername = urlParams.get('name');
  const currentUser = getUser();

  if (!viewUsername && !currentUser) {
    window.location.href = '/pages/login.html';
    return;
  }

  try {
    const username = viewUsername || currentUser.name;
    const { data: profile } = await getProfile(username);
    updateProfileDisplay(profile);

    const isOwnProfile = currentUser && username === currentUser.name;
    document.querySelectorAll('.edit-profile').forEach((el) => {
      el.style.display = isOwnProfile ? 'block' : 'none';
    });

    if (isOwnProfile) {
      initializeMediaUpdates();
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  }
}

function updateProfileDisplay(profile) {
  document.querySelectorAll('.profile-name').forEach((el) => {
    el.textContent = profile.name;
  });

  document.querySelectorAll('.profile-email').forEach((el) => {
    el.textContent = profile.email;
  });

  document.querySelectorAll('.profile-credits').forEach((el) => {
    el.textContent = `${profile.credits} credits available`;
  });

  if (profile.avatar?.url) {
    document.querySelectorAll('.profile-avatar').forEach((el) => {
      el.src = profile.avatar.url;
      el.alt = profile.avatar.alt || 'Profile avatar';
    });
  }

  const listingsContainer = document.querySelector('.listings-container');
  if (!listingsContainer) return;

  if (!profile.listings?.length) {
    listingsContainer.innerHTML = '<p class="text-gray-500 text-center py-4">No listings yet</p>';
    return;
  }

  const isOwnProfile = profile.name === getUser()?.name;
  listingsContainer.innerHTML = profile.listings
    .map(
      (listing) => `
       <div class="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
           <a href="/pages/single-listing.html?id=${listing.id}" class="flex items-center gap-4 flex-1">
               <img src="${listing.media?.[0]?.url || '/api/placeholder/64/64'}" 
                    alt="${listing.title}" 
                    class="w-16 h-16 rounded object-cover">
               <div>
                   <h3 class="font-medium">${listing.title}</h3>
                   <p class="text-gray-600">${listing._count?.bids || 0} bids</p>
               </div>
           </a>
           ${
             isOwnProfile
               ? `
               <a href="/pages/edit-listing.html?id=${listing.id}" 
                  class="px-4 py-2 bg-[#4f6f52] text-white rounded">
                   Edit
               </a>
           `
               : ''
           }
       </div>
   `
    )
    .join('');
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
