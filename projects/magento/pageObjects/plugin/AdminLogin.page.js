export class AdminLoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator("#username");
    this.passwordInput = page.locator("#password");
    this.loginButton = page.locator("button.action-login");
  }

  async goTo() {
    await this.page.goto("/admin/");
  }

  async login(user) {
    await this.usernameInput.type(user.username);
    await this.passwordInput.type(user.password);

    await this.loginButton.click();
  }
}
