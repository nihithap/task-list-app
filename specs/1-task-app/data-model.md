# Data Model: Basic Task List App

**Phase**: 1 (Design)  
**Date**: 2026-01-02  
**Feature**: [spec.md](spec.md)

## Entity Definitions

### Task

The core entity representing a single todo item.

**Fields**:

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | string (UUID) | Yes | Unique identifier for the task | Generated on creation; immutable |
| `title` | string | Yes | Task description text | 1-5000 characters; trimmed; not empty |
| `completed` | boolean | Yes | Completion status | Default: false |
| `createdAt` | number (timestamp) | Yes | Unix timestamp when task was created | Auto-generated; immutable |
| `updatedAt` | number (timestamp) | Yes | Unix timestamp of last modification | Auto-updated on any change |

**Example**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries",
  "completed": false,
  "createdAt": 1704211200000,
  "updatedAt": 1704211200000
}
```

**Validation Rules**:

1. **title**: 
   - MUST not be empty (after trimming whitespace)
   - MUST not exceed 5000 characters
   - MUST be trimmed (leading/trailing whitespace removed)
   - Required on creation

2. **completed**: 
   - MUST be boolean (true or false)
   - Default: false
   - Can be toggled at any time

3. **id**: 
   - MUST be unique across all tasks
   - MUST be generated on creation (use v4 UUID or simple incrementing counter)
   - MUST NOT be modified after creation

4. **createdAt** & **updatedAt**: 
   - MUST be valid Unix timestamps (milliseconds)
   - createdAt is immutable (set once on creation)
   - updatedAt changes on any modification (title change, completion toggle, etc.)

## Collection: Tasks List

**Storage Model**: Array of Task objects stored in browser storage.

**Ordering**: Tasks MUST be ordered by `createdAt` (ascending) — newest tasks appear at bottom of list.

**Size Limits**:
- Typical scenario: < 500 tasks (< 100KB in storage)
- Edge case handling: System should warn user if approaching storage quota (> 90%)
- Maximum practical: ~5000 tasks (approaching 5MB localStorage limit)

**Example Collection**:
```json
[
  {
    "id": "task-001",
    "title": "Buy groceries",
    "completed": false,
    "createdAt": 1704211200000,
    "updatedAt": 1704211200000
  },
  {
    "id": "task-002", 
    "title": "Call mom",
    "completed": true,
    "createdAt": 1704211260000,
    "updatedAt": 1704211320000
  }
]
```

## State Transitions

### Task Lifecycle

```
Created
  ↓
Pending (completed: false)
  ↕ (toggle completion)
Completed (completed: true)
  ↓
Deleted (removed from storage)
```

**Allowed Operations**:

1. **Create**: New task added to list with default state (completed: false)
2. **Read**: Retrieve single task or all tasks
3. **Update**: Modify title or completion status
4. **Delete**: Permanently remove task from list
5. **Restore from Storage**: Load tasks from localStorage/IndexedDB on page load

**No Operations**: 
- No archiving (deleted = gone)
- No soft deletes (no "deleted" timestamp)
- No task reordering by user (always sorted by createdAt)

## Storage Schema

### localStorage Key

**Key**: `tasks` (single entry containing JSON array)

**Value**:
```json
[
  {"id": "...", "title": "...", "completed": false, "createdAt": ..., "updatedAt": ...},
  ...
]
```

**Size**: Approximately 150-200 bytes per task (depending on title length)

### Backup/Export Format

For future manual export feature, tasks should be exportable as JSON:

```json
{
  "version": "1.0.0",
  "exportedAt": 1704211200000,
  "tasks": [...]
}
```

## Relationships

No relationships between tasks (flat structure). Each task is independent.

## Integrity Constraints

1. **Uniqueness**: `id` field MUST be unique
2. **Non-null**: `id`, `title`, `completed`, `createdAt`, `updatedAt` MUST always have values
3. **Immutability**: `id` and `createdAt` MUST NOT change after creation
4. **Type Safety**: Each field MUST match its declared type
5. **Ordering**: Tasks MUST remain sorted by `createdAt` ascending

## Migration / Versioning

Not required for MVP. If schema changes in future:
1. Add `version` field to storage (e.g., `tasks_v2`)
2. Implement migration function to transform old format to new format
3. Load appropriate version based on what's in storage

Current MVP: Single schema, no migration needed.

---

## Approval

Data model is complete and ready for contract/API design.
