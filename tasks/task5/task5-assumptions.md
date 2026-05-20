# Task 5 Assumptions

## `getCalendarWeeks(year, month)`
1. `month` is 0-indexed (JavaScript `Date` convention: 0=January … 11=December).
2. The grid starts on Monday (`weekStartsOn: 1` in date-fns `startOfWeek`/`endOfWeek`), filling partial first/last weeks from adjacent months.
3. Returns exactly N full weeks (each `Date[]` has 7 items). The number of weeks varies (4–6) depending on the month layout.

## `getTodosForDate(todos, date)`
4. Filters out completed todos (`!t.completed`). The spec says "active only" for the calendar.
5. Matches `workOnDate` (a `YYYY-MM-DD` string) against `format(date, 'yyyy-MM-dd')` — string comparison avoids timezone pitfalls.

## CalendarGrid
6. Cells outside the current month are dimmed with `opacity-40`.
7. Today's cell has both a visual highlight (blue circle around the day number) AND `data-testid="calendar-day-today"`. Non-today cells omit that `data-testid`.
8. At most 3 `data-testid="calendar-day-dot"` elements are shown per cell, taken from the first 3 active todos for that date (no additional ordering applied at the dot level).
9. Dot colours: `office=bg-blue-500`, `personal=bg-green-500`, `family=bg-purple-500` — matching the existing badge colours in `TodoForm` and `TodoCard`.
10. Clicking any day cell (including out-of-month cells) calls `onDayClick(date)`.

## DayPanel
11. Rendered conditionally inside `CalendarPage`; when `selectedDate` is null the panel is fully unmounted (satisfies Playwright's `.not.toBeVisible()` check after close).
12. Todos are sorted via `sortTodosByPriority(todos, date)` where `date` is the **selected** date, not today — this is the core behaviour called out in the task spec.
13. The panel uses `useTodos()` internally for `updateTodo`, `deleteTodo`, `toggleComplete`, since these operations require the full context and operate by todo ID.
14. The "+ Add Todo" button opens a `<Modal>` containing `<TodoForm>` with `initialValues={{ workOnDate: format(selectedDate, 'yyyy-MM-dd') }}` so the field is pre-filled to the selected day.
15. Editing a todo in the panel reuses the same modal; `editingTodo` state is local to DayPanel.
16. The panel renders `TodoCard` components which each carry `data-testid="todo-card"` (satisfying the "day panel shows todos" test).

## CalendarPage
17. Navigation state is a `viewDate: Date` (defaults to `new Date()` — current month). `subMonths` / `addMonths` from date-fns handle year-boundary wraparound automatically.
18. The month/year header uses `format(viewDate, 'MMMM yyyy')`, e.g. "May 2026", matching the test expectation `currentMonthLabel`.
19. The "Today" button resets `viewDate` to `new Date()` (a fresh Date object); it does NOT close the selected-date panel.
20. `selectedDate` and `viewDate` are independent states — navigating months does not clear the selected date, though in practice the panel remains visible until explicitly closed.
21. `getTodosForDate` is called in `CalendarPage` to pass the filtered todos to `DayPanel`; `CalendarGrid` receives the full (unfiltered) `todos` array and does its own `getTodosForDate` per cell.

## Components / exports
22. `CalendarGrid` and `DayPanel` are both exported from `src/components/index.ts`.
23. `getCalendarWeeks` and `getTodosForDate` are re-exported from `src/utils/index.ts`.
24. No new packages are installed; all date utilities come from the already-declared `date-fns` dependency.

## Out-of-scope / unchanged
25. `src/context/`, `src/types/`, `src/services/`, `src/pages/DashboardPage.tsx` are not touched.
26. Completed todos are excluded from dots AND from the DayPanel list (both handled by `getTodosForDate`'s `!t.completed` filter).
