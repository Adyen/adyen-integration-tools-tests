export class IdealIssuerPage {
  constructor(page) {
    this.iDealContinueButton = page.locator('input[type="submit"]');
  }

  async continuePayment() {
    await this.iDealContinueButton.waitFor({
      state: "visible",
      timeout: 7000,
    });
    await this.iDealContinueButton.click();
  }
}
