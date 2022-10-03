export class PayPalComponents {
  constructor(page) {
    this.page = page;

    this.payPalButton = page
      .frameLocator("#payment_form_adyen_hpp_paypal iframe.visible")
      .locator(".paypal-button");
  }

  async proceedToPayPal() {
    /* Immediate click of PayPal button may cause since the iframe
    may take extra time to load, hence this hard wait */
    await new Promise(r => setTimeout(r, 500));
    await this.payPalButton.hover();
    await this.payPalButton.click();
  }
}
