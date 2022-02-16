export class PayPalComponents {
  constructor(page) {
    this.page = page;

    this.payPalButton = page
      .frameLocator("#payment_form_adyen_hpp_paypal iframe.visible")
      .locator(".paypal-button");
  }

  async proceedToPayPal() {
    await this.payPalButton.click();
  }
}
