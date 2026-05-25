# Task 8: Dashboard Search Bar

## Objective
Add a real-time search input to the Dashboard that filters the visible todo list by title as the user types. No server calls, no debounce required — instant client-side filtering.

## Scope
- `<SearchBar>` component — controlled input with a clear (×) button
- Integrate into `<DashboardPage>`: search state filters todos before they are passed to `<TodoList>`
- Search and category/overdue filters compose — both can be active at the same time

## Out of scope
- Do not search by description, category, or date — title only
- Do not persist search state to localStorage
- Do not add search to Calendar or Completed pages
- Do not modify the data layer (context, reducer, types, localStorage service)

## Acceptance criteria
- [ ] `data-testid="search-bar"` input is visible on the Dashboard
- [ ] Typing in the search bar hides todos whose titles do not match (case-insensitive)
- [ ] Matching is substring-based — "pitch" matches "Write pitch deck"
- [ ] Todos whose titles match are still visible
- [ ] When the search query is cleared (empty string), all active todos reappear
- [ ] `data-testid="search-clear-btn"` button is visible when there is text in the input
- [ ] `data-testid="search-clear-btn"` is hidden (or absent) when the input is empty
- [ ] Clicking `data-testid="search-clear-btn"` clears the input and restores all todos
- [ ] `data-testid="todo-list-empty"` is shown when no todos match the search query
- [ ] Search composes with the active category filter — if "Office" pill is active and user types, only office todos matching the query are shown

## Dependencies
- task7 must be complete (DashboardPage has overdue filter pill; search must not break it)

## File and folder targets
- Create: `src/components/SearchBar.tsx`
- Modify: `src/components/index.ts` (re-export `SearchBar`)
- Modify: `src/pages/DashboardPage.tsx` (add search state + SearchBar, compose with existing filters)
- Do not touch: `src/context/`, `src/services/`, `src/types/`, `src/utils/`, calendar or completed files

## Design constraints
- Follow `CONVENTIONS.md` for naming and styling
- `<SearchBar>` receives `value: string`, `onChange(v: string): void`, as props — no internal state
- Placeholder text: `"Search todos…"`
- Clear button: × character or an X icon; only rendered when `value.length > 0`
- Input + clear button share a single container with a subtle border (`border border-gray-300 rounded-lg`)
- Case-insensitive match: `todo.title.toLowerCase().includes(query.toLowerCase())`
- Place `<SearchBar>` above the filter pills row on the Dashboard

### Required data-testid attributes
| Element | data-testid |
|---|---|
| Search input | `search-bar` |
| Clear button | `search-clear-btn` |

## Context
A founder accumulates many todos over time. Search makes it fast to find a specific one without scrolling. Keeping it title-only keeps the scope tiny and the UX simple — no power-user syntax to learn.
