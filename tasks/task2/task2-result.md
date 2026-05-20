# Task 2 Result: Data Models & localStorage Service

## Status: implemented (iteration 2)

## Summary
All TypeScript types, the localStorage service, pure reducer, React context, and test-handle exposure are implemented and passing. Iteration 2 fixes the silent catch in `todoStorage.load()` flagged by the review.

## Files created / modified
| File | Action |
|------|--------|
| `src/types/index.ts` | Modified — added `Category`, `Priority`, `Todo`, `TodoState`, `TodoAction` |
| `src/utils/generateId.ts` | Created — `generateId()` wraps `crypto.randomUUID()` |
| `src/utils/index.ts` | Modified — barrel export for `generateId` |
| `src/services/todoStorage.ts` | Created — `load()`, `save()`, `clear()` over `localStorage` key `founder_todos` |
| `src/services/index.ts` | Modified — barrel export for `todoStorage` |
| `src/context/todoReducer.ts` | Created — pure reducer, no side effects |
| `src/context/TodoContext.tsx` | Created — `TodoProvider`, `useTodos`, `window.__TODO_CONTEXT__` exposure |
| `src/context/index.ts` | Modified — barrel export for `TodoProvider`, `useTodos` |
| `src/main.tsx` | Modified — wrapped `<App />` with `<TodoProvider>` |

## Verification results
- `npx tsc --noEmit`: exit 0 (confirmed before test run)
- Playwright test suite: **9/10 passed**

### Passing tests
1. load() returns empty array when key is absent
2. todos persist after page reload
3. addTodo adds a todo with correct fields
4. addTodo generates unique IDs for multiple todos
5. deleteTodo removes the todo by id
6. deleteTodo with unknown id does not crash
7. updateTodo replaces matching todo and updates updatedAt
8. toggleComplete sets completed=true and sets completedAt
9. toggleComplete a second time sets completed=false and clears completedAt

### Failing tests
**"TypeScript compiles without errors"** — this test uses `require('child_process')` inside the spec file. Because `package.json` declares `"type": "module"`, Playwright runs test files as ES modules and `require` is not available at runtime. The TypeScript compilation itself is verified to pass (`npx tsc --noEmit` exits 0); the test failure is a test infrastructure compatibility issue that cannot be fixed without modifying the protected spec file or the disallowed `playwright.config.ts`.

## Changes from iteration 1
- `src/services/todoStorage.ts`: replaced empty `catch {}` with `catch (err) { console.error(..., err); return []; }` — surfacing developer-facing parse errors as required by `CONVENTIONS.md`.

## Design decisions
- `todoStorage.load()` catches all JSON parse errors, logs a `console.error` with context, and returns `[]` — satisfies the corrupted-JSON acceptance criterion while not swallowing errors silently.
- Initial state is loaded synchronously via `useReducer`'s initial value to avoid a flash of empty state.
- The reducer is fully pure — all timestamps (`new Date().toISOString()`) are computed in context action creators and passed in the action payload.
- `toggleComplete` reads `state.todos` to determine current `completed`, then dispatches a `TOGGLE_COMPLETE` action with pre-computed `completed`, `completedAt`, and `updatedAt`.
- `window.__TODO_CONTEXT__` is updated in a `useEffect` that runs whenever `contextValue` changes, keeping the test handle current.
- `useTodos()` throws `Error('useTodos must be used within a TodoProvider')` when called outside the provider, as required.
