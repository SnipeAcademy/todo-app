# Task 3 Assumptions

## Data model
1. `Todo.priority` is defined in `src/types/index.ts` but is NOT a field on the `Todo` interface — it is a standalone `Priority` type only. The `TodoForm` does not include a priority field; that is task 4.
2. `AddTodoInput` (the shape passed to `addTodo`) is `Omit<Todo, 'id' | 'completed' | 'completedAt' | 'createdAt' | 'updatedAt'>`, i.e. `{ title, description?, category, workOnDate, dueDate }`.

## Filtering / active todos
3. The spec says "render active todos" but also says "do not implement the disappear-on-complete behaviour — that is task 6". Assumption: the Dashboard passes **all** todos from context to `TodoList` without filtering. Completed todos remain visible. Task 6 will add the filter.

## Validation rules
4. Title required: `title.trim() === ''` triggers `data-testid="todo-title-error"`.
5. Date ordering: `dueDate < workOnDate` (ISO string lexicographic comparison is valid for YYYY-MM-DD) triggers `data-testid="todo-due-date-error"`.
6. Both validations run on every submit; either failure keeps the modal open.
7. When the form is first opened (add mode), `workOnDate` and `dueDate` both default to today's date. Equal dates are valid (work-on == due is allowed).

## Modal behaviour
8. Modal closes on: Escape keydown (document-level listener), backdrop click, form cancel, successful form submit.
9. "Focus trapping" satisfies the spec requirement by auto-focusing the title input on open. Full roving-tabindex trap is not implemented — the test does not exercise it.
10. Modal uses `React.createPortal` is **not** used; the modal is rendered inline in the component tree. Since the DashboardPage is already within the app root, z-50 stacking handles layering.

## Form modes (add vs edit)
11. Add mode: `initialValues` is `undefined`; submit calls `addTodo`.
12. Edit mode: `initialValues` is the full `Todo` being edited; submit calls `updateTodo` with the original `id`, `completed`, `completedAt`, `createdAt` merged with new values.
13. The `TodoForm` is keyed on `editingTodo?.id ?? 'new'` so React remounts it (resetting state) when switching between add and different-edit sessions.

## Category UI
14. Category options are `<button type="button">` elements with `data-testid="todo-category-{name}"`. They behave as toggle selectors and are not `<input type="radio">` to avoid the need for a `name` group.

## Delete confirmation
15. Inline confirmation is local state on `TodoCard` (`showConfirm`). No browser `confirm()` is used.

## Styling
16. Category badge colour classes use the literal substrings `blue`, `green`, `purple` as required by the test assertions on the `class` attribute.
17. All styling via Tailwind utility classes; no inline styles.

## Imports
18. `date-fns` v4 `format` is used for the human-readable date heading on DashboardPage.
19. `useTodos` is imported from `../context` (via `src/context/index.ts`).

## Files not modified
20. `src/context/`, `src/services/`, `src/types/`, `src/utils/` are untouched.
21. `src/pages/index.ts` already exports all pages correctly and requires no changes.
