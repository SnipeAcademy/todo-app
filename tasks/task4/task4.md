# Task 4: Priority System & Day-based Sorting

## Objective
Implement a priority engine that surfaces the right category of work depending on whether it is a weekday or weekend. Display a priority badge on every todo card and sort the Dashboard list by effective priority, with due date as the tiebreaker.

## Scope
- `getPriority(category, referenceDate?)` utility function
- `sortTodosByPriority(todos, referenceDate?)` utility function
- `<PriorityBadge>` component
- Update `<TodoCard>` to compute and display the priority badge
- Update `<DashboardPage>` to sort todos before rendering and show a mode banner

## Out of scope
- Calendar-specific priority display (task 5 uses `sortTodosByPriority` with its own `referenceDate`)
- No new data fields — priority is derived at render time, not stored
- Do not modify the data layer (context, reducer, types, localStorage)

## Acceptance criteria
- [ ] On a weekday (Mon–Fri), office todos have `data-testid="priority-badge"` text "High"
- [ ] On a weekday (Mon–Fri), personal todos have priority badge "Medium"
- [ ] On a weekday (Mon–Fri), family todos have priority badge "Low"
- [ ] On a weekend (Sat–Sun), family todos have priority badge "High"
- [ ] On a weekend (Sat–Sun), personal todos have priority badge "Medium"
- [ ] On a weekend (Sat–Sun), office todos have priority badge "Low"
- [ ] High badge element has a class containing `red`
- [ ] Medium badge element has a class containing `yellow`
- [ ] Low badge element has a class containing `gray`
- [ ] Dashboard list is sorted: High priority cards appear before Medium, Medium before Low
- [ ] Todos with equal priority are sorted by `dueDate` ascending (earlier due date first)
- [ ] `data-testid="priority-mode-banner"` is visible on the Dashboard
- [ ] Banner text contains "Weekday" on Mon–Fri
- [ ] Banner text contains "Weekend" on Sat–Sun

## Dependencies
- task3 must be complete (TodoCard exists and is rendering)

## File and folder targets
- Create: `src/utils/priority.ts`
- Modify: `src/utils/index.ts`
- Create: `src/components/PriorityBadge.tsx`
- Modify: `src/components/TodoCard.tsx` (add PriorityBadge, add data-testid to badge)
- Modify: `src/components/index.ts`
- Modify: `src/pages/DashboardPage.tsx` (sort todos, add mode banner)
- Do not touch: `src/context/`, `src/services/`, `src/types/`
- Do not touch: `src/components/Modal.tsx`, `src/components/TodoForm.tsx`, `src/components/TodoList.tsx`

## Design constraints
- Use `isWeekend(date)` from `date-fns` — do not reimplement day-of-week logic
- `getPriority` and `sortTodosByPriority` must accept an optional `referenceDate: Date` parameter — defaults to `new Date()` when omitted. This allows CalendarPage (task 5) to pass a specific date.
- Priority badge colours: `high` → `bg-red-100 text-red-700`, `medium` → `bg-yellow-100 text-yellow-700`, `low` → `bg-gray-100 text-gray-600`
- The `data-testid="priority-badge"` attribute must be on the outermost element of `<PriorityBadge>`
- The `data-testid="priority-mode-banner"` attribute must be on the banner element in DashboardPage

### Priority rules (encode exactly)
**Weekday (Mon–Fri)**
| Category | Priority |
|---|---|
| office | high |
| personal | medium |
| family | low |

**Weekend (Sat–Sun)**
| Category | Priority |
|---|---|
| family | high |
| personal | medium |
| office | low |

### Sort order
1. Priority weight: high=0, medium=1, low=2 (ascending)
2. Tiebreaker: `dueDate` string comparison ascending (ISO format sorts correctly)

## Context
Priority is the founder's core workflow aid. The system is intentionally simple — two modes, no user configuration. A founder should open the app on Monday and immediately see office work at the top; on Saturday, family commitments lead. The priority is always computed from today's date unless a specific date is passed (for the calendar view).

### Test date mocking
The verify tests will mock `Date` in the browser using `page.addInitScript` to fix the date to a known weekday and weekend. The priority utility must call `new Date()` (not `Date.now()`) so the mock intercepts it correctly. Alternatively, the utility accepts `referenceDate` — tests will always pass `referenceDate` explicitly.
