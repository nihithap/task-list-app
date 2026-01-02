# Copilot Agent Context: Todo-List 1-task-app

**Last Updated**: 2026-01-02  
**Feature**: Basic Task List App (1-task-app)  
**Agent**: GitHub Copilot

## Project Summary

Build a minimal, offline-first task list web application. Users can create tasks, mark them complete, and delete them. All data stored locally in browser (no backend, no login).

## Technology Stack

- **Language**: HTML5 + JavaScript (ES6+)
- **Storage**: localStorage with IndexedDB fallback
- **Framework**: None (vanilla JS only)
- **Testing**: Browser DevTools + optional Mocha/Chai
- **Bundle**: Single HTML file < 100KB minified
- **Browsers**: Chrome 51+, Firefox 54+, Safari 10+, Edge 15+

## Core Constraints

✅ **Local-First**: All data in browser storage, zero backend
✅ **Zero-Setup**: No login, no build, no config — works instantly
✅ **Performance**: < 100ms for all operations
✅ **Minimal Scope**: Create, complete, delete, persist — nothing else
✅ **Privacy**: No analytics, no external calls, open-source

## Key Entities

**Task**: `{ id, title, completed, createdAt, updatedAt }`

- id: UUID string (immutable)
- title: string 1-5000 chars (trimmed, required)
- completed: boolean (default false)
- createdAt: timestamp (immutable)
- updatedAt: timestamp (auto-updated)

Storage: Array of Tasks in localStorage['tasks'] (JSON)

## TaskStore API (Main Contract)

```javascript
class TaskStore {
  async init()                                    // Load from storage
  async createTask(title: string)                // Create task
  async getTask(id: string)                      // Get single task
  async getAllTasks()                            // Get all tasks (sorted by createdAt)
  async updateTask(id: string, updates)          // Update title or completed
  async toggleTaskCompletion(id: string)         // Toggle completed flag
  async deleteTask(id: string)                   // Delete task
  async deleteAllTasks()                         // Clear all tasks
  onTasksChanged(callback)                       // Subscribe to changes
}
```

See `/specs/1-task-app/contracts/task-store-api.md` for full specification.

## File Structure

```
specs/1-task-app/               # Design documents
├── spec.md                     # User stories & requirements
├── plan.md                     # Architecture & technical design
├── research.md                 # Technology decisions
├── data-model.md               # Task entity schema
├── contracts/task-store-api.md # API contract
└── quickstart.md               # Dev guide & getting started

src/ (to be created)
├── app.js                      # Main entry, initialization
├── ui.js                       # DOM rendering, event handlers
├── task-store.js               # Storage implementation (TaskStore)
└── utils.js                    # Helpers (UUID, validation, etc.)

index.html                      # Production: single-file bundle

tests/
├── unit/task-store.test.js
└── integration/ui.test.js
```

## Development Phases

**Phase 2 (In Progress)**: Task breakdown via `/speckit.tasks` command
- Will generate detailed tasks by user story
- Create, complete, delete, persist tasks
- UI implementation
- Testing & validation

## Implementation Guidelines

1. **No External Dependencies**: Vanilla JS only (no npm packages in production)
2. **No Framework Overhead**: React/Vue/Angular prohibited (bundle size)
3. **Single HTML File Output**: Concatenate src files into index.html
4. **Offline-First**: Must work 100% without internet after initial load
5. **Error Handling**: Storage errors, quota exceeded, corrupted data
6. **Performance**: Every operation < 100ms (profile with DevTools)
7. **Testing**: Manual testing + optional unit tests (Mocha/Chai optional)

## User Stories (MVP)

**P1 - Create Task**: Type description + Enter/Click Add → task appears in list  
**P1 - Complete Task**: Checkbox toggle → visual feedback + persists  
**P1 - Persist Data**: Close/reload → all tasks and states restored  
**P2 - Delete Task**: Delete button → task removed from list

## Success Criteria

- Create task: < 1 second
- Toggle completion: < 500ms
- Load with 100+ tasks: < 500ms
- Works offline: ✓ (no API calls)
- Bundle size: < 100KB minified
- Works in all modern browsers: ✓

## References

- `/specs/1-task-app/` — All design documents
- `/specs/1-task-app/plan.md` — Full technical plan
- `/specs/1-task-app/quickstart.md` — Dev getting started guide
- Constitution: `/`.specify/memory/constitution.md`

## Important Notes

- No user accounts, authentication, or permissions
- No sync across devices/tabs
- No undo/redo, search, or filtering (MVP)
- Data deletion is permanent (no soft deletes)
- Tasks always ordered by createdAt (user cannot reorder)
- Open-source license required (MIT or similar)

---

**Context Version**: 1.0.0  
**Valid For**: Implementation phase and beyond  
**Update After**: Any technology stack changes or architectural decisions
