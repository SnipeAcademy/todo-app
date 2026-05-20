# Task 3 Result: Core Todo CRUD UI

## Status
Implemented and verified (iteration 2). All 20 Playwright tests pass.

## Iteration 2 fix
Added keyboard focus trapping to `Modal.tsx` (blocking issue from review). The modal now:
- Queries all focusable elements inside the container on `Tab`/`Shift+Tab`
- Cycles focus within the modal boundary, preventing keyboard focus from escaping
- Auto-focuses the first focusable element on open
- Restores focus to the previously focused element on close

## Files created
- `src/components/Modal.tsx` — backdrop + container, Escape/backdrop close, keyboard focus trap
- `src/components/TodoForm.tsx` — controlled form for add/edit with inline validation
- `src/components/TodoCard.tsx` — card with title, category badge, dates, and Edit/Delete/Complete actions
- `src/components/TodoList.tsx` — list of TodoCards with empty state

## Files modified
- `src/components/index.ts` — exports Modal, TodoCard, TodoForm, TodoList
- `src/pages/DashboardPage.tsx` — today's date heading, "+ Add Todo" button, modal wiring, TodoList

## Acceptance criteria
All criteria met:
- `add-todo-btn` opens modal containing `todo-form`
- Empty title submit shows `todo-title-error`, keeps modal open
- Due date before work-on date shows `todo-due-date-error`, keeps modal open
- Valid submit closes modal and shows `todo-card` in list
- Card shows correct title, category badge, work-on date, due date
- `office` badge has class containing `blue`
- `personal` badge has class containing `green`
- `family` badge has class containing `purple`
- Edit button opens pre-populated form
- Saving edit updates card title
- Delete button shows inline `todo-card-delete-confirm` and `todo-card-delete-cancel`
- Cancel dismisses confirmation without deleting
- Confirm deletes card from list
- Escape closes modal without saving
- Empty state `todo-list-empty` visible when no todos
- Data persists after page reload

## Verify output
```
20 passed (10.4s)
```
