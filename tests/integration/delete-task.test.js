/**
 * Integration Test: Delete Task Functionality
 * Tests User Story 3: Delete a Task
 */

const { TaskStore } = require('../../src/task-store.js');
const { renderTaskList, createTaskElement } = require('../../src/ui.js');

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
 * Mock DOM for testing
 */
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body><ul id="task-list"></ul></body></html>');
global.document = dom.window.document;
global.window = dom.window;

describe('Delete Task (US3) - Integration Tests', () => {
  let taskStore;
  let tasks;

  beforeEach(async () => {
    localStorage.clear();
    taskStore = new TaskStore();
    await taskStore.init();
    tasks = [];
  });

  test('Test: Delete pending task → removed from list', async () => {
    // Create pending task
    const createdTask = await taskStore.createTask('Buy groceries');
    tasks = await taskStore.getAllTasks();
    
    // Verify task created
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe('Buy groceries');
    expect(tasks[0].completed).toBe(false);

    // Delete task
    await taskStore.deleteTask(createdTask.id);
    tasks = await taskStore.getAllTasks();

    // Verify task removed
    expect(tasks.length).toBe(0);
  });

  test('Test: Delete completed task → removed from list', async () => {
    // Create and complete task
    const createdTask = await taskStore.createTask('Call mom');
    await taskStore.toggleTaskCompletion(createdTask.id);
    tasks = await taskStore.getAllTasks();

    // Verify task completed
    expect(tasks.length).toBe(1);
    expect(tasks[0].completed).toBe(true);

    // Delete task
    await taskStore.deleteTask(createdTask.id);
    tasks = await taskStore.getAllTasks();

    // Verify task removed
    expect(tasks.length).toBe(0);
  });

  test('Test: Delete one task from many → others unaffected', async () => {
    // Create multiple tasks
    const task1 = await taskStore.createTask('Task 1');
    const task2 = await taskStore.createTask('Task 2');
    const task3 = await taskStore.createTask('Task 3');
    tasks = await taskStore.getAllTasks();

    // Verify all created
    expect(tasks.length).toBe(3);

    // Delete middle task
    await taskStore.deleteTask(task2.id);
    tasks = await taskStore.getAllTasks();

    // Verify only middle task removed
    expect(tasks.length).toBe(2);
    expect(tasks[0].id).toBe(task1.id);
    expect(tasks[1].id).toBe(task3.id);
  });

  test('Test: Deletion persists across page refresh', async () => {
    // Create task
    const createdTask = await taskStore.createTask('Persistent task');
    tasks = await taskStore.getAllTasks();
    expect(tasks.length).toBe(1);

    // Delete task
    await taskStore.deleteTask(createdTask.id);
    tasks = await taskStore.getAllTasks();
    expect(tasks.length).toBe(0);

    // Simulate page refresh (new TaskStore instance)
    const taskStore2 = new TaskStore();
    await taskStore2.init();
    tasks = await taskStore2.getAllTasks();

    // Verify deletion persists
    expect(tasks.length).toBe(0);
  });
});
