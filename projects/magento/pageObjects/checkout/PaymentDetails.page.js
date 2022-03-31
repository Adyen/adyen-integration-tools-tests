import { BancontactCardComponents } from "./BancontactCardComponents.js";
import { CreditCardComponents } from "./CreditCardComponents.js";
import { GenericGiftCardComponents } from "./GenericGiftCardComponents.js";
import { IDealComponents } from "./iDealComponents.js";
import { KlarnaPayLaterComponents } from "./KlarnaPayLaterComponents.js";
import { OneyComponents } from "./OneyComponents.js";
import { PayPalComponents } from "./PayPalComponents.js";
import { SepaDirectDebitComponents } from "./SepaDirectDebitComponents.js";
import { ClearPayComponents } from "./ClearPayComponents.js";
import { BoletoComponents } from "./BoletoComponents.js";
import { MultiBancoComponents } from "./MultiBancoComponents.js";
import { KlarnaPayNowComponents } from "./KlarnaPayNowComponents.js";
import { KlarnaPayOverTimeComponents } from "./KlarnaPayOverTimeComponents.js";

export class PaymentDetailsPage {
  constructor(page) {
    this.page = page;

    this.creditCardRadioButton = page.locator("#adyen_cc");
    this.idealRadioButton = page.locator("#adyen_ideal");
    this.payPalRadioButton = page.locator("#adyen_paypal");
    this.klarnaPayLaterRadioButton = page.locator("#adyen_klarna");
    this.klarnaPayOverTimeRadioButton = page.locator("#adyen_klarna_account");
    this.klarnaPayNowRadioButton = page.locator("#adyen_klarna_paynow");
    this.bancontactCardRadioButton = page.locator("#adyen_bcmc");
    this.sepaDirectDebitRadioButton = page.locator("#adyen_sepadirectdebit");
    this.genericGiftCardRadioButton = page.locator("#adyen_genericgiftcard");
    this.oney3RadioButton = page.locator("#adyen_facilypay_3x");
    this.clearPayRadioButton = page.locator("#adyen_clearpay");
    this.boletoRadioButton = page.locator("#adyen_boleto");
    this.multiBancoRadioButton = page.locator("#adyen_multibanco");

    this.paymentSummaryLoadingSpinner = page.locator(
      ".opc-sidebar .loading-mask"
    );
    this.activePaymentMethod = page.locator(".payment-method._active");
  }

  async selectCreditCard() {
    await this.creditCardRadioButton.click();
    await this.waitForPaymentMethodReady();
    return new CreditCardComponents(this.page);
  }

  async selectIDeal() {
    await this.idealRadioButton.click();
    await this.waitForPaymentMethodReady();
    return new IDealComponents(this.page);
  }

  async selectPayPal() {
    await this.payPalRadioButton.click();
    await this.waitForPaymentMethodReady();
    return new PayPalComponents(this.page);
  }

  async selectKlarnaPayLater() {
    await this.klarnaPayLaterRadioButton.click();
    await this.waitForPaymentMethodReady();
    return new KlarnaPayLaterComponents(this.page);
  }

  async selectKlarnaPayOverTime() {
    await this.klarnaPayOverTimeRadioButton.click();
    await this.waitForPaymentMethodReady();
    return new KlarnaPayOverTimeComponents(this.page);
  }

  async selectKlarnaPayNow() {
    await this.klarnaPayNowRadioButton.click();
    await this.waitForPaymentMethodReady();
    return new KlarnaPayNowComponents(this.page);
  }

  async selectBancontactCard() {
    await this.bancontactCardRadioButton.click();
    await this.waitForPaymentMethodReady();
    return new BancontactCardComponents(this.page);
  }

  async selectSepaDirectDebit() {
    await this.sepaDirectDebitRadioButton.click();
    await this.waitForPaymentMethodReady();
    return new SepaDirectDebitComponents(this.page);
  }

  async selectGiftCard() {
    await this.genericGiftCardRadioButton.click();
    await this.waitForPaymentMethodReady();
    return new GenericGiftCardComponents(this.page);
  }

  async selectOney() {
    await this.oney3RadioButton.click();
    await this.waitForPaymentMethodReady();
    return new OneyComponents(this.page);
  }

  async selectClearPay() {
    await this.clearPayRadioButton.click();
    await this.waitForPaymentMethodReady();
    return new ClearPayComponents(this.page);
  }

  async selectBoleto() {
    await this.boletoRadioButton.click();
    await this.waitForPaymentMethodReady();
    return new BoletoComponents(this.page);
  }

  async selectMultiBanco() {
    await this.multiBancoRadioButton.click();
    await this.waitForPaymentMethodReady();
    return new MultiBancoComponents(this.page);
  }

  async waitForPaymentMethodReady() {
    await this.waitForPaymentSummaryLoader();
    await this.activePaymentMethod.scrollIntoViewIfNeeded();
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
