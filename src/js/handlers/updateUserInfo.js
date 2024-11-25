// src/js/handlers/updateUserInfo.js
import { getUser } from '../utils/userData.js';

export function updateUserInfo() {
  const user = getUser();
  if (user) {
    // Update all username instances
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userNameDesktop').textContent = user.name;
    document.getElementById('userNameDropdown').textContent = user.name;

    // Update all credits instances
    const credits = user.credits || 1000;
    document.getElementById('userCredits').textContent = `${credits} Credits`;
    document.getElementById('userCreditsDesktop').textContent = `${credits}`;
    document.getElementById('userCreditsDropdown').textContent = `${credits} credits`;
  }
}
