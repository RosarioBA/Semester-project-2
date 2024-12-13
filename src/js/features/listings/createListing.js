// src/js/features/listings/createListing.js

import { createListing } from '../../api/listings/create.js';


/**
 * Displays a success message overlay and redirects to the homepage after a short delay.
 */


function showSuccessAndRedirect() {
  // Create success overlay
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

  const message = document.createElement('div');
  message.className = 'bg-white rounded-lg p-6 flex flex-col items-center max-w-sm mx-4';
  message.innerHTML = `
        <svg class="w-12 h-12 text-[#4F6F52] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Listing Created!</h3>
        <p class="text-gray-500 text-center mb-1">Your listing has been created successfully.</p>
        <p class="text-sm text-gray-400">Redirecting to homepage...</p>
    `;

  overlay.appendChild(message);
  document.body.appendChild(overlay);

  // Redirect after 2 seconds
  setTimeout(() => {
    window.location.href = '/';
  }, 2000);
}

/**
 * Handles form submission for creating a new listing
 * @param {Event} event - The form submission event
 */
async function handleCreateListing(event) {
  event.preventDefault();

  const form = event.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerHTML;

  // Disable submit button and show loading state
  submitButton.disabled = true;
  submitButton.innerHTML = `
        <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Creating...
    `;

  try {
    const formData = {
      title: form.title.value,
      description: form.description.value,
      tags: form.tags.value,
      media: form.media.value,
      deadline: form.deadline.value,
    };

    await createListing(formData);
    showSuccessAndRedirect();
  } catch (error) {
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-50 text-red-500 p-4 rounded-md mb-4';
    errorDiv.textContent = error.message || 'Failed to create listing. Please try again.';

    // Insert error message at the top of the form
    form.insertBefore(errorDiv, form.firstChild);

    // Remove error message after 5 seconds
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);

    // Reset button state
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  }
}

// Add event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', handleCreateListing);
  }
});

