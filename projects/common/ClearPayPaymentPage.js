export class ClearPayPaymentPage {
  constructor(page) {
    this.page = page;

    this.continueButton = page.locator("#continueBtn");

    this.mobileNumberInput = page.locator("input[name='mobile']");
    this.fiscalCodeInput = page.locator("input[name='fiscalCode']");
    this.passwordInput = page.locator("input[name='password']");
  }

  async continueClearPayPayment() {
    // const paymentResources = new PaymentResources();
    // const user = paymentResources.guestUser.oney.approved.fr;

    await this.continueButton.click();

    await this.passwordInput.fill("Abc12345");
    await this.continueButton.click();

    await this.genderSelector.click();
    await this.birthDateInput.type(user.dateOfBirth);
    await this.birthPlaceInput.click();
    await this.birthPlaceInput.type(user.city);
    await this.birthPlaceList.click();
  }
}
