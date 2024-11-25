// src/js/handlers/createListing.js

import { createListing } from '../api/listings/create.js';

/**
 * Handles form submission for creating a new listing
 * @param {Event} event - The form submission event
 */
async function handleCreateListing(event) {
    event.preventDefault();
    
    // Get the form element
    const form = event.target;
    
    // Disable the submit button to prevent double submission
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = 'Creating...';
    
    try {
        // Get form data
        const formData = {
            title: form.title.value,
            description: form.description.value,
            tags: form.tags.value,
            media: form.media.value,
            deadline: form.deadline.value
        };

        // Validate required fields
        if (!formData.title || !formData.deadline) {
            throw new Error('Title and deadline are required');
        }

        // Create the listing
        const response = await createListing(formData);

        // Show success message
        alert('Listing created successfully!');

        // Redirect to the listing page or home page
        window.location.href = '/';

    } catch (error) {
        // Show error message
        alert(error.message || 'Failed to create listing. Please try again.');
        
        // Re-enable the submit button
        submitButton.disabled = false;
        submitButton.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create New Listing
        `;
    }
}

// Add event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', handleCreateListing);
    }
});

// Add validation for the deadline date
const deadlineInput = document.getElementById('deadline');
if (deadlineInput) {
    deadlineInput.addEventListener('change', (event) => {
        const selectedDate = new Date(event.target.value);
        const now = new Date();
        
        if (selectedDate <= now) {
            alert('Deadline must be in the future');
            event.target.value = '';
        }
    });
}