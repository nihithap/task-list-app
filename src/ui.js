/**
 * UI Module - DOM manipulation and rendering for Task List App
 */

/**
 * Render the complete task list
 * @param {array} tasks - Array of task objects
 */
function renderTaskList(tasks) {
  const taskList = document.getElementById(DOM_IDS.TASK_LIST);
  if (!taskList) return;

  taskList.innerHTML = '';

  if (tasks.length === 0) {
    taskList.innerHTML = '<p class="empty-message">No tasks yet. Add one to get started!</p>';
    return;
  }

  tasks.forEach((task) => {
    const element = createTaskElement(task);
    taskList.appendChild(element);
  });
}

/**
 * Create a DOM element for a single task
 * @param {object} task - Task object
 * @returns {HTMLElement} Task DOM element
 */
function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = `${CSS_CLASSES.TASK_ITEM}`;
  li.id = `task-${task.id}`;

  if (task.completed) {
    li.classList.add(CSS_CLASSES.COMPLETED);
  }

  // Checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = CSS_CLASSES.CHECKBOX;
  checkbox.checked = task.completed;
  checkbox.dataset.taskId = task.id;

  // Task title
  const span = document.createElement('span');
  span.className = 'task-title';
  span.textContent = task.title;

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = CSS_CLASSES.DELETE_BUTTON;
  deleteBtn.textContent = '🗑';
  deleteBtn.title = 'Delete task';
  deleteBtn.dataset.taskId = task.id;

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
}

/**
 * Attach event listeners for task creation
 * @param {TaskStore} taskStore - Task store instance
 */
function attachAddTaskListener(taskStore) {
  const input = document.getElementById(DOM_IDS.TASK_INPUT);
  const button = document.getElementById(DOM_IDS.ADD_TASK_BUTTON);

  if (!input || !button) {
    console.error('Task input or button not found');
    return;
  }

  // Add button click
  button.addEventListener('click', async () => {
    await handleTaskCreation(input, taskStore);
  });

  // Enter key in input field
  input.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      await handleTaskCreation(input, taskStore);
    }
  });
}

/**
 * Handle task creation from input
 * @param {HTMLInputElement} input - Input field
 * @param {TaskStore} taskStore - Task store instance
 */
async function handleTaskCreation(input, taskStore) {
  const title = input.value;

  if (!title.trim()) {
    input.focus();
    return;
  }

  try {
    await taskStore.createTask(title);
    input.value = '';
    input.focus();
  } catch (error) {
    console.error('Error creating task:', error);
    // Could show error to user (future enhancement)
  }
}

/**
 * Attach event listeners for task completion
 * @param {TaskStore} taskStore - Task store instance
 */
function attachCheckboxListener(taskStore) {
  const taskList = document.getElementById(DOM_IDS.TASK_LIST);
  if (!taskList) return;

  taskList.addEventListener('change', async (e) => {
    if (e.target.classList.contains(CSS_CLASSES.CHECKBOX)) {
      const taskId = e.target.dataset.taskId;
      await handleTaskCompletion(taskId, taskStore);
    }
  });
}

/**
 * Handle task completion toggle
 * @param {string} taskId - Task ID
 * @param {TaskStore} taskStore - Task store instance
 */
async function handleTaskCompletion(taskId, taskStore) {
  try {
    await taskStore.toggleTaskCompletion(taskId);
  } catch (error) {
    console.error('Error toggling task completion:', error);
  }
}

/**
 * Attach event listeners for task deletion
 * @param {TaskStore} taskStore - Task store instance
 */
function attachDeleteListener(taskStore) {
  const taskList = document.getElementById(DOM_IDS.TASK_LIST);
  if (!taskList) return;

  taskList.addEventListener('click', async (e) => {
    if (e.target.classList.contains(CSS_CLASSES.DELETE_BUTTON)) {
      const taskId = e.target.dataset.taskId;
      await handleTaskDelete(taskId, taskStore);
    }
  });
}

/**
 * Handle task deletion
 * @param {string} taskId - Task ID
 * @param {TaskStore} taskStore - Task store instance
 */
async function handleTaskDelete(taskId, taskStore) {
  try {
    await taskStore.deleteTask(taskId);
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}

/**
 * Initialize all UI event listeners
 * @param {TaskStore} taskStore - Task store instance
 */
function initializeEventListeners(taskStore) {
  attachAddTaskListener(taskStore);
  attachCheckboxListener(taskStore);
  attachDeleteListener(taskStore);
}

// Export for browser
if (typeof window !== 'undefined') {
  window.renderTaskList = renderTaskList;
  window.createTaskElement = createTaskElement;
  window.attachAddTaskListener = attachAddTaskListener;
  window.attachCheckboxListener = attachCheckboxListener;
  window.attachDeleteListener = attachDeleteListener;
  window.initializeEventListeners = initializeEventListeners;
}

// Export for Node/testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderTaskList,
    createTaskElement,
    attachAddTaskListener,
    attachCheckboxListener,
    attachDeleteListener,
    initializeEventListeners,
  };
}
