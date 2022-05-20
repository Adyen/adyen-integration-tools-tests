export class OneyComponents {
  constructor(page) {
    this.page = page;

    this.activePaymentMethodSection = page.locator(".payment-method._active");
    this.placeOrderButton = this.activePaymentMethodSection.locator(
      "button[type=submit]"
    );
    this.maleGenderRadioButton = this.activePaymentMethodSection
      .locator(".adyen-checkout__radio_group__input-wrapper")
      .nth(0);
    this.birthdayInput = this.activePaymentMethodSection.locator(
      ".adyen-checkout__input--dateOfBirth"
    );
  }

  async completeOneyForm(birthday) {
    await this.maleGenderRadioButton.click();
    await this.birthdayInput.type(birthday);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}
