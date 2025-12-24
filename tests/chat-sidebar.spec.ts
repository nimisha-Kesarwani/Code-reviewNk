import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ChatPage } from '../pages/ChatPage';

test("validating sidebar logic with 7 opened chats", async ({ page }) => {
  const chatPage = new ChatPage(page);
  const loginPage = new LoginPage(page);


  const email = process.env.TEST_EMAIL as 0000000000000;
  const password = process.env.TEST_PASSWORD as string;
  //  await page.pause();                                       
  await loginPage.gotoLoginPage();
  await loginPage.login(email, password);

  await loginPage.openFirstModule();
    // await loginPage.openMReachModule();

  await chatPage.resetAllChats();
  const MINI_TRAY_CAPACITY = 3;
  await page.waitForTimeout(2000);
  const openedRooms: string[] = [];
  const sidebarHistory: string[][] = [];

  for (let i = 1; i <= 7; i++) {
    if (i > MINI_TRAY_CAPACITY) {
      await chatPage.openDropdownAndExpandSidebar();
    }
    const title = await chatPage.pickRandomRoom(openedRooms);
    openedRooms.push(title);
    await chatPage.minimizeCurrentChat(i);
    const sidebar = await chatPage.getSidebarTitles();
    sidebarHistory.push(sidebar);
    if (i > MINI_TRAY_CAPACITY) {
      const justMovedChat = openedRooms[i - MINI_TRAY_CAPACITY - 1];
      expect(sidebar.some(s => s.includes(justMovedChat))).toBe(true);
      if (i === 7) {
        const firstChat = openedRooms[0];
        expect(sidebar.some(s => s.includes(firstChat))).toBe(false);
      }
    }
  }

  console.log("Final opened rooms:", openedRooms);
  console.log("Sidebar snapshots:", sidebarHistory);
});




