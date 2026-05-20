# CONVENTIONS.md

This file is the single source of truth for naming, structure, tooling, and behaviour rules across the entire project. It is passed as context to every Claude Code and Codex invocation.

---

## Naming

- **Components**: PascalCase, one component per file.
- **Files**: `kebab-case` for non-component files, `PascalCase` for component files.
- **Test IDs**: `data-testid` attribute on every interactive and key display element, formatted as `kebab-case`.
- **Context files**: Named `{Domain}Context.tsx`.
- **Types**: Defined in `src/types/index.ts`.

## Folder structure

```
todo-app/
├── src/
│   ├── components/        # Reusable UI components (PascalCase files)
│   ├── context/           # React context providers ({Domain}Context.tsx)
│   ├── hooks/             # Custom React hooks (useFoo.ts)
│   ├── types/             # TypeScript type definitions (index.ts)
│   ├── utils/             # Pure utility functions (kebab-case)
│   ├── App.tsx            # Root application component
│   └── main.tsx           # Entry point
├── tests/                 # Playwright end-to-end tests
├── tasks/                 # Task definitions and verification scripts
├── public/                # Static assets
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── CONVENTIONS.md
```

## Error handling

- Never swallow errors silently — always surface to the user or re-throw.
- Use `try/catch` blocks around async operations with meaningful error messages.
- Display user-facing errors in the UI; log developer-facing errors to console.
- Do not use empty `catch {}` blocks.

## Styling

- **Tailwind CSS v3** is the only styling system.
- No inline styles (`style={}` prop is forbidden).
- No CSS Modules, no styled-components, no emotion, no other CSS-in-JS libraries.
- Use Tailwind utility classes exclusively. Prefer composition over custom CSS.
- When Tailwind utility classes are insufficient, use `@apply` in a CSS file — never fall back to inline styles.

## Verification tooling

- **Playwright** is the testing framework for end-to-end verification.
- Tests use the `browser_app` protocol for browser automation.
- Every interactive element and key display element must have a `data-testid` attribute.
- Playwright tests must use explicit waits on element state (e.g., `locator.isEnabled()`, `locator.isVisible()`), never `waitForTimeout`.

## Environment contract

```json
{
  "setup_command": "npm install",
  "dev_command": "npm run dev",
  "verify_command": "npx playwright test",
  "required_env_vars": []
}
```

### Stack

| Layer        | Technology                  |
|-------------|-----------------------------|
| Build       | Vite                        |
| Framework   | React 18                    |
| Language    | TypeScript (strict mode)    |
| Routing     | react-router-dom v6         |
| Styling     | Tailwind CSS v3             |
| Dates       | date-fns                    |
| State       | React context + useReducer   |
| Storage     | localStorage only (no backend) |
| Testing     | Playwright                   |

## What Claude Code must never do

1. **Install packages** not already declared in `package.json` unless the task's scope explicitly requires it.
2. **Touch files** outside the task's declared `allowed_paths`.
3. **Use inline styles** — all styling must go through Tailwind utility classes.
4. **Mix styling systems** — no CSS Modules, no styled-components, no other CSS-in-JS.
5. **Use the `any` type** in TypeScript — always define proper types or use `unknown`.
6. **Swallow errors silently** — always surface to the user or re-throw.
7. **Use `waitForTimeout`** in Playwright tests — use explicit waits on element state instead.
