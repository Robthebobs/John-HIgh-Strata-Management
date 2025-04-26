// Cookie management utilities

/**
 * Set a cookie with the given name, value and expiration days
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Number of days until expiration
 * @param {boolean} secure - Whether to set Secure flag (HTTPS only)
 */
export const setCookie = (name, value, days = 7, secure = false) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  const secureFlag = secure ? '; secure' : '';
  document.cookie = `${name}=${value}; ${expires}; path=/; samesite=strict${secureFlag}`;
};

/**
 * Get a cookie by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
};

/**
 * Delete a cookie by name
 * @param {string} name - Cookie name
 */
export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

/**
 * Check if user is authenticated via cookies
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
  return getCookie('isAuthenticated') === 'true';
};

/**
 * Get the current user ID from cookies
 * @returns {string|null} User ID or null if not found
 */
export const getUserId = () => {
  return getCookie('userId');
};

/**
 * Set authentication cookies
 * @param {string} userId - User ID to store
 * @param {number} days - Number of days until expiration
 */
export const setAuthCookies = (userId, days = 7) => {
  // Use secure cookies in production
  const isSecure = window.location.protocol === 'https:';
  setCookie('isAuthenticated', 'true', days, isSecure);
  setCookie('userId', userId, days, isSecure);
  
  // Also update localStorage for backwards compatibility
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('userId', userId);
};

/**
 * Clear authentication cookies
 */
export const clearAuthCookies = () => {
  deleteCookie('isAuthenticated');
  deleteCookie('userId');
  
  // Also clear localStorage for consistency
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userId');
}; 