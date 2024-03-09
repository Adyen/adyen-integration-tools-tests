import { CreditCardComponentsMagento } from "../checkout/CreditCardComponentsMagento.js";
import { PayPalComponents } from "../../../common/checkoutComponents/PayPalComponents.js"
import PaymentResources from "../../../data/PaymentResources.js";

const paymentResources = new PaymentResources();

export class PaymentDetailsPage {
  constructor(page) {
    this.page = page;

    this.emailField = page.locator("#customer-email");

    this.creditCardRadioButton = page.locator("input[id='payment-method-adyen_cc']");
    this.without3dsVaultButton = page.locator("input#payment-method-adyen_vault_1");
    this.with3dsVaultButton = page.locator("input#payment-method-adyen_vault_2");
    this.cvcInput = page
        .frameLocator(".adyen-checkout__card__cvc__input iframe")
        .locator(".input-field");
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

  async selectVaultAndInsertCVC(creditCardNumber, cvc) {
    if (creditCardNumber == paymentResources.masterCard3DS2) {
      await this.with3dsVaultButton.click();
    } else {
      await this.without3dsVaultButton.click();
    }

    await this.cvcInput.type(cvc, { delay: 50 });
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
