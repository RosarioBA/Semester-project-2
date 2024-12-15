// src/js/utils/userData.js

export function getUser() {
  try {
    const userJson = localStorage.getItem('user');
    
    if (!userJson) {
      return null;
    }

    const user = JSON.parse(userJson);

    if (user) {
      const credits = localStorage.getItem('userCredits') || user.credits || 1000;
      user.credits = credits;
    }

    return user;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem('token'));
}

export function updateUserCredits(credits) {
  localStorage.setItem('userCredits', credits);
}