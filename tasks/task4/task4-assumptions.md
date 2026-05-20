# Task 4 Assumptions

## Existing codebase

1. `date-fns` (^4.1.0) is already in `package.json` — `isWeekend` is available without installing anything.
2. `Priority` type (`'high' | 'medium' | 'low'`) and `Category` type (`'office' | 'personal' | 'family'`) are already defined in `src/types/index.ts` — no new types needed.
3. `TodoList` accepts a `todos: Todo[]` prop and renders one `TodoCard` per item. Sorting the array before passing it to `TodoList` is sufficient to control render order.
4. `DashboardPage` currently passes the raw `todos` array from context to `TodoList`. Sorting will be applied in `DashboardPage` before rendering — no changes to `TodoList` or context needed.

## Design decisions

5. `PriorityBadge` accepts `category: Category` and an optional `referenceDate?: Date`. It calls `getPriority` internally — the caller does not need to know the priority level.
6. `TodoCard` passes its `todo.category` and no explicit `referenceDate` to `PriorityBadge`, so the badge always reflects the current date. (CalendarPage, task 5, will pass `referenceDate` explicitly when it uses `PriorityBadge` or `sortTodosByPriority` directly.)
7. `DashboardPage` calls `new Date()` once at render time to compute both the mode banner label and the sort order, so both stay in sync.
8. The mode banner is a single `<div>` / `<p>` element with `data-testid="priority-mode-banner"`. Text is "Weekday Mode" on Mon–Fri and "Weekend Mode" on Sat–Sun.
9. The sort is applied to the full `todos` array from context (includes incomplete todos). Completed todos shown on the Dashboard are also sorted. The `DashboardPage` currently does not filter completed todos, so we preserve that behaviour.
10. `src/utils/priority.ts` uses `new Date()` as the default for `referenceDate` so the browser `Date` mock in tests intercepts the call correctly (the spec notes this pattern explicitly).
11. `sortTodosByPriority` returns a **new** array (via spread) to avoid mutating the original context state.
12. Tiebreaker uses `String.localeCompare` on the `dueDate` field (ISO `YYYY-MM-DD` strings sort lexicographically, which equals chronological order).
