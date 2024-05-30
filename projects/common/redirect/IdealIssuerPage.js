export class IdealIssuerPage {
  constructor(page, bankName) {
    const PAYMENT_ACTION_BUTTON_TEST_ID = 'payment-action-button';
    const BANK_ITEM_TEST_ID_PREFIX = 'ideal-box-bank-item-';

    this.iDealContinueButton = page.locator("button");
    this.selectYourBankButton = page.getByTestId(PAYMENT_ACTION_BUTTON_TEST_ID);
    this.selectIssuerButton = page.getByTestId(BANK_ITEM_TEST_ID_PREFIX + bankName);
    this.simulateSuccessButton = page.getByRole('button', { name: 'Success'});
    this.simulateFailureButton = page.getByRole('button', { name: 'Failure'});
  }

  /** @deprecated on Ideal 2.0 */
  async continuePayment() {
    await this.iDealContinueButton.waitFor({
      state: "visible",
      timeout: 7000,
    });
    await this.iDealContinueButton.click();
  }

  async proceedWithSelectedBank(bankName) {
    await this.selectYourBankButton.click();
    await this.selectIssuerButton.click();
  }

  async simulateSuccess() {
    await this.simulateSuccessButton.click();
  }

  async simulateFailure() {
    await this.simulateFailureButton.click();
  }
}
