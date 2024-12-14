/**
 * Initializes the dropdown menu functionality.
 *
 * This function sets up event listeners for a dropdown menu, allowing it to be toggled
 * by clicking a button, and optionally handling hover events on desktop screens.
 *
 * The dropdown menu is expected to be a sibling of the button within a container
 * element with the class "dropdown-container". The menu should have a class that
 * includes "hidden" when it is not visible.
 *
 * Functionality:
 * - Toggles the visibility of the dropdown menu when the button is clicked.
 * - Closes the dropdown menu when clicking outside of it.
 * - Optionally handles hover events to show/hide the menu on desktop screens.
 *
 * @function initializeDropdown
 */

export function initializeDropdown() {
  const menuButton = document.getElementById('menuButton');
  const dropdownContainer = menuButton?.closest('.dropdown-container');
  const dropdownMenu = dropdownContainer?.querySelector('div[class*="hidden"]');

  if (!menuButton || !dropdownMenu) return;

  let isOpen = false;
  let timeoutId = null;

  menuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen = !isOpen;
    dropdownMenu.classList.toggle('hidden', !isOpen);
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdownContainer.contains(e.target)) {
      isOpen = false;
      dropdownMenu.classList.add('hidden');
    }
  });

  // Optional: Handle hover on desktop
  if (window.innerWidth >= 768) {
    dropdownContainer.addEventListener('mouseenter', () => {
      if (timeoutId) clearTimeout(timeoutId);
      dropdownMenu.classList.remove('hidden');
    });

    dropdownContainer.addEventListener('mouseleave', () => {
      timeoutId = setTimeout(() => {
        dropdownMenu.classList.add('hidden');
      }, 300);
    });
  }
}
