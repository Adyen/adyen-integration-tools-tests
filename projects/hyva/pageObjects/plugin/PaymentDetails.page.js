import { CreditCardComponentsMagento } from "../checkout/CreditCardComponentsMagento.js";
import { PayPalComponents } from "../../../common/checkoutComponents/PayPalComponents.js"

export class PaymentDetailsPage {
  constructor(page) {
    this.page = page;

    this.emailField = page.locator("#customer-email");

    this.creditCardRadioButton = page.locator("input[id='payment-method-adyen_cc']");
    this.payPalRadioButton = page.locator("#adyen_paypal");

    this.paymentSummaryLoadingSpinner = page.locator(
      ".opc-sidebar .loading-mask"
    );
    this.activePaymentMethod = page.locator("div[id='CreditCardActionContainer']");
    this.paymentMethodSaveCheckBox = this.activePaymentMethod.locator(
      ".adyen-checkout__checkbox__label"
    );
  }

  async fillEmailAddress(user){
    this.emailField.fill(user.email);
  }

  async savePaymentMethod() {
    await this.paymentMethodSaveCheckBox.click();
  }

  async selectVault(lastFourDigits) {
    // Not ideal way of selecting saved card due to vault UI structure
    lastFourDigits != undefined ?
    await this.page.locator(`text=Ending ${lastFourDigits} ( expires: 3/2030 )`).click()
    : await page.locator("input#adyen_cc_vault_1").first().click();
    await this.waitForPaymentMethodReady();
  }

  async selectCreditCard() {
    await this.creditCardRadioButton.click();
    await this.waitForPaymentMethodReady();
    return new CreditCardComponentsMagento(this.page.locator("div[id='CreditCardActionContainer']"));
  }

  async selectPayPal() {
    await this.payPalRadioButton.click();
    await this.waitForPaymentMethodReady();
    return new PayPalComponents(this.page);
  }

  async waitForPaymentMethodReady() {
    await this.activePaymentMethod.scrollIntoViewIfNeeded();
  }
}
