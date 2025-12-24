import { Page, expect } from '@playwright/test';
import { LoginPageLocators } from './locators/LoginPageLocator.ts';

export class LoginPage {
  constructor(private page: Page) {}

  async gotoLoginPage() {
    await this.page.goto('https://melento.co/login/');
  }

  async login(email: string, password: string) {
    await this.page.fill(LoginPageLocators.emailInput, email);
    await this.page.locator(LoginPageLocators.loginButton).click();

    await this.page.fill(LoginPageLocators.passwordInput, password);
    await this.page.locator(LoginPageLocators.loginButton).click();

    await this.page.waitForTimeout(5000);
    await expect(this.page).toHaveURL(/mplan/);
  }

  async openFirstModule() {
    await this.page.locator(LoginPageLocators.moduleOption).first().click();
  }

}



// import { Page, expect } from '@playwright/test';
// import { LoginPageLocators } from './locators/LoginPageLocator.ts';

// export class LoginPage {
//   constructor(private page: Page) {}

//   async gotoLoginPage() {
//     await this.page.goto('https://melento.co/login/');
  // }

  // async login(email: string, password: string) {
  //   await this.page.fill(LoginPageLocators.emailInput, email);
  //   await this.page.locator(LoginPageLocators.loginButton).click();

  //   await this.page.fill(LoginPageLocators.passwordInput, password);
  //   await this.page.locator(LoginPageLocators.loginButton).click();

  //   await this.page.waitForTimeout(5000);
  //   await expect(this.page).toHaveURL(/mplan/);
  // }


// async openFirstModule() {

//  if(await this.page.locator(LoginPageLocators.hiddenArrow).isVisible())

//  await this.page.locator(LoginPageLocators.hiddenArrow).click()

//  await this.page.locator(LoginPageLocators.moduleOption).first().click();

//  }
 
}

