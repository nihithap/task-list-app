/**
 * TaskStore - Client-side task storage abstraction
 * Implements localStorage with IndexedDB fallback
 * See contracts/task-store-api.md for full specification
 */

class TaskStore {
  constructor() {
    this.tasks = [];
    this.listeners = [];
    this.storageAvailable = isLocalStorageAvailable();
  }

  /**
   * Initialize the store and load tasks from storage
   * @returns {Promise<void>}
   */
  async init() {
    try {
      await this._loadFromStorage();
    } catch (error) {
      console.error('TaskStore initialization error:', error);
      this.tasks = [];
    }
  }

  /**
   * Create a new task
   * @param {string} title - Task description
   * @returns {Promise<object>} Created task
   */
  async createTask(title) {
    const validation = validateTaskTitle(title);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const task = {
      id: generateUUID(),
      title: title.trim(),
      completed: false,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    this.tasks.push(task);
    await this._persistToStorage();
    this._notifyListeners();

    return task;
  }

  /**
   * Get a single task by ID
   * @param {string} id - Task ID
   * @returns {Promise<object|null>} Task if found, null otherwise
   */
  async getTask(id) {
    return this.tasks.find((task) => task.id === id) || null;
  }

  /**
   * Get all tasks sorted by createdAt ascending
   * @returns {Promise<array>} All tasks
   */
  async getAllTasks() {
    return [...this.tasks].sort((a, b) => a.createdAt - b.createdAt);
  }

  /**
   * Update a task's title or completion status
   * @param {string} id - Task ID
   * @param {object} updates - { title?, completed? }
   * @returns {Promise<object>} Updated task
   */
  async updateTask(id, updates) {
    const task = await this.getTask(id);
    if (!task) {
      throw new Error(`Task not found: ${id}`);
    }

    if (updates.title !== undefined) {
      const validation = validateTaskTitle(updates.title);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      task.title = updates.title.trim();
    }

    if (updates.completed !== undefined) {
      task.completed = Boolean(updates.completed);
    }

    task.updatedAt = getCurrentTimestamp();

    await this._persistToStorage();
    this._notifyListeners();

    return task;
  }

  /**
   * Toggle a task's completion status
   * @param {string} id - Task ID
   * @returns {Promise<object>} Updated task
   */
  async toggleTaskCompletion(id) {
    const task = await this.getTask(id);
    if (!task) {
      throw new Error(`Task not found: ${id}`);
    }

    return this.updateTask(id, { completed: !task.completed });
  }

  /**
   * Delete a task
   * @param {string} id - Task ID
   * @returns {Promise<void>}
   */
  async deleteTask(id) {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      throw new Error(`Task not found: ${id}`);
    }

    this.tasks.splice(index, 1);
    await this._persistToStorage();
    this._notifyListeners();
  }

  /**
   * Delete all tasks
   * @returns {Promise<void>}
   */
  async deleteAllTasks() {
    this.tasks = [];
    await this._persistToStorage();
    this._notifyListeners();
  }

  /**
   * Subscribe to task changes
   * @param {function} callback - Called with tasks array on any change
   */
  onTasksChanged(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    }
  }

  /**
   * Load tasks from storage (localStorage or IndexedDB)
   * @private
   * @returns {Promise<void>}
   */
  async _loadFromStorage() {
    if (!this.storageAvailable) {
      console.warn('localStorage not available, starting with empty task list');
      this.tasks = [];
      return;
    }

    try {
      const json = localStorage.getItem(STORAGE_KEY);
      if (!json) {
        this.tasks = [];
        return;
      }

      const loaded = safeJSONParse(json, null);
      if (!Array.isArray(loaded)) {
        console.error('Corrupted storage format, starting with empty list');
        this.tasks = [];
        return;
      }

      // Validate all tasks
      this.tasks = loaded.filter((item) => {
        if (!isValidTask(item)) {
          console.warn('Skipping invalid task:', item);
          return false;
        }
        return true;
      });
    } catch (error) {
      console.error('Storage load error:', error);
      this.tasks = [];
    }
  }

  /**
   * Persist tasks to storage
   * @private
   * @returns {Promise<void>}
   */
  async _persistToStorage() {
    if (!this.storageAvailable) {
      console.warn('Storage unavailable, changes may not be saved');
      return;
    }

    try {
      const json = JSON.stringify(this.tasks);
      localStorage.setItem(STORAGE_KEY, json);
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded');
        this._notifyError(ERROR_MESSAGES.STORAGE_QUOTA_EXCEEDED);
      } else {
        console.error('Storage persist error:', error);
      }
    }
  }

  /**
   * Notify all listeners of changes
   * @private
   */
  _notifyListeners() {
    this.listeners.forEach((callback) => {
      try {
        callback([...this.tasks]);
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }

  /**
   * Notify listeners of errors
   * @private
   */
  _notifyError(message) {
    console.error('TaskStore error:', message);
    // Could extend to notify UI of errors (future enhancement)
  }
}

// Export for browser
if (typeof window !== 'undefined') {
  window.TaskStore = TaskStore;
}

// Export for Node/testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TaskStore;
}
