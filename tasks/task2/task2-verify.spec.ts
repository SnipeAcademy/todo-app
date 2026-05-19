import { test, expect } from '@playwright/test';

/**
 * task2-verify.spec.ts
 * Verifies the data layer: localStorage service and React context CRUD operations.
 *
 * Strategy: the app exposes window.__TODO_CONTEXT__ in dev mode.
 * Tests drive the data layer via page.evaluate() without a UI.
 */

// Helper: clear localStorage and reload to reset state
async function resetState(page: import('@playwright/test').Page) {
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => typeof (window as any).__TODO_CONTEXT__ !== 'undefined');
}

// Helper: call a context method
async function ctx(page: import('@playwright/test').Page, method: string, ...args: unknown[]) {
  return page.evaluate(
    ([m, a]) => (window as any).__TODO_CONTEXT__[m](...(a as unknown[])),
    [method, args] as [string, unknown[]]
  );
}

// Helper: get current todos from context
async function getTodos(page: import('@playwright/test').Page) {
  return page.evaluate(() => (window as any).__TODO_CONTEXT__.todos as import('../../src/types').Todo[]);
}

test.describe('Task 2: Data Layer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await resetState(page);
  });

  // ── localStorage service ───────────────────────────────────────────────────

  test('load() returns empty array when key is absent', async ({ page }) => {
    const result = await page.evaluate(() => {
      localStorage.removeItem('founder_todos');
      // Re-import via the exposed service if available, else check context state
      return (window as any).__TODO_CONTEXT__.todos;
    });
    expect(result).toEqual([]);
  });

  test('todos persist after page reload', async ({ page }) => {
    await ctx(page, 'addTodo', {
      title: 'Persistent task',
      category: 'office',
      workOnDate: '2026-05-20',
      dueDate: '2026-05-25',
    });

    await page.reload();
    await page.waitForFunction(() => typeof (window as any).__TODO_CONTEXT__ !== 'undefined');

    const todos = await getTodos(page);
    expect(todos).toHaveLength(1);
    expect(todos[0].title).toBe('Persistent task');
  });

  // ── addTodo ────────────────────────────────────────────────────────────────

  test('addTodo adds a todo with correct fields', async ({ page }) => {
    await ctx(page, 'addTodo', {
      title: 'Write pitch deck',
      category: 'office',
      workOnDate: '2026-05-20',
      dueDate: '2026-05-25',
      description: 'For Series A',
    });

    const todos = await getTodos(page);
    expect(todos).toHaveLength(1);

    const todo = todos[0];
    expect(todo.title).toBe('Write pitch deck');
    expect(todo.category).toBe('office');
    expect(todo.workOnDate).toBe('2026-05-20');
    expect(todo.dueDate).toBe('2026-05-25');
    expect(todo.description).toBe('For Series A');
    expect(todo.completed).toBe(false);
    expect(todo.completedAt).toBeUndefined();
    expect(todo.id).toBeTruthy();
    expect(todo.createdAt).toBeTruthy();
    expect(todo.updatedAt).toBeTruthy();
  });

  test('addTodo generates unique IDs for multiple todos', async ({ page }) => {
    await ctx(page, 'addTodo', { title: 'Task A', category: 'office', workOnDate: '2026-05-20', dueDate: '2026-05-20' });
    await ctx(page, 'addTodo', { title: 'Task B', category: 'personal', workOnDate: '2026-05-20', dueDate: '2026-05-20' });

    const todos = await getTodos(page);
    expect(todos).toHaveLength(2);
    expect(todos[0].id).not.toBe(todos[1].id);
  });

  // ── deleteTodo ─────────────────────────────────────────────────────────────

  test('deleteTodo removes the todo by id', async ({ page }) => {
    await ctx(page, 'addTodo', { title: 'To delete', category: 'family', workOnDate: '2026-05-20', dueDate: '2026-05-20' });
    const before = await getTodos(page);
    const id = before[0].id;

    await ctx(page, 'deleteTodo', id);

    const after = await getTodos(page);
    expect(after).toHaveLength(0);
  });

  test('deleteTodo with unknown id does not crash', async ({ page }) => {
    await ctx(page, 'deleteTodo', 'nonexistent-id');
    const todos = await getTodos(page);
    expect(todos).toHaveLength(0); // no crash, still empty
  });

  // ── updateTodo ─────────────────────────────────────────────────────────────

  test('updateTodo replaces matching todo and updates updatedAt', async ({ page }) => {
    await ctx(page, 'addTodo', { title: 'Original', category: 'office', workOnDate: '2026-05-20', dueDate: '2026-05-20' });
    const before = await getTodos(page);
    const original = before[0];

    // Wait 1ms so updatedAt will differ
    await page.waitForTimeout(10);

    await ctx(page, 'updateTodo', { ...original, title: 'Updated' });

    const after = await getTodos(page);
    expect(after).toHaveLength(1);
    expect(after[0].title).toBe('Updated');
    expect(after[0].updatedAt).not.toBe(original.updatedAt);
  });

  // ── toggleComplete ─────────────────────────────────────────────────────────

  test('toggleComplete sets completed=true and sets completedAt', async ({ page }) => {
    await ctx(page, 'addTodo', { title: 'Complete me', category: 'personal', workOnDate: '2026-05-20', dueDate: '2026-05-20' });
    const [todo] = await getTodos(page);

    await ctx(page, 'toggleComplete', todo.id);

    const [updated] = await getTodos(page);
    expect(updated.completed).toBe(true);
    expect(updated.completedAt).toBeTruthy();
  });

  test('toggleComplete a second time sets completed=false and clears completedAt', async ({ page }) => {
    await ctx(page, 'addTodo', { title: 'Toggle twice', category: 'personal', workOnDate: '2026-05-20', dueDate: '2026-05-20' });
    const [todo] = await getTodos(page);

    await ctx(page, 'toggleComplete', todo.id);
    await ctx(page, 'toggleComplete', todo.id);

    const [restored] = await getTodos(page);
    expect(restored.completed).toBe(false);
    expect(restored.completedAt).toBeFalsy();
  });

  // ── TypeScript ─────────────────────────────────────────────────────────────

  test('TypeScript compiles without errors', async () => {
    const { execSync } = require('child_process');
    const result = execSync('npx tsc --noEmit', { encoding: 'utf8', stdio: 'pipe' });
    // If tsc exits non-zero it throws; reaching here means exit 0
    expect(result).toBeDefined();
  });
});
