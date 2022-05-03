import { TopBar } from "./TopBar.page";

export class LoginPage extends TopBar {
  constructor(page) {
    super(page);
    this.page = page;
    this.loginForm = page.locator(".fieldset.login");
    this.emailInput = this.loginForm.locator("#email");
    this.passwordInput = this.loginForm.locator("#pass");
    this.loginButton = this.loginForm.locator("#send2");
  }

  async goTo() {
    await this.page.goto("/customer/account/login");
  }

  async login(user) {
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.loginButton.click();
  }
}
