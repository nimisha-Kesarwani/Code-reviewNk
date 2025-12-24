import { expect, Page } from '@playwright/test';
import { ChatPageLocators } from './locators/ChatPageLocator.ts';
import { hoverUntilVisible } from './utils';


export class ChatPage {
  readonly page: Page;
  private movedToSidebar: string[] = [];

  constructor(page: Page) {
    this.page = page;
  }

  async resetAllChats() {
  const allMinimizeBtns = this.page.locator(ChatPageLocators.allMinimizeBtns);
  const count = await allMinimizeBtns.count();
  if (count === 0) return;
  await Promise.all(
    Array.from({ length: count }, (_, i) =>
      allMinimizeBtns.nth(i).click().catch(() => null)
    )
  );
}


  async pickRandomRoom(exclude: string[] = []): Promise<string> {
    const rooms = this.page.locator(ChatPageLocators.roomCards);
    const count = await rooms.count();
    if (count === 0) throw new Error('No rooms available to pick');

    for (let attempt = 0; attempt < count * 2; attempt++) {
      const idx = Math.floor(Math.random() * count);
      const room = rooms.nth(idx);

      await room.waitFor({ state: 'visible', timeout: 3000 }).catch(() => null);
      if (!(await room.isVisible())) continue;

      const nameSpan = room.locator(ChatPageLocators.roomNameSpans);
      if (!(await nameSpan.isVisible())) continue;

      let pickedText = (await nameSpan.innerText()).trim();
      if (pickedText.startsWith('#')) {
        pickedText = pickedText.replace(/^#/, '').trim();
      }

      if (!pickedText || exclude.includes(pickedText)) continue;

      await room.scrollIntoViewIfNeeded();
      await room.click({ force: true });
      await this.page.waitForTimeout(500);

      return pickedText;
    }

    throw new Error('Could not find a new room to open');
  }

  async getMiniChatTitles(): Promise<string[]> {
    const miniChats = this.page.locator(ChatPageLocators.miniChats);
    const count = await miniChats.count();
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = (await miniChats.nth(i).innerText()).trim();
      if (text) titles.push(text);
    }
    return titles;
  }

 async getSidebarTitles(): Promise<string[]> {
  const chatItems = this.page.locator(ChatPageLocators.sidebarChatItems);
  await chatItems.first().waitFor({ state: "visible", timeout: 3000 }).catch(() => {});
  const titles = await chatItems.allTextContents();
  return [...new Set(
    titles.map(t => t.replace(/^#/, '').trim()).filter(Boolean)
  )];
}


  trackMovedToSidebar(openedRooms: string[]): string[] {
    const MAX_MINI_TRAY = 3;
    this.movedToSidebar =
      openedRooms.length > MAX_MINI_TRAY
        ? openedRooms.slice(0, openedRooms.length - MAX_MINI_TRAY)
        : [];
    return this.movedToSidebar;
  }

  getMovedChats(): string[] {
    return this.movedToSidebar;
  }

  // async openDropdownAndExpandSidebar() {
  //   const trayContainer = this.page.locator(ChatPageLocators.trayContainer);
  //   await trayContainer.hover();
  //   await this.page.waitForTimeout(500);

  //   const arrow = this.page.locator(ChatPageLocators.hiddenArrow);
  //   await arrow.waitFor({ state: 'attached', timeout: 5000 });
  //   await arrow.click({ force: true });
  //   await this.page.waitForTimeout(500);
  // }

  // async openSidebarFromTray() {
  //   const cornerHover = this.page.locator(ChatPageLocators.cornerHover);
  //   await cornerHover.hover();
  //   await cornerHover.waitFor({ state: 'visible', timeout: 5000 });
  //   await cornerHover.click();
  //   await this.page.waitForTimeout(500);
  // }

async openDropdownAndExpandSidebar() {
    const arrow = await hoverUntilVisible(
      this.page,
      ChatPageLocators.trayContainer,
      ChatPageLocators.hiddenArrow
    );

    await expect(arrow).toBeVisible({ timeout: 5000 });
    await arrow.click();
    await this.page.waitForTimeout(500);
  }

  async openSidebarFromTray() {
    const corner = await hoverUntilVisible(
      this.page,
      ChatPageLocators.cornerHover,
      ChatPageLocators.cornerHover
    );
     await expect(corner).toBeVisible({ timeout: 5000 });
    await corner.click();
    await this.page.waitForTimeout(500);
  }

  async minimizeCurrentChat(openedCount: number) {
    if (openedCount >= 4) {
      await this.openDropdownAndExpandSidebar();
    }

    const minimizeBtn = this.page.locator(ChatPageLocators.firstMinimizeBtn);
    await minimizeBtn.waitFor({ state: 'visible', timeout: 5000 });
    await minimizeBtn.click();
    await this.page.waitForTimeout(500);
  }


  async getAllChatTitles(): Promise<string[]> {
    const rooms = this.page.locator(ChatPageLocators.roomCards);
    const count = await rooms.count();
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      const textSpan = rooms.nth(i).locator(ChatPageLocators.roomNameSpans);
      await textSpan.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});
      const text = (await textSpan.innerText()).trim();
      if (text) titles.push(text);
    }
    return titles;
  }
}






