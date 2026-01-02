/**
 * Constants for the Task List App
 */

// Storage configuration
const STORAGE_KEY = 'tasks';
const STORAGE_VERSION = '1.0.0';

// Validation constraints (from data-model.md)
const TASK_TITLE_MIN_LENGTH = 1;
const TASK_TITLE_MAX_LENGTH = 5000;

// Performance targets (from spec.md success criteria)
const PERFORMANCE_TARGETS = {
  CREATE_TASK_MS: 1000,        // SC-001: < 1 second
  TOGGLE_COMPLETION_MS: 500,   // SC-002: < 500ms
  LOAD_TASKS_MS: 500,          // SC-003: < 500ms
  BUNDLE_SIZE_KB: 100,         // SC-006: < 100KB
};

// UI element IDs (from index.html specification)
const DOM_IDS = {
  TASK_INPUT: 'task-input',
  ADD_TASK_BUTTON: 'add-task-button',
  TASK_LIST: 'task-list',
};

// CSS class names for styling
const CSS_CLASSES = {
  COMPLETED: 'completed',
  TASK_ITEM: 'task-item',
  DELETE_BUTTON: 'delete-btn',
  CHECKBOX: 'task-checkbox',
};

// Error messages
const ERROR_MESSAGES = {
  EMPTY_TITLE: 'Task title cannot be empty',
  TITLE_TOO_LONG: `Task title cannot exceed ${TASK_TITLE_MAX_LENGTH} characters`,
  STORAGE_UNAVAILABLE: 'Storage is unavailable. Changes may not be saved.',
  STORAGE_QUOTA_EXCEEDED: 'Storage quota exceeded. Please delete some tasks.',
  INVALID_TASK: 'Invalid task format',
};

// Export for both Node and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    STORAGE_KEY,
    STORAGE_VERSION,
    TASK_TITLE_MIN_LENGTH,
    TASK_TITLE_MAX_LENGTH,
    PERFORMANCE_TARGETS,
    DOM_IDS,
    CSS_CLASSES,
    ERROR_MESSAGES,
  };
}
