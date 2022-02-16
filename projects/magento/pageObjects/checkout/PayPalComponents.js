export class PayPalComponents {
  constructor(page) {
    this.page = page;

    this.payPalButton = page
      .frameLocator("#payment_form_adyen_hpp_paypal iframe.visible")
      .locator(".paypal-button");
  }

  async proceedToPayPal(page) {
    await this.payPalButton.click();
    const [popup] = await Promise.all([
      // It is important to call waitForEvent before click to set up waiting.
      page.waitForEvent("popup"),

      await page
        .context()
        .pages()[1]
        .locator("#email")
        .fill("sb-absw44928195@personal.example.com"),
      await page.context().pages()[1].locator("#password").fill("t-2LqbUX"),
      await page.context().pages()[1].locator("#payment-submit-btn").click(),
    ]);
  }
}
