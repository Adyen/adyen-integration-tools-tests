export class ThreeDSPaymentPage {
  constructor(page) {
    this.threeDS2UsernameInput = page.locator("#username");
    this.threeDS2PasswordInput = page.locator("#password");
    this.threeDSSubmit = page.locator('input[type="submit"]');
  }

  async validate3DS(username, password) {
    await this.fillThreeDSCredentialsAndSubmit(username, password);
  }

  async fillThreeDSCredentialsAndSubmit(username, password) {
    await this.threeDS2UsernameInput.type(username);
    await this.threeDS2PasswordInput.type(password);
    await this.threeDSSubmit.click();
  }
}
