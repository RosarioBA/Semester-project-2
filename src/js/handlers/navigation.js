
/**
 * Initialize navigation handlers
 */
document.addEventListener('DOMContentLoaded', () => {
    // Create listing button handler
    const createListingBtn = document.getElementById('createListingBtn');
    if (createListingBtn) {
        createListingBtn.addEventListener('click', () => {
            window.location.href = '/pages/create-listing.html';
        });
    }
});