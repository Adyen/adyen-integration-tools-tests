import { OneyComponents } from "../../../common/checkoutComponents/OneyComponents.js";

export class OneyComponentsMagento extends OneyComponents {
  constructor(page) {
    this.page = page;

    this.activePaymentMethodSection = page.locator(".payment-method._active");
    this.placeOrderButton = this.activePaymentMethodSection.locator(
      "button[type=submit]"
    );
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}
