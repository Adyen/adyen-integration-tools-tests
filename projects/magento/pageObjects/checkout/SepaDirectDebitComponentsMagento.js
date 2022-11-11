import { SepaDirectDebitComponents } from "../../../common/checkoutComponents/SepaDirectDebitComponents.js";

export class SepaDirectDebitComponentsMagento extends SepaDirectDebitComponents {
  constructor(page) {
    super(page)
    this.page = page;

    this.placeOrderButton = page.locator(
      ".payment-method._active button[type=submit]"
    );
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}
