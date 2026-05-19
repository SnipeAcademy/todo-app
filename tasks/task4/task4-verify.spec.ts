import { test, expect } from '@playwright/test';

/**
 * task4-verify.spec.ts
 * Verifies priority badges, weekday/weekend logic, and sort order.
 *
 * Strategy: use page.addInitScript to fix window.Date to a known weekday
 * or weekend before the app loads, ensuring deterministic priority output.
 */

// Monday 2026-05-18 — a weekday
const MOCK_WEEKDAY = new Date('2026-05-18T10:00:00').getTime();
// Saturday 2026-05-16 — a weekend
const MOCK_WEEKEND = new Date('2026-05-16T10:00:00').getTime();

function mockDate(ts: number) {
  return `
    (() => {
      const OrigDate = Date;
      const MOCK_TS = ${ts};
      class MockDate extends OrigDate {
        constructor(...args) {
          if (args.length === 0) { super(MOCK_TS); } else { super(...args); }
        }
        static now() { return MOCK_TS; }
      }
      window.Date = MockDate;
    })();
  `;
}

async function resetState(page: import('@playwright/test').Page) {
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('[data-testid="page-dashboard"]');
}

async function addTodo(
  page: import('@playwright/test').Page,
  title: string,
  category: 'office' | 'personal' | 'family',
  dueDate = '2026-05-25'
) {
  await page.getByTestId('add-todo-btn').click();
  await page.waitForSelector('[data-testid="todo-form"]');
  await page.getByTestId('todo-title-input').fill(title);
  await page.getByTestId(`todo-category-${category}`).click();
  await page.getByTestId('todo-work-on-date').fill('2026-05-18');
  await page.getByTestId('todo-due-date').fill(dueDate);
  await page.getByTestId('todo-form-submit').click();
  await page.waitForSelector('[data-testid="todo-form"]', { state: 'hidden' });
}

test.describe('Task 4: Priority System — Weekday', () => {
  test.use({
    // Mock date BEFORE the app script runs
  });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(mockDate(MOCK_WEEKDAY));
    await page.goto('/');
    await resetState(page);
  });

  test('office todo shows High priority badge on weekday', async ({ page }) => {
    await addTodo(page, 'Office task', 'office');
    const badge = page.getByTestId('priority-badge').first();
    await expect(badge).toContainText('High');
  });

  test('personal todo shows Medium priority badge on weekday', async ({ page }) => {
    await addTodo(page, 'Personal task', 'personal');
    await expect(page.getByTestId('priority-badge').first()).toContainText('Medium');
  });

  test('family todo shows Low priority badge on weekday', async ({ page }) => {
    await addTodo(page, 'Family task', 'family');
    await expect(page.getByTestId('priority-badge').first()).toContainText('Low');
  });

  test('High badge has red class', async ({ page }) => {
    await addTodo(page, 'Office task', 'office');
    const cls = await page.getByTestId('priority-badge').first().getAttribute('class');
    expect(cls).toContain('red');
  });

  test('Medium badge has yellow class', async ({ page }) => {
    await addTodo(page, 'Personal task', 'personal');
    const cls = await page.getByTestId('priority-badge').first().getAttribute('class');
    expect(cls).toContain('yellow');
  });

  test('Low badge has gray class', async ({ page }) => {
    await addTodo(page, 'Family task', 'family');
    const cls = await page.getByTestId('priority-badge').first().getAttribute('class');
    expect(cls).toContain('gray');
  });

  test('mode banner contains "Weekday" on weekday', async ({ page }) => {
    await expect(page.getByTestId('priority-mode-banner')).toContainText(/weekday/i);
  });

  test('weekday sort order: Office → Personal → Family', async ({ page }) => {
    // Add in reverse order so natural order won't pass accidentally
    await addTodo(page, 'Family task', 'family');
    await addTodo(page, 'Personal task', 'personal');
    await addTodo(page, 'Office task', 'office');

    const cards = page.getByTestId('todo-card');
    await expect(cards).toHaveCount(3);

    const firstTitle = await cards.nth(0).getByTestId('todo-card-title').textContent();
    const secondTitle = await cards.nth(1).getByTestId('todo-card-title').textContent();
    const thirdTitle = await cards.nth(2).getByTestId('todo-card-title').textContent();

    expect(firstTitle).toContain('Office task');
    expect(secondTitle).toContain('Personal task');
    expect(thirdTitle).toContain('Family task');
  });
});

test.describe('Task 4: Priority System — Weekend', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(mockDate(MOCK_WEEKEND));
    await page.goto('/');
    await resetState(page);
  });

  test('family todo shows High priority badge on weekend', async ({ page }) => {
    await addTodo(page, 'Family task', 'family');
    await expect(page.getByTestId('priority-badge').first()).toContainText('High');
  });

  test('office todo shows Low priority badge on weekend', async ({ page }) => {
    await addTodo(page, 'Office task', 'office');
    await expect(page.getByTestId('priority-badge').first()).toContainText('Low');
  });

  test('mode banner contains "Weekend" on weekend', async ({ page }) => {
    await expect(page.getByTestId('priority-mode-banner')).toContainText(/weekend/i);
  });

  test('weekend sort order: Family → Personal → Office', async ({ page }) => {
    await addTodo(page, 'Office task', 'office');
    await addTodo(page, 'Personal task', 'personal');
    await addTodo(page, 'Family task', 'family');

    const cards = page.getByTestId('todo-card');
    await expect(cards).toHaveCount(3);

    const first = await cards.nth(0).getByTestId('todo-card-title').textContent();
    const second = await cards.nth(1).getByTestId('todo-card-title').textContent();
    const third = await cards.nth(2).getByTestId('todo-card-title').textContent();

    expect(first).toContain('Family task');
    expect(second).toContain('Personal task');
    expect(third).toContain('Office task');
  });
});

test.describe('Task 4: Sort tiebreaker', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(mockDate(MOCK_WEEKDAY));
    await page.goto('/');
    await resetState(page);
  });

  test('same-priority todos sorted by dueDate ascending', async ({ page }) => {
    // Both office (High on weekday) — different due dates
    await addTodo(page, 'Due later', 'office', '2026-06-01');
    await addTodo(page, 'Due sooner', 'office', '2026-05-20');

    const cards = page.getByTestId('todo-card');
    const first = await cards.nth(0).getByTestId('todo-card-title').textContent();
    expect(first).toContain('Due sooner');
  });
});
