import { test, expect } from '@playwright/test';

/**
 * task7-verify.spec.ts
 * Verifies the overdue indicator: badge on TodoCard and Overdue filter pill on Dashboard.
 */

const TODAY = new Date().toISOString().slice(0, 10);
const PAST_DATE = '2026-01-01'; // always in the past relative to any test run after Jan 2026
const FUTURE_DATE = '2099-12-31';

async function resetState(page: import('@playwright/test').Page) {
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('[data-testid="page-dashboard"]');
}

async function addTodo(
  page: import('@playwright/test').Page,
  title: string,
  category: 'office' | 'personal' | 'family' = 'office',
  dueDate: string = TODAY
) {
  await page.getByTestId('add-todo-btn').click();
  await page.waitForSelector('[data-testid="todo-form"]');
  await page.getByTestId('todo-title-input').fill(title);
  await page.getByTestId(`todo-category-${category}`).click();
  await page.getByTestId('todo-work-on-date').fill(TODAY);
  await page.getByTestId('todo-due-date').fill(dueDate);
  await page.getByTestId('todo-form-submit').click();
  await page.waitForSelector('[data-testid="todo-form"]', { state: 'hidden' });
}

test.describe('Task 7: Overdue Indicator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await resetState(page);
  });

  // ── Overdue badge on card ──────────────────────────────────────────────────

  test('overdue todo shows overdue badge', async ({ page }) => {
    await addTodo(page, 'Past due task', 'office', PAST_DATE);
    await expect(page.getByTestId('todo-card-overdue-badge')).toBeVisible();
  });

  test('non-overdue todo does not show overdue badge', async ({ page }) => {
    await addTodo(page, 'Future task', 'office', FUTURE_DATE);
    await expect(page.getByTestId('todo-card-overdue-badge')).not.toBeVisible();
  });

  test('todo due today does not show overdue badge', async ({ page }) => {
    await addTodo(page, 'Due today task', 'personal', TODAY);
    await expect(page.getByTestId('todo-card-overdue-badge')).not.toBeVisible();
  });

  test('completed todo has no overdue badge visible on dashboard', async ({ page }) => {
    await addTodo(page, 'Complete this overdue', 'office', PAST_DATE);
    await page.getByTestId('todo-card-complete-btn').click();
    // Card is gone from dashboard; badge must not be present
    await expect(page.getByTestId('todo-card-overdue-badge')).not.toBeVisible();
  });

  // ── Red visual treatment ───────────────────────────────────────────────────

  test('overdue card has red visual treatment', async ({ page }) => {
    await addTodo(page, 'Red ring task', 'family', PAST_DATE);
    const card = page.getByTestId('todo-card').first();
    // Card must have a class containing 'red' for the ring/border treatment
    const className = await card.getAttribute('class');
    expect(className).toMatch(/red/);
  });

  // ── Overdue filter pill ───────────────────────────────────────────────────

  test('overdue filter pill is visible on dashboard', async ({ page }) => {
    await expect(page.getByTestId('filter-overdue')).toBeVisible();
  });

  test('overdue filter shows only overdue todos', async ({ page }) => {
    await addTodo(page, 'Overdue A', 'office', PAST_DATE);
    await addTodo(page, 'On-time B', 'personal', FUTURE_DATE);

    await page.getByTestId('filter-overdue').click();

    const cards = page.getByTestId('todo-card');
    await expect(cards).toHaveCount(1);
    await expect(page.getByTestId('todo-card-title').first()).toContainText('Overdue A');
  });

  test('overdue filter hides non-overdue todos', async ({ page }) => {
    await addTodo(page, 'Not overdue', 'office', FUTURE_DATE);

    await page.getByTestId('filter-overdue').click();

    await expect(page.getByTestId('todo-card')).toHaveCount(0);
  });

  test('switching from overdue filter to all restores full list', async ({ page }) => {
    await addTodo(page, 'Overdue one', 'office', PAST_DATE);
    await addTodo(page, 'Future one', 'personal', FUTURE_DATE);

    await page.getByTestId('filter-overdue').click();
    await expect(page.getByTestId('todo-card')).toHaveCount(1);

    await page.getByTestId('filter-all').click();
    await expect(page.getByTestId('todo-card')).toHaveCount(2);
  });

  test('overdue filter across categories: only overdue from all categories', async ({ page }) => {
    await addTodo(page, 'Overdue office', 'office', PAST_DATE);
    await addTodo(page, 'Overdue personal', 'personal', PAST_DATE);
    await addTodo(page, 'Fine family', 'family', FUTURE_DATE);

    await page.getByTestId('filter-overdue').click();

    await expect(page.getByTestId('todo-card')).toHaveCount(2);
  });
});
