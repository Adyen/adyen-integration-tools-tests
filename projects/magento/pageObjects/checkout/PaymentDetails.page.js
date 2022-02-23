import { BancontactCardComponents } from "./BancontactCardComponents.js";
import { CreditCardComponents } from "./CreditCardComponents.js";
import { IDealComponents } from "./iDealComponents.js";
import { KlarnaPayLaterComponents } from "./KlarnaPayLaterComponents.js";
import { PayPalComponents } from "./PayPalComponents.js";
import { SepaDirectDebitComponents } from "./SepaDirectDebitComponents.js";

export class PaymentDetailsPage {
  constructor(page) {
    this.page = page;

    this.creditCardRadioButton = page.locator("#adyen_cc");
    this.idealRadioButton = page.locator("#adyen_ideal");
    this.payPalRadioButton = page.locator("#adyen_paypal");
    this.klarnaPayLaterButton = page.locator("#adyen_klarna");
    this.bancontactCardButton = page.locator("#adyen_bcmc");
    this.sepaDirectDebitButton = page.locator("#adyen_sepadirectdebit");

    this.paymentSummaryLoadingSpinner = page.locator(
      ".opc-sidebar .loading-mask"
    );
    this.activePaymentMethod = page.locator(".payment-method._active");
  }

  async selectCreditCard() {
    await this.creditCardRadioButton.click();
    await this.waitForPaymentSummaryLoader();
    await this.activePaymentMethod.scrollIntoViewIfNeeded();
    return new CreditCardComponents(this.page);
  }

  async selectIDeal() {
    await this.idealRadioButton.click();
    await this.waitForPaymentSummaryLoader();
    await this.activePaymentMethod.scrollIntoViewIfNeeded();
    return new IDealComponents(this.page);
  }

  async selectPayPal() {
    await this.payPalRadioButton.click();
    await this.waitForPaymentSummaryLoader();
    await this.activePaymentMethod.scrollIntoViewIfNeeded();
    return new PayPalComponents(this.page);
  }

  async selectKlarnaPayLater() {
    await this.klarnaPayLaterButton.click();
    await this.waitForPaymentSummaryLoader();
    await this.activePaymentMethod.scrollIntoViewIfNeeded();
    return new KlarnaPayLaterComponents(this.page);
  }

  async selectBancontactCard() {
    await this.bancontactCardButton.click();
    await this.waitForPaymentSummaryLoader();
    await this.activePaymentMethod.scrollIntoViewIfNeeded();
    return new BancontactCardComponents(this.page);
  }

  async selectSepaDirectDebit() {
    await this.sepaDirectDebitButton.click();
    await this.waitForPaymentSummaryLoader();
    await this.activePaymentMethod.scrollIntoViewIfNeeded();
    return new SepaDirectDebitComponents(this.page);
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
