export class PayPalPaymentPage {
  constructor(page) {
    this.page = page;

    this.changeEmailAddressButton = page.locator(".notYouLink");
    this.emailInput = page.locator("#email");
    this.nextButton = page.locator("#btnNext");
    this.passwordInput = page.locator("#password");
    this.loginButton = page.locator("#btnLogin");
    this.agreeAndPayNowButton = page.locator("#payment-submit-btn");
  }

  async loginToPayPal(username, password) {
    /* Disabling this step since the PayPal HPP disabled this step for now
    await this.changeEmailAddressButton.click();
    */
    await this.emailInput.fill(username);
    await this.nextButton.click();
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async agreeAndPay() {
    await this.agreeAndPayNowButton.click();
  }

  async makePayPalPayment(username, password) {
    await this.waitForPopupLoad(this.page);
    await this.loginToPayPal(username, password);
    await this.agreeAndPay();
  }

  async waitForPopupLoad(page) {
    await page.waitForNavigation({
      url: /.*sandbox.paypal.com*/,
      timeout: 10000,
    });
  }
}
