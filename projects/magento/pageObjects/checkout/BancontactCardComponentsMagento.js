import { expect } from "@playwright/test";
import { BancontactCardComponents } from "../../../common/checkoutComponents/BancontactCardComponents.js";
export class BancontactCardComponentsMagento extends BancontactCardComponents {
  constructor(page) {
    super(page);
    this.page = page;


    this.errorMessage = page.locator("#messages-bcmc");
    this.placeOrderButton = page.locator(
      ".payment-method._active button[type=submit]"
    );
  }


  async placeOrder() {
    await this.placeOrderButton.click();
  }

  async verifyPaymentRefusal() {
    await expect(await this.errorMessage.innerText()).toContain(
      "The payment is REFUSED."
    );
  }
}
