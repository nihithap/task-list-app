# Quickstart: Basic Task List App

**Phase**: 1 (Design)  
**Date**: 2026-01-02  
**Audience**: Developers and end users

## For Users: Getting Started

### Installation

1. **Download** `index.html` from the repository
2. **Open** in any web browser (Chrome, Firefox, Safari, Edge)
3. **Start using** — no setup, no login, no internet required

That's it! Your tasks are automatically saved in your browser.

### Using the App

#### Creating a Task
1. Type task description in the input field
2. Press **Enter** or click **Add** button
3. Task appears in the list

#### Marking Tasks Complete
- Click the **checkbox** next to a task to mark it done
- Completed tasks show a strikethrough
- Click again to un-complete

#### Deleting a Task
- Click the **delete (🗑)** button next to a task
- Task is permanently removed

#### Your Data
- Tasks are saved **locally in your browser**
- No servers involved, 100% private
- Data persists if you close the browser
- Clear your browser data to delete tasks

---

## For Developers: Implementation Guide

### Project Structure

```
specs/1-task-app/
├── spec.md                    # User requirements & acceptance criteria
├── plan.md                    # Technical design & architecture
├── research.md                # Technology decisions & alternatives
├── data-model.md              # Task entity schema
├── contracts/
│   └── task-store-api.md      # JavaScript API contract
└── quickstart.md              # This file

src/ (future)
├── app.js                     # Main entry point, UI initialization
├── ui.js                      # DOM manipulation, rendering
├── task-store.js              # Storage abstraction (localStorage + IndexedDB)
└── utils.js                   # Helpers (UUID generation, validation, etc.)

tests/ (optional)
├── unit/
│   └── task-store.test.js    # TaskStore unit tests
└── integration/
    └── ui.test.js            # Full integration tests

index.html                     # Single-file production build (after bundling)
```

### Technology Stack

- **Language**: Vanilla JavaScript (ES6+)
- **Storage**: localStorage with IndexedDB fallback
- **Testing**: Browser DevTools + optional Mocha/Chai
- **Build**: None required for MVP (or simple concat for production)
- **Bundle Size**: Target < 100KB minified

### Key Implementation Files

#### `task-store.js` — Storage Abstraction

Implements the `TaskStore` class from [task-store-api.md](contracts/task-store-api.md).

**Responsibilities**:
- Load/save tasks from browser storage
- Validate task data
- Handle storage errors gracefully
- Notify UI of changes

**Key Methods** (see contract for full spec):
```javascript
class TaskStore {
  async init()
  async createTask(title)
  async getAllTasks()
  async updateTask(id, updates)
  async deleteTask(id)
  onTasksChanged(callback)
}
```

#### `ui.js` — User Interface

Handles all DOM manipulation and rendering.

**Responsibilities**:
- Render task list
- Handle user input (type, click, enter)
- Display visual feedback for actions
- Update UI when store changes

**Key Functions**:
```javascript
function renderTaskList(tasks) { /* render HTML */ }
function attachEventListeners() { /* attach click/input handlers */ }
function clearInput() { /* clear input field */ }
function showTask(task) { /* create task DOM element */ }
```

#### `app.js` — Entry Point

Orchestrates initialization and wires components together.

```javascript
async function init() {
  const taskStore = new TaskStore();
  await taskStore.init();
  
  taskStore.onTasksChanged((tasks) => renderTaskList(tasks));
  attachEventListeners(taskStore);
}

document.addEventListener('DOMContentLoaded', init);
```

### Data Flow

```
User Input (input field, button click)
    ↓
Event Handler (in ui.js)
    ↓
TaskStore method (createTask, toggleTaskCompletion, etc.)
    ↓
localStorage/IndexedDB update
    ↓
onTasksChanged callback triggered
    ↓
renderTaskList() called with updated tasks
    ↓
DOM re-renders with new task list
```

### Development Workflow

1. **Start with `task-store.js`**: Implement storage layer first
   - Write unit tests using Mocha/Chai
   - Test localStorage + IndexedDB fallback
   - Test error scenarios (quota exceeded, corrupted data)

2. **Then `ui.js`**: Build user interface
   - HTML markup for input field, task list, buttons
   - CSS for styling (minimal, vanilla CSS)
   - Event listeners for create, complete, delete

3. **Then `app.js`**: Wire everything together
   - Initialize TaskStore
   - Attach UI listeners
   - Test full workflow (create → display → toggle → delete)

4. **Testing**:
   - Manual testing in browser DevTools
   - Verify tasks persist across page refresh
   - Test with 100+ tasks for performance
   - Verify offline functionality

5. **Bundling** (optional for MVP):
   - Concatenate files into single `index.html`
   - Minify HTML, CSS, JavaScript
   - Verify final bundle is < 100KB

### Performance Targets

From [spec.md](spec.md):
- Create task: < 1 second (SC-001)
- Toggle completion: < 500ms (SC-002)
- Load with 100+ tasks: < 500ms (SC-003)
- Bundle size: < 100KB minified (SC-006)

**Optimization Tips**:
- Avoid unnecessary DOM reflows (batch updates)
- Use requestAnimationFrame for rendering
- Don't load all tasks if list is very long (virtual scrolling, future enhancement)
- Minify production bundle

### Testing Checklist

Before shipping, verify:

**Functional** (from spec.md user stories):
- [x] User Story 1: Create task → appears in list
- [x] User Story 2: Toggle completion → visual change + persists
- [x] User Story 3: Delete task → removed from list
- [x] User Story 4: Tasks persist → refresh restores state

**Non-Functional** (from spec.md success criteria):
- [x] Performance: < 100ms operations
- [x] Offline: Works with no internet connection
- [x] Browser support: Chrome, Firefox, Safari, Edge
- [x] Bundle size: < 100KB minified
- [x] Scale: Works with 100+ tasks smoothly

**Edge Cases** (from spec.md):
- [x] Empty input validation (no blank tasks)
- [x] Very long task titles (5000+ characters)
- [x] Rapid button clicks (no duplicates)
- [x] Storage quota exceeded (graceful warning)
- [x] Private browsing mode (fallback to in-memory)

### Debugging

Use browser DevTools:
```javascript
// Check current tasks in console
await taskStore.getAllTasks()

// Manually trigger change listener
taskStore.onTasksChanged(() => console.log('Tasks updated'))

// Inspect storage
localStorage.getItem('tasks')
// or for IndexedDB
db.objectStore('tasks').getAll()
```

### Deployment

**For MVP**: No deployment needed
- Users download `index.html`
- Open in browser
- Works offline

**For future distribution**:
- Host on GitHub Pages (free, static)
- Or provide as downloadable file

### Future Enhancements (Out of Scope for MVP)

- Search/filter tasks
- Due dates on tasks
- Task categories/tags
- Export to CSV/JSON
- Dark mode toggle
- Mobile touch optimization
- Service Worker for offline-first PWA
- Sync across browser tabs
- Undo/redo functionality

---

## References

- [spec.md](spec.md) — User requirements & acceptance criteria
- [data-model.md](data-model.md) — Task entity schema & validation
- [contracts/task-store-api.md](contracts/task-store-api.md) — Storage API contract
- [plan.md](plan.md) — Technical architecture & decisions

---

**Status**: Ready for Phase 2 task breakdown (via `/speckit.tasks` command)
