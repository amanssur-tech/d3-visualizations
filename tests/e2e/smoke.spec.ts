import { test, expect } from '@playwright/test';

test('dashboard loads', async ({ page }) => {
  await page.goto('/');
  // Adjust this if your title is different
  await expect(page).toHaveTitle(/D3 Visualizations/i);
});

test('case studies index is reachable', async ({ page }) => {
  await page.goto('/case-studies');
  // Adjust selector to match your heading text
  await expect(page.getByRole('heading', { name: /case studies/i })).toBeVisible();
});
