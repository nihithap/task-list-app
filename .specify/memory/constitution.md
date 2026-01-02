<!--
SYNC IMPACT REPORT
===================
Ratification Date: 2026-01-02
Version Update: 0.0.0 → 1.0.0 (MAJOR initial ratification)

Changes Made:
- [NEW] 5 Core Principles established: Local-First Storage, Zero-Setup, Performance, Minimal Scope, Privacy
- [NEW] Data Constraints section added (offline, storage, no sync)
- [NEW] Development Workflow section added (offline/dependency checks)
- [REMOVED] Generic library/CLI principles from template (replaced with app-specific guidance)

Modified Templates Status:
✅ plan-template.md - No changes needed (generic structure compatible)
✅ spec-template.md - No changes needed (user story format applies)
✅ tasks-template.md - No changes needed (task organization applies)
⚠️ No command templates found - if they exist, verify no outdated references

Notes:
- Constitution now explicitly forbids backend/API calls, auth, and external data transmission
- Bundle size constraint (<100KB) and performance target (<100ms) are non-negotiable
- Offline-first requirement is core to all development decisions
-->

# Todo-List Constitution

## Core Principles

### I. Local-First Storage
Every feature MUST store data locally in the browser via IndexedDB or localStorage. MUST NOT require backend connectivity, server synchronization, or authentication. Data persists across browser sessions and is never transmitted to external services.

### II. Zero-Setup Operation
Users MUST be able to open the application and immediately start creating tasks without registration, login, or configuration. The application ships ready to use in a single HTML file or minimal asset bundle.

### III. Performance as a Feature
Page load, task creation, task updates, and search MUST complete in < 100ms. UI MUST remain responsive during heavy operations. No unnecessary frameworks or bloat; vanilla JavaScript or lightweight libraries only (< 50KB minified).

### IV. Minimal & Focused Scope
The application MUST support: create task, read tasks, update task status/title, delete task, filter/search, and persistent storage. No social features, no notifications, no AI integrations, no plugins. Feature requests that violate simplicity are rejected.

### V. Privacy by Default
User data MUST never leave the browser. No analytics, no telemetry, no cookies for tracking. Source code MUST be auditable for any external requests or permissions. Open-source license (MIT or similar) required.

## Data Constraints

**Offline Requirement**: Application MUST function completely offline after initial load. No CDN dependencies, no API calls.

**Storage Limit**: Tasks stored locally without arbitrary server limits. Browser storage quota (typically 5-50MB per origin) is sufficient for typical use.

**No Synchronization**: No automatic sync across devices, tabs, or browsers. Users manage backup/export via manual download if desired.

## Development Workflow

- Changes MUST not break offline functionality or add external dependencies.
- Testing MUST include localStorage behavior and offline scenarios.
- All new features MUST be justified against the Minimal & Focused Scope principle.
- Code review checklist: No external requests? No unnecessary dependencies? Remains < 100KB bundle?

## Governance

This Constitution supersedes all other development decisions. All pull requests and feature discussions MUST verify compliance with the five core principles above. Amendments require a clear rationale explaining how the change aligns with or enhances the project's minimalist, privacy-first mission.

**Version**: 1.0.0 | **Ratified**: 2026-01-02 | **Last Amended**: 2026-01-02
