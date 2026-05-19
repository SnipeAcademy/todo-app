# Task 6: Completed Tasks Page

## Objective
Move completed todos out of all active views (Dashboard and Calendar) and into a dedicated Completed page. Allow the founder to review, restore, or permanently delete completed tasks, with filtering by category.

## Scope
- `<CompletedTodoCard>` component (shows completed todo with Restore and Delete actions)
- Update `<CompletedPage>` with category filter pills, sorted list, and empty state
- Update `<DashboardPage>` to filter out `completed === true` todos (mark complete → card disappears)
- Update `<CalendarGrid>` and `<DayPanel>` to receive only active todos (no dots or panel entries for completed todos)
- Optional: update `<Layout>` nav link to show count badge on "Completed"

## Out of scope
- No new data fields — `completed` and `completedAt` already exist from task 2
- Do not modify the data layer (context, reducer, types, localStorage service)
- Do not add pagination or search to the Completed page

## Acceptance criteria
- [ ] On the Dashboard, clicking `data-testid="todo-card-complete-btn"` removes the card from view immediately
- [ ] The completed todo appears on `/completed` as `data-testid="completed-todo-card"`
- [ ] `data-testid="completed-todo-card"` title element has a CSS `line-through` style applied
- [ ] `data-testid="completed-todo-completed-date"` shows the date it was completed
- [ ] Clicking `data-testid="completed-todo-restore-btn"` removes the card from `/completed`
- [ ] Restored todo reappears on Dashboard as an active card
- [ ] Clicking `data-testid="completed-todo-delete-btn"` shows `data-testid="completed-todo-delete-confirm"`
- [ ] Confirming the delete permanently removes the todo from `/completed` and from localStorage
- [ ] `data-testid="completed-filter-all"` shows all completed todos
- [ ] `data-testid="completed-filter-office"` shows only office completed todos
- [ ] `data-testid="completed-filter-personal"` shows only personal completed todos
- [ ] `data-testid="completed-filter-family"` shows only family completed todos
- [ ] `data-testid="completed-empty-state"` is visible when no completed todos exist (or when filtered to zero)
- [ ] Completed todos are sorted by `completedAt` descending (most recently completed first)
- [ ] `/calendar` shows no dot for a completed todo's `workOnDate`

## Dependencies
- task5 must be complete (CalendarGrid and DayPanel exist and accept active-only todos)

## File and folder targets
- Create: `src/components/CompletedTodoCard.tsx`
- Modify: `src/components/index.ts`
- Modify: `src/pages/CompletedPage.tsx`
- Modify: `src/pages/DashboardPage.tsx` (add `completed === false` filter before rendering)
- Modify: `src/components/CalendarGrid.tsx` (already accepts todos prop — ensure completed are filtered by the caller)
- Modify: `src/components/DayPanel.tsx` (same — ensure completed are filtered by the caller)
- Modify: `src/pages/CalendarPage.tsx` (pass only active todos to grid and panel)
- Optionally modify: `src/components/Layout.tsx` (add count badge)
- Do not touch: `src/context/`, `src/services/`, `src/types/`, `src/utils/`

## Design constraints
- Follow `CONVENTIONS.md` for naming and styling
- Do not use browser `confirm()` for delete — use inline confirmation matching the pattern in `<TodoCard>`
- Title in `<CompletedTodoCard>` must have Tailwind class `line-through`
- Category badge colours must match `<TodoCard>` (office=blue, personal=green, family=purple)
- Completed page sort: `completedAt` descending — use `date-fns` `compareDesc` or string sort (ISO strings compare correctly)
- Filter state is local component state — do not persist to localStorage

### Required data-testid attributes
| Element | data-testid |
|---|---|
| Completed todo card | `completed-todo-card` |
| Completed date label | `completed-todo-completed-date` |
| Restore button | `completed-todo-restore-btn` |
| Delete button | `completed-todo-delete-btn` |
| Delete confirmation | `completed-todo-delete-confirm` |
| Delete cancel | `completed-todo-delete-cancel` |
| Empty state | `completed-empty-state` |
| "All" filter pill | `completed-filter-all` |
| "Office" filter pill | `completed-filter-office` |
| "Personal" filter pill | `completed-filter-personal` |
| "Family" filter pill | `completed-filter-family` |

## Context
This is the final task. It completes the separation of active and archived work. The founder should see a clean Dashboard with only actionable todos, and have a separate archive to review what was accomplished. The Completed page is a historical record — restore is an escape hatch, not a primary workflow.
