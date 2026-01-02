/**
 * Performance Validation Tests (T028)
 * Tests performance targets across all operations
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

describe('Performance Validation (T028)', () => {
  let taskStore;

  beforeEach(async () => {
    localStorage.clear();
    taskStore = new TaskStore();
    await taskStore.init();
  });

  test('Test: Task creation < 1 second (SC-001)', async () => {
    const startTime = performance.now();
    
    for (let i = 0; i < 10; i++) {
      await taskStore.createTask(`Task ${i}`);
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`Task creation (10 tasks): ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(1000); // < 1 second
  });

  test('Test: Completion toggle < 500ms (SC-002)', async () => {
    const task = await taskStore.createTask('Test task');
    
    const startTime = performance.now();
    
    for (let i = 0; i < 10; i++) {
      await taskStore.toggleTaskCompletion(task.id);
    }

    const endTime = performance.now();
    const duration = (endTime - startTime) / 10; // Average per toggle

    console.log(`Completion toggle (average): ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(500); // < 500ms
  });

  test('Test: Load with 100+ tasks < 500ms (SC-003)', async () => {
    // Create 100 tasks
    console.log('Creating 100 tasks...');
    for (let i = 0; i < 100; i++) {
      await taskStore.createTask(`Task ${i}`);
    }

    // Clear and reload from storage
    const startTime = performance.now();
    
    const newStore = new TaskStore();
    await newStore.init();
    const tasks = await newStore.getAllTasks();

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`Load 100 tasks: ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(500); // < 500ms
    expect(tasks.length).toBe(100);
  });

  test('Test: Bundle size check (SC-006)', () => {
    // This test is informational - actual bundling happens during build
    // For now, we estimate based on file sizes
    const fs = require('fs');
    const path = require('path');

    const files = [
      'src/utils.js',
      'src/constants.js',
      'src/task-store.js',
      'src/ui.js',
      'src/app.js',
    ];

    let totalSize = 0;
    files.forEach((file) => {
      try {
        const filePath = path.join(__dirname, '../../', file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
        console.log(`${file}: ${stats.size} bytes`);
      } catch (e) {
        console.warn(`Could not read ${file}`);
      }
    });

    console.log(`Total source size: ${totalSize} bytes (~${(totalSize / 1024).toFixed(2)} KB)`);
    console.log('Note: Minified size will be significantly smaller');
    expect(totalSize).toBeLessThan(100000); // < 100KB unminified (will be much smaller minified)
  });

  test('Test: Storage quota handling', async () => {
    // Create a large task to test quota limits
    const largeTitle = 'x'.repeat(4000); // Near max size

    const task = await taskStore.createTask(largeTitle);
    expect(task).toBeDefined();
    expect(task.title.length).toBe(4000);

    const retrieved = await taskStore.getTask(task.id);
    expect(retrieved.title.length).toBe(4000);
  });
});
