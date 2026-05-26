# Task 10: CSV Export

## Objective
Add a one-click "Export CSV" button to the Dashboard that downloads the currently visible (filtered + sorted) active todos as a `.csv` file. Gives the founder a portable snapshot of their work without leaving the app.

## Scope
- `buildCsv(todos)` utility — converts a `Todo[]` to a CSV string
- `<ExportButton>` component — a button that triggers a browser download
- Integrate into `<DashboardPage>`: pass the current filtered+sorted todos to `<ExportButton>`

## Out of scope
- Do not export completed todos
- Do not add export to Calendar or Completed pages
- Do not use any external CSV library — generate the string manually
- Do not modify the data layer (context, reducer, types, localStorage service)
- No server upload or cloud sync

## Acceptance criteria
- [ ] `data-testid="export-csv-btn"` button is visible on the Dashboard
- [ ] Clicking the button triggers a file download
- [ ] The downloaded file is named `todos.csv`
- [ ] The CSV has a header row: `title,category,dueDate,workOnDate,description`
- [ ] Each active todo in the current view appears as one data row
- [ ] `title` and `description` values containing commas are wrapped in double-quotes
- [ ] When no todos are visible (empty list or all filtered out), clicking still triggers a download of a header-only CSV (no crash)
- [ ] The exported rows reflect the current active filter — if "Office" filter is active, only office todos are in the CSV
- [ ] The exported rows reflect the current search query — if search is active, only matching todos are exported

## Dependencies
- task9 must be complete (`<DashboardPage>` has sort control; export must not break it)

## File and folder targets
- Create: `src/utils/exportCsv.ts`
- Modify: `src/utils/index.ts` (re-export `buildCsv`)
- Create: `src/components/ExportButton.tsx`
- Modify: `src/components/index.ts` (re-export `ExportButton`)
- Modify: `src/pages/DashboardPage.tsx` (add `<ExportButton>` wired to filtered+sorted todos)
- Do not touch: `src/context/`, `src/services/`, `src/types/`, calendar or completed files

## Design constraints
- Follow `CONVENTIONS.md` for naming and styling
- `buildCsv(todos: Todo[]): string` — pure function, no side effects
- CSV columns in this exact order: `title`, `category`, `dueDate`, `workOnDate`, `description`
- Quote-escape rule: if a field value contains a comma, a double-quote, or a newline, wrap it in double-quotes and escape any internal double-quotes as `""`
- Download implementation: create a `Blob` with `type: 'text/csv'`, create an object URL, click a hidden `<a>` element, then revoke the URL
- `<ExportButton>` receives `todos: Todo[]` as a prop; it calls `buildCsv` internally
- Button label: "Export CSV"
- Place `<ExportButton>` in the Dashboard header area, to the right of (or near) the "+ Add Todo" button
- Button style: secondary/outline style — `border border-gray-300 text-gray-700 hover:bg-gray-50`

### Required data-testid attributes
| Element | data-testid |
|---|---|
| Export CSV button | `export-csv-btn` |

## Context
Founders often need to share task lists in standup docs, investor updates, or spreadsheets. A one-click CSV export removes all friction. Because it exports the current view, it doubles as a "filtered export" — the founder can filter to Office tasks and export just those for a team sync.
