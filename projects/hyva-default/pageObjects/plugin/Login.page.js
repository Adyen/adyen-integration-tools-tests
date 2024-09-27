import { TopBar } from "./TopBar.page.js";

export class LoginPage extends TopBar {
  constructor(page) {
    super(page);
    this.page = page;
    this.loginFormContainer = page.locator(".login-container");
    this.loginForm = this.loginFormContainer.locator(".fieldset.login");
    this.emailInput = this.loginForm.locator("#email");
    this.passwordInput = this.loginForm.locator("#password");
    this.loginButton = this.loginForm.locator("button[type='submit']");
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
