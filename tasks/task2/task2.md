# Task 2: Data Models & localStorage Service

## Objective
Define all TypeScript types for the application and implement a `localStorage`-backed CRUD service. Wrap the service in a React context + `useReducer` so that every page can read and mutate todos without prop drilling.

## Scope
- Define `Todo`, `Category`, `Priority`, `TodoState`, and `TodoAction` types in `src/types/index.ts`
- Implement `todoStorage` service in `src/services/todoStorage.ts`
- Implement a pure `todoReducer` in `src/context/todoReducer.ts`
- Implement `TodoContext`, `TodoProvider`, and `useTodos` hook in `src/context/TodoContext.tsx`
- Create `src/utils/generateId.ts` utility
- Wrap `<App />` with `<TodoProvider>` in `src/main.tsx`

## Out of scope
- No UI components (task 3)
- No priority sorting logic (task 4)
- No calendar utilities (task 5)
- No completed-page filtering (task 6)
- Do not install any packages — all required packages were installed in task 1

## Acceptance criteria
- [ ] `npx tsc --noEmit` exits 0
- [ ] `todoStorage.load()` returns `[]` when localStorage key is absent (no throw)
- [ ] `todoStorage.load()` returns `[]` when the stored value is corrupted JSON (no throw)
- [ ] `todoStorage.save(todos)` persists data so a subsequent `load()` returns the same array
- [ ] `todoStorage.clear()` removes the key from localStorage
- [ ] Calling `addTodo()` from `useTodos()` adds a todo and it is readable via `todos` state
- [ ] Calling `deleteTodo(id)` removes the todo from `todos` state
- [ ] Calling `updateTodo(todo)` replaces the todo in `todos` state and updates `updatedAt`
- [ ] Calling `toggleComplete(id)` flips `completed` and sets `completedAt` when completing
- [ ] Calling `toggleComplete(id)` a second time unflips `completed` and clears `completedAt`
- [ ] `todos` state persists across page reload (verified via Playwright `localStorage` evaluation)
- [ ] `useTodos()` called outside `<TodoProvider>` throws a descriptive error

## Dependencies
- task1 must be complete (project scaffold, folder structure, Playwright installed)

## File and folder targets
- Modify: `src/types/index.ts`
- Create: `src/services/todoStorage.ts`
- Modify: `src/services/index.ts`
- Create: `src/context/todoReducer.ts`
- Create: `src/context/TodoContext.tsx`
- Modify: `src/context/index.ts`
- Create: `src/utils/generateId.ts`
- Modify: `src/utils/index.ts`
- Modify: `src/main.tsx` (wrap App with TodoProvider)
- Do not touch: any file under `src/components/` or `src/pages/`
- Do not touch: `playwright.config.ts`, `tailwind.config.js`, `vite.config.ts`

## Design constraints
- Follow `CONVENTIONS.md` for all naming and error-handling rules
- `Todo.id` must be generated via `crypto.randomUUID()` — no external UUID library
- `Todo.workOnDate` and `Todo.dueDate` are ISO date strings (`YYYY-MM-DD`) — not `Date` objects
- `Todo.createdAt`, `Todo.updatedAt`, `Todo.completedAt` are ISO datetime strings (from `new Date().toISOString()`)
- The reducer must be a pure function — no side effects, no `localStorage` calls inside it
- `localStorage` persistence happens in the provider via a `useEffect` that watches `state.todos`
- Do not use `any` type anywhere
- `useTodos` must throw `Error('useTodos must be used within a TodoProvider')` when called outside the provider

### Type definitions (exact shape required)
```ts
export type Category = 'office' | 'personal' | 'family';
export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  category: Category;
  workOnDate: string;       // YYYY-MM-DD
  dueDate: string;          // YYYY-MM-DD
  completed: boolean;
  completedAt?: string;     // ISO datetime, set when completed
  createdAt: string;        // ISO datetime
  updatedAt: string;        // ISO datetime
}
```

## Context
This task has no visible UI output — it is pure state infrastructure. The verify tests drive the data layer via Playwright's `page.evaluate()` to call context methods through a globally exposed test handle. Claude Code must expose `window.__TODO_CONTEXT__` in development mode only (`import.meta.env.DEV`) pointing to the `useTodos()` return value, so Playwright tests can call `addTodo`, `deleteTodo`, etc. without a UI.
