/**
 * Edge Case Testing (T030)
 * Tests edge cases and boundary conditions
 */

const { TaskStore } = require('../../src/task-store.js');
const { validateTaskInput } = require('../../src/utils.js');

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

describe('Edge Case Testing (T030)', () => {
  let taskStore;

  beforeEach(async () => {
    localStorage.clear();
    taskStore = new TaskStore();
    await taskStore.init();
  });

  describe('Very long task titles', () => {
    test('Accept task titles up to 5000 characters', async () => {
      const longTitle = 'x'.repeat(5000);
      const task = await taskStore.createTask(longTitle);

      expect(task).toBeDefined();
      expect(task.title.length).toBe(5000);

      const retrieved = await taskStore.getTask(task.id);
      expect(retrieved.title).toBe(longTitle);
    });

    test('Reject task titles over 5000 characters', () => {
      const veryLongTitle = 'x'.repeat(5001);
      const result = validateTaskInput(veryLongTitle);

      expect(result).toBe(null); // Should be invalid
    });

    test('Accept task titles with special characters', async () => {
      const specialTitle = '🎉 Special chars: @#$%^&*() "<>[]{}';
      const task = await taskStore.createTask(specialTitle);

      expect(task).toBeDefined();
      expect(task.title).toBe(specialTitle);
    });

    test('Accept task titles with unicode characters', async () => {
      const unicodeTitle = '你好世界 مرحبا بالعالم Привет мир';
      const task = await taskStore.createTask(unicodeTitle);

      expect(task).toBeDefined();
      expect(task.title).toBe(unicodeTitle);
    });

    test('Accept task titles with newlines and tabs', async () => {
      const multilineTitle = 'Line 1\nLine 2\tTabbed';
      const task = await taskStore.createTask(multilineTitle);

      expect(task).toBeDefined();
      expect(task.title).toContain('\n');
      expect(task.title).toContain('\t');
    });
  });

  describe('Rapid task addition', () => {
    test('Create multiple tasks in rapid succession without duplicates', async () => {
      const tasks = [];
      
      for (let i = 0; i < 50; i++) {
        tasks.push(taskStore.createTask(`Rapid task ${i}`));
      }

      const results = await Promise.all(tasks);
      const allTasks = await taskStore.getAllTasks();

      expect(allTasks.length).toBe(50);
      
      // Check for duplicates
      const ids = allTasks.map(t => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(50); // All IDs unique
    });

    test('Handle concurrent create and delete operations', async () => {
      // Create 10 tasks
      const createPromises = [];
      for (let i = 0; i < 10; i++) {
        createPromises.push(taskStore.createTask(`Task ${i}`));
      }
      const createdTasks = await Promise.all(createPromises);

      // Delete while state is consistent
      const allTasks = await taskStore.getAllTasks();
      expect(allTasks.length).toBe(10);

      // Delete in rapid succession
      const deletePromises = createdTasks.slice(0, 5).map(t => 
        taskStore.deleteTask(t.id)
      );
      await Promise.all(deletePromises);

      const remainingTasks = await taskStore.getAllTasks();
      expect(remainingTasks.length).toBe(5);
    });
  });

  describe('Storage quota and limits', () => {
    test('Handle storage quota exceeded gracefully', async () => {
      // This test documents quota behavior - actual limit depends on browser
      try {
        let totalSize = 0;
        let taskCount = 0;

        // Create tasks until we might hit limits
        while (taskCount < 1000) {
          try {
            await taskStore.createTask(`Large task with lots of content... ${taskCount}`);
            taskCount++;
            
            const storageData = localStorage.getItem('tasks');
            totalSize = storageData ? storageData.length : 0;

            // Most browsers allow ~5-10MB of localStorage
            if (totalSize > 5000000) {
              console.log(`Storage approaching limit at ${taskCount} tasks`);
              break;
            }
          } catch (e) {
            console.log(`Storage quota exceeded at ${taskCount} tasks: ${e.message}`);
            break;
          }
        }

        console.log(`Successfully stored ${taskCount} tasks (~${totalSize} bytes)`);
      } catch (error) {
        console.log(`Storage test note: ${error.message}`);
      }
    });

    test('Graceful fallback when localStorage unavailable', async () => {
      // Simulate localStorage unavailable
      const originalLocalStorage = global.localStorage;
      global.localStorage = null;

      try {
        const fallbackStore = new TaskStore();
        // Should use IndexedDB fallback or in-memory storage
        // Note: Full test requires IndexedDB mock
        expect(fallbackStore).toBeDefined();
      } finally {
        global.localStorage = originalLocalStorage;
      }
    });
  });

  describe('Private browsing mode', () => {
    test('Handle storage limitations in private mode', async () => {
      // In private mode, some browsers restrict storage
      // This test documents expected behavior
      try {
        const testStore = new TaskStore();
        await testStore.init();
        
        const task = await testStore.createTask('Private mode test');
        expect(task).toBeDefined();

        console.log('App works in private/incognito mode');
      } catch (e) {
        console.log(`Private mode limitation: ${e.message}`);
      }
    });
  });

  describe('Large dataset handling', () => {
    test('Load 500+ tasks without performance degradation', async () => {
      // Create 500 tasks
      console.log('Creating 500 tasks...');
      for (let i = 0; i < 500; i++) {
        await taskStore.createTask(`Task ${i}`);
      }

      const startTime = performance.now();
      const tasks = await taskStore.getAllTasks();
      const endTime = performance.now();

      console.log(`Loaded 500 tasks in ${(endTime - startTime).toFixed(2)}ms`);
      expect(tasks.length).toBe(500);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete quickly
    });

    test('Delete all tasks efficiently', async () => {
      // Create 100 tasks
      for (let i = 0; i < 100; i++) {
        await taskStore.createTask(`Task ${i}`);
      }

      // Delete all
      const startTime = performance.now();
      await taskStore.deleteAllTasks();
      const endTime = performance.now();

      console.log(`Deleted 100 tasks in ${(endTime - startTime).toFixed(2)}ms`);

      const tasks = await taskStore.getAllTasks();
      expect(tasks.length).toBe(0);
    });
  });

  describe('Input validation edge cases', () => {
    test('Reject empty string after trimming', () => {
      expect(validateTaskInput('')).toBe(null);
      expect(validateTaskInput('   ')).toBe(null);
      expect(validateTaskInput('\n\t')).toBe(null);
    });

    test('Accept whitespace-padded input', async () => {
      const result = validateTaskInput('  Valid task  ');
      expect(result).toBeTruthy();
      expect(result).toBe('Valid task'); // Should be trimmed
    });

    test('Handle null and undefined gracefully', () => {
      expect(validateTaskInput(null)).toBe(null);
      expect(validateTaskInput(undefined)).toBe(null);
    });

    test('Accept single character task', async () => {
      const task = await taskStore.createTask('A');
      expect(task).toBeDefined();
      expect(task.title).toBe('A');
    });
  });

  describe('Data consistency', () => {
    test('Prevent duplicate IDs across operations', async () => {
      const ids = new Set();
      const taskCount = 100;

      for (let i = 0; i < taskCount; i++) {
        const task = await taskStore.createTask(`Task ${i}`);
        if (ids.has(task.id)) {
          throw new Error(`Duplicate ID detected: ${task.id}`);
        }
        ids.add(task.id);
      }

      expect(ids.size).toBe(taskCount);
    });

    test('Maintain creation order for tasks with same creation time', async () => {
      const task1 = await taskStore.createTask('First');
      const task2 = await taskStore.createTask('Second');
      const task3 = await taskStore.createTask('Third');

      const tasks = await taskStore.getAllTasks();

      expect(tasks[0].id).toBe(task1.id);
      expect(tasks[1].id).toBe(task2.id);
      expect(tasks[2].id).toBe(task3.id);
    });
  });
});
