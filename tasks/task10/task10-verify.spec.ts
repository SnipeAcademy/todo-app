import { test, expect } from '@playwright/test';

/**
 * task10-verify.spec.ts
 * Verifies the CSV export button: download triggered, correct filename, header row,
 * data rows, quote-escaping, and composition with active filters.
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
  options: {
    category?: 'office' | 'personal' | 'family';
    dueDate?: string;
    description?: string;
  } = {}
) {
  const category = options.category ?? 'office';
  const dueDate = options.dueDate ?? TODAY;

  await page.getByTestId('add-todo-btn').click();
  await page.waitForSelector('[data-testid="todo-form"]');
  await page.getByTestId('todo-title-input').fill(title);
  await page.getByTestId(`todo-category-${category}`).click();
  await page.getByTestId('todo-work-on-date').fill(TODAY);
  await page.getByTestId('todo-due-date').fill(dueDate);
  if (options.description) {
    const descInput = page.getByTestId('todo-description-input');
    if (await descInput.isVisible()) {
      await descInput.fill(options.description);
    }
  }
  await page.getByTestId('todo-form-submit').click();
  await page.waitForSelector('[data-testid="todo-form"]', { state: 'hidden' });
}

async function downloadCsv(page: import('@playwright/test').Page): Promise<string> {
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('export-csv-btn').click();
  const download = await downloadPromise;
  const filePath = await download.path();
  const { readFile } = await import('fs/promises');
  return readFile(filePath!, 'utf8');
}

test.describe('Task 10: CSV Export', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await resetState(page);
  });

  // ── Button presence ────────────────────────────────────────────────────────

  test('export CSV button is visible on the dashboard', async ({ page }) => {
    await expect(page.getByTestId('export-csv-btn')).toBeVisible();
  });

  // ── Download triggers ──────────────────────────────────────────────────────

  test('clicking export triggers a file download', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('export-csv-btn').click();
    const download = await downloadPromise;
    expect(download).toBeTruthy();
  });

  test('downloaded file is named todos.csv', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('export-csv-btn').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('todos.csv');
  });

  // ── CSV content ────────────────────────────────────────────────────────────

  test('CSV has correct header row', async ({ page }) => {
    const csv = await downloadCsv(page);
    const header = csv.split('\n')[0].trim();
    expect(header).toBe('title,category,dueDate,workOnDate,description');
  });

  test('empty list exports header-only CSV without crashing', async ({ page }) => {
    const csv = await downloadCsv(page);
    const lines = csv.trim().split('\n');
    expect(lines).toHaveLength(1); // header only
  });

  test('each todo appears as one data row', async ({ page }) => {
    await addTodo(page, 'Task Alpha', { category: 'office' });
    await addTodo(page, 'Task Beta', { category: 'personal' });

    const csv = await downloadCsv(page);
    const lines = csv.trim().split('\n');
    expect(lines).toHaveLength(3); // header + 2 rows
  });

  test('todo title appears in the CSV', async ({ page }) => {
    await addTodo(page, 'Write investor update', { category: 'office' });

    const csv = await downloadCsv(page);
    expect(csv).toContain('Write investor update');
  });

  test('todo category appears in the CSV', async ({ page }) => {
    await addTodo(page, 'Family errand', { category: 'family' });

    const csv = await downloadCsv(page);
    expect(csv).toContain('family');
  });

  test('todo dueDate appears in the CSV', async ({ page }) => {
    await addTodo(page, 'Dated task', { dueDate: '2026-08-15' });

    const csv = await downloadCsv(page);
    expect(csv).toContain('2026-08-15');
  });

  // ── Quote escaping ─────────────────────────────────────────────────────────

  test('title containing a comma is wrapped in double-quotes', async ({ page }) => {
    await addTodo(page, 'Plan, execute, review', { category: 'office' });

    const csv = await downloadCsv(page);
    expect(csv).toContain('"Plan, execute, review"');
  });

  // ── Export reflects current filter ────────────────────────────────────────

  test('export with active category filter includes only filtered todos', async ({ page }) => {
    await addTodo(page, 'Office task', { category: 'office' });
    await addTodo(page, 'Personal task', { category: 'personal' });

    await page.getByTestId('filter-office').click();
    const csv = await downloadCsv(page);

    expect(csv).toContain('Office task');
    expect(csv).not.toContain('Personal task');
  });

  test('export with active search includes only matching todos', async ({ page }) => {
    await addTodo(page, 'Pitch deck preparation', { category: 'office' });
    await addTodo(page, 'Call accountant', { category: 'office' });

    await page.getByTestId('search-bar').fill('pitch');
    const csv = await downloadCsv(page);

    expect(csv).toContain('Pitch deck preparation');
    expect(csv).not.toContain('Call accountant');
  });
});
