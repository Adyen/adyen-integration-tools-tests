import KlarnaPaymentPage from "../../../common/KlarnaPaymentPage.js";

export class KlarnaPayLaterComponents {
  constructor(page) {
    this.page = page;

    this.placeOrderButton = page.locator(
      ".payment-method._active button[type=submit]"
    );
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}
