import { CreditCardComponents } from "./CreditCardComponents.js";
import { IDealComponents } from "./iDealComponents.js";
import { PayPalComponents } from "./PayPalComponents.js";

export class PaymentDetailsPage {
  constructor(page) {
    this.page = page;

    this.creditCardRadioButton = page.locator("#adyen_cc");
    this.idealRadioButton = page.locator("#adyen_ideal");
    this.payPalRadioButton = page.locator("#adyen_paypal");
    this.paymentSummaryLoadingSpinner = page.locator(
      ".opc-sidebar .loading-mask"
    );
  }

  async selectCreditCard() {
    await this.creditCardRadioButton.click();
    await this.waitForPaymentSummaryLoader();
    return new CreditCardComponents(this.page);
  }

  async selectIDeal() {
    await this.idealRadioButton.click();
    await this.waitForPaymentSummaryLoader();
    return new IDealComponents(this.page);
  }

  async selectPayPal() {
    await this.payPalRadioButton.click();
    await this.waitForPaymentSummaryLoader();
    return new PayPalComponents(this.page);
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
