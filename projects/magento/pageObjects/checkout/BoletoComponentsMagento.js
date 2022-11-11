import { BoletoComponents } from "../../../common/checkoutComponents/BoletoComponents.js";

export class BoletoComponentsMagento extends BoletoComponents {
  constructor(page) {
    super(page);
    this.page = page;

    this.placeOrderButton = page.locator(
      ".payment-method._active button[type=submit]"
    );
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}
