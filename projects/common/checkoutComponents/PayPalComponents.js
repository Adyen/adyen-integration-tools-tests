export class PayPalComponents {
  constructor(page) {
    this.page = page;

    this.payPalButton = page
      .frameLocator("iframe[title='PayPal-paypal']").last()
      .locator(".paypal-button").first();
  }

  async proceedToPayPal() {
    await this.payPalButton.waitFor({ state: "visible", timeout: 15000 });
    await this.payPalButton.scrollIntoViewIfNeeded();
    await this.payPalButton.hover();
    await this.payPalButton.click();
  }
}
