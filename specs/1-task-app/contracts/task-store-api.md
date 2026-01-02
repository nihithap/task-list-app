# API Contract: Task Storage Service

**Status**: Design  
**Phase**: 1 (Design)  
**Format**: JavaScript API (internal contract for implementation)

## Overview

The Task Storage Service is a client-side module that manages all interactions with browser storage (localStorage/IndexedDB). It provides a simple, promise-based interface for CRUD operations on tasks.

## Core Interface

```javascript
class TaskStore {
  // Initialization
  async init() → void
  
  // Create
  async createTask(title: string) → Task
  
  // Read
  async getTask(id: string) → Task | null
  async getAllTasks() → Task[]
  
  // Update
  async updateTask(id: string, updates: Partial<Task>) → Task
  async toggleTaskCompletion(id: string) → Task
  
  // Delete
  async deleteTask(id: string) → void
  async deleteAllTasks() → void
  
  // Listeners (optional for Phase 1)
  onTasksChanged(callback: (tasks: Task[]) => void) → void
}
```

## Method Specifications

### `init()`

Initialize the store and load tasks from storage.

**Signature**: `async init(): Promise<void>`

**Input**: None

**Output**: None (tasks loaded into memory)

**Side Effects**: 
- Loads tasks from localStorage (or IndexedDB if available)
- Populates internal task cache
- Calls registered change listeners

**Error Handling**:
- If storage is corrupted, log error to console and start with empty task list
- If storage quota exceeded, warn user but continue operation

**Performance**: MUST complete in < 100ms for typical load (< 500 tasks)

---

### `createTask(title)`

Create a new task with the given title.

**Signature**: `async createTask(title: string): Promise<Task>`

**Input**:
- `title` (string): Task description (1-5000 characters)

**Output**: 
- Task object with generated `id`, `createdAt`, `updatedAt` (all auto-set)

**Validation**:
- Trim input string
- If empty after trimming, throw ValidationError
- If > 5000 characters, truncate or reject with error

**Side Effects**:
- Persist new task to storage
- Call change listeners with updated task list

**Performance**: MUST complete in < 100ms (including storage write)

**Example**:
```javascript
const newTask = await taskStore.createTask("Buy groceries");
// Returns:
// {
//   id: "550e8400-e29b-41d4-a716-446655440000",
//   title: "Buy groceries",
//   completed: false,
//   createdAt: 1704211200000,
//   updatedAt: 1704211200000
// }
```

---

### `getTask(id)`

Retrieve a single task by ID.

**Signature**: `async getTask(id: string): Promise<Task | null>`

**Input**:
- `id` (string): Task unique identifier

**Output**: 
- Task object if found, null if not found

**Performance**: MUST complete in < 10ms (in-memory lookup)

---

### `getAllTasks()`

Retrieve all tasks in order (sorted by `createdAt`).

**Signature**: `async getAllTasks(): Promise<Task[]>`

**Input**: None

**Output**: 
- Array of Task objects sorted by `createdAt` (ascending — oldest first)

**Performance**: MUST complete in < 50ms even with 500+ tasks

**Example Return**:
```javascript
[
  { id: "task-001", title: "Buy groceries", completed: false, ... },
  { id: "task-002", title: "Call mom", completed: true, ... }
]
```

---

### `updateTask(id, updates)`

Update one or more fields of an existing task.

**Signature**: `async updateTask(id: string, updates: Partial<Task>): Promise<Task>`

**Input**:
- `id` (string): Task to update
- `updates` (object): Fields to change (title and/or completed)

**Output**: 
- Updated Task object

**Allowed Updates**:
- `title` (string): New task description
- `completed` (boolean): New completion status

**Immutable Fields**: `id` and `createdAt` cannot be updated

**Side Effects**:
- Sets `updatedAt` to current timestamp
- Persists to storage
- Calls change listeners

**Error Handling**: 
- If task not found, throw TaskNotFoundError
- If title is empty after trimming, reject update

**Performance**: MUST complete in < 100ms

**Example**:
```javascript
const updated = await taskStore.updateTask("task-001", { 
  title: "Buy groceries and cook" 
});
// updatedAt automatically set to current time
```

---

### `toggleTaskCompletion(id)`

Toggle a task's completion status (convenience method).

**Signature**: `async toggleTaskCompletion(id: string): Promise<Task>`

**Input**:
- `id` (string): Task to toggle

**Output**: 
- Updated Task object with `completed` flipped

**Behavior**: Equivalent to `updateTask(id, { completed: !task.completed })`

**Performance**: MUST complete in < 100ms

---

### `deleteTask(id)`

Permanently remove a task from storage.

**Signature**: `async deleteTask(id: string): Promise<void>`

**Input**:
- `id` (string): Task to delete

**Output**: None

**Side Effects**:
- Removes task from storage
- Calls change listeners with updated task list

**Error Handling**: 
- If task not found, throw TaskNotFoundError (or silently succeed, TBD)

**Performance**: MUST complete in < 100ms

---

### `deleteAllTasks()`

Permanently remove all tasks (dangerous operation).

**Signature**: `async deleteAllTasks(): Promise<void>`

**Input**: None

**Output**: None

**Confirmation**: Consider requiring explicit confirmation or password-like input to prevent accidental deletion

**Performance**: MUST complete in < 50ms

---

### `onTasksChanged(callback)`

Register a listener to be called whenever tasks change.

**Signature**: `onTasksChanged(callback: (tasks: Task[]) => void): void`

**Input**:
- `callback` (function): Called with updated task list on any change

**Behavior**: 
- Call callback immediately with current tasks (optional: do this on registration?)
- Call callback after any create/update/delete operation
- Pass entire task list (not just changed task)

**Use Case**: UI components subscribe to this for reactive updates

**Example**:
```javascript
taskStore.onTasksChanged((tasks) => {
  updateUI(tasks);
});
```

---

## Error Handling

All methods MUST handle these scenarios gracefully:

1. **Storage Unavailable**: localStorage not available (private browsing mode)
   - Fall back to in-memory storage (persists only during session)
   - Log warning to console

2. **Storage Quota Exceeded**: 
   - Log warning to user
   - Attempt to delete oldest completed tasks to free space
   - If still full, notify user and prevent new task creation

3. **Corrupted Data**: 
   - Log error
   - Reset to empty task list
   - Display recovery message

4. **Invalid Input**: 
   - Throw ValidationError with descriptive message
   - Do not persist invalid data

## Constraints

- All operations are single-user (no locking, no concurrency control needed)
- No real-time sync (changes are local only)
- No undo/redo mechanism
- No soft deletes (deletion is permanent)
- Tasks are not ordered by user; always sorted by createdAt

## Usage Example (UI Integration)

```javascript
// Initialize
const taskStore = new TaskStore();
await taskStore.init();

// Subscribe to changes
taskStore.onTasksChanged((tasks) => renderTaskList(tasks));

// Create
const newTask = await taskStore.createTask("Buy milk");

// Toggle completion
await taskStore.toggleTaskCompletion(newTask.id);

// Delete
await taskStore.deleteTask(newTask.id);

// Get all
const allTasks = await taskStore.getAllTasks();
```

---

## Approval

API contract is complete and ready for implementation.
