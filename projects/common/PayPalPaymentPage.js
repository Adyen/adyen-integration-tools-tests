export class PayPalPaymentPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator("#email");
    this.passwordInput = page.locator("#password");
    this.loginButton = page.locator("#btnLogin");

    this.agreeAndPayNowButton = page.locator("#payment-submit-btn");
  }

  async loginToPayPal(username, password) {
    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);
    await this.page.loginButton.click();
  }

  async agreeAndPay() {
    await this.agreeAndPayNowButton.click();
  }

  async makeFullPayment(page, username, password) {
    page.on("popup", async (popup) => {
      await popup.waitForLoadState();
      await popup.title();
      await page.context().pages()[1].locator("#email").fill("username");
      // await this.loginToPayPal(username, password);
      // await this.agreeAndPay().click();
    });
  }
}
