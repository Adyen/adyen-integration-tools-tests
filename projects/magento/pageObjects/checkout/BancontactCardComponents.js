import { expect } from "@playwright/test";
export class BancontactCardComponents {
  constructor(page) {
    this.page = page;

    this.cardNumberInput = page
      .frameLocator(
        "#payment_form_adyen_hpp_bcmc .adyen-checkout__card__cardNumber__input iframe"
      )
      .locator(".input-field");

    this.expDateInput = page
      .frameLocator(
        "#payment_form_adyen_hpp_bcmc .adyen-checkout__card__exp-date__input iframe"
      )
      .locator(".input-field");

    this.holderNameInput = page.locator(
      "#payment_form_adyen_hpp_bcmc input.adyen-checkout__card__holderName__input"
    );

    this.errorMessage = page.locator("#messages-bcmc");
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

  async fillBancontacCardInfo(
    cardNumber,
    cardExpirationDate,
    cardHolderName,
    cardHolderLastName
  ) {
    await this.fillCardNumber(cardNumber);
    await this.fillExpDate(cardExpirationDate);
    await this.fillHolderName(cardHolderName);
    await this.fillHolderName(` ${cardHolderLastName}`);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }

  async verifyPaymentRefusal() {
    await expect(await this.errorMessage.innerText()).toEqual(
      "The payment is REFUSED."
    );
  }
}
