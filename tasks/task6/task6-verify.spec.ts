import { test, expect } from '@playwright/test';
import { format } from 'date-fns';

/**
 * task6-verify.spec.ts
 * Verifies completed tasks page: complete, archive, restore, delete, filter.
 */

const todayFormatted = format(new Date(), 'yyyy-MM-dd');

async function resetState(page: import('@playwright/test').Page) {
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('[data-testid="page-dashboard"]');
}

async function addTodoViaForm(
  page: import('@playwright/test').Page,
  title: string,
  category: 'office' | 'personal' | 'family' = 'office'
) {
  await page.getByTestId('add-todo-btn').click();
  await page.waitForSelector('[data-testid="todo-form"]');
  await page.getByTestId('todo-title-input').fill(title);
  await page.getByTestId(`todo-category-${category}`).click();
  await page.getByTestId('todo-work-on-date').fill(todayFormatted);
  await page.getByTestId('todo-due-date').fill(todayFormatted);
  await page.getByTestId('todo-form-submit').click();
  await page.waitForSelector('[data-testid="todo-form"]', { state: 'hidden' });
}

test.describe('Task 6: Completed Tasks Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await resetState(page);
  });

  // ── Complete removes from Dashboard ────────────────────────────────────────

  test('marking complete removes card from dashboard', async ({ page }) => {
    await addTodoViaForm(page, 'Finish me', 'office');
    await expect(page.getByTestId('todo-card')).toBeVisible();

    await page.getByTestId('todo-card-complete-btn').click();

    await expect(page.getByTestId('todo-card')).not.toBeVisible();
    await expect(page.getByTestId('todo-list-empty')).toBeVisible();
  });

  // ── Completed page ─────────────────────────────────────────────────────────

  test('completed todo appears on /completed', async ({ page }) => {
    await addTodoViaForm(page, 'Done task', 'personal');
    await page.getByTestId('todo-card-complete-btn').click();

    await page.goto('/completed');
    await expect(page.getByTestId('completed-todo-card')).toBeVisible();
  });

  test('completed card title has line-through class', async ({ page }) => {
    await addTodoViaForm(page, 'Crossed out', 'office');
    await page.getByTestId('todo-card-complete-btn').click();

    await page.goto('/completed');
    const titleEl = page.getByTestId('completed-todo-card').first().locator('[class*="line-through"]');
    await expect(titleEl).toBeVisible();
  });

  test('completed-date label is visible', async ({ page }) => {
    await addTodoViaForm(page, 'Date shown', 'family');
    await page.getByTestId('todo-card-complete-btn').click();

    await page.goto('/completed');
    await expect(page.getByTestId('completed-todo-completed-date')).toBeVisible();
  });

  // ── Restore ────────────────────────────────────────────────────────────────

  test('restoring a todo removes it from /completed', async ({ page }) => {
    await addTodoViaForm(page, 'Restore me', 'office');
    await page.getByTestId('todo-card-complete-btn').click();

    await page.goto('/completed');
    await page.getByTestId('completed-todo-restore-btn').click();

    await expect(page.getByTestId('completed-todo-card')).not.toBeVisible();
    await expect(page.getByTestId('completed-empty-state')).toBeVisible();
  });

  test('restored todo reappears on dashboard as active', async ({ page }) => {
    await addTodoViaForm(page, 'Back to active', 'personal');
    await page.getByTestId('todo-card-complete-btn').click();

    await page.goto('/completed');
    await page.getByTestId('completed-todo-restore-btn').click();

    await page.goto('/');
    await expect(page.getByTestId('todo-card')).toBeVisible();
    await expect(page.getByTestId('todo-card-title')).toContainText('Back to active');
  });

  // ── Delete ─────────────────────────────────────────────────────────────────

  test('delete button shows inline confirmation', async ({ page }) => {
    await addTodoViaForm(page, 'Delete me', 'family');
    await page.getByTestId('todo-card-complete-btn').click();

    await page.goto('/completed');
    await page.getByTestId('completed-todo-delete-btn').click();
    await expect(page.getByTestId('completed-todo-delete-confirm')).toBeVisible();
  });

  test('delete cancel keeps the todo', async ({ page }) => {
    await addTodoViaForm(page, 'Stay alive', 'office');
    await page.getByTestId('todo-card-complete-btn').click();

    await page.goto('/completed');
    await page.getByTestId('completed-todo-delete-btn').click();
    await page.getByTestId('completed-todo-delete-cancel').click();
    await expect(page.getByTestId('completed-todo-card')).toBeVisible();
  });

  test('confirming delete permanently removes the todo', async ({ page }) => {
    await addTodoViaForm(page, 'Gone forever', 'personal');
    await page.getByTestId('todo-card-complete-btn').click();

    await page.goto('/completed');
    await page.getByTestId('completed-todo-delete-btn').click();
    await page.getByTestId('completed-todo-delete-confirm').click();

    await expect(page.getByTestId('completed-todo-card')).not.toBeVisible();
    // Verify localStorage is clean
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('founder_todos') || '[]'));
    expect(stored).toHaveLength(0);
  });

  // ── Filter pills ───────────────────────────────────────────────────────────

  test('filter pills are visible on /completed', async ({ page }) => {
    await page.goto('/completed');
    await expect(page.getByTestId('completed-filter-all')).toBeVisible();
    await expect(page.getByTestId('completed-filter-office')).toBeVisible();
    await expect(page.getByTestId('completed-filter-personal')).toBeVisible();
    await expect(page.getByTestId('completed-filter-family')).toBeVisible();
  });

  test('office filter shows only office completed todos', async ({ page }) => {
    await addTodoViaForm(page, 'Office done', 'office');
    await page.getByTestId('todo-card-complete-btn').click();
    await addTodoViaForm(page, 'Family done', 'family');
    await page.getByTestId('todo-card-complete-btn').click();

    await page.goto('/completed');
    await page.getByTestId('completed-filter-office').click();

    const cards = page.getByTestId('completed-todo-card');
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText('Office done');
  });

  test('All filter shows all completed todos', async ({ page }) => {
    await addTodoViaForm(page, 'Task 1', 'office');
    await page.getByTestId('todo-card-complete-btn').click();
    await addTodoViaForm(page, 'Task 2', 'personal');
    await page.getByTestId('todo-card-complete-btn').click();

    await page.goto('/completed');
    await page.getByTestId('completed-filter-office').click();
    await page.getByTestId('completed-filter-all').click();

    await expect(page.getByTestId('completed-todo-card')).toHaveCount(2);
  });

  test('empty state visible when filtered category has no todos', async ({ page }) => {
    await addTodoViaForm(page, 'Only office', 'office');
    await page.getByTestId('todo-card-complete-btn').click();

    await page.goto('/completed');
    await page.getByTestId('completed-filter-family').click();
    await expect(page.getByTestId('completed-empty-state')).toBeVisible();
  });

  // ── Sort order ─────────────────────────────────────────────────────────────

  test('completed todos sorted most-recently-completed first', async ({ page }) => {
    await addTodoViaForm(page, 'First completed', 'office');
    await page.getByTestId('todo-card-complete-btn').click();
    // Brief delay to ensure different completedAt timestamps
    await page.waitForTimeout(50);
    await addTodoViaForm(page, 'Second completed', 'personal');
    await page.getByTestId('todo-card-complete-btn').click();

    await page.goto('/completed');
    const cards = page.getByTestId('completed-todo-card');
    await expect(cards).toHaveCount(2);
    // Most recently completed (Second) appears first
    await expect(cards.nth(0)).toContainText('Second completed');
    await expect(cards.nth(1)).toContainText('First completed');
  });

  // ── Calendar not polluted ───────────────────────────────────────────────────

  test('completed todo shows no dot on calendar', async ({ page }) => {
    await addTodoViaForm(page, 'No dot for me', 'office');
    await page.getByTestId('todo-card-complete-btn').click();

    await page.goto('/calendar');
    await page.waitForSelector('[data-testid="calendar-grid"]');
    const todayCell = page.getByTestId('calendar-day-today');
    await expect(todayCell.locator('[data-testid="calendar-day-dot"]')).toHaveCount(0);
  });

  // ── End-to-end flow ────────────────────────────────────────────────────────

  test('full flow: add 3 todos, complete 2, verify counts', async ({ page }) => {
    await addTodoViaForm(page, 'Active 1', 'office');
    await addTodoViaForm(page, 'Complete A', 'personal');
    await addTodoViaForm(page, 'Complete B', 'family');

    // Complete the last two (they are first in list due to add order)
    const cards = page.getByTestId('todo-card');
    await cards.nth(0).getByTestId('todo-card-complete-btn').click();
    await cards.nth(0).getByTestId('todo-card-complete-btn').click();

    // Dashboard: 1 active
    await expect(page.getByTestId('todo-card')).toHaveCount(1);

    // Completed: 2
    await page.goto('/completed');
    await expect(page.getByTestId('completed-todo-card')).toHaveCount(2);
  });
});
