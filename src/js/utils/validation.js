// src/js/utils/validation.js

/**
 * Validates user registration data
 * @param {Object} userData - The user data to validate
 * @param {string} userData.name - Username
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Password
 * @param {string} [userData.bio] - Optional user bio
 * @param {Object} [userData.avatar] - Optional avatar data
 * @param {string} [userData.avatar.url] - Avatar URL
 * @param {string} [userData.avatar.alt] - Avatar alt text
 * @returns {Object} Validation result with isValid and any errors
 */
export function validateRegistration(userData) {
  const errors = {};

  // Username validation
  if (!userData.name || !/^[a-zA-Z0-9_]+$/.test(userData.name)) {
    errors.name = 'Username can only contain letters, numbers, and underscores';
  }

  // Email validation
  if (!userData.email || !userData.email.endsWith('@stud.noroff.no')) {
    errors.email = 'Must be a valid stud.noroff.no email address';
  }

  // Password validation
  if (!userData.password || userData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  // Bio validation (optional)
  if (userData.bio && userData.bio.length > 160) {
    errors.bio = 'Bio must be less than 160 characters';
  }

  // Avatar validation (optional)
  if (userData.avatar) {
    if (userData.avatar.url) {
      try {
        new URL(userData.avatar.url);
      } catch {
        errors.avatar = 'Avatar URL must be valid';
      }
    }
    if (userData.avatar.alt && userData.avatar.alt.length > 120) {
      errors.avatarAlt = 'Avatar alt text must be less than 120 characters';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
