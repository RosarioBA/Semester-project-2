// src/js/utils/userData.js
export function getUser() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    user.credits = localStorage.getItem('userCredits') || user.credits || 1000;
  }
  return user;
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem('token'));
}

export function updateUserCredits(credits) {
  localStorage.setItem('userCredits', credits);
}