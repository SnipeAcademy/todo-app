# Task 6 Result

## Status: COMPLETE

All 16 Playwright acceptance tests pass.

## What was implemented

### New file
- **`src/components/CompletedTodoCard.tsx`** — Displays a completed todo with a line-through title, category badge, completed date, and inline Restore / Delete actions. Delete uses the same inline confirmation pattern as `TodoCard` (local `showConfirm` state, no `browser.confirm()`).

### Modified files
- **`src/components/index.ts`** — Added export for `CompletedTodoCard`.
- **`src/pages/CompletedPage.tsx`** — Full implementation: category filter pills (All / Office / Personal / Family) using local state, list sorted by `completedAt` descending, empty state, and calls to `toggleComplete` (restore) and `deleteTodo` (permanent delete).
- **`src/pages/DashboardPage.tsx`** — Filters `todos` to `!t.completed` before sorting, so completed cards disappear immediately on toggle.
- **`src/pages/CalendarPage.tsx`** — Derives `activeTodos = todos.filter(!t.completed)` and passes it to both `CalendarGrid` (dots) and `getTodosForDate` (panel), so completed todos produce no calendar dots and do not appear in the DayPanel.
- **`src/components/Layout.tsx`** — Added optional count badge on the "Completed" nav link; hidden when count is zero.

## CalendarGrid and DayPanel
Neither component was modified. The filtering is applied at the caller (`CalendarPage`) which is the correct separation per the task spec.

## Test results
```
16/16 passed (13.6s)
```

| Test | Result |
|---|---|
| marking complete removes card from dashboard | ✓ |
| completed todo appears on /completed | ✓ |
| completed card title has line-through class | ✓ |
| completed-date label is visible | ✓ |
| restoring a todo removes it from /completed | ✓ |
| restored todo reappears on dashboard as active | ✓ |
| delete button shows inline confirmation | ✓ |
| delete cancel keeps the todo | ✓ |
| confirming delete permanently removes the todo | ✓ |
| filter pills are visible on /completed | ✓ |
| office filter shows only office completed todos | ✓ |
| All filter shows all completed todos | ✓ |
| empty state visible when filtered category has no todos | ✓ |
| completed todos sorted most-recently-completed first | ✓ |
| completed todo shows no dot on calendar | ✓ |
| full flow: add 3 todos, complete 2, verify counts | ✓ |
