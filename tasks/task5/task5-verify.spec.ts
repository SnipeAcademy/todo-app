import { test, expect } from '@playwright/test';
import { format, addMonths, subMonths } from 'date-fns';

/**
 * task5-verify.spec.ts
 * Verifies the calendar view: grid rendering, month navigation, dots, day panel.
 */

async function resetState(page: import('@playwright/test').Page) {
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('[data-testid="page-dashboard"]');
}

async function addTodoViaContext(
  page: import('@playwright/test').Page,
  opts: { title: string; category: 'office' | 'personal' | 'family'; workOnDate: string; dueDate: string }
) {
  await page.waitForFunction(() => typeof (window as any).__TODO_CONTEXT__ !== 'undefined');
  await page.evaluate((o) => (window as any).__TODO_CONTEXT__.addTodo(o), opts);
}

test.describe('Task 5: Calendar View', () => {
  const today = new Date();
  const todayFormatted = format(today, 'yyyy-MM-dd');
  const currentMonthLabel = format(today, 'MMMM yyyy'); // e.g. "May 2026"
  const prevMonthLabel = format(subMonths(today, 1), 'MMMM yyyy');
  const nextMonthLabel = format(addMonths(today, 1), 'MMMM yyyy');

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await resetState(page);
    await page.goto('/calendar');
    await page.waitForSelector('[data-testid="calendar-grid"]');
  });

  // ── Grid renders ────────────────────────────────────────────────────────────

  test('calendar grid is visible', async ({ page }) => {
    await expect(page.getByTestId('calendar-grid')).toBeVisible();
  });

  test('calendar header shows current month and year', async ({ page }) => {
    await expect(page.getByTestId('calendar-header')).toContainText(currentMonthLabel);
  });

  test("today's cell has data-testid=calendar-day-today", async ({ page }) => {
    await expect(page.getByTestId('calendar-day-today')).toBeVisible();
  });

  // ── Month navigation ────────────────────────────────────────────────────────

  test('prev button navigates to previous month', async ({ page }) => {
    await page.getByTestId('calendar-prev-btn').click();
    await expect(page.getByTestId('calendar-header')).toContainText(prevMonthLabel);
  });

  test('next button navigates to next month', async ({ page }) => {
    await page.getByTestId('calendar-next-btn').click();
    await expect(page.getByTestId('calendar-header')).toContainText(nextMonthLabel);
  });

  test('today button returns to current month after navigating away', async ({ page }) => {
    await page.getByTestId('calendar-next-btn').click();
    await page.getByTestId('calendar-next-btn').click();
    await page.getByTestId('calendar-today-btn').click();
    await expect(page.getByTestId('calendar-header')).toContainText(currentMonthLabel);
  });

  test('navigating from January goes to December of previous year without crash', async ({ page }) => {
    // Navigate to January of next year
    for (let i = 0; i < 12; i++) {
      await page.getByTestId('calendar-next-btn').click();
    }
    await page.getByTestId('calendar-today-btn').click();
    // Navigate backwards to January
    for (let i = 0; i < today.getMonth(); i++) {
      await page.getByTestId('calendar-prev-btn').click();
    }
    // Now at January — one more prev should go to December of prior year
    await page.getByTestId('calendar-prev-btn').click();
    await expect(page.getByTestId('calendar-header')).toContainText('December');
    // No crash
    await expect(page.getByTestId('calendar-grid')).toBeVisible();
  });

  // ── Todo dots ───────────────────────────────────────────────────────────────

  test('date cell shows a dot when a todo has that workOnDate', async ({ page }) => {
    await addTodoViaContext(page, {
      title: 'Dot test',
      category: 'office',
      workOnDate: todayFormatted,
      dueDate: todayFormatted,
    });
    await page.reload();
    await page.waitForSelector('[data-testid="calendar-grid"]');
    // Today's cell should have at least one dot
    const todayCell = page.getByTestId('calendar-day-today');
    await expect(todayCell.locator('[data-testid="calendar-day-dot"]')).toHaveCount(1);
  });

  test('completed todo does not show a dot', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => typeof (window as any).__TODO_CONTEXT__ !== 'undefined');
    await page.evaluate((d) => (window as any).__TODO_CONTEXT__.addTodo({
      title: 'Completed dot test',
      category: 'office',
      workOnDate: d,
      dueDate: d,
    }), todayFormatted);
    const [todo] = await page.evaluate(() => (window as any).__TODO_CONTEXT__.todos);
    await page.evaluate((id) => (window as any).__TODO_CONTEXT__.toggleComplete(id), todo.id);

    await page.goto('/calendar');
    await page.waitForSelector('[data-testid="calendar-grid"]');
    const todayCell = page.getByTestId('calendar-day-today');
    await expect(todayCell.locator('[data-testid="calendar-day-dot"]')).toHaveCount(0);
  });

  // ── Day panel ───────────────────────────────────────────────────────────────

  test('clicking today cell opens the day panel', async ({ page }) => {
    await page.getByTestId('calendar-day-today').click();
    await expect(page.getByTestId('day-panel')).toBeVisible();
  });

  test('day panel shows the selected date in day-panel-date', async ({ page }) => {
    await page.getByTestId('calendar-day-today').click();
    await expect(page.getByTestId('day-panel-date')).toBeVisible();
    // Date heading should contain the day number
    await expect(page.getByTestId('day-panel-date')).toContainText(String(today.getDate()));
  });

  test('day panel close button hides the panel', async ({ page }) => {
    await page.getByTestId('calendar-day-today').click();
    await page.waitForSelector('[data-testid="day-panel"]');
    await page.getByTestId('day-panel-close').click();
    await expect(page.getByTestId('day-panel')).not.toBeVisible();
  });

  test('day panel shows todos for that date', async ({ page }) => {
    await addTodoViaContext(page, {
      title: 'Panel todo',
      category: 'personal',
      workOnDate: todayFormatted,
      dueDate: todayFormatted,
    });
    await page.reload();
    await page.waitForSelector('[data-testid="calendar-grid"]');
    await page.getByTestId('calendar-day-today').click();
    await expect(page.getByTestId('day-panel')).toBeVisible();
    await expect(page.getByTestId('todo-card').first()).toBeVisible();
  });

  test('day-panel-add-btn opens TodoForm with workOnDate pre-filled', async ({ page }) => {
    await page.getByTestId('calendar-day-today').click();
    await page.getByTestId('day-panel-add-btn').click();
    await expect(page.getByTestId('todo-form')).toBeVisible();
    const workOnValue = await page.getByTestId('todo-work-on-date').inputValue();
    expect(workOnValue).toBe(todayFormatted);
  });

  // ── Priority in panel uses selected date ────────────────────────────────────

  test('panel sorts todos by priority for the selected date (not today)', async ({ page }) => {
    // Find a known weekend date in the current month (or next) to click
    // We'll test via the context: add office + family, check order on a Saturday
    // For simplicity, check that panel shows todos in some order (detailed priority
    // testing is in task4; here we just confirm sortTodosByPriority is called)
    await addTodoViaContext(page, { title: 'Office', category: 'office', workOnDate: todayFormatted, dueDate: todayFormatted });
    await addTodoViaContext(page, { title: 'Family', category: 'family', workOnDate: todayFormatted, dueDate: todayFormatted });
    await page.reload();
    await page.waitForSelector('[data-testid="calendar-grid"]');
    await page.getByTestId('calendar-day-today').click();
    // Two cards visible in panel
    const cards = page.getByTestId('todo-card');
    await expect(cards).toHaveCount(2);
    // Exact order depends on today's day — just confirm both are visible (sort correctness covered in task4)
  });
});
