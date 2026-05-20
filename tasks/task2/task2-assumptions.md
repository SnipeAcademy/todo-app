# Task 2 Assumptions

## localStorage key
- The key used to store todos is `'founder_todos'`, as referenced in the verify spec (`localStorage.removeItem('founder_todos')`).

## Type shapes
- `Priority` is defined as a standalone union type but is NOT a field on `Todo` in this task (no `priority` field); it is defined for future use by tasks 3+.
- `TodoState` is `{ todos: Todo[] }`.
- `TodoAction` is a discriminated union covering `ADD_TODO`, `DELETE_TODO`, `UPDATE_TODO`, `TOGGLE_COMPLETE`, and `LOAD_TODOS`.
- `TOGGLE_COMPLETE` action payload carries pre-computed `{ id, completed, completedAt, updatedAt }` so the reducer stays pure.

## addTodo input shape
- `addTodo` accepts `Omit<Todo, 'id' | 'completed' | 'completedAt' | 'createdAt' | 'updatedAt'>` — i.e., caller supplies `title`, `category`, `workOnDate`, `dueDate`, and optional `description`.
- Fields `id`, `completed` (false), `createdAt`, and `updatedAt` are generated inside the provider function; `completedAt` is omitted.

## updateTodo behaviour
- The context's `updateTodo` function stamps a fresh `updatedAt = new Date().toISOString()` onto the payload before dispatching, so the reducer itself is side-effect-free.

## toggleComplete behaviour
- The context's `toggleComplete` function reads the current todo from `state.todos` to determine the current `completed` value, computes new values, then dispatches.
- If the id is not found, the function is a no-op.
- When completing: `completedAt` is set to `new Date().toISOString()`.
- When un-completing: `completedAt` is explicitly set to `undefined` (omitted in JSON output).

## Reducer purity
- The reducer never calls `new Date()`, `crypto.randomUUID()`, or any `localStorage` API.
- All timestamps are computed by the context action creators and passed in action payloads.

## Persistence
- `todoStorage.save(todos)` is called inside a `useEffect` in `TodoProvider` that runs whenever `state.todos` changes.
- Initial state is populated synchronously from `todoStorage.load()` passed as the initial value to `useReducer`, avoiding a flash of empty state.

## Window test handle
- `window.__TODO_CONTEXT__` is assigned in a `useEffect` inside `TodoProvider` only when `import.meta.env.DEV` is true.
- It is updated on every render where `state.todos` changes so that test calls always see current state.
- A `declare global { interface Window }` augmentation is added in `TodoContext.tsx` to satisfy strict TypeScript.

## Error handling for corrupted JSON
- `todoStorage.load()` wraps `JSON.parse` in a `try/catch` and returns `[]` on any parse error, matching the acceptance criterion.

## generateId
- Uses `crypto.randomUUID()` — available in all modern browsers and in the Vite `ES2020`/`DOM` target environment.

## StrictMode / double-invoke
- `useReducer` initial-value function runs once (not twice) in StrictMode because we pass the value directly, not a lazy initializer. Effects do run twice in StrictMode during dev, but `todoStorage.save` is idempotent, so there is no issue.

## Barrel files
- `src/services/index.ts`, `src/context/index.ts`, and `src/utils/index.ts` are updated to re-export the new modules so consumers can import from the barrel.

## tsconfig
- `noUnusedLocals` and `noUnusedParameters` are enabled; every declared symbol is used or the file is structured to avoid the violation.
- `strict: true` is active; no `any` types are used.
