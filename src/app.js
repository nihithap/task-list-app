/**
 * App - Main entry point for the Task List App
 */

let taskStore;

/**
 * Initialize the application
 */
async function initApp() {
  try {
    // Create and initialize TaskStore
    taskStore = new TaskStore();
    await taskStore.init();

    // Load initial tasks
    const tasks = await taskStore.getAllTasks();
    renderTaskList(tasks);

    // Initialize event listeners
    initializeEventListeners(taskStore);

    // Subscribe to task changes
    taskStore.onTasksChanged((updatedTasks) => {
      renderTaskList(updatedTasks);
    });

    console.log('App initialized successfully');
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
}

/**
 * Wait for DOM to be ready, then initialize
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initApp };
}
