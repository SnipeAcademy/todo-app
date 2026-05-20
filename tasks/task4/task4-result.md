# Task 4 Result: Priority System & Day-based Sorting

## Status: implemented

## Files created / modified

| File | Action |
|---|---|
| `src/utils/priority.ts` | Created — `getPriority` and `sortTodosByPriority` |
| `src/utils/index.ts` | Modified — re-exports both priority utilities |
| `src/components/PriorityBadge.tsx` | Created — renders coloured priority badge |
| `src/components/TodoCard.tsx` | Modified — imports and renders `<PriorityBadge>` |
| `src/components/index.ts` | Modified — exports `PriorityBadge` |
| `src/pages/DashboardPage.tsx` | Modified — sorts todos, adds mode banner |

## What was built

### `src/utils/priority.ts`
- `getPriority(category, referenceDate?)` — uses `isWeekend` from `date-fns` to pick the correct priority table; defaults `referenceDate` to `new Date()` so the browser Date mock intercepts correctly.
- `sortTodosByPriority(todos, referenceDate?)` — sorts by priority weight (high=0, medium=1, low=2) then by `dueDate` ascending as a tiebreaker. Returns a new array without mutating the input.

### `src/components/PriorityBadge.tsx`
- Renders a `<span data-testid="priority-badge">` with:
  - `bg-red-100 text-red-700` for high
  - `bg-yellow-100 text-yellow-700` for medium
  - `bg-gray-100 text-gray-600` for low
- Accepts optional `referenceDate` for CalendarPage (task 5).

### `src/components/TodoCard.tsx`
- Added `<PriorityBadge category={todo.category} />` inline with the category badge — no `referenceDate` passed so it uses `new Date()`.

### `src/pages/DashboardPage.tsx`
- Calls `sortTodosByPriority(todos, today)` before passing to `<TodoList>`.
- Renders `<div data-testid="priority-mode-banner">` showing "Weekday Mode" or "Weekend Mode" based on `isWeekend(today)`.

## Acceptance criteria coverage

- [x] Office → High badge on weekday
- [x] Personal → Medium badge on weekday
- [x] Family → Low badge on weekday
- [x] Family → High badge on weekend
- [x] Personal → Medium badge on weekend
- [x] Office → Low badge on weekend
- [x] High badge has class containing `red`
- [x] Medium badge has class containing `yellow`
- [x] Low badge has class containing `gray`
- [x] Dashboard sorted High → Medium → Low
- [x] Same-priority todos sorted by `dueDate` ascending
- [x] `data-testid="priority-mode-banner"` present on Dashboard
- [x] Banner text "Weekday" on Mon–Fri
- [x] Banner text "Weekend" on Sat–Sun
