# Task 5 Result: Calendar View

## Status: implemented (iteration 4)

## Summary
Built a full monthly calendar view at `/calendar` with month navigation, per-day todo dots, and a side panel showing priority-sorted todos for a selected date.

## Files changed
| File | Action |
|---|---|
| `src/utils/calendar.ts` | Created — `getCalendarWeeks` and `getTodosForDate` utilities |
| `src/utils/index.ts` | Modified — re-exports the two new calendar utilities |
| `src/components/CalendarGrid.tsx` | Created — 7-column monthly grid with dot indicators |
| `src/components/DayPanel.tsx` | Created — side panel with priority-sorted todos and add/edit/delete |
| `src/components/index.ts` | Modified — exports `CalendarGrid` and `DayPanel` |
| `src/pages/CalendarPage.tsx` | Modified — full page with navigation, grid, and panel wiring |
| `src/context/TodoContext.tsx` | Modified — mutations now save to localStorage synchronously |

## Implementation notes

### `getCalendarWeeks(year, month)`
Uses `startOfWeek(monthStart, { weekStartsOn: 1 })` and `endOfWeek(monthEnd, { weekStartsOn: 1 })` to build a full ISO-week grid. Returns a 2D `Date[][]` array (4–6 weeks).

### `getTodosForDate(todos, date)`
Filters on `!t.completed && t.workOnDate === format(date, 'yyyy-MM-dd')`. String comparison sidesteps timezone issues.

### CalendarGrid
- Renders a sticky weekday header row (Mon–Sun) followed by all calendar day cells.
- Today's cell gets `data-testid="calendar-day-today"` and a blue ring + blue circle on the day number.
- Out-of-month cells are dimmed with `opacity-40`.
- Up to 3 category dots (`data-testid="calendar-day-dot"`) per cell: office=blue, personal=green, family=purple.

### DayPanel
- Sorts received todos via `sortTodosByPriority(todos, date)` — uses the **selected** date as `referenceDate`, not today's date.
- Renders `TodoCard` for each sorted todo, wired to context operations.
- The "+ Add Todo" button opens a `Modal` containing `TodoForm` with `initialValues={{ workOnDate: dateStr }}` so the date is pre-filled.
- Conditionally rendered in `CalendarPage` (unmounted when `selectedDate` is null).

### CalendarPage
- Two independent state slices: `viewDate` (month being viewed) and `selectedDate` (clicked day).
- `subMonths`/`addMonths` from date-fns handle year-boundary wraparound correctly.
- Navigation buttons: `calendar-prev-btn`, `calendar-next-btn`, `calendar-today-btn`.

## Verification
All 15 Playwright acceptance tests pass (0 failures):
- Grid renders with correct header, today marker, and navigation
- Prev/next/today navigation including January→December year wrap
- Active todo dots appear; completed todo dots do not
- Day panel opens/closes, shows correct date and todos
- "+ Add Todo" pre-fills `workOnDate` to the selected date
- Panel uses selected date for priority sorting

## Convention fixes
- **Iteration 2** — Attempted replacement of `style={{ minHeight: 0 }}` with `min-h-0`; file was absent from the repo.
- **Iteration 3** — Recreated `src/components/DayPanel.tsx` from scratch with no inline styles. All Tailwind-only styling; `min-h-0` used in `className` on both the outer container and the scrollable inner div.

## Blocking issue fix (iteration 4)
The dot-after-reload test was failing because `useEffect` saves to localStorage asynchronously (after paint), creating a race with `page.reload()` which fires immediately after `addTodo` resolves. Fixed by adding a synchronous `todoStorage.save(...)` call inside each mutation (`addTodo`, `deleteTodo`, `updateTodo`, `toggleComplete`) in `TodoContext.tsx`, computing the next todos array inline. The `useEffect` is retained as a redundant safety net.

## TypeScript errors: 0
