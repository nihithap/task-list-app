---
description: "Task list for 1-task-app feature implementation"
---

# Tasks: Basic Task List App (1-task-app)

**Input**: Design documents from `/specs/1-task-app/`  
**Prerequisites**: plan.md ✅, spec.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Organization**: Tasks grouped by phase then by user story to enable independent implementation  
**Format**: `- [ ] [ID] [P?] [Story] Description with file path`

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize project structure and core utilities  
**Blocking**: All other phases depend on these tasks

### Infrastructure Tasks

- [ ] T001 Initialize project structure per plan.md in `/src` and `/tests` directories
- [ ] T002 Create `src/utils.js` with UUID generator and input validation helpers
- [ ] T003 Create `src/constants.js` with storage keys, time limits, and validation thresholds
- [ ] T004 Set up `tests/` directory structure for unit and integration tests
- [ ] T005 [P] Create `.gitignore` to exclude node_modules, build artifacts, logs

---

## Phase 2: Foundational (Core Storage Layer)

**Purpose**: Implement the foundation that all user stories depend on  
**Blocking**: All user story tasks depend on these

### TaskStore Implementation (Task Storage Service)

- [ ] T006 Implement `src/task-store.js` - TaskStore class initialization
  - Implement `constructor()` to initialize internal task cache
  - Implement `async init()` to load tasks from localStorage/IndexedDB on startup

- [ ] T007 [P] Implement CRUD methods in `src/task-store.js`
  - Implement `async createTask(title)` with validation and storage persist
  - Implement `async getTask(id)` for single task retrieval
  - Implement `async getAllTasks()` returning tasks sorted by createdAt
  - Implement `async updateTask(id, updates)` for title or completion updates
  - Implement `async deleteTask(id)` for permanent removal

- [ ] T008 [P] Implement utility methods in `src/task-store.js`
  - Implement `async toggleTaskCompletion(id)` convenience method
  - Implement `async deleteAllTasks()` for clearing all tasks
  - Implement `onTasksChanged(callback)` subscription mechanism

- [ ] T009 Implement storage abstraction in `src/task-store.js`
  - Implement localStorage persist strategy
  - Implement IndexedDB fallback strategy (when localStorage unavailable)
  - Implement error handling for quota exceeded, corrupted data, storage unavailable

- [ ] T010 [P] Write unit tests in `tests/unit/task-store.test.js`
  - Test `init()` loads existing tasks correctly
  - Test `createTask()` generates unique IDs and updates timestamps
  - Test `createTask()` validates input (empty, > 5000 chars)
  - Test `updateTask()` and `toggleTaskCompletion()` update correctly
  - Test `deleteTask()` removes task and persists change
  - Test storage errors handled gracefully
  - Test with 100+ tasks for performance
  - Target: <100ms for all operations

---

## Phase 3: User Story 1 - Create a New Task (P1)

**Goal**: Users can type a task description and add it to the list  
**Dependency**: Phase 2 (TaskStore) must be complete

### User Story 1 Test Task (Optional - include if testing requested)

- [ ] T011 [US1] Write integration test in `tests/integration/create-task.test.js`
  - Test: Create task via UI → appears in task list
  - Test: Create task → input field clears
  - Test: Reject empty input (no blank tasks created)
  - Test: Accept long titles (up to 5000 chars)

### User Story 1 Implementation

- [ ] T012 [P] [US1] Create `src/ui.js` with basic DOM structure and rendering
  - Create HTML structure (input field, add button, task list container)
  - Implement `renderTaskList(tasks)` function to display all tasks
  - Implement `createTaskElement(task)` to generate individual task DOM elements
  - Add basic CSS for layout and styling

- [ ] T013 [US1] Implement input validation and submission in `src/ui.js`
  - Implement `attachAddTaskListener()` to bind input field & Add button
  - Implement `handleTaskCreation(title)` to validate and create task
  - Implement input trimming and empty string rejection
  - Implement input field clearing after successful submission
  - Implement Enter key handling (same as Add button click)

- [ ] T014 [P] [US1] Create `src/app.js` main entry point
  - Implement `async init()` to initialize TaskStore and UI
  - Implement `document.DOMContentLoaded` listener
  - Connect TaskStore change events to UI updates
  - Handle initialization errors gracefully

- [ ] T015 [US1] Create `index.html` skeleton with basic structure
  - Add HTML boilerplate and body structure
  - Include input field with id="task-input"
  - Include button with id="add-task-button"
  - Include task list container with id="task-list"
  - Link to CSS file (to be created later)
  - Link to JavaScript files in correct order

---

## Phase 4: User Story 2 - Mark Task as Done (P1)

**Goal**: Users can toggle task completion status with visual feedback  
**Dependency**: Phase 2 (TaskStore) + Phase 3 (UI rendering)  
**Independent Test**: Can be fully tested by creating a task, clicking checkbox, verifying status change

### User Story 2 Test Task (Optional)

- [ ] T016 [US2] Write integration test in `tests/integration/complete-task.test.js`
  - Test: Toggle task complete → strikethrough applied
  - Test: Toggle incomplete → strikethrough removed
  - Test: Multiple tasks, toggle one → others unaffected
  - Test: Toggle persists across page refresh

### User Story 2 Implementation

- [ ] T017 [P] [US2] Implement completion checkbox in `src/ui.js`
  - Modify `createTaskElement(task)` to include checkbox element
  - Implement `attachCheckboxListener(taskId)` to handle checkbox clicks
  - Implement visual distinction for completed tasks (strikethrough or CSS class)
  - Apply `completed` class to completed task elements

- [ ] T018 [P] [US2] Style completed tasks in CSS
  - Add `.completed` CSS class with strikethrough text decoration (optional: gray color, opacity)
  - Ensure contrast and accessibility (readable for all users)
  - Test visual feedback is immediate (< 500ms from click to display)

- [ ] T019 [US2] Implement completion toggle handler in `src/ui.js`
  - Implement `handleTaskCompletion(taskId)` to call TaskStore.toggleTaskCompletion()
  - Update UI immediately on checkbox click (optimistic update)
  - Sync with storage backend
  - Handle errors (show notification if toggle fails)

---

## Phase 5: User Story 4 - Tasks Persist After Page Refresh (P1)

**Goal**: Tasks and their completion states survive page reload  
**Dependency**: Phase 2 (TaskStore persistence) + Phase 3 (UI rendering)  
**Independent Test**: Can be tested by creating tasks, reloading page, verifying all restored

### User Story 4 Test Task (Optional)

- [ ] T020 [US4] Write integration test in `tests/integration/persistence.test.js`
  - Test: Create tasks → reload page → all tasks present with same state
  - Test: Toggle completion → reload → state persists
  - Test: Create 100 tasks → reload → all 100 present
  - Test: Empty task list → reload → empty list

### User Story 4 Implementation

- [ ] T021 [US4] Implement auto-load on app initialization in `src/app.js`
  - Call `taskStore.init()` during DOMContentLoaded
  - Load all tasks from storage via `taskStore.getAllTasks()`
  - Render loaded tasks via `renderTaskList(tasks)`
  - Handle case where storage is empty (start with empty list)

- [ ] T022 [US4] Implement change listener subscription in `src/app.js`
  - Subscribe to TaskStore changes via `taskStore.onTasksChanged()`
  - Re-render task list on any task change (create, update, delete)
  - Ensure all changes persist to storage automatically

- [ ] T023 [P] [US4] Test persistence mechanisms
  - Verify localStorage is populated after task creation
  - Verify localStorage JSON format matches data-model.md
  - Test localStorage contents directly via browser console
  - Test IndexedDB fallback when localStorage unavailable
  - Performance: All load operations < 500ms even with 100+ tasks

---

## Phase 6: User Story 3 - Delete a Task (P2)

**Goal**: Users can remove tasks they no longer need  
**Dependency**: Phase 2 (TaskStore) + Phase 3 (UI) + Phase 4 (completion)  
**Independent Test**: Can be tested by creating task, clicking delete, verifying removal

### User Story 3 Test Task (Optional)

- [ ] T024 [US3] Write integration test in `tests/integration/delete-task.test.js`
  - Test: Delete pending task → removed from list
  - Test: Delete completed task → removed from list
  - Test: Delete one task from many → others unaffected
  - Test: Deletion persists across page refresh

### User Story 3 Implementation

- [ ] T025 [P] [US3] Implement delete button in `src/ui.js`
  - Modify `createTaskElement(task)` to include delete button (🗑 icon or text)
  - Implement `attachDeleteListener(taskId)` to handle delete button clicks
  - Add visual indicator for delete action (hover effect, disabled state during deletion)

- [ ] T026 [US3] Implement deletion handler in `src/ui.js`
  - Implement `handleTaskDelete(taskId)` to call TaskStore.deleteTask()
  - Remove task element from DOM immediately (optimistic update)
  - Sync with storage backend
  - Optional: Add confirmation dialog to prevent accidental deletion

- [ ] T027 [P] [US3] Style delete button in CSS
  - Add delete button styling (red color, hover effect, icon styling)
  - Ensure button is accessible and easy to click/tap
  - Test on mobile devices (if applicable)

---

## Phase 7: Testing & Validation

**Purpose**: Comprehensive testing of all user stories and edge cases

### Performance & Load Testing

- [ ] T028 [P] Performance validation across all operations
  - Test task creation: < 1 second (SC-001)
  - Test completion toggle: < 500ms (SC-002)
  - Test load with 100+ tasks: < 500ms (SC-003)
  - Test bundle size: < 100KB minified (SC-006)
  - Use browser DevTools Performance tab to measure
  - Profile with Chrome Lighthouse if needed

### Browser Compatibility Testing

- [ ] T029 [P] Cross-browser testing in major browsers
  - Test in Chrome (latest)
  - Test in Firefox (latest)
  - Test in Safari (latest)
  - Test in Edge (latest)
  - Verify all functionality works identically
  - No console errors or warnings

### Edge Case Testing

- [ ] T030 [P] Test edge cases from spec.md
  - Test very long task titles (5000+ characters) → should accept or truncate gracefully
  - Test rapid task additions (user mashing Add button) → no duplicates, no errors
  - Test storage quota exceeded → graceful warning or cleanup
  - Test in private browsing mode → fallback to in-memory storage works
  - Test with 500+ tasks → no performance degradation

### Offline Functionality Testing

- [ ] T031 [US4] Verify complete offline capability
  - Disable internet connection in browser DevTools
  - Test all CRUD operations work offline
  - Test page reload while offline → tasks persist
  - Enable internet and verify no API calls made
  - Confirm no console errors about network failures

### Manual Acceptance Testing

- [ ] T032 User Story 1 acceptance test (Create Task)
  - [ ] Open app → verify input field visible
  - [ ] Type "Buy groceries" → click Add → task appears in list
  - [ ] Type "Call mom" → press Enter → task appears
  - [ ] Type empty string → submit → no task created
  - [ ] Type task → verify input field clears after submission

- [ ] T033 User Story 2 acceptance test (Complete Task)
  - [ ] Create multiple tasks
  - [ ] Click checkbox on "Buy groceries" → strikethrough appears
  - [ ] Click again → strikethrough removed
  - [ ] Verify other tasks unaffected
  - [ ] Reload page → completed state persists

- [ ] T034 User Story 4 acceptance test (Persistence)
  - [ ] Create 5 tasks with mixed completion states
  - [ ] Reload page → all tasks present with same state
  - [ ] Close browser → reopen → tasks still present
  - [ ] Open in new tab → tasks visible (same origin)
  - [ ] Clear browser storage → reload → empty list

- [ ] T035 User Story 3 acceptance test (Delete Task)
  - [ ] Create multiple tasks
  - [ ] Click delete button on one task → task disappears
  - [ ] Verify other tasks remain
  - [ ] Reload page → deleted task stays deleted
  - [ ] Delete all tasks → list is empty

---

## Phase 8: Bundling & Final Delivery

**Purpose**: Create production-ready single HTML file

### Production Build

- [ ] T036 Minify and bundle source files
  - Concatenate `src/utils.js`, `src/constants.js`, `src/task-store.js`, `src/ui.js`, `src/app.js` in order
  - Minify combined JavaScript (remove comments, whitespace)
  - Minify CSS (inline in HTML)
  - Combine into single `index.html` file

- [ ] T037 Verify production bundle
  - Check total file size: must be < 100KB minified (SC-006)
  - Test functionality with bundle (all user stories work)
  - Verify no source maps or development code in bundle
  - Confirm browser DevTools shows minified code (expected)

- [ ] T038 Create production deployment package
  - Generate final `index.html` (standalone, no dependencies)
  - Test by opening file directly in browser (file:// protocol)
  - Create README for distribution
  - Add license file (MIT or similar per constitution)

### Documentation

- [ ] T039 Create distribution documentation
  - Create DOWNLOAD.md with installation instructions
  - Add USAGE.md with user guide (getting started)
  - Add LICENSE.md (MIT or open-source license)
  - Document browser requirements (Chrome 51+, Firefox 54+, Safari 10+, Edge 15+)

---

## Summary & Dependencies

### Task Count
- **Total Tasks**: 39
- **Setup/Infrastructure**: 5 tasks
- **Core Storage (Foundational)**: 5 tasks
- **User Story 1 (Create)**: 4 tasks + 1 test
- **User Story 2 (Complete)**: 3 tasks + 1 test
- **User Story 4 (Persist)**: 3 tasks + 1 test
- **User Story 3 (Delete)**: 3 tasks + 1 test
- **Testing & Validation**: 8 tasks
- **Production**: 3 tasks
- **Documentation**: 1 task

### Parallelization Opportunities

**Phase 1 (Setup)**: All 5 tasks can run in parallel (independent file creation)

**Phase 2 (Foundational)**: 
- T006 must complete before T007, T008, T009
- T007, T008, T009 can run in parallel (different methods)
- T010 can run in parallel with implementation (test-driven)

**Phase 3 (US1)**: 
- T012, T014, T015 can run in parallel (different components)
- T013 depends on T012 (needs input elements)
- T011 (test) can run in parallel with implementation

**Phase 4 (US2)**: 
- T017, T018 can run in parallel (UI code vs CSS)
- T019 depends on T017
- T016 (test) can run in parallel

**Phase 5 (US4)**: All tasks sequential (app initialization flow)

**Phase 6 (US3)**: 
- T025, T027 can run in parallel (button code vs CSS)
- T026 depends on T025
- T024 (test) can run in parallel

**Phase 7 (Testing)**: 
- T028, T029, T030, T031 can run in parallel (different test scenarios)
- T032-T035 (manual acceptance) are sequential steps in one test cycle

**Phase 8 (Bundling)**: Strictly sequential

### Suggested Execution Order (Parallel-Optimized)

1. **Phase 1**: Run all 5 tasks in parallel
2. **Phase 2**: 
   - T006 (init TaskStore)
   - T006 → T007, T008, T009 in parallel (write methods)
   - T010 in parallel with implementation (test-driven)
3. **Phase 3**:
   - T012, T014, T015 in parallel
   - T012 → T013 (add input listeners)
   - T011 (test) can run alongside
4. **Phase 4**:
   - T017, T018 in parallel
   - T017 → T019 (completion handler)
   - T016 (test) can run alongside
5. **Phase 5**: T021 → T022 → T023 (sequential app initialization)
6. **Phase 6**:
   - T025, T027 in parallel
   - T025 → T026 (delete handler)
   - T024 (test) can run alongside
7. **Phase 7**:
   - T028, T029, T030, T031 in parallel (different test suites)
   - T032-T035 (manual acceptance - one test cycle)
8. **Phase 8**: T036 → T037 → T038 → T039 (sequential, production only)

### Minimum Viable Product (MVP) Scope

**MVP includes**:
- Phase 1: Setup ✅
- Phase 2: TaskStore ✅
- Phase 3: Create Task ✅
- Phase 4: Complete Task ✅
- Phase 5: Persist Data ✅
- Partial Phase 7: Manual acceptance testing (T032-T035)

**MVP excludes** (Phase 2):
- Unit testing with Mocha/Chai (optional, browser testing sufficient)
- Phase 6: Delete Task (P2, not critical for MVP)
- Phase 8: Bundling (optional; can ship as multiple files initially)

**Expected MVP Completion**: Tasks T001-T035 (35 tasks)

### Independent Test Criteria by User Story

| Story | Independent Test Criteria | Test Task |
|-------|---------------------------|-----------|
| US1 | Create task + see in list | T011 + T032 |
| US2 | Toggle completion + visual feedback | T016 + T033 |
| US4 | Reload → all tasks + states restored | T020 + T034 |
| US3 | Delete task → removed from list | T024 + T035 |

---

**Status**: Ready for implementation  
**Approved**: 2026-01-02
