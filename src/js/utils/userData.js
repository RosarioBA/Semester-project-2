// src/js/utils/userData.js

export function getUser() {
  try {
    const userJson = localStorage.getItem('user');
    console.log('Raw user data from localStorage:', userJson);
    
    if (!userJson) {
      console.log('No user data found in localStorage');
      return null;
    }

    const user = JSON.parse(userJson);
    console.log('Parsed user data:', user);

    if (user) {
      const credits = localStorage.getItem('userCredits') || user.credits || 1000;
      user.credits = credits;
      console.log('User with credits:', user);
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