export class GooglePayPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator("#username");
    this.nextButton = page.getByRole('button', { name: 'Next' });

    this.passwordInput = page.locator("input[type='password']");

    this.payButton = page.locator(".jfk-button");
  }

  async fillUsername(username) {
    await this.emailInput.click();
    await this.emailInput.type(username);
  }

  async fillPassword(password) {
    await this.passwordInput.click();
    await this.passwordInput.type(password);
  }

  async clickNext(){
    await this.nextButton.click();
  }

  async payWithGoogle(username, password){
    await this.fillUsername(username);
    await this.clickNext();

    await this.fillPassword(password);
    await this.clickNext();

    await this.page.waitForLoadState("networkidle", {timeout:10000});
  }
}
