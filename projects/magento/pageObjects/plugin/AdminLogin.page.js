export class AdminLoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator("#username");
    this.passwordInput = page.locator("#login");
    this.loginButton = page.locator("button.action-login");
  }

  async goTo() {
    await this.page.goto("/admin");
  }

  async login(user) {
    await this.usernameInput.fill(user.username);
    await this.passwordInput.fill(user.password);
    await this.loginButton.click();
  }
}
