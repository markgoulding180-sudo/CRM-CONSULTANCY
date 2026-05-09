/**
 * Formatting utilities for CRM application
 */

/**
 * Format a number as GBP currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string (e.g., "£75,000")
 */
export function formatCurrency(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '£0';
  }
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format a date string to a readable format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string (e.g., "9 May 2026")
 */
export function formatDate(date) {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(dateObj);
}

/**
 * Get initials from a full name
 * @param {string} name - Full name (e.g., "John Smith")
 * @returns {string} Initials (e.g., "JS")
 */
export function getInitials(name) {
  if (!name || typeof name !== 'string') {
    return '';
  }
  
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2); // Limit to 2 characters
}

// Default export for convenience
export default {
  formatCurrency,
  formatDate,
  getInitials
};
