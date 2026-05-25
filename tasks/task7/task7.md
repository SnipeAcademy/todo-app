# Task 7: Overdue Indicator

## Objective
Visually flag todos that are past their `dueDate` and not yet completed. Give the founder a one-click way to see only overdue work on the Dashboard.

## Scope
- `isOverdue(todo)` utility — returns `true` when `dueDate < today` and `completed === false`
- Visual treatment on `<TodoCard>` for overdue todos (red ring + overdue badge chip)
- "Overdue" filter pill on `<DashboardPage>` that narrows the list to overdue todos only

## Out of scope
- Do not modify the data layer (context, reducer, types, localStorage service)
- Do not change how `dueDate` is stored or validated
- Do not add overdue logic to the Calendar or Completed page

## Acceptance criteria
- [ ] `isOverdue` returns `true` when `dueDate` is before today and `completed === false`
- [ ] `isOverdue` returns `false` when `dueDate` is today or in the future
- [ ] `isOverdue` returns `false` for completed todos regardless of `dueDate`
- [ ] An overdue todo's card shows `data-testid="todo-card-overdue-badge"`
- [ ] A non-overdue todo's card does NOT have `data-testid="todo-card-overdue-badge"`
- [ ] A completed todo does NOT show `data-testid="todo-card-overdue-badge"` (completed todos never appear on Dashboard anyway, but the badge must not be rendered if the card is somehow visible)
- [ ] `data-testid="filter-overdue"` pill is visible on the Dashboard
- [ ] Clicking `data-testid="filter-overdue"` shows only overdue todos; non-overdue todos are hidden
- [ ] Clicking `data-testid="filter-all"` (or any other category pill) after "Overdue" resets the view to show all active todos of that scope
- [ ] Overdue cards have a visible red visual treatment (Tailwind `ring-2 ring-red-400` or `border-red-400`)

## Dependencies
- task3 must be complete (`<TodoCard>`, `<DashboardPage>` exist)

## File and folder targets
- Create: `src/utils/overdue.ts`
- Modify: `src/utils/index.ts` (re-export `isOverdue`)
- Modify: `src/components/TodoCard.tsx` (add overdue badge + red ring)
- Modify: `src/pages/DashboardPage.tsx` (add "Overdue" filter pill)
- Do not touch: `src/context/`, `src/services/`, `src/types/`, calendar or completed files

## Design constraints
- Follow `CONVENTIONS.md` for naming and styling
- "Today" means midnight at the start of today in local time — compare ISO date strings (`dueDate < today.toISOString().slice(0,10)`) or use `date-fns` `isBefore` + `startOfToday`
- Badge chip: small red pill, text "Overdue", Tailwind classes `bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full`
- Place the badge chip alongside the category badge inside `<TodoCard>`
- Filter pill `data-testid="filter-overdue"` must sit in the same filter row as existing category pills
- Active filter pill styling: same pattern as existing active category pill

### Required data-testid attributes
| Element | data-testid |
|---|---|
| Overdue badge chip on card | `todo-card-overdue-badge` |
| Overdue filter pill | `filter-overdue` |

## Context
Founders often let tasks slip past their due date. This indicator makes overdue work impossible to miss without cluttering the UI — it's just a badge and a filter pill, nothing more.
