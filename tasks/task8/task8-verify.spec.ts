import { test, expect } from '@playwright/test';

/**
 * task8-verify.spec.ts
 * Verifies the Dashboard search bar: real-time title filtering, clear button, composition with filters.
 */

const TODAY = new Date().toISOString().slice(0, 10);

async function resetState(page: import('@playwright/test').Page) {
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('[data-testid="page-dashboard"]');
}

async function addTodo(
  page: import('@playwright/test').Page,
  title: string,
  category: 'office' | 'personal' | 'family' = 'office'
) {
  await page.getByTestId('add-todo-btn').click();
  await page.waitForSelector('[data-testid="todo-form"]');
  await page.getByTestId('todo-title-input').fill(title);
  await page.getByTestId(`todo-category-${category}`).click();
  await page.getByTestId('todo-work-on-date').fill(TODAY);
  await page.getByTestId('todo-due-date').fill(TODAY);
  await page.getByTestId('todo-form-submit').click();
  await page.waitForSelector('[data-testid="todo-form"]', { state: 'hidden' });
}

test.describe('Task 8: Dashboard Search Bar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await resetState(page);
  });

  // ── Search bar presence ────────────────────────────────────────────────────

  test('search bar is visible on the dashboard', async ({ page }) => {
    await expect(page.getByTestId('search-bar')).toBeVisible();
  });

  test('clear button is hidden when search input is empty', async ({ page }) => {
    await expect(page.getByTestId('search-clear-btn')).not.toBeVisible();
  });

  test('clear button appears when user types in search', async ({ page }) => {
    await page.getByTestId('search-bar').fill('anything');
    await expect(page.getByTestId('search-clear-btn')).toBeVisible();
  });

  // ── Filtering behaviour ────────────────────────────────────────────────────

  test('typing filters todos by title substring (case-insensitive)', async ({ page }) => {
    await addTodo(page, 'Write pitch deck', 'office');
    await addTodo(page, 'Call the investor', 'personal');

    await page.getByTestId('search-bar').fill('pitch');

    await expect(page.getByTestId('todo-card')).toHaveCount(1);
    await expect(page.getByTestId('todo-card-title').first()).toContainText('Write pitch deck');
  });

  test('search is case-insensitive', async ({ page }) => {
    await addTodo(page, 'PITCH deck for Series A', 'office');

    await page.getByTestId('search-bar').fill('pitch');
    await expect(page.getByTestId('todo-card')).toHaveCount(1);
  });

  test('non-matching todos are hidden', async ({ page }) => {
    await addTodo(page, 'Unrelated task', 'office');

    await page.getByTestId('search-bar').fill('zzznomatch');
    await expect(page.getByTestId('todo-card')).toHaveCount(0);
  });

  test('empty search query shows all active todos', async ({ page }) => {
    await addTodo(page, 'Task Alpha', 'office');
    await addTodo(page, 'Task Beta', 'personal');

    await page.getByTestId('search-bar').fill('Alpha');
    await expect(page.getByTestId('todo-card')).toHaveCount(1);

    await page.getByTestId('search-bar').fill('');
    await expect(page.getByTestId('todo-card')).toHaveCount(2);
  });

  test('no-match search shows empty state', async ({ page }) => {
    await addTodo(page, 'Something here', 'office');

    await page.getByTestId('search-bar').fill('zzznomatch');
    await expect(page.getByTestId('todo-list-empty')).toBeVisible();
  });

  // ── Clear button ───────────────────────────────────────────────────────────

  test('clicking clear button resets search and shows all todos', async ({ page }) => {
    await addTodo(page, 'Task One', 'office');
    await addTodo(page, 'Task Two', 'personal');

    await page.getByTestId('search-bar').fill('One');
    await expect(page.getByTestId('todo-card')).toHaveCount(1);

    await page.getByTestId('search-clear-btn').click();
    await expect(page.getByTestId('search-bar')).toHaveValue('');
    await expect(page.getByTestId('todo-card')).toHaveCount(2);
  });

  // ── Composition with category filter ──────────────────────────────────────

  test('search composes with category filter', async ({ page }) => {
    await addTodo(page, 'Office pitch', 'office');
    await addTodo(page, 'Personal pitch', 'personal');
    await addTodo(page, 'Office other', 'office');

    // Activate office category filter first
    await page.getByTestId('filter-office').click();
    await expect(page.getByTestId('todo-card')).toHaveCount(2);

    // Then type "pitch" — should show only office todos matching "pitch"
    await page.getByTestId('search-bar').fill('pitch');
    await expect(page.getByTestId('todo-card')).toHaveCount(1);
    await expect(page.getByTestId('todo-card-title').first()).toContainText('Office pitch');
  });

  test('clearing search while category filter is active restores filtered list', async ({ page }) => {
    await addTodo(page, 'Office A', 'office');
    await addTodo(page, 'Office B', 'office');
    await addTodo(page, 'Personal C', 'personal');

    await page.getByTestId('filter-office').click();
    await page.getByTestId('search-bar').fill('A');
    await expect(page.getByTestId('todo-card')).toHaveCount(1);

    await page.getByTestId('search-clear-btn').click();
    // Back to just office filter — 2 office todos
    await expect(page.getByTestId('todo-card')).toHaveCount(2);
  });
});
