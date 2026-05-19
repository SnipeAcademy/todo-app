import { test, expect } from '@playwright/test';

/**
 * task3-verify.spec.ts
 * Verifies core todo CRUD UI: add, edit, delete, validation, empty state.
 */

async function resetState(page: import('@playwright/test').Page) {
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('[data-testid="page-dashboard"]');
}

async function addTodoViaForm(
  page: import('@playwright/test').Page,
  opts: { title: string; category?: string; workOnDate?: string; dueDate?: string; description?: string }
) {
  const today = new Date().toISOString().split('T')[0];
  const { title, category = 'office', workOnDate = today, dueDate = today, description } = opts;

  await page.getByTestId('add-todo-btn').click();
  await page.waitForSelector('[data-testid="todo-form"]');

  await page.getByTestId('todo-title-input').fill(title);
  if (description) await page.getByTestId('todo-description-input').fill(description);
  await page.getByTestId(`todo-category-${category}`).click();
  await page.getByTestId('todo-work-on-date').fill(workOnDate);
  await page.getByTestId('todo-due-date').fill(dueDate);
  await page.getByTestId('todo-form-submit').click();
}

test.describe('Task 3: Core CRUD UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await resetState(page);
  });

  // ── Empty state ────────────────────────────────────────────────────────────

  test('empty state is visible when no todos exist', async ({ page }) => {
    await expect(page.getByTestId('todo-list-empty')).toBeVisible();
  });

  test('add-todo-btn is visible on the dashboard', async ({ page }) => {
    await expect(page.getByTestId('add-todo-btn')).toBeVisible();
  });

  // ── Modal open/close ───────────────────────────────────────────────────────

  test('clicking add-todo-btn opens the todo form modal', async ({ page }) => {
    await page.getByTestId('add-todo-btn').click();
    await expect(page.getByTestId('todo-form')).toBeVisible();
  });

  test('pressing Escape closes the modal without saving', async ({ page }) => {
    await page.getByTestId('add-todo-btn').click();
    await page.getByTestId('todo-title-input').fill('Should not save');
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('todo-form')).not.toBeVisible();
    await expect(page.getByTestId('todo-list-empty')).toBeVisible();
  });

  test('clicking the form cancel button closes the modal', async ({ page }) => {
    await page.getByTestId('add-todo-btn').click();
    await page.getByTestId('todo-form-cancel').click();
    await expect(page.getByTestId('todo-form')).not.toBeVisible();
  });

  // ── Validation ─────────────────────────────────────────────────────────────

  test('submitting with empty title shows title error and keeps modal open', async ({ page }) => {
    await page.getByTestId('add-todo-btn').click();
    await page.getByTestId('todo-form-submit').click();
    await expect(page.getByTestId('todo-title-error')).toBeVisible();
    await expect(page.getByTestId('todo-form')).toBeVisible();
  });

  test('submitting with due date before work-on date shows due date error', async ({ page }) => {
    await page.getByTestId('add-todo-btn').click();
    await page.getByTestId('todo-title-input').fill('Date error test');
    await page.getByTestId('todo-category-office').click();
    await page.getByTestId('todo-work-on-date').fill('2026-05-20');
    await page.getByTestId('todo-due-date').fill('2026-05-19'); // earlier than work-on
    await page.getByTestId('todo-form-submit').click();
    await expect(page.getByTestId('todo-due-date-error')).toBeVisible();
    await expect(page.getByTestId('todo-form')).toBeVisible();
  });

  // ── Create ─────────────────────────────────────────────────────────────────

  test('valid form submission closes modal and shows the card', async ({ page }) => {
    await addTodoViaForm(page, { title: 'Write investor update', category: 'office' });
    await expect(page.getByTestId('todo-form')).not.toBeVisible();
    await expect(page.getByTestId('todo-card')).toBeVisible();
  });

  test('card shows correct title', async ({ page }) => {
    await addTodoViaForm(page, { title: 'My first task', category: 'personal' });
    await expect(page.getByTestId('todo-card-title')).toContainText('My first task');
  });

  test('office category badge contains "blue" class', async ({ page }) => {
    await addTodoViaForm(page, { title: 'Office task', category: 'office' });
    const badge = page.getByTestId('todo-card-category-badge');
    const cls = await badge.getAttribute('class');
    expect(cls).toContain('blue');
  });

  test('personal category badge contains "green" class', async ({ page }) => {
    await addTodoViaForm(page, { title: 'Personal task', category: 'personal' });
    const badge = page.getByTestId('todo-card-category-badge');
    const cls = await badge.getAttribute('class');
    expect(cls).toContain('green');
  });

  test('family category badge contains "purple" class', async ({ page }) => {
    await addTodoViaForm(page, { title: 'Family task', category: 'family' });
    const badge = page.getByTestId('todo-card-category-badge');
    const cls = await badge.getAttribute('class');
    expect(cls).toContain('purple');
  });

  test('empty state disappears after adding a todo', async ({ page }) => {
    await addTodoViaForm(page, { title: 'Not empty anymore' });
    await expect(page.getByTestId('todo-list-empty')).not.toBeVisible();
  });

  // ── Persist ────────────────────────────────────────────────────────────────

  test('todos persist after page reload', async ({ page }) => {
    await addTodoViaForm(page, { title: 'Persist me', category: 'family' });
    await page.reload();
    await page.waitForSelector('[data-testid="page-dashboard"]');
    await expect(page.getByTestId('todo-card')).toBeVisible();
    await expect(page.getByTestId('todo-card-title')).toContainText('Persist me');
  });

  // ── Edit ───────────────────────────────────────────────────────────────────

  test('clicking edit opens the form pre-populated', async ({ page }) => {
    await addTodoViaForm(page, { title: 'Before edit', category: 'office' });
    await page.getByTestId('todo-card-edit-btn').click();
    await expect(page.getByTestId('todo-form')).toBeVisible();
    await expect(page.getByTestId('todo-title-input')).toHaveValue('Before edit');
  });

  test('saving an edit updates the card title', async ({ page }) => {
    await addTodoViaForm(page, { title: 'Old title', category: 'personal' });
    await page.getByTestId('todo-card-edit-btn').click();
    await page.getByTestId('todo-title-input').fill('New title');
    await page.getByTestId('todo-form-submit').click();
    await expect(page.getByTestId('todo-card-title')).toContainText('New title');
  });

  // ── Delete ─────────────────────────────────────────────────────────────────

  test('clicking delete shows inline confirmation', async ({ page }) => {
    await addTodoViaForm(page, { title: 'Delete candidate' });
    await page.getByTestId('todo-card-delete-btn').click();
    await expect(page.getByTestId('todo-card-delete-confirm')).toBeVisible();
  });

  test('clicking cancel on delete dismisses confirmation without deleting', async ({ page }) => {
    await addTodoViaForm(page, { title: 'Keep me' });
    await page.getByTestId('todo-card-delete-btn').click();
    await page.getByTestId('todo-card-delete-cancel').click();
    await expect(page.getByTestId('todo-card')).toBeVisible();
    await expect(page.getByTestId('todo-card-title')).toContainText('Keep me');
  });

  test('confirming delete removes the card from the list', async ({ page }) => {
    await addTodoViaForm(page, { title: 'Remove me' });
    await page.getByTestId('todo-card-delete-btn').click();
    await page.getByTestId('todo-card-delete-confirm').click();
    await expect(page.getByTestId('todo-card')).not.toBeVisible();
    await expect(page.getByTestId('todo-list-empty')).toBeVisible();
  });

  // ── Mark complete ──────────────────────────────────────────────────────────

  test('mark complete button is visible on a card', async ({ page }) => {
    await addTodoViaForm(page, { title: 'Complete me' });
    await expect(page.getByTestId('todo-card-complete-btn')).toBeVisible();
  });
});
