// src/js/handlers/updateUserInfo.js
import { getUser } from '../utils/userData.js';

export function updateUserInfo() {
  const user = getUser();
  if (!user) return;

  const elements = {
    name: ['userName', 'userNameDesktop', 'userNameDropdown'],
    credits: ['userCredits', 'userCreditsDesktop', 'userCreditsDropdown']
  };

  elements.name.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = user.name;
  });

  const credits = user.credits || 1000;
  elements.credits.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = id === 'userCreditsDesktop' ? 
        `${credits}` : 
        `${credits} credits`;
    }
  });
}