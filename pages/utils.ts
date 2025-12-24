import { Page } from '@playwright/test';

export async function hoverUntilVisible(
  page: Page,
  hoverLocator: string,
  targetLocator: string,
  retries = 5
) {
  const hoverEl = page.locator(hoverLocator);
  const targetEl = page.locator(targetLocator);

  for (let i = 0; i < retries; i++) {
    await hoverEl.scrollIntoViewIfNeeded();
    await hoverEl.hover();
    if (await targetEl.isVisible()) return targetEl;
    await page.waitForTimeout(300);
  }

  throw new Error(`Element ${targetLocator} not visible after ${retries} hovers`);
}
