# Task 1: Project Scaffold

## Objective
Initialise a Vite + React + TypeScript + Tailwind CSS project with react-router-dom routing, install Playwright for end-to-end testing, and produce the folder skeleton and stub pages that all subsequent tasks will build on.

## Scope
- Run `npm create vite@latest` to scaffold the project
- Install and configure Tailwind CSS v3, react-router-dom, date-fns, and Playwright
- Create the `src/` folder structure with barrel `index.ts` files
- Implement a persistent `<Layout>` component with a top navigation bar
- Create three stub route pages: Dashboard, Calendar, Completed
- Wire up client-side routing via react-router-dom
- Create `playwright.config.ts` with `webServer` pointing to the dev server on port 5173
- Add `data-testid` attributes to every navigation element and page root element

## Out of scope
- No real todo data or business logic (that is task 2)
- No todo UI components (task 3+)
- No priority logic (task 4)
- No calendar grid (task 5)
- No completed-task filtering (task 6)
- Do not create `CONVENTIONS.md` — that was task 0

## Acceptance criteria
- [ ] `npm run dev` starts without errors and serves on port 5173
- [ ] `npx tsc --noEmit` exits 0 (zero TypeScript errors)
- [ ] Navigating to `/` renders an element with `data-testid="page-dashboard"`
- [ ] Navigating to `/calendar` renders an element with `data-testid="page-calendar"`
- [ ] Navigating to `/completed` renders an element with `data-testid="page-completed"`
- [ ] Any unknown route (e.g. `/unknown`) redirects to `/` without a crash
- [ ] Navigation bar is visible on all three routes
- [ ] Nav link `data-testid="nav-dashboard"` is present and navigates to `/`
- [ ] Nav link `data-testid="nav-calendar"` is present and navigates to `/calendar`
- [ ] Nav link `data-testid="nav-completed"` is present and navigates to `/completed`
- [ ] Active nav link has a visually distinct style compared to inactive links (verified by checking for an `aria-current="page"` attribute or a distinct CSS class)
- [ ] At least one Tailwind utility class is applied and rendered in the DOM
- [ ] `playwright.config.ts` exists at repo root with `webServer` config pointing to port 5173

## Dependencies
- task0 must be complete (CONVENTIONS.md committed and approved before this task runs)

## File and folder targets
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `playwright.config.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css` (Tailwind directives only)
- Create: `src/vite-env.d.ts`
- Create: `src/components/Layout.tsx`
- Create: `src/components/index.ts`
- Create: `src/pages/DashboardPage.tsx`
- Create: `src/pages/CalendarPage.tsx`
- Create: `src/pages/CompletedPage.tsx`
- Create: `src/pages/index.ts`
- Create: `src/context/index.ts`
- Create: `src/services/index.ts`
- Create: `src/types/index.ts`
- Create: `src/hooks/index.ts`
- Create: `src/utils/index.ts`
- Do not touch: `CONVENTIONS.md`
- Do not touch: anything under `tasks/`

## Design constraints
- Follow `CONVENTIONS.md` for all naming rules
- Use `NavLink` from react-router-dom for navigation — it provides `aria-current="page"` on the active link automatically
- Use Tailwind utility classes exclusively — no CSS Modules, no inline styles
- Use TypeScript strict mode (already set in tsconfig by Vite's react-ts template)
- `src/index.css` must contain only the three Tailwind directives — no other CSS

### Tailwind configuration
`tailwind.config.js` content field must include:
```js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
```

### Playwright configuration
`playwright.config.ts` must include a `webServer` block:
```ts
webServer: {
  command: 'npm run dev',
  port: 5173,
  reuseExistingServer: !process.env.CI,
  timeout: 30_000,
}
```
And `use.baseURL` set to `'http://localhost:5173'`.

### Dependencies to install
```
npm create vite@latest . -- --template react-ts
npm install
npm install react-router-dom date-fns
npm install -D tailwindcss@3 postcss autoprefixer
npm install -D @playwright/test
npx playwright install --with-deps chromium
npx tailwindcss init -p
```

## Context
This is the foundation task. Every subsequent task builds on the scaffold created here. The stub pages are intentionally minimal — each will be filled in by later tasks. Routing must work before any feature work begins. Playwright must be installed here because the verify runner for every subsequent task uses it.
