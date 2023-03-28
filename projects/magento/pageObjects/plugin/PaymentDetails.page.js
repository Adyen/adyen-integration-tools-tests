import { BancontactCardComponentsMagento } from "../checkout/BancontactCardComponentsMagento.js";
import { CreditCardComponentsMagento } from "../checkout/CreditCardComponentsMagento.js";
import { PayPalComponents } from "../../../common/checkoutComponents/PayPalComponents.js"
import { SepaDirectDebitComponents } from "../../../common/checkoutComponents/SepaDirectDebitComponents.js";
import { BoletoComponents } from "../../../common/checkoutComponents/BoletoComponents.js";
import { IDealComponents } from "../../../common/checkoutComponents/iDealComponents.js";
import { OneyComponents } from "../../../common/checkoutComponents/OneyComponents.js";

export class PaymentDetailsPage {
  constructor(page) {
    this.page = page;

    this.vaultRadioButton = page.locator("input#adyen_cc_vault_1").first();
    this.creditCardRadioButton = page.locator("#adyen_cc");
    this.idealWrapper = page.locator("#payment_form_adyen_hpp_ideal");
    this.idealRadioButton = page.locator("#adyen_ideal");
    this.payPalRadioButton = page.locator("#adyen_paypal");
    this.klarnaPayLaterRadioButton = page.locator("#adyen_klarna");
    this.klarnaPayOverTimeRadioButton = page.locator("#adyen_klarna_account");
    this.klarnaPayNowRadioButton = page.locator("#adyen_klarna_paynow");
    this.bancontactCardRadioButton = page.locator("#adyen_bcmc");
    this.sepaWrapper = page.locator("#payment_form_adyen_hpp_sepadirectdebit");
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
    this.paymentMethodSaveCheckBox = this.activePaymentMethod.locator(
      ".adyen-checkout__checkbox__label"
    );
  }

  async savePaymentMethod() {
    await this.paymentMethodSaveCheckBox.click();
  }

  async selectVault() {
    await this.vaultRadioButton.click();
    await this.waitForPaymentMethodReady();
  }

  async selectCreditCard() {
    await this.creditCardRadioButton.click();
    await this.waitForPaymentMethodReady();
    return new CreditCardComponentsMagento(this.page.locator(".payment-method._active"));
  }

  async selectIDeal() {
    await this.idealRadioButton.click();
    await this.waitForPaymentMethodReady();
    return new IDealComponents(this.idealWrapper);
  }

  async selectPayPal() {
    await this.payPalRadioButton.click();
    await this.waitForPaymentMethodReady();
    return new PayPalComponents(this.page);
  }

  async selectKlarnaPayLater() {
    await this.klarnaPayLaterRadioButton.click();
    await this.waitForPaymentMethodReady();
  }

  async selectKlarnaPayOverTime() {
    await this.klarnaPayOverTimeRadioButton.click();
    await this.waitForPaymentMethodReady();
  }

  async selectKlarnaPayNow() {
    await this.klarnaPayNowRadioButton.click();
    await this.waitForPaymentMethodReady();
  }

  async selectBancontactCard() {
    await this.bancontactCardRadioButton.click();
    await this.waitForPaymentMethodReady();
    return new BancontactCardComponentsMagento(this.page);
  }

  async selectSepaDirectDebit() {
    await this.sepaDirectDebitRadioButton.click();
    await this.waitForPaymentMethodReady();
    return new SepaDirectDebitComponents(this.sepaWrapper);
  }

  async selectGiftCard() {
    await this.genericGiftCardRadioButton.click();
    await this.waitForPaymentMethodReady();
  }

  async selectOney() {
    await this.oney3RadioButton.click();
    await this.waitForPaymentMethodReady();
    return new OneyComponents(this.page);
  }

  async selectClearPay() {
    await this.clearPayRadioButton.click();
    await this.waitForPaymentMethodReady();
  }

  async selectBoleto() {
    await this.boletoRadioButton.click();
    await this.waitForPaymentMethodReady();
    return new BoletoComponents(this.page);
  }

  async selectMultiBanco() {
    await this.multiBancoRadioButton.click();
    await this.waitForPaymentMethodReady();
  }

  async waitForPaymentMethodReady() {
    await this.waitForPaymentSummaryLoader();
    await this.activePaymentMethod.scrollIntoViewIfNeeded();
  }

  async waitForPaymentSummaryLoader() {
    await this.paymentSummaryLoadingSpinner.waitFor({
      state: "attached",
      timeout: 15000,
    });
    await this.paymentSummaryLoadingSpinner.waitFor({
      state: "detached",
      timeout: 20000,
    });
  }
}
