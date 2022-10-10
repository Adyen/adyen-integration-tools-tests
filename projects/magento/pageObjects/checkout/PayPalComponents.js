export class PayPalComponents {
  constructor(page) {
    this.page = page;

    this.payPalButton = page
      .frameLocator("#payment_form_adyen_hpp_paypal iframe.visible")
      .locator(".paypal-button");
  }

  async proceedToPayPal() {
    // The iframe which contains PayPal button may require extra time to load
    await new Promise(r => setTimeout(r, 500));
    await this.payPalButton.hover();
    await this.payPalButton.click();
  }
}
