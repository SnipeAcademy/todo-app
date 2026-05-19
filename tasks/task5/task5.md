# Task 5: Calendar View

## Objective
Build a monthly calendar page that plots active todos on their `workOnDate`. Clicking a date opens a side panel listing that day's todos sorted by effective priority for that specific day.

## Scope
- `getCalendarWeeks(year, month)` utility — returns a 2D array of `Date[][]` for the visible calendar grid
- `getTodosForDate(todos, date)` utility — filters todos by `workOnDate`
- `<CalendarGrid>` component — 7-column monthly grid with category dot indicators
- `<DayPanel>` component — side panel showing todos for a selected date, priority-sorted for that day
- Update `<CalendarPage>` with month navigation, today button, and grid + panel wiring

## Out of scope
- Completed todos are not shown in the calendar (filtering is covered here — active only)
- No todo creation directly from the calendar grid dot (only from the DayPanel "+ Add" button)
- Do not modify the data layer (context, reducer, types)
- Do not modify DashboardPage

## Acceptance criteria
- [ ] `/calendar` renders `data-testid="calendar-grid"`
- [ ] Calendar header shows the current month and year (e.g. "May 2026") in `data-testid="calendar-header"`
- [ ] Clicking `data-testid="calendar-prev-btn"` shows the previous month
- [ ] Clicking `data-testid="calendar-next-btn"` shows the next month
- [ ] Clicking `data-testid="calendar-today-btn"` returns to the current month
- [ ] Navigating from January backwards goes to December of the previous year (no crash)
- [ ] Today's date cell contains `data-testid="calendar-day-today"`
- [ ] A date cell with an active todo shows at least one `data-testid="calendar-day-dot"` element
- [ ] A date cell with no todos shows zero `calendar-day-dot` elements
- [ ] A completed todo's `workOnDate` cell shows no dot
- [ ] Clicking a date cell opens `data-testid="day-panel"` showing that date
- [ ] `data-testid="day-panel-date"` contains the formatted selected date
- [ ] Todos in the panel are sorted by priority for the selected day (weekday/weekend rule applied to that date)
- [ ] Clicking `data-testid="day-panel-close"` closes the panel
- [ ] Clicking `data-testid="day-panel-add-btn"` opens `<TodoForm>` with `workOnDate` pre-filled to the selected date

## Dependencies
- task4 must be complete (PriorityBadge, sortTodosByPriority exported from utils)

## File and folder targets
- Create: `src/utils/calendar.ts`
- Modify: `src/utils/index.ts`
- Create: `src/components/CalendarGrid.tsx`
- Create: `src/components/DayPanel.tsx`
- Modify: `src/components/index.ts`
- Modify: `src/pages/CalendarPage.tsx`
- Do not touch: `src/pages/DashboardPage.tsx`
- Do not touch: `src/context/`, `src/services/`, `src/types/`

## Design constraints
- Follow `CONVENTIONS.md` for naming and styling
- Use `date-fns` for all date manipulation: `startOfMonth`, `endOfMonth`, `eachDayOfInterval`, `startOfWeek`, `endOfWeek`, `isSameDay`, `isSameMonth`, `isToday`, `format`
- Calendar week starts on Monday (ISO week)
- Cells outside the current month are rendered dimmed (`opacity-40` or `text-gray-300`)
- `sortTodosByPriority` from `src/utils/priority.ts` must be called with the selected date as `referenceDate` in the DayPanel — not today's date
- Each category dot colour: office=blue, personal=green, family=purple (match badge colours)
- Maximum 3 dots shown per cell regardless of how many todos exist on that date

### Required data-testid attributes
| Element | data-testid |
|---|---|
| Calendar grid container | `calendar-grid` |
| Month/year header | `calendar-header` |
| Previous month button | `calendar-prev-btn` |
| Next month button | `calendar-next-btn` |
| Today button | `calendar-today-btn` |
| Today's date cell | `calendar-day-today` |
| Category dot in a cell | `calendar-day-dot` |
| Day panel container | `day-panel` |
| Date heading in panel | `day-panel-date` |
| Close button | `day-panel-close` |
| Add todo from panel | `day-panel-add-btn` |

## Context
The calendar view gives the founder a weekly and monthly perspective on their workload. The key behaviour is that clicking a date applies that date's priority rules (not today's), so a Saturday in the future correctly surfaces family todos at the top even when viewed on a weekday.
