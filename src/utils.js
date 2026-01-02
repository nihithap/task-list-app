/**
 * Utility functions for the Task List App
 */

/**
 * Generate a UUID v4
 * @returns {string} UUID v4 string
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Validate task title input
 * @param {string} title - Task title to validate
 * @returns {object} { valid: boolean, error: string|null }
 */
function validateTaskTitle(title) {
  if (typeof title !== 'string') {
    return { valid: false, error: 'Title must be a string' };
  }

  const trimmed = title.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Title cannot be empty' };
  }

  if (trimmed.length > 5000) {
    return { valid: false, error: 'Title cannot exceed 5000 characters' };
  }

  return { valid: true, error: null };
}

/**
 * Get current timestamp in milliseconds
 * @returns {number} Current Unix timestamp (milliseconds)
 */
function getCurrentTimestamp() {
  return Date.now();
}

/**
 * Check if object is a valid Task
 * @param {object} obj - Object to validate
 * @returns {boolean} True if valid task
 */
function isValidTask(obj) {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.completed === 'boolean' &&
    typeof obj.createdAt === 'number' &&
    typeof obj.updatedAt === 'number'
  );
}

/**
 * Parse JSON safely
 * @param {string} json - JSON string
 * @param {*} fallback - Value to return if parsing fails
 * @returns {*} Parsed object or fallback
 */
function safeJSONParse(json, fallback = null) {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.error('JSON parse error:', e);
    return fallback;
  }
}

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage is available
 */
function isLocalStorageAvailable() {
  try {
    const test = '__local_storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Export for both Node and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateUUID,
    validateTaskTitle,
    getCurrentTimestamp,
    isValidTask,
    safeJSONParse,
    isLocalStorageAvailable,
  };
}
