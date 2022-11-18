import { expect } from "@playwright/test";
import { CreditCardComponents } from "../../../common/checkoutComponents/CreditCardComponents.js";
export class CreditCardComponentsMagento extends CreditCardComponents {
  constructor(page) {
    super(page);
    this.page = page;

    this.errorMessage = page.locator("#adyen-cc-form .message-error");
  }

  async verifyPaymentRefusal() {
    expect(await this.errorMessage.innerText()).toContain(
      "The payment is REFUSED."
    );
  }

  async verifyPaymentCancellation() {
    expect(await this.errorMessage.innerText()).toContain(
      "Payment has been cancelled"
    );
  }
}
