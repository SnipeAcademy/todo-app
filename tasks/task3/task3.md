# Task 3: Core Todo CRUD UI

## Objective
Build the UI for creating, editing, and deleting todos. The Dashboard page must display active todos and allow the user to open a form to add or edit them.

## Scope
- `<Modal>` backdrop + container component
- `<TodoForm>` component (add and edit modes, controlled inputs, inline validation)
- `<TodoCard>` component (displays one todo with Edit, Delete, Mark Complete actions)
- `<TodoList>` component (renders a list of TodoCards, empty state included)
- Update `<DashboardPage>` to: show today's date heading, render active todos via TodoList, provide "+ Add Todo" button, wire up edit flow

## Out of scope
- Priority sorting and priority badges (task 4)
- Calendar (task 5)
- Completed page and filtering (task 6)
- Do not implement the "disappear on complete" behaviour yet — the card may stay visible after marking complete; that filtering is task 6

## Acceptance criteria
- [ ] Clicking `data-testid="add-todo-btn"` opens a modal containing `data-testid="todo-form"`
- [ ] Submitting the form with an empty title shows `data-testid="todo-title-error"` and does not close the modal
- [ ] Submitting the form with a due date earlier than the work-on date shows `data-testid="todo-due-date-error"` and does not close the modal
- [ ] Submitting a valid form closes the modal and shows a card with `data-testid="todo-card"` in the list
- [ ] The card shows the correct title, category badge (`data-testid="todo-card-category-badge"`), work-on date, and due date
- [ ] The `office` category badge has Tailwind class containing `blue`
- [ ] The `personal` category badge has Tailwind class containing `green`
- [ ] The `family` category badge has Tailwind class containing `purple`
- [ ] Clicking `data-testid="todo-card-edit-btn"` opens the modal pre-populated with existing values
- [ ] Saving an edit updates the card title in the list
- [ ] Clicking `data-testid="todo-card-delete-btn"` shows a confirmation element (`data-testid="todo-card-delete-confirm"`)
- [ ] Clicking `data-testid="todo-card-delete-cancel"` dismisses the confirmation without deleting
- [ ] Clicking `data-testid="todo-card-delete-confirm"` removes the card from the list
- [ ] Pressing `Escape` while the modal is open closes it without saving
- [ ] When there are no active todos, `data-testid="todo-list-empty"` is visible
- [ ] Data persists after page reload (todos still in list)

## Dependencies
- task2 must be complete (context, types, localStorage service)

## File and folder targets
- Create: `src/components/Modal.tsx`
- Create: `src/components/TodoForm.tsx`
- Create: `src/components/TodoCard.tsx`
- Create: `src/components/TodoList.tsx`
- Modify: `src/components/index.ts`
- Modify: `src/pages/DashboardPage.tsx`
- Do not touch: `src/context/`, `src/services/`, `src/types/`, `src/utils/`

## Design constraints
- Follow `CONVENTIONS.md` for naming and styling
- All interactive and displayed elements must have `data-testid` attributes — see accepted list below
- Use only Tailwind utility classes — no inline styles
- Form must use controlled inputs (React `useState` for each field)
- Do not use browser `confirm()` — show an inline confirmation in the card
- Modal must trap focus and close on Escape keydown and backdrop click

### Required data-testid attributes
| Element | data-testid |
|---|---|
| "+ Add Todo" button | `add-todo-btn` |
| Form element | `todo-form` |
| Title input | `todo-title-input` |
| Description textarea | `todo-description-input` |
| Category option — office | `todo-category-office` |
| Category option — personal | `todo-category-personal` |
| Category option — family | `todo-category-family` |
| Work-on date input | `todo-work-on-date` |
| Due date input | `todo-due-date` |
| Form submit button | `todo-form-submit` |
| Form cancel/close button | `todo-form-cancel` |
| Title validation error | `todo-title-error` |
| Due date validation error | `todo-due-date-error` |
| Todo list container | `todo-list` |
| Individual todo card | `todo-card` |
| Card title text | `todo-card-title` |
| Category badge | `todo-card-category-badge` |
| Edit button | `todo-card-edit-btn` |
| Delete button | `todo-card-delete-btn` |
| Delete confirmation button | `todo-card-delete-confirm` |
| Delete cancel button | `todo-card-delete-cancel` |
| Mark complete button | `todo-card-complete-btn` |
| Empty state element | `todo-list-empty` |

## Context
This task adds the first visible UI to the app. The form is the primary data-entry point for the founder. Inline validation prevents bad data entering the store. All UI interactions must work via `data-testid` selectors — CSS classes may change in future tasks and must not be relied on in tests.
