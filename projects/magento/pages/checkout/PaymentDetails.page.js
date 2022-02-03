export class PaymentDetails {
  constructor(page) {
    this.page = page;

    this.placeOrderButton = page.locator(
      ".payment-method._active button[type=submit]"
    );

    this.creditCardRadioButton = page.locator("#adyen_cc");
    this.holderNameInput = page.locator(
      "#payment_form_adyen_cc .adyen-checkout__card__holderName input"
    );
    this.cardNumberInput = page
      .frameLocator(".adyen-checkout__card__cardNumber__input iframe")
      .locator("#encryptedCardNumber");

    this.expDateInput = page
      .frameLocator(".adyen-checkout__card__exp-date__input iframe")
      .locator("#encryptedExpiryDate");
    // this.expDateInput = page.locator("#encryptedExpiryDate");
    this.cvcInput = page
      .frameLocator(".adyen-checkout__card__cvc__input iframe")
      .locator("#encryptedSecurityCode");
    // this.cvcInput = page.locator("#encryptedSecurityCode");
  }

  async fillHolderName(holderName) {
    this.holderNameInput.type(holderName);
  }
  async fillCardNumber(cardNumber) {
    this.cardNumberInput.type(cardNumber);
  }
  async fillExpDate(expDate) {
    this.expDateInput.type(expDate);
  }
  async fillCVC(CVC) {
    this.cvcInput.type(CVC);
  }

  async fillCreditCardInfoAndPlaceOrder(
    cardHolderName,
    cardHolderLastName,
    cardNumber,
    cardExpirationDate,
    cardCVC
  ) {
    await this.creditCardRadioButton.click();
    await this.fillHolderName(cardHolderName);
    if (cardHolderLastName != undefined) {
      await this.fillHolderName(` ${this.cardHolderLastName}`);
    }
    await this.fillCardNumber(cardNumber);
    await this.fillExpDate(cardExpirationDate);
    await this.fillCVC(cardCVC);

    await this.placeOrderButton.click();
    await page.waitForNavigation();
  }
}
