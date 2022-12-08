export class IdealIssuerPage {
  constructor(page) {
    this.iDealContinueButton = page.locator("button");
  }

  async continuePayment() {
    await this.iDealContinueButton.waitFor({
      state: "visible",
      timeout: 7000,
    });
    await this.iDealContinueButton.click();
  }
}
