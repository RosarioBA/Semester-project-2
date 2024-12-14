// src/js/components/userInfo.js

import { getUser } from '../utils/userData.js';

/**
 * Updates the user information displayed on the webpage.
 *
 * This function retrieves the user data using the `getUser` function and updates
 * the text content of specific HTML elements with the user's name and credits.
 *
 * The elements to be updated are identified by their IDs:
 * - Name elements: 'userName', 'userNameDesktop', 'userNameDropdown'
 * - Credits elements: 'userCredits', 'userCreditsDesktop', 'userCreditsDropdown'
 *
 * If the user data is not available, the function will return early.
 * If the user credits are not defined, a default value of 1000 credits will be used.
 */

export function updateUserInfo() {
  const user = getUser();
  if (!user) return;

  const elements = {
    name: ['userName', 'userNameDesktop', 'userNameDropdown'],
    credits: ['userCredits', 'userCreditsDesktop', 'userCreditsDropdown'],
  };

  elements.name.forEach((id) => {
    const element = document.getElementById(id);
    if (element) element.textContent = user.name;
  });

  const credits = user.credits || 1000;
  elements.credits.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = id === 'userCreditsDesktop' ? `${credits}` : `${credits} credits`;
    }
  });
}
