import { expect } from "@playwright/test";
export class CreditCardComponents {
  constructor(page) {
    this.page = page;

    this.errorMessage = page.locator("#adyen-cc-form .message-error");

    this.holderNameInput = page.locator(
      "#payment_form_adyen_cc .adyen-checkout__card__holderName input"
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

    this.placeOrderButton = page.locator(
      ".payment-method._active button[type=submit]"
    );
  }

  async fillHolderName(holderName) {
    await this.holderNameInput.click();
    await this.holderNameInput.type(holderName);
  }
  async fillCardNumber(cardNumber) {
    await this.cardNumberInput.click();
    await this.cardNumberInput.type(cardNumber);
  }
  async fillExpDate(expDate) {
    await this.expDateInput.click();
    await this.expDateInput.type(expDate);
  }
  async fillCVC(CVC) {
    await this.cvcInput.click();
    await this.cvcInput.type(CVC);
  }

  async fillCreditCardInfo(
    cardHolderName,
    cardHolderLastName,
    cardNumber,
    cardExpirationDate,
    cardCVC
  ) {
    await this.fillHolderName(cardHolderName);
    await this.fillHolderName(` ${cardHolderLastName}`);
    await this.fillCardNumber(cardNumber);
    await this.fillExpDate(cardExpirationDate);
    await this.fillCVC(cardCVC);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }

  async fillCreditCardInfoAndPlaceOrder(
    cardHolderName,
    cardHolderLastName,
    cardNumber,
    cardExpirationDate,
    cardCVC
  ) {
    await this.fillCreditCardInfo(
      cardHolderName,
      cardHolderLastName,
      cardNumber,
      cardExpirationDate,
      cardCVC
    );
    await this.placeOrder();
  }

  async verifyPaymentRefusal() {
    const errorMessage = await expect(
      await this.errorMessage.innerText()
    ).toEqual("The payment is REFUSED.");
  }
}
