# Task 6 Assumptions

## Data layer
1. `completed` and `completedAt` fields already exist on the `Todo` type and are managed by `toggleComplete` in `TodoContext`. No data layer changes are needed.
2. `toggleComplete` sets `completedAt` to the current ISO timestamp when completing, and clears it to `undefined` when restoring. This is the restore mechanism — calling `toggleComplete` on a completed todo returns it to active state.
3. `deleteTodo` in the context permanently removes the todo from state and localStorage. The same function is reused for permanent delete on the Completed page.

## DashboardPage filtering
4. The `sortedTodos` variable in `DashboardPage` currently includes completed todos. The fix is to filter `todos` (from context) to `completed === false` before passing to `sortTodosByPriority`, so completed cards disappear immediately on toggle without any other changes.

## CalendarPage filtering
5. `CalendarPage` passes the full `todos` array to `CalendarGrid` (for dots) and uses `getTodosForDate(todos, selectedDate)` for `DayPanel`. Both must receive only active todos. The filter is applied in `CalendarPage` before passing to child components — `CalendarGrid` and `DayPanel` themselves are not modified.
6. `DayPanel` already accepts todos as a prop and does not fetch from context — filtering at the `CalendarPage` caller is sufficient.
7. `CalendarGrid` also accepts todos as a prop — filtering at the `CalendarPage` caller is sufficient.

## CompletedTodoCard component
8. `CompletedTodoCard` is a new standalone component (not a wrapper around `TodoCard`) because its action surface (Restore + Delete) and display (line-through title, completed date) differ meaningfully from `TodoCard`.
9. Category badge colours match `TodoCard`: office=`bg-blue-100 text-blue-800`, personal=`bg-green-100 text-green-800`, family=`bg-purple-100 text-purple-800`.
10. The delete confirmation is inline (local `showConfirm` state), matching the pattern in `TodoCard`. No browser `confirm()` is used.
11. The completed date is displayed using `date-fns` `format` with `'MMM d, yyyy'` pattern. If `completedAt` is absent (edge case from legacy data), the component falls back to "Unknown date".
12. `data-testid="completed-todo-delete-cancel"` is included in the delete confirmation (required by the spec table even though not in acceptance criteria).

## CompletedPage
13. Filter state (`'all' | 'office' | 'personal' | 'family'`) is local `useState` in `CompletedPage` — not persisted to localStorage.
14. Todos are sorted by `completedAt` descending. Since `completedAt` is an ISO datetime string, lexicographic sort (`.localeCompare`) is equivalent to date sort and avoids an extra `date-fns` import in this file. `compareDesc` from `date-fns` is also acceptable but not required.
15. The empty state (`data-testid="completed-empty-state"`) is shown both when there are no completed todos at all and when the active filter produces zero results.
16. `onRestore` calls `toggleComplete(id)` which clears `completedAt` and flips `completed` to `false` — the card disappears from the Completed page automatically because the derived list filters on `completed === true`.
17. `onDelete` calls `deleteTodo(id)` which permanently removes the entry.

## Layout (optional badge)
18. The optional count badge on the "Completed" nav link is implemented. It shows the count of `completed === true` todos. When the count is zero the badge is hidden (no badge rendered). This uses `useTodos` from context inside `Layout`.

## General
19. No new npm packages are installed. All utilities (`format`, `compareDesc` from `date-fns`) are already in `package.json`.
20. All interactive and display elements that require `data-testid` attributes per the spec table are included.
21. TypeScript strict mode is respected — no `any` types.
