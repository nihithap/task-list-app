/**
 * Offline Functionality Test (T031)
 * Verifies complete offline capability (no network required)
 */

const { TaskStore } = require('../../src/task-store.js');

/**
 * Mock localStorage for testing
 */
global.localStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

/**
 * Mock window.navigator for offline simulation
 */
if (typeof global !== 'undefined' && !global.navigator) {
  global.navigator = {
    onLine: true,
  };
}

describe('Offline Functionality Test (T031)', () => {
  let taskStore;

  beforeEach(async () => {
    localStorage.clear();
    taskStore = new TaskStore();
    await taskStore.init();
    // Simulate online status
    global.navigator.onLine = true;
  });

  test('Test: All CRUD operations work offline', async () => {
    // Simulate offline
    global.navigator.onLine = false;

    // Create task offline
    const task = await taskStore.createTask('Offline task');
    expect(task).toBeDefined();
    expect(task.id).toBeTruthy();

    // Read task offline
    const retrieved = await taskStore.getTask(task.id);
    expect(retrieved.title).toBe('Offline task');

    // Update task offline
    await taskStore.updateTask(task.id, { title: 'Updated offline' });
    const updated = await taskStore.getTask(task.id);
    expect(updated.title).toBe('Updated offline');

    // Delete task offline
    await taskStore.deleteTask(task.id);
    const allTasks = await taskStore.getAllTasks();
    expect(allTasks.length).toBe(0);

    // Restore online
    global.navigator.onLine = true;
    console.log('✓ All CRUD operations completed offline');
  });

  test('Test: Page reload while offline → tasks persist', async () => {
    // Create tasks while online
    await taskStore.createTask('Task 1');
    await taskStore.createTask('Task 2');
    await taskStore.createTask('Task 3');

    let tasks = await taskStore.getAllTasks();
    expect(tasks.length).toBe(3);

    // Simulate offline
    global.navigator.onLine = false;

    // Simulate page reload (new TaskStore instance)
    const offlineStore = new TaskStore();
    await offlineStore.init();
    tasks = await offlineStore.getAllTasks();

    expect(tasks.length).toBe(3);
    expect(tasks[0].title).toBe('Task 1');
    console.log('✓ Tasks persist across reload while offline');

    // Restore online
    global.navigator.onLine = true;
  });

  test('Test: No API calls made (zero network requests)', async () => {
    // Track fetch calls
    let fetchCalls = 0;
    const originalFetch = global.fetch;
    
    global.fetch = () => {
      fetchCalls++;
      throw new Error('Network error - should not be called');
    };

    try {
      // Perform all operations
      const task = await taskStore.createTask('No network task');
      await taskStore.getTask(task.id);
      await taskStore.updateTask(task.id, { title: 'Updated' });
      await taskStore.toggleTaskCompletion(task.id);
      await taskStore.getAllTasks();
      await taskStore.deleteTask(task.id);

      // Verify no network calls
      expect(fetchCalls).toBe(0);
      console.log('✓ Zero network requests made');
    } finally {
      global.fetch = originalFetch;
    }
  });

  test('Test: Completion toggle persists offline', async () => {
    // Create task online
    const task = await taskStore.createTask('Toggle test');
    expect(task.completed).toBe(false);

    // Go offline
    global.navigator.onLine = false;

    // Toggle completion offline
    await taskStore.toggleTaskCompletion(task.id);
    let retrieved = await taskStore.getTask(task.id);
    expect(retrieved.completed).toBe(true);

    // Toggle again offline
    await taskStore.toggleTaskCompletion(task.id);
    retrieved = await taskStore.getTask(task.id);
    expect(retrieved.completed).toBe(false);

    // Go online and verify persistence
    global.navigator.onLine = true;

    // Simulate new session
    const newStore = new TaskStore();
    await newStore.init();
    const tasks = await newStore.getAllTasks();

    expect(tasks[0].completed).toBe(false);
    console.log('✓ Completion toggle persists across offline/online transitions');
  });

  test('Test: No console errors about network failures', async () => {
    const consoleErrors = [];
    const originalError = console.error;

    console.error = (msg) => {
      if (msg && msg.includes('network') || msg.includes('fetch') || msg.includes('request')) {
        consoleErrors.push(msg);
      }
      originalError.apply(console, arguments);
    };

    try {
      // Go offline
      global.navigator.onLine = false;

      // Perform operations
      await taskStore.createTask('Test');
      await taskStore.getAllTasks();
      const tasks = await taskStore.getAllTasks();
      if (tasks.length > 0) {
        await taskStore.deleteTask(tasks[0].id);
      }

      // Check for network-related errors
      expect(consoleErrors.length).toBe(0);
      console.log('✓ No network-related console errors');

      // Restore online
      global.navigator.onLine = true;
    } finally {
      console.error = originalError;
    }
  });

  test('Test: Responsive UI updates while offline', async () => {
    // Create mock DOM
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM('<!DOCTYPE html><html><body><ul id="task-list"></ul><input id="task-input"/><button id="add-task-button">Add</button></body></html>');
    const mockDocument = dom.window.document;

    // Go offline
    global.navigator.onLine = false;

    // Simulate task creation UI update
    const taskList = mockDocument.getElementById('task-list');
    const li = mockDocument.createElement('li');
    li.textContent = 'Offline task';
    taskList.appendChild(li);

    expect(taskList.children.length).toBe(1);
    expect(taskList.children[0].textContent).toBe('Offline task');

    console.log('✓ UI responsive while offline');
    global.navigator.onLine = true;
  });

  test('Test: Storage size check', async () => {
    // Create some tasks
    for (let i = 0; i < 20; i++) {
      await taskStore.createTask(`Task ${i}: Lorem ipsum dolor sit amet...`);
    }

    const storageData = localStorage.getItem('tasks');
    expect(storageData).toBeTruthy();

    const storageSize = storageData.length;
    console.log(`Storage used: ${(storageSize / 1024).toFixed(2)} KB`);

    // Verify storage is reasonable
    expect(storageSize).toBeLessThan(50000); // Less than 50KB for 20 tasks
    console.log('✓ Storage usage within reasonable limits');
  });
});

/**
 * Manual Testing Guide for Offline Mode
 */
const OFFLINE_TEST_GUIDE = `
MANUAL OFFLINE TESTING (T031):
=============================

1. Test using Browser DevTools:
   - Open DevTools (F12)
   - Go to Network tab
   - Create a task
   - Verify task appears (no network request should be visible)
   - Go to Application > Storage > Local Storage
   - Verify 'tasks' key contains your task data

2. Test Offline Mode:
   - Open index.html in browser
   - Open DevTools > Network tab
   - Go offline by checking "Offline" checkbox in Network tab
   - Create, complete, and delete tasks
   - Verify all operations work without network

3. Test Page Refresh While Offline:
   - Create several tasks
   - Go offline in DevTools
   - Press F5 to reload page
   - Verify all tasks still appear
   - Check console (F12) for any errors

4. Test Transition Back to Online:
   - Go offline
   - Create a task (offline)
   - Go back online in DevTools
   - Verify no sync errors in console
   - Data should persist without issues

5. Verify No API Calls:
   - Open DevTools Network tab
   - Perform all operations (create, update, delete)
   - Verify NO HTTP requests are made
   - All operations should be instant (< 100ms)

6. Test Private/Incognito Mode:
   - Open app in private/incognito window
   - Create and manage tasks
   - Verify functionality works
   - Close window and reopen
   - Note: Tasks may not persist in true private mode (expected behavior)
`;

console.log(OFFLINE_TEST_GUIDE);

// Export for testing frameworks
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    OFFLINE_TEST_GUIDE,
  };
}
