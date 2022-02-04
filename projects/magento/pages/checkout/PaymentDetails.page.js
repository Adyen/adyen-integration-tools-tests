import { CreditCardComponents } from "./CreditCardComponents.js";

export class PaymentDetails {
  constructor(page) {
    this.page = page;

    this.creditCardRadioButton = page.locator("#adyen_cc");
    this.paymentSummaryLoadingSpinner = page.locator(
      ".opc-sidebar .loading-mask"
    );
  }

  async selectCreditCard() {
    await this.creditCardRadioButton.click();
    await this.waitForPaymentSummaryLoader();
    return new CreditCardComponents(this.page);
  }

  async waitForPaymentSummaryLoader() {
    await this.paymentSummaryLoadingSpinner.waitFor({
      state: "attached",
      timeout: 10000,
    });
    await this.paymentSummaryLoadingSpinner.waitFor({
      state: "detached",
      timeout: 10000,
    });
  }
}
