import PaymentResources from "../../data/PaymentResources.js";
const paymentResources = new PaymentResources();

export class CreditCardComponents {
  constructor(page) {
    this.page = page;

    this.holderNameInput = page.locator(
      ".adyen-checkout__card__holderName input"
    );

    this.cardNumberInput = page
      .frameLocator(".adyen-checkout__card__cardNumber__input iframe")
      .locator(".input-field");

    this.expDateInput = page
      .frameLocator(".adyen-checkout__card__exp-date__input iframe")
      .locator(".input-field");

    this.cvcInput = page
      .frameLocator(".adyen-checkout__card__cvc__input iframe")
      .locator(".input-field");

    this.installmentDropdown = page.locator("//button[contains(@id,'adyen-checkout-installments')]").first();
    this.installmentOption = page.locator(`#listItem-${paymentResources.installmentsDefaults.count}`);

    this.paymentMethodSaveCheckBox = page.locator(".adyen-checkout__checkbox__label");

    this.typeDelay = 50;
  }

  async fillHolderName(holderName) {
    await this.holderNameInput.scrollIntoViewIfNeeded();
    await this.holderNameInput.click();
    await this.holderNameInput.type(holderName);
  }
  async fillCardNumber(cardNumber) {
    await this.cardNumberInput.scrollIntoViewIfNeeded();
    await this.cardNumberInput.click();
    await this.cardNumberInput.type(cardNumber, { delay: this.typeDelay });
  }
  async fillExpDate(expDate) {
    await this.expDateInput.scrollIntoViewIfNeeded();
    await this.expDateInput.click({ force: true });
    await this.expDateInput.type(expDate, { delay: this.typeDelay });
  }
  async fillCVC(CVC) {
    await this.cvcInput.scrollIntoViewIfNeeded();
    await this.cvcInput.click();
    await this.cvcInput.type(CVC, { delay: this.typeDelay });
  }

  async fillInstallements() {
    await this.installmentDropdown.click();
    await this.installmentOption.click();
  }

  async fillCreditCardInfo(
    cardHolderName,
    cardHolderLastName,
    cardNumber,
    cardExpirationDate,
    cardCVC = undefined,
    saveCard = false,
    installment = false
  ) {
    await this.fillCardNumber(cardNumber);
    await this.fillExpDate(cardExpirationDate);
    if (cardCVC !== undefined ) {
      await this.fillCVC(cardCVC);
    }
    await this.fillHolderName(cardHolderName);
    await this.fillHolderName(` ${cardHolderLastName}`);

    if (saveCard) {
      await this.paymentMethodSaveCheckBox.click();
    }

    if (installment) {
      await this.fillInstallements();
    }
  }
}
