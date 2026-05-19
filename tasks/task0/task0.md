# Task 0: Generate CONVENTIONS.md

## Objective
Produce a `CONVENTIONS.md` at the repository root that all subsequent agents (Claude Code and Codex) will receive as context on every task. This file is the single source of truth for naming, structure, tooling, and behaviour rules across the entire project.

## Scope
- Generate `CONVENTIONS.md` with all required sections (see below)
- Commit via Raven — this is the only file touched in this task

## Out of scope
- No source code
- No package installation
- No scaffolding of any kind
- Do not create any file other than `CONVENTIONS.md`

## Acceptance criteria
- [ ] `CONVENTIONS.md` exists at repo root
- [ ] Contains a `## Naming` section
- [ ] Contains a `## Folder structure` section
- [ ] Contains a `## Error handling` section
- [ ] Contains a `## Styling` section (declares Tailwind CSS as the only styling system)
- [ ] Contains a `## Verification tooling` section (declares Playwright + browser_app)
- [ ] Contains a `## Environment contract` section with `setup_command`, `dev_command`, `verify_command`, and `required_env_vars`
- [ ] Contains a `## What Claude Code must never do` section
- [ ] File is valid Markdown (no broken headers, no unclosed code blocks)

## Dependencies
- None — this is the first task

## File and folder targets
- Create: `CONVENTIONS.md` (repo root)
- Do not touch: anything else

## Design constraints
The project is:
- **Stack**: Vite + React 18 + TypeScript + Tailwind CSS v3
- **Routing**: react-router-dom v6
- **Date utility**: date-fns
- **State**: React context + useReducer
- **Storage**: localStorage only (no backend)
- **Testing**: Playwright (browser_app)
- **Language**: TypeScript strict mode

Key naming rules to establish:
- Components: PascalCase, one component per file
- Files: kebab-case for non-component files, PascalCase for component files
- Test IDs: `data-testid` attribute on every interactive and key display element, format `kebab-case`
- Context files: named `{Domain}Context.tsx`
- Types: defined in `src/types/index.ts`

What Claude Code must never do (enumerate clearly):
- Install packages not already in `package.json` without it being explicitly in the task's scope
- Touch files outside the task's `allowed_paths`
- Use inline styles — all styling via Tailwind utility classes
- Mix styling systems (no CSS Modules, no styled-components)
- Use `any` type in TypeScript
- Swallow errors silently (always surface to the user or re-throw)
- Use `waitForTimeout` in Playwright tests

## Context
The pipeline requires `CONVENTIONS.md` to be committed before task 1 starts. Claude Code generates this file because it has full project context at generation time and can write rules that accurately reflect the codebase that is about to be built, rather than generic defaults.

This file will be passed to every subsequent Claude Code and Codex invocation.
