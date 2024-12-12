// src/js/utils/loadingStates.js

// Loading state for listings grid
export function displayLoadingState(container) {
  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${Array(6)
          .fill()
          .map(
            () => `
            <div class="border border-gray-200 shadow rounded-md p-4 w-full">
                <div class="animate-pulse space-y-4">
                    <div class="bg-slate-200 h-48 w-full rounded"></div>
                    <div class="space-y-3">
                        <div class="h-4 bg-slate-200 rounded"></div>
                        <div class="h-4 bg-slate-200 rounded w-2/3"></div>
                        <div class="flex justify-between">
                            <div class="h-4 bg-slate-200 rounded w-1/4"></div>
                            <div class="h-4 bg-slate-200 rounded w-1/4"></div>
                        </div>
                    </div>
                </div>
            </div>
        `
          )
          .join('')}
    </div>`;
}

// Loading state for profile page
export function displayProfileLoading() {
  // Clear existing profile content
  const profileElements = {
    name: document.querySelectorAll('.profile-name'),
    email: document.querySelectorAll('.profile-email'),
    credits: document.querySelectorAll('.profile-credits'),
    avatar: document.querySelector('.profile-avatar'),
  };

  // Clear text content
  profileElements.name.forEach((el) => (el.textContent = ''));
  profileElements.email.forEach((el) => (el.textContent = ''));
  profileElements.credits.forEach((el) => (el.textContent = ''));

  // Add loading animation to avatar
  const avatarImg = document.querySelector('.profile-avatar');
  if (avatarImg) {
    avatarImg.src = '/api/placeholder/96/96';
    avatarImg.classList.add('animate-pulse');
  }

  // Add loading animation to listings container
  const listingsContainer = document.querySelector('.listings-container');
  if (listingsContainer) {
    listingsContainer.innerHTML = `
            <div class="space-y-4">
                ${Array(3)
                  .fill()
                  .map(
                    () => `
                    <div class="bg-white rounded-lg shadow-sm p-4">
                        <div class="animate-pulse flex items-center gap-4">
                            <div class="bg-slate-200 w-16 h-16 rounded"></div>
                            <div class="flex-1 space-y-2">
                                <div class="h-4 bg-slate-200 rounded"></div>
                                <div class="h-4 bg-slate-200 rounded w-1/4"></div>
                            </div>
                        </div>
                    </div>
                `
                  )
                  .join('')}
            </div>
        `;
  }
}

// General error display
export function showError(container, message) {
  container.innerHTML = `
        <div class="text-center py-12">
            <p class="text-red-500">Error: ${message}</p>
        </div>
    `;
}
