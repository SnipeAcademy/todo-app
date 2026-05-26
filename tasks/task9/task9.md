# Task 9: Dashboard Sort Control

## Objective
Let the founder choose how their active todo list is ordered. Add a compact sort control to the Dashboard with three options: Priority (default, existing behaviour), Due Date (earliest first), and Created Date (newest first).

## Scope
- `<SortControl>` component — three-option toggle (button group or segmented control)
- Integrate into `<DashboardPage>`: sort state controls the order todos are passed to `<TodoList>`
- Sort composes with existing search and category/overdue filters — sort applies to the already-filtered list

## Out of scope
- Do not persist sort preference to localStorage
- Do not add sorting to Calendar or Completed pages
- Do not modify the data layer (context, reducer, types, localStorage service)
- Do not add a fourth sort option or reverse/ascending toggle in this task

## Acceptance criteria
- [ ] `data-testid="sort-control"` container is visible on the Dashboard
- [ ] `data-testid="sort-priority"` button is visible and active by default
- [ ] `data-testid="sort-due-date"` button is visible
- [ ] `data-testid="sort-created"` button is visible
- [ ] With "Due Date" selected, todos are ordered earliest `dueDate` first
- [ ] With "Created Date" selected, todos are ordered newest `createdAt` first
- [ ] With "Priority" selected (default), todos follow the existing `sortTodosByPriority` order (office/personal/family weekday logic)
- [ ] The active sort button has a visually distinct style (e.g. `bg-indigo-600 text-white` vs inactive `bg-white text-gray-700`)
- [ ] Sort composes with the active category filter — due-date sort within an "Office" filter only reorders office todos
- [ ] Sort composes with search — sorted order applies to search-filtered results

## Dependencies
- task8 must be complete (`<DashboardPage>` has search bar and overdue filter pill)

## File and folder targets
- Create: `src/components/SortControl.tsx`
- Modify: `src/components/index.ts` (re-export `SortControl`)
- Modify: `src/pages/DashboardPage.tsx` (add sort state + SortControl, apply sort after filtering)
- Do not touch: `src/context/`, `src/services/`, `src/types/`, calendar or completed files

## Design constraints
- Follow `CONVENTIONS.md` for naming and styling
- `<SortControl>` receives `value: SortKey` and `onChange(v: SortKey): void` as props — no internal state
- `SortKey` type: `'priority' | 'due-date' | 'created'` — define in `SortControl.tsx`
- Due date sort: compare ISO date strings directly (`a.dueDate.localeCompare(b.dueDate)`)
- Created sort: newest first — descending `createdAt` ISO string sort
- Priority sort: call `sortTodosByPriority(todos, new Date())` imported from `src/utils`
- Place `<SortControl>` to the right of (or below) the filter pills row on the Dashboard
- Button labels: "Priority", "Due Date", "Created"

### Required data-testid attributes
| Element | data-testid |
|---|---|
| Sort control container | `sort-control` |
| Priority sort button | `sort-priority` |
| Due date sort button | `sort-due-date` |
| Created date sort button | `sort-created` |

## Context
Once a founder has more than a handful of todos, arbitrary order becomes friction. Sorting by due date surfaces the most urgent work; sorting by created date helps review recent additions. Priority sort remains the default because it already encodes the weekday/weekend logic built in task 4.
